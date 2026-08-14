const supabase = require('../config/database');

// GET all rooms for a venue
const getRooms = async (req, res) => {
  try {
    const { venue_id } = req.params;

    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('venue_id', venue_id)
      .order('created_at', { ascending: true });

    if (error) throw error;
    res.json({ rooms: data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADD a room to a venue
const addRoom = async (req, res) => {
  try {
    const { venue_id, name, emoji, max_kids, max_adults, type, notes } = req.body;

    if (!venue_id || !name) {
      return res.status(400).json({ message: 'venue_id and name are required' });
    }

    const { data, error } = await supabase
      .from('rooms')
      .insert([{ venue_id, name, emoji: emoji || '🏠', max_kids: max_kids || null, max_adults: max_adults || null, type: type || 'General', notes: notes || '' }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ message: 'Room added successfully!', room: data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE a room
const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from('rooms')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json({ message: 'Room updated!', room: data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE a room
const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('rooms')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'Room removed successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getRooms, addRoom, updateRoom, deleteRoom };
