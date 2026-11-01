const express = require('express');
const router = express.Router();
const { getRooms, addRoom, updateRoom, deleteRoom } = require('../controllers/roomsController');
const auth = require('../middleware/auth');
const { adminOnly, staffOnly, venueFromParam, venueFromBody, venueFromRecord, selfFromParam, kidAccess, bookingAccess } = require('../middleware/access');

router.get('/:venue_id', getRooms);                                // public — party rooms shown to parents
router.post('/', auth, venueFromBody('venue_id'), addRoom);
router.put('/:id', auth, venueFromRecord('rooms'), updateRoom);
router.delete('/:id', auth, venueFromRecord('rooms'), deleteRoom);

module.exports = router;
