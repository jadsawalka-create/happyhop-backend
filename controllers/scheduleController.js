const supabase = require('../config/database');

// GET /api/schedule/:venueId
exports.getSchedule = async (req, res) => {
  try {
    const { venueId } = req.params;
    const { data, error } = await supabase
      .from('venue_schedule')
      .select('*')
      .eq('venue_id', venueId)
      .order('event_date', { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    res.json({ schedule: data || [] });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// POST /api/schedule
exports.createEntry = async (req, res) => {
  try {
    const { data, error } = await supabase.from('venue_schedule').insert([req.body]).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Schedule entry created!', entry: data });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// PUT /api/schedule/:id
exports.updateEntry = async (req, res) => {
  try {
    const { data, error } = await supabase.from('venue_schedule').update(req.body).eq('id', req.params.id).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Schedule entry updated!', entry: data });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// DELETE /api/schedule/:id
exports.deleteEntry = async (req, res) => {
  try {
    const { error } = await supabase.from('venue_schedule').delete().eq('id', req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Schedule entry deleted!' });
  } catch (e) { res.status(500).json({ error: e.message }); }
};
