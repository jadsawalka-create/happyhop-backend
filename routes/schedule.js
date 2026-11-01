const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const authenticateToken = require('../middleware/auth');
const { venueFromBody, venueFromRecord } = require('../middleware/access');

router.get('/:venueId', scheduleController.getSchedule);
router.post('/', authenticateToken, venueFromBody('venue_id'), scheduleController.createEntry);
router.put('/:id', authenticateToken, venueFromRecord('venue_schedule'), scheduleController.updateEntry);
router.delete('/:id', authenticateToken, venueFromRecord('venue_schedule'), scheduleController.deleteEntry);

module.exports = router;
