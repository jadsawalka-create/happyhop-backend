const express = require('express');
const router = express.Router();
const sessionsController = require('../controllers/sessionsController');
const authenticateToken = require('../middleware/auth');
const optionalAuth = require('../middleware/optionalAuth');
const supabase = require('../config/database');
const { selfFromParam, canManageVenue } = require('../middleware/access');

// Live sessions at a venue. The venue (owner) and admins get full details;
// everyone else (e.g. the marketplace's "spots left" count) gets no child details.
async function sessionsForVenue(req, res, next) {
  try {
    if (req.user && (await canManageVenue(req, req.params.venueId))) return sessionsController.getSessions(req, res, next);
    let q = supabase.from('venue_sessions').select('id, venue_id, status, check_in_time, expected_duration_minutes').eq('venue_id', req.params.venueId);
    if (req.query.status) q = q.eq('status', req.query.status);
    const { data, error } = await q;
    if (error) return res.status(500).json({ error: error.message });
    res.json({ sessions: data || [] });
  } catch (e) { res.status(500).json({ error: e.message }); }
}

router.get('/parent/:parentId/active', authenticateToken, selfFromParam('parentId'), sessionsController.getParentActiveSessions);
router.get('/:venueId', optionalAuth, sessionsForVenue);
router.post('/', authenticateToken, sessionsController.createSession);
router.put('/:id/checkout', authenticateToken, sessionsController.checkoutSession);
router.put('/:id', authenticateToken, sessionsController.updateSession);
router.delete('/:id', authenticateToken, sessionsController.deleteSession);

module.exports = router;
