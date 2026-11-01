// ═══ Sprint 22: Cafeteria routes ═══
// Save as happyhop-backend/routes/cafe.js
// In server.js:
//     const cafeRoutes = require('./routes/cafe');
//     app.use('/api/cafe', cafeRoutes);

const express = require('express');
const router = express.Router();
const c = require('../controllers/cafeController');
const auth = require('../middleware/auth');
const { adminOnly, staffOnly, venueFromParam, venueFromBody, venueFromRecord, selfFromParam, kidAccess, bookingAccess } = require('../middleware/access');

// Menu
router.get('/menu/:venueId', c.listMenu);             // public — customer app
router.post('/menu', auth, venueFromBody('venue_id'), c.createItem);
router.put('/menu/:itemId', auth, venueFromRecord('cafe_menu_items', 'itemId'), c.updateItem);
router.delete('/menu/:itemId', auth, venueFromRecord('cafe_menu_items', 'itemId'), c.deleteItem);

// Orders
router.post('/orders', auth, c.createOrder);
router.get('/orders/venue/:venueId', auth, venueFromParam('venueId'), c.listOrdersByVenue);
router.get('/orders/parent/:parentId', auth, selfFromParam('parentId'), c.listOrdersByParent);
router.put('/orders/:orderId/status', auth, venueFromRecord('cafe_orders', 'orderId'), c.updateOrderStatus);

module.exports = router;
