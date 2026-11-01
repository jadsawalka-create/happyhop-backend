const express = require('express');
const router = express.Router();
const requestsController = require('../controllers/requestsController');
const authenticateToken = require('../middleware/auth');
const { adminOnly } = require('../middleware/access');

router.post('/', requestsController.createRequest);
router.get('/', authenticateToken, adminOnly, requestsController.getAllRequests);
router.put('/:id', authenticateToken, adminOnly, requestsController.updateRequest);
router.delete('/:id', authenticateToken, adminOnly, requestsController.deleteRequest);

module.exports = router;
