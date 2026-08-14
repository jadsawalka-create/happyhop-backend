const supabase = require('../config/database');

// GET /api/requests — admin lists all
exports.getAllRequests = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('venue_requests')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json({ requests: data || [] });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// POST /api/requests — anyone can submit a venue signup request
exports.createRequest = async (req, res) => {
  try {
    const { data, error } = await supabase.from('venue_requests').insert([req.body]).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Request submitted! We will review it soon.', request: data });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// PUT /api/requests/:id — admin approves or rejects
exports.updateRequest = async (req, res) => {
  try {
    const update = { ...req.body, reviewed_at: new Date().toISOString() };
    const { data, error } = await supabase.from('venue_requests').update(update).eq('id', req.params.id).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Request updated!', request: data });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// DELETE /api/requests/:id
exports.deleteRequest = async (req, res) => {
  try {
    const { error } = await supabase.from('venue_requests').delete().eq('id', req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Request deleted!' });
  } catch (e) { res.status(500).json({ error: e.message }); }
};
