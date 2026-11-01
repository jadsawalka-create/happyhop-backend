const express = require('express');
const router = express.Router();
const packagesController = require('../controllers/packagesController');
const authenticateToken = require('../middleware/auth');
const { venueFromBody, venueFromRecord } = require('../middleware/access');

router.get('/:venueId', packagesController.getPackages);
router.post('/', authenticateToken, venueFromBody('venue_id'), packagesController.createPackage);
router.put('/:id', authenticateToken, venueFromRecord('venue_packages'), packagesController.updatePackage);
router.delete('/:id', authenticateToken, venueFromRecord('venue_packages'), packagesController.deletePackage);

module.exports = router;
