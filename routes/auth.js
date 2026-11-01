const express = require('express');
const router = express.Router();
const { register, login, getUsers, setVenueOwnerPassword, deleteAccount } = require('../controllers/authController');
const authenticateToken = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/users?search=...  (admin only — was public, exposed names/emails/phones)
router.get('/users', authenticateToken, requireAdmin, getUsers);

// POST /api/auth/set-venue-password  (admin only — was public, allowed anyone to reset any password)
router.post('/set-venue-password', authenticateToken, requireAdmin, setVenueOwnerPassword);

// DELETE /api/auth/me  — the logged-in parent deletes their own account (App Store requirement)
router.delete('/me', authenticateToken, deleteAccount);

module.exports = router;
