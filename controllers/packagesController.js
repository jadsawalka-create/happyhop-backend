const supabase = require('../config/database');

exports.getPackages = async (req, res) => {
  try {
    const { venueId } = req.params;
    const { visibility, include_inactive } = req.query;
    let q = supabase.from('venue_packages').select('*').eq('venue_id', venueId);
    if (!include_inactive) q = q.eq('is_active', true);
    if (visibility === 'marketplace') q = q.in('visibility', ['marketplace', 'both']);
    else if (visibility === 'venue_app') q = q.in('visibility', ['venue_app', 'both']);
    q = q.order('sort_order', { ascending: true }).order('created_at', { ascending: true });
    const { data, error } = await q;
    if (error) return res.status(500).json({ error: error.message });
    res.json({ packages: data || [] });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.createPackage = async (req, res) => {
  try {
    const { data, error } = await supabase.from('venue_packages').insert([req.body]).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Package created!', package: data });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.updatePackage = async (req, res) => {
  try {
    const { data, error } = await supabase.from('venue_packages').update(req.body).eq('id', req.params.id).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Package updated!', package: data });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.deletePackage = async (req, res) => {
  try {
    const { error } = await supabase.from('venue_packages').delete().eq('id', req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Package deleted!' });
  } catch (e) { res.status(500).json({ error: e.message }); }
};
