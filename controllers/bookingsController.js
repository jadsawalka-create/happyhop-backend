const supabase = require('../config/database');
const { sendBookingConfirmation, sendVenueNewBooking } = require('../services/emailService');
 
// ============================================================
// CREATE a new booking
// ============================================================
const createBooking = async (req, res) => {
  const { parent_id, kid_id, venue_id, booking_date, booking_time, tickets, total_price, notes } = req.body;
 
  if (!parent_id || !venue_id || !booking_date || !booking_time) {
    return res.status(400).json({ error: 'parent_id, venue_id, booking_date, and booking_time are required' });
  }
 
  const { data, error } = await supabase
    .from('bookings')
    .insert([{ parent_id, kid_id, venue_id, booking_date, booking_time, tickets, total_price, notes }])
    .select()
    .single();
 
  if (error) return res.status(500).json({ error: error.message });
 
  // Send confirmation emails (non-blocking — don't fail booking if email fails)
  try {
    const { data: parentData } = await supabase
      .from('users')
      .select('name, email')
      .eq('id', parent_id)
      .single();
 
    const { data: venueData } = await supabase
      .from('venues')
      .select('name')
      .eq('id', venue_id)
      .single();
 
    const venueName = venueData?.name || 'the venue';
 
    if (parentData?.email) {
      await sendBookingConfirmation({
        parentEmail: parentData.email,
        parentName: parentData.name,
        venueName,
        bookingDate: booking_date,
        bookingTime: booking_time,
        tickets: tickets || 1,
        totalPrice: total_price || 0,
        bookingId: data.id
      });
      console.log('✅ Booking confirmation email sent to', parentData.email);
    }
  } catch (emailErr) {
    console.error('Email notification error:', emailErr);
  }
 
  res.status(201).json({ message: 'Booking created successfully!', booking: data });
};
 
// ============================================================
// GET all bookings for a parent
// ============================================================
const getBookingsByParent = async (req, res) => {
  const { parent_id } = req.params;
 
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      venues (name, city, location, image_url),
      kids (name, age)
    `)
    .eq('parent_id', parent_id)
    .order('booking_date', { ascending: false });
 
  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json({ bookings: data, count: data.length });
};
 
// ============================================================
// GET all bookings for a venue
// ============================================================
const getBookingsByVenue = async (req, res) => {
  const { venue_id } = req.params;
 
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      kids (name, age),
      users (name, email)
    `)
    .eq('venue_id', venue_id)
    .order('booking_date', { ascending: true });
 
  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json({ bookings: data, count: data.length });
};
 
// ============================================================
// GET ALL bookings across ALL venues (admin dashboard)
// ============================================================
const getAllBookings = async (req, res) => {
  const { status, from_date, to_date } = req.query;
 
  let query = supabase
    .from('bookings')
    .select(`
      *,
      venues (id, name, city, location, image_url),
      kids (id, name, age, gender),
      users (id, name, email, phone)
    `)
    .order('booking_date', { ascending: false });
 
  if (status)    query = query.eq('status', status);
  if (from_date) query = query.gte('booking_date', from_date);
  if (to_date)   query = query.lte('booking_date', to_date);
 
  const { data, error } = await query;
 
  if (error) {
    console.error('getAllBookings error:', error);
    return res.status(500).json({ error: error.message });
  }
  res.status(200).json({ bookings: data || [], count: (data || []).length });
};
 
// ============================================================
// GET a single booking by ID
// ============================================================
const getBookingById = async (req, res) => {
  const { id } = req.params;
 
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      venues (name, city, location, image_url),
      kids (name, age)
    `)
    .eq('id', id)
    .single();
 
  if (error) return res.status(404).json({ error: 'Booking not found' });
  res.status(200).json({ booking: data });
};
 
// ============================================================
// UPDATE booking status
// ============================================================
const updateBookingStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
 
  const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Status must be: pending, confirmed, cancelled, or completed' });
  }
 
  const { data, error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
 
  if (error) return res.status(500).json({ error: error.message });
 
  // Send confirmation email when venue confirms
  if (status === 'confirmed') {
    try {
      const { data: fullBooking } = await supabase
        .from('bookings')
        .select(`
          *,
          venues (name),
          users (name, email)
        `)
        .eq('id', id)
        .single();
 
      if (fullBooking && fullBooking.users && fullBooking.venues) {
        await sendBookingConfirmation({
          parentEmail: fullBooking.users.email,
          parentName: fullBooking.users.name,
          venueName: fullBooking.venues.name,
          bookingDate: fullBooking.booking_date,
          bookingTime: fullBooking.booking_time,
          tickets: fullBooking.tickets || 1,
          totalPrice: fullBooking.total_price || 0,
          bookingId: fullBooking.id
        });
      }
    } catch (emailErr) {
      console.error('Confirmation email error:', emailErr);
    }
  }
 
  res.status(200).json({ message: 'Booking status updated!', booking: data });
};
 
// ============================================================
// CANCEL a booking
// ============================================================
const cancelBooking = async (req, res) => {
  const { id } = req.params;
 
  const { data, error } = await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', id)
    .select()
    .single();
 
  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json({ message: 'Booking cancelled successfully!', booking: data });
};
 
// ============================================================
// EXPORTS
// ============================================================
module.exports = {
  createBooking,
  getBookingsByParent,
  getBookingsByVenue,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking
};