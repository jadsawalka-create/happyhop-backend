const express = require('express');
const router = express.Router();
const sessionsController = require('../controllers/sessionsController');
const authenticateToken = require('../middleware/auth');

router.get('/parent/:parentId/active', authenticateToken, sessionsController.getParentActiveSessions);
router.get('/:venueId', sessionsController.getSessions);
router.post('/', authenticateToken, sessionsController.createSession);
router.put('/:id/checkout', authenticateToken, sessionsController.checkoutSession);
router.put('/:id', authenticateToken, sessionsController.updateSession);
router.delete('/:id', authenticateToken, sessionsController.deleteSession);

module.exports = router;
