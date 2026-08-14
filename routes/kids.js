const express = require('express');
const router = express.Router();
const { addChild, getAllKids, getKids, updateChild, deleteChild } = require('../controllers/kidsController');
const authenticateToken = require('../middleware/auth');

// Admin: get all kids (no auth — admin portal uses its own token check)
router.get('/', getAllKids);

// Admin: add standalone kid (no parent auth needed)
router.post('/standalone', addChild);

// Parent: add kid linked to their account
router.post('/', authenticateToken, addChild);

// Parent: get their kids
router.get('/parent/:parent_id', authenticateToken, getKids);

// Update a kid
router.put('/:id', authenticateToken, updateChild);

// Delete a kid
router.delete('/:id', deleteChild);

module.exports = router;
