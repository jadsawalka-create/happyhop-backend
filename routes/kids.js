const express = require('express');
const router = express.Router();
const { addChild, getAllKids, getKids, updateChild, deleteChild } = require('../controllers/kidsController');
const authenticateToken = require('../middleware/auth');
const { adminOnly, staffOnly, venueFromParam, venueFromBody, venueFromRecord, selfFromParam, kidAccess, bookingAccess } = require('../middleware/access');

// All kids: admins and venue owners only (was public).
router.get('/', authenticateToken, staffOnly, getAllKids);
// Kid without a parent account (walk-ins): venues/admin only (was public).
router.post('/standalone', authenticateToken, staffOnly, addChild);
// Parent: add kid linked to their account
router.post('/', authenticateToken, addChild);
// A parent's kids: the parent, venues (check-in) or admin.
router.get('/parent/:parent_id', authenticateToken, selfFromParam('parent_id', { allowVenueOwners: true }), getKids);
// Update / delete a kid: its parent, venues or admin (delete was public).
router.put('/:id', authenticateToken, kidAccess, updateChild);
router.delete('/:id', authenticateToken, kidAccess, deleteChild);

module.exports = router;
