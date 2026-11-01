const express = require('express');
const router = express.Router();
const { getStaff, addStaff, updateStaff, deleteStaff } = require('../controllers/staffController');
const auth = require('../middleware/auth');
const { adminOnly, staffOnly, venueFromParam, venueFromBody, venueFromRecord, selfFromParam, kidAccess, bookingAccess } = require('../middleware/access');

// Staff lists are private to the venue (owner) and admins.
router.get('/:venue_id', auth, venueFromParam('venue_id'), getStaff);
router.post('/', auth, venueFromBody('venue_id'), addStaff);
router.put('/:id', auth, venueFromRecord('staff'), updateStaff);
router.delete('/:id', auth, venueFromRecord('staff'), deleteStaff);

module.exports = router;
