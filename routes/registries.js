// ═══ Sprint 20: Gift Registry Routes ═══
// Save as happyhop-backend/routes/registries.js
// Then register in server.js / app.js:
//     const registriesRoutes = require('./routes/registries');
//     app.use('/api/registries', registriesRoutes);

const express = require('express');
const router = express.Router();
const c = require('../controllers/registriesController');
const auth = require('../middleware/auth');

// ── Public (no auth) ──
// Guests claim items without logging in, using the share link
router.get('/share/:code', c.getByShareCode);
router.post('/items/:itemId/reserve', c.reserveItem);
router.delete('/reservations/:reservationId', c.cancelReservation);

// ── Authenticated ──
router.get('/parent/:parentId', auth, c.getByParent);
router.get('/venue/:venueId', auth, c.getByVenue);
router.get('/:id', auth, c.getById);
router.get('/:id/reservations', auth, c.listReservationsForRegistry);

router.post('/', auth, c.createRegistry);
router.put('/:id', auth, c.updateRegistry);
router.delete('/:id', auth, c.deleteRegistry);

router.post('/:id/items', auth, c.addItem);
router.put('/items/:itemId', auth, c.updateItem);
router.delete('/items/:itemId', auth, c.deleteItem);

module.exports = router;
