// Drop-in replacement for happyhop-backend/controllers/settingsController.js
// Adds ui_config support so the admin Marketplace UI section can be saved.

const supabase = require('../config/database');

exports.getSettings = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('platform_settings')
      .select('*')
      .eq('id', 1)
      .single();
    if (error) return res.status(500).json({ error: error.message });
    res.json({ settings: data });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const allowed = ['name', 'tagline', 'brand_color', 'logo_url', 'ui_config'];
    const updates = {};
    for (const k of allowed) {
      if (k in (req.body || {})) updates[k] = req.body[k];
    }
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('platform_settings')
      .update(updates)
      .eq('id', 1)
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    res.json({ settings: data });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
