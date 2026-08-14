// ═══ Sprint 22: Cafeteria controller ═══
// Save as happyhop-backend/controllers/cafeController.js

const supabase = require('../config/database');

// ── Menu ──

exports.listMenu = async (req, res) => {
  try {
    const { venueId } = req.params;
    const includeUnavailable = req.query.include_unavailable === '1';
    let query = supabase.from('cafe_menu_items').select('*').eq('venue_id', venueId).order('sort_order').order('created_at');
    if (!includeUnavailable) query = query.eq('is_available', true);
    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    res.json({ items: data || [] });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.createItem = async (req, res) => {
  try {
    const { venue_id, name, description, price, currency, image_url, emoji, category, restaurant, is_available, sort_order } = req.body;
    if (!venue_id || !name) return res.status(400).json({ error: 'venue_id and name are required' });
    const payload = {
      venue_id, name, description: description || null,
      price: price || 0, currency: currency || 'JOD',
      image_url: image_url || null, emoji: emoji || null,
      category: category || 'other',
      restaurant: restaurant || null,
      is_available: is_available !== false,
      sort_order: sort_order || 0
    };
    const { data, error } = await supabase.from('cafe_menu_items').insert([payload]).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.json({ item: data });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.updateItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const allowed = ['name','description','price','currency','image_url','emoji','category','restaurant','is_available','sort_order'];
    const updates = {};
    for (const k of allowed) if (k in (req.body || {})) updates[k] = req.body[k];
    const { data, error } = await supabase.from('cafe_menu_items').update(updates).eq('id', itemId).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.json({ item: data });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { error } = await supabase.from('cafe_menu_items').delete().eq('id', itemId);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

// ── Orders ──

exports.createOrder = async (req, res) => {
  try {
    const { venue_id, parent_id, session_id, booking_id, items, total, currency, notes, table_number } = req.body;
    if (!venue_id || !Array.isArray(items) || items.length === 0)
      return res.status(400).json({ error: 'venue_id and items are required' });
    const payload = {
      venue_id,
      parent_id: parent_id || req.user?.id || null,
      session_id: session_id || null,
      booking_id: booking_id || null,
      items, total: total || 0, currency: currency || 'JOD',
      notes: notes || null, table_number: table_number || null,
      status: 'pending'
    };
    const { data, error } = await supabase.from('cafe_orders').insert([payload]).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.json({ order: data });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    if (!['pending','confirmed','preparing','delivered','cancelled'].includes(status))
      return res.status(400).json({ error: 'Invalid status' });
    const { data, error } = await supabase
      .from('cafe_orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.json({ order: data });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.listOrdersByVenue = async (req, res) => {
  try {
    const { venueId } = req.params;
    const { status } = req.query;
    let query = supabase.from('cafe_orders')
      .select('*, users!parent_id(id, name, email, phone)')
      .eq('venue_id', venueId)
      .order('created_at', { ascending: false });
    if (status) query = query.eq('status', status);
    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    res.json({ orders: data || [] });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.listOrdersByParent = async (req, res) => {
  try {
    const { parentId } = req.params;
    const { data, error } = await supabase
      .from('cafe_orders').select('*, venues(id, name)')
      .eq('parent_id', parentId)
      .order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json({ orders: data || [] });
  } catch (e) { res.status(500).json({ error: e.message }); }
};
