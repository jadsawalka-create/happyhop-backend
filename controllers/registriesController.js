// ═══ Sprint 20: Gift Registry Controller ═══
// Save as happyhop-backend/controllers/registriesController.js

const supabase = require('../config/database');

function genShareCode(kidName) {
  const base = (kidName || 'KID').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6) || 'KID';
  const rnd = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${base}-${rnd}`;
}

// ── Registries ──

exports.createRegistry = async (req, res) => {
  try {
    const { venue_id, parent_id, booking_id, kid_name, kid_age, party_date, title, description, theme, cover_url, is_public } = req.body;
    if (!kid_name) return res.status(400).json({ error: 'kid_name is required' });
    let share_code = genShareCode(kid_name);
    // Avoid collision (rare)
    for (let i = 0; i < 3; i++) {
      const { data: existing } = await supabase.from('gift_registries').select('id').eq('share_code', share_code).maybeSingle();
      if (!existing) break;
      share_code = genShareCode(kid_name);
    }
    const payload = {
      venue_id: venue_id || null,
      parent_id: parent_id || req.user?.id || null,
      booking_id: booking_id || null,
      kid_name, kid_age: kid_age || null,
      party_date: party_date || null,
      title: title || `${kid_name}'s Gift Registry`,
      description: description || null,
      theme: theme || null,
      cover_url: cover_url || null,
      share_code,
      is_public: is_public !== false
    };
    const { data, error } = await supabase.from('gift_registries').insert([payload]).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.json({ registry: data });
  } catch (e) {
    console.error('[createRegistry]', e);
    res.status(500).json({ error: e.message });
  }
};

exports.getByParent = async (req, res) => {
  try {
    const { parentId } = req.params;
    const { data, error } = await supabase
      .from('gift_registries')
      .select('*, gift_items(id, name, price, is_active), venues(id, name)')
      .eq('parent_id', parentId)
      .order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json({ registries: data || [] });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.getByVenue = async (req, res) => {
  try {
    const { venueId } = req.params;
    const { data, error } = await supabase
      .from('gift_registries')
      .select('*, gift_items(id, name, price, is_active), users!parent_id(id, name, email)')
      .eq('venue_id', venueId)
      .order('party_date', { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    res.json({ registries: data || [] });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('gift_registries')
      .select('*, gift_items(*), gift_reservations(*), venues(id, name, city), users!parent_id(id, name, email)')
      .eq('id', id)
      .single();
    if (error) return res.status(404).json({ error: error.message });
    res.json({ registry: data });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// PUBLIC — no auth; used by guests opening a share link
exports.getByShareCode = async (req, res) => {
  try {
    const { code } = req.params;
    const { data, error } = await supabase
      .from('gift_registries')
      .select('*, gift_items(*), gift_reservations(id, item_id, guest_name, amount), venues(id, name, city, location, image_url)')
      .eq('share_code', code.toUpperCase())
      .eq('is_public', true)
      .single();
    if (error) return res.status(404).json({ error: 'Registry not found or private' });
    res.json({ registry: data });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.updateRegistry = async (req, res) => {
  try {
    const { id } = req.params;
    const allowed = ['kid_name', 'kid_age', 'party_date', 'title', 'description', 'theme', 'cover_url', 'is_public'];
    const updates = {};
    for (const k of allowed) if (k in (req.body || {})) updates[k] = req.body[k];
    updates.updated_at = new Date().toISOString();
    const { data, error } = await supabase.from('gift_registries').update(updates).eq('id', id).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.json({ registry: data });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.deleteRegistry = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('gift_registries').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// ── Items ──

exports.addItem = async (req, res) => {
  try {
    const { id } = req.params; // registry id
    const { name, description, image_url, link_url, price, currency, emoji, category, quantity } = req.body;
    if (!name) return res.status(400).json({ error: 'name required' });
    const payload = {
      registry_id: id,
      name, description: description || null, image_url: image_url || null, link_url: link_url || null,
      price: price || null, currency: currency || 'JOD',
      emoji: emoji || '🎁', category: category || 'toy',
      quantity: quantity || 1
    };
    const { data, error } = await supabase.from('gift_items').insert([payload]).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.json({ item: data });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.updateItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const allowed = ['name', 'description', 'image_url', 'link_url', 'price', 'currency', 'emoji', 'category', 'quantity', 'is_active', 'sort_order'];
    const updates = {};
    for (const k of allowed) if (k in (req.body || {})) updates[k] = req.body[k];
    const { data, error } = await supabase.from('gift_items').update(updates).eq('id', itemId).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.json({ item: data });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { error } = await supabase.from('gift_items').delete().eq('id', itemId);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// ── Reservations — PUBLIC (no auth required so guests can claim) ──

exports.reserveItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { guest_name, guest_email, guest_phone, message, amount } = req.body;
    if (!guest_name) return res.status(400).json({ error: 'guest_name required' });
    // Find registry_id via item
    const { data: item, error: ie } = await supabase.from('gift_items').select('registry_id, quantity').eq('id', itemId).single();
    if (ie || !item) return res.status(404).json({ error: 'Item not found' });
    // Count existing reservations
    const { count } = await supabase.from('gift_reservations').select('*', { count: 'exact', head: true }).eq('item_id', itemId);
    if ((count || 0) >= (item.quantity || 1)) return res.status(409).json({ error: 'Item already fully claimed' });
    const token = Math.random().toString(36).slice(2, 12).toUpperCase();
    const payload = {
      item_id: itemId, registry_id: item.registry_id,
      guest_name, guest_email: guest_email || null, guest_phone: guest_phone || null,
      message: message || null, amount: amount || null, cancel_token: token
    };
    const { data, error } = await supabase.from('gift_reservations').insert([payload]).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.json({ reservation: data, cancel_token: token });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.cancelReservation = async (req, res) => {
  try {
    const { reservationId } = req.params;
    const { cancel_token } = req.body || req.query;
    if (!cancel_token) return res.status(400).json({ error: 'cancel_token required' });
    const { data: r } = await supabase.from('gift_reservations').select('cancel_token').eq('id', reservationId).single();
    if (!r) return res.status(404).json({ error: 'Reservation not found' });
    if (r.cancel_token !== cancel_token) return res.status(403).json({ error: 'Invalid cancel token' });
    const { error } = await supabase.from('gift_reservations').delete().eq('id', reservationId);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.listReservationsForRegistry = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('gift_reservations')
      .select('*, gift_items(id, name, emoji, price)')
      .eq('registry_id', id)
      .order('reserved_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json({ reservations: data || [] });
  } catch (e) { res.status(500).json({ error: e.message }); }
};
