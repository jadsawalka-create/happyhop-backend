const express = require('express');
const router = express.Router();
const packagesController = require('../controllers/packagesController');
const authenticateToken = require('../middleware/auth');

router.get('/:venueId', packagesController.getPackages);
router.post('/', authenticateToken, packagesController.createPackage);
router.put('/:id', authenticateToken, packagesController.updatePackage);
router.delete('/:id', authenticateToken, packagesController.deletePackage);

module.exports = router;
