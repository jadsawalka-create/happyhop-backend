const supabase = require('../config/database');

// Add a new venue
const addVenue = async (req, res) => {
  const { name, description, city, location, capacity, min_age, max_age, price_per_child, image_url } = req.body;

  if (!name || !city || !location) {
    return res.status(400).json({ error: 'Name, city, and location are required' });
  }

  const { data, error } = await supabase
    .from('venues')
    .insert([{ name, description, city, location, capacity, min_age, max_age, price_per_child, image_url }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json({ message: 'Venue added successfully!', venue: data });
};

// Get all venues
const getVenues = async (req, res) => {
  const { city, showAll } = req.query;

  // showAll=true returns all venues including inactive (for admin use)
  let query = supabase.from('venues').select('*');
  if (showAll !== 'true') {
    query = query.eq('is_active', true);
  }

  if (city) {
    query = query.ilike('city', `%${city}%`);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json({ venues: data, count: data.length });
};

// Get venue by owner email (for venue owner portal login)
const getVenueByOwnerEmail = async (req, res) => {
  const { email } = req.params;

  const { data, error } = await supabase
    .from('venues')
    .select('*')
    .eq('owner_email', email.toLowerCase())
    .single();

  if (error || !data) return res.status(404).json({ error: 'No venue found for this account' });

  res.status(200).json({ venue: data });
};

// Get a single venue by ID
const getVenueById = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('venues')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return res.status(404).json({ error: 'Venue not found' });

  res.status(200).json({ venue: data });
};

// Update a venue
const updateVenue = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const { data, error } = await supabase
    .from('venues')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json({ message: 'Venue updated successfully!', venue: data });
};

// Delete a venue
const deleteVenue = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('venues')
    .delete()
    .eq('id', id);

  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json({ message: 'Venue deleted successfully!' });
};

module.exports = { addVenue, getVenues, getVenueById, getVenueByOwnerEmail, updateVenue, deleteVenue };
