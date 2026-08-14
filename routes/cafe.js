// ═══ Sprint 22: Cafeteria routes ═══
// Save as happyhop-backend/routes/cafe.js
// In server.js:
//     const cafeRoutes = require('./routes/cafe');
//     app.use('/api/cafe', cafeRoutes);

const express = require('express');
const router = express.Router();
const c = require('../controllers/cafeController');
const auth = require('../middleware/auth');

// Menu
router.get('/menu/:venueId', c.listMenu);             // public — customer app
router.post('/menu', auth, c.createItem);
router.put('/menu/:itemId', auth, c.updateItem);
router.delete('/menu/:itemId', auth, c.deleteItem);

// Orders
router.post('/orders', auth, c.createOrder);
router.get('/orders/venue/:venueId', auth, c.listOrdersByVenue);
router.get('/orders/parent/:parentId', auth, c.listOrdersByParent);
router.put('/orders/:orderId/status', auth, c.updateOrderStatus);

module.exports = router;
