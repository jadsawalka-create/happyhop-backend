// ─────────────────────────────────────────────────────────────
// Who-is-asking checks. Use AFTER authenticateToken (req.user = { id, email }).
//   Admin       → email listed in the ADMIN_EMAILS Railway variable
//   Venue owner → email is the owner_email of a venue (all branches they own)
//   Parent      → their own records only
// ─────────────────────────────────────────────────────────────
const supabase = require('../config/database');

const lower = (s) => String(s || '').trim().toLowerCase();

function isAdmin(req) {
  const admins = (process.env.ADMIN_EMAILS || '').split(',').map(lower).filter(Boolean);
  return !!req.user && admins.includes(lower(req.user.email));
}

// Venue ids this user owns (cached for the request).
async function ownedVenueIds(req) {
  if (req._ownedVenues) return req._ownedVenues;
  const email = lower(req.user && req.user.email);
  if (!email) return (req._ownedVenues = []);
  const { data } = await supabase.from('venues').select('id, owner_email').ilike('owner_email', email);
  req._ownedVenues = (data || []).filter((v) => lower(v.owner_email) === email).map((v) => String(v.id));
  return req._ownedVenues;
}

async function canManageVenue(req, venueId) {
  if (isAdmin(req)) return true;
  if (!venueId) return false;
  return (await ownedVenueIds(req)).includes(String(venueId));
}

async function isAnyVenueOwner(req) {
  return (await ownedVenueIds(req)).length > 0;
}

const deny = (res) => res.status(403).json({ error: 'You do not have access to this.' });
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch((e) => res.status(500).json({ error: e.message }));

// ── Guards ──

/** Admins only. */
const adminOnly = (req, res, next) => (isAdmin(req) ? next() : deny(res));

/** Admin or any venue owner (e.g. looking up a child at check-in). */
const staffOnly = wrap(async (req, res, next) => ((isAdmin(req) || (await isAnyVenueOwner(req))) ? next() : deny(res)));

/** The venue id is in the URL (e.g. /venue/:venue_id). */
const venueFromParam = (param) =>
  wrap(async (req, res, next) => ((await canManageVenue(req, req.params[param])) ? next() : deny(res)));

/** The venue id is in the request body (create calls). */
const venueFromBody = (field = 'venue_id') =>
  wrap(async (req, res, next) => ((await canManageVenue(req, req.body && req.body[field])) ? next() : deny(res)));

/** The record (by :id) belongs to a venue — look up its venue_id. */
const venueFromRecord = (table, param = 'id', column = 'venue_id') =>
  wrap(async (req, res, next) => {
    const { data } = await supabase.from(table).select(column).eq('id', req.params[param]).maybeSingle();
    if (!data) return res.status(404).json({ error: 'Not found' });
    return (await canManageVenue(req, data[column])) ? next() : deny(res);
  });

/** The URL is about a parent (e.g. /parent/:parent_id): the parent themself, or admin.
 *  allowVenueOwners: venues may look up a parent's kids at check-in. */
const selfFromParam = (param, { allowVenueOwners = false } = {}) =>
  wrap(async (req, res, next) => {
    if (isAdmin(req) || String(req.params[param]) === String(req.user.id)) return next();
    if (allowVenueOwners && (await isAnyVenueOwner(req))) return next();
    return deny(res);
  });

/** A kid record: its parent, any venue owner (check-in / POS), or admin. */
const kidAccess = wrap(async (req, res, next) => {
  if (isAdmin(req)) return next();
  const { data } = await supabase.from('kids').select('parent_id').eq('id', req.params.id).maybeSingle();
  if (!data) return res.status(404).json({ error: 'Not found' });
  if (String(data.parent_id) === String(req.user.id)) return next();
  if (await isAnyVenueOwner(req)) return next();
  return deny(res);
});

/** A booking: the parent who made it, the venue it's at, or admin.
 *  Sets req.bookingRole = 'admin' | 'venue' | 'parent'.
 *  venueOnly: e.g. changing status/payment — the parent is not allowed. */
const bookingAccessFor = ({ venueOnly = false } = {}) =>
  wrap(async (req, res, next) => {
    if (isAdmin(req)) { req.bookingRole = 'admin'; return next(); }
    const { data } = await supabase.from('bookings').select('parent_id, venue_id').eq('id', req.params.id).maybeSingle();
    if (!data) return res.status(404).json({ error: 'Not found' });
    if (await canManageVenue(req, data.venue_id)) { req.bookingRole = 'venue'; return next(); }
    if (!venueOnly && String(data.parent_id) === String(req.user.id)) { req.bookingRole = 'parent'; return next(); }
    return deny(res);
  });
const bookingAccess = bookingAccessFor();
const bookingVenueOnly = bookingAccessFor({ venueOnly: true });

module.exports = {
  isAdmin, ownedVenueIds, canManageVenue, isAnyVenueOwner,
  adminOnly, staffOnly, venueFromParam, venueFromBody, venueFromRecord, selfFromParam, kidAccess, bookingAccess, bookingVenueOnly,
};
