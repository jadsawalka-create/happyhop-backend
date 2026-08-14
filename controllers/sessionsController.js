const supabase = require('../config/database');

// GET /api/sessions/:venueId — list active sessions for a venue
exports.getSessions = async (req, res) => {
  try {
    const { venueId } = req.params;
    const { status } = req.query;
    let q = supabase.from('venue_sessions').select('*, kids(id,name,age,gender,image_url), rooms(id,name,emoji)').eq('venue_id', venueId);
    if (status) q = q.eq('status', status);
    q = q.order('check_in_time', { ascending: false });
    const { data, error } = await q;
    if (error) return res.status(500).json({ error: error.message });
    res.json({ sessions: data || [] });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// GET /api/sessions/parent/:parentId/active — parent-facing: active sessions for their kids
exports.getParentActiveSessions = async (req, res) => {
  try {
    const { parentId } = req.params;
    const { data: kids, error: kidsErr } = await supabase.from('kids').select('id').eq('parent_id', parentId);
    if (kidsErr) return res.status(500).json({ error: kidsErr.message });
    const kidIds = (kids || []).map(k => k.id);
    if (kidIds.length === 0) return res.json({ sessions: [] });
    const { data, error } = await supabase.from('venue_sessions').select('*, kids(id,name,age,gender,image_url), venues(id,name,city,image_url,brand_color)').in('kid_id', kidIds).eq('status', 'active').order('check_in_time', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json({ sessions: data || [] });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// POST /api/sessions — create (typically on QR scan check-in)
exports.createSession = async (req, res) => {
  try {
    const { data, error } = await supabase.from('venue_sessions').insert([req.body]).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Session started!', session: data });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// PUT /api/sessions/:id — update (check out, change room, etc.)
exports.updateSession = async (req, res) => {
  try {
    const { data, error } = await supabase.from('venue_sessions').update(req.body).eq('id', req.params.id).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Session updated!', session: data });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// PUT /api/sessions/:id/checkout — convenience: mark session ended now
exports.checkoutSession = async (req, res) => {
  try {
    const { data, error } = await supabase.from('venue_sessions').update({ status: 'completed', check_out_time: new Date().toISOString() }).eq('id', req.params.id).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Checked out!', session: data });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// DELETE /api/sessions/:id
exports.deleteSession = async (req, res) => {
  try {
    const { error } = await supabase.from('venue_sessions').delete().eq('id', req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Session deleted!' });
  } catch (e) { res.status(500).json({ error: e.message }); }
};
