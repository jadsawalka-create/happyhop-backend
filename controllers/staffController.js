const supabase = require('../config/database');

// GET all staff for a venue
const getStaff = async (req, res) => {
  try {
    const { venue_id } = req.params;

    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .eq('venue_id', venue_id)
      .order('created_at', { ascending: true });

    if (error) throw error;
    res.json({ staff: data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADD a staff member to a venue
const addStaff = async (req, res) => {
  try {
    const { venue_id, name, role, phone, shift } = req.body;

    if (!venue_id || !name) {
      return res.status(400).json({ message: 'venue_id and name are required' });
    }

    const { data, error } = await supabase
      .from('staff')
      .insert([{ venue_id, name, role: role || 'Staff', phone: phone || '', shift: shift || '' }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ message: 'Staff member added successfully!', member: data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE a staff member
const updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from('staff')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json({ message: 'Staff member updated!', member: data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE a staff member
const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('staff')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'Staff member removed successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStaff, addStaff, updateStaff, deleteStaff };
