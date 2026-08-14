const express = require('express');
const router = express.Router();
const requestsController = require('../controllers/requestsController');
const authenticateToken = require('../middleware/auth');

router.post('/', requestsController.createRequest);
router.get('/', authenticateToken, requestsController.getAllRequests);
router.put('/:id', authenticateToken, requestsController.updateRequest);
router.delete('/:id', authenticateToken, requestsController.deleteRequest);

module.exports = router;
