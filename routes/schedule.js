const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const authenticateToken = require('../middleware/auth');

router.get('/:venueId', scheduleController.getSchedule);
router.post('/', authenticateToken, scheduleController.createEntry);
router.put('/:id', authenticateToken, scheduleController.updateEntry);
router.delete('/:id', authenticateToken, scheduleController.deleteEntry);

module.exports = router;
