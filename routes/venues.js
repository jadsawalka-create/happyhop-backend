const express = require('express');
const router = express.Router();
const { addVenue, getVenues, getVenueById, getVenueByOwnerEmail, updateVenue, deleteVenue } = require('../controllers/venuesController');

router.post('/', addVenue);
router.get('/', getVenues);
router.get('/owner/:email', getVenueByOwnerEmail);
router.get('/:id', getVenueById);
router.put('/:id', updateVenue);
router.delete('/:id', deleteVenue);

module.exports = router;
