const express = require('express');
const router = express.Router();
const supabase = require('../config/database');
const {
  createBooking,
  getBookingsByParent,
  getBookingsByVenue,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking
} = require('../controllers/bookingsController');
const authenticateToken = require('../middleware/auth');

// ─────────────────────────────────────────────────────────────
// SPECIFIC routes FIRST (so /admin/all and /parent/:id don't get caught by /:id)
// ─────────────────────────────────────────────────────────────

// Admin: list ALL bookings across all venues
router.get('/admin/all', authenticateToken, getAllBookings);

// Parent: list bookings for a specific parent
router.get('/parent/:parent_id', authenticateToken, getBookingsByParent);

// Venue: list bookings for a specific venue
router.get('/venue/:venue_id', authenticateToken, getBookingsByVenue);

// ─────────────────────────────────────────────────────────────
// GENERIC routes
// ─────────────────────────────────────────────────────────────

// Create new booking
router.post('/', authenticateToken, createBooking);

// Update booking status (used by admin & venue dashboards)
router.put('/:id/status', authenticateToken, updateBookingStatus);

// Cancel a booking
router.put('/:id/cancel', authenticateToken, cancelBooking);

// NEW: Generic update — used by the "Mark Paid" button on the dashboard
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const allowed = ['is_paid', 'paid_at', 'notes', 'status', 'total_price'];
  const updates = {};
  for (const k of allowed) {
    if (Object.prototype.hasOwnProperty.call(req.body || {}, k)) updates[k] = req.body[k];
  }
  if (updates.is_paid === true && !updates.paid_at) updates.paid_at = new Date().toISOString();
  if (updates.is_paid === false) updates.paid_at = null;
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'No updatable fields in request body' });
  }
  const { data, error } = await supabase
    .from('bookings')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) {
    console.error('[bookings PUT /:id]', error);
    return res.status(500).json({ error: error.message });
  }
  res.json({ message: 'Booking updated!', booking: data });
});

// Get one booking by ID (must be LAST among GETs to not catch /admin or /parent)
router.get('/:id', authenticateToken, getBookingById);

module.exports = router;
