const express = require('express');
const router = express.Router();
const { getRooms, addRoom, updateRoom, deleteRoom } = require('../controllers/roomsController');

// Get all rooms for a venue
router.get('/:venue_id', getRooms);

// Add a room to a venue
router.post('/', addRoom);

// Update a room
router.put('/:id', updateRoom);

// Delete a room
router.delete('/:id', deleteRoom);

module.exports = router;
