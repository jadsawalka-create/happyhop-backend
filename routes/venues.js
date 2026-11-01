const express = require('express');
const router = express.Router();
const { addVenue, getVenues, getVenueById, getVenueByOwnerEmail, updateVenue, deleteVenue } = require('../controllers/venuesController');
const auth = require('../middleware/auth');
const { adminOnly, staffOnly, venueFromParam, venueFromBody, venueFromRecord, selfFromParam, kidAccess, bookingAccess } = require('../middleware/access');

router.post('/', auth, adminOnly, addVenue);                       // admin creates venues
router.get('/', getVenues);                                        // public — marketplace
router.get('/owner/:email', getVenueByOwnerEmail);                 // venue portal login lookup
router.get('/:id', getVenueById);                                  // public
router.put('/:id', auth, venueFromParam('id'), updateVenue);       // that venue's owner or admin
router.delete('/:id', auth, adminOnly, deleteVenue);               // admin only

module.exports = router;
