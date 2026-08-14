const supabase = require('../config/database');

// ADD A CHILD (linked to parent OR standalone)
const addChild = async (req, res) => {
  try {
    const { name, age, gender, allergies, parent_id, parent_name, parent_phone, is_standalone } = req.body;

    const { data, error } = await supabase
      .from('kids')
      .insert([{ name, age, gender, allergies, parent_id: parent_id || null, parent_name: parent_name || null, parent_phone: parent_phone || null, is_standalone: is_standalone || false }])
      .select();

    if (error) throw error;

    res.status(201).json({ message: 'Child added successfully!', child: data[0] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL KIDS (admin view)
const getAllKids = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('kids')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ kids: data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET KIDS FOR A PARENT
const getKids = async (req, res) => {
  try {
    const { parent_id } = req.params;

    const { data, error } = await supabase
      .from('kids')
      .select('*')
      .eq('parent_id', parent_id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ kids: data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE A CHILD
const updateChild = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from('kids')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json({ message: 'Child updated successfully!', child: data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE A CHILD
const deleteChild = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('kids')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'Child removed successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addChild, getAllKids, getKids, updateChild, deleteChild };
