const express = require('express');
const router = express.Router();
const { getStaff, addStaff, updateStaff, deleteStaff } = require('../controllers/staffController');

// Get all staff for a venue
router.get('/:venue_id', getStaff);

// Add a staff member
router.post('/', addStaff);

// Update a staff member
router.put('/:id', updateStaff);

// Delete a staff member
router.delete('/:id', deleteStaff);

module.exports = router;
