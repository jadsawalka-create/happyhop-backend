// routes/settings.js
const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const authMiddleware = require('../middleware/auth');

// Public read — KidZone app, venue portal, admin all need live brand
router.get('/', settingsController.getSettings);

// Admin write — protected
router.put('/', authMiddleware, require('../middleware/access').adminOnly, settingsController.updateSettings);

module.exports = router;