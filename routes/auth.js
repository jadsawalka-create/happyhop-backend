const express = require('express');
const router = express.Router();
const { register, login, getUsers, setVenueOwnerPassword } = require('../controllers/authController');

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/users?search=... (admin: search parents)
router.get('/users', getUsers);

// POST /api/auth/set-venue-password (admin: create or reset venue owner account)
router.post('/set-venue-password', setVenueOwnerPassword);

module.exports = router;
