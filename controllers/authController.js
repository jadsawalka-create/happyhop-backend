const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/database');

// REGISTER
const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if user exists
    const { data: existing } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user to database
    const { data, error } = await supabase
      .from('users')
      .insert([{ name, email, password: hashedPassword, phone }])
      .select();

    if (error) throw error;

    // Create token
    const token = jwt.sign(
      { id: data[0].id, email: data[0].email },
      process.env.JWT_SECRET || 'happyhop-secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Account created successfully!',
      token,
      user: { id: data[0].id, name: data[0].name, email: data[0].email }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Create token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'happyhop-secret',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful!',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET USERS (admin search for parent linking)
const getUsers = async (req, res) => {
  try {
    const { search } = req.query;
    let query = supabase.from('users').select('id, name, email, phone').order('name');
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    }
    const { data, error } = await query.limit(20);
    if (error) throw error;
    res.json({ users: data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN: CREATE OR RESET password for a venue owner account
const setVenueOwnerPassword = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if user already exists
    const { data: existing } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', email.toLowerCase())
      .single();

    if (existing) {
      // Update password
      const { error } = await supabase
        .from('users')
        .update({ password: hashedPassword })
        .eq('email', email.toLowerCase());

      if (error) throw error;
      return res.json({ message: 'Password updated successfully!' });
    } else {
      // Create new account
      const { error } = await supabase
        .from('users')
        .insert([{ name: name || 'Venue Owner', email: email.toLowerCase(), password: hashedPassword }]);

      if (error) throw error;
      return res.status(201).json({ message: 'Account created successfully!' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/auth/me — permanently delete the logged-in user's account.
// Removes their kids; deleting the user also removes their bookings and gift
// registries (ON DELETE CASCADE) and detaches their café orders (SET NULL).
const deleteAccount = async (req, res) => {
  try {
    const id = req.user && req.user.id;
    if (!id) return res.status(401).json({ message: 'Not logged in' });

    const { error: kidsError } = await supabase.from('kids').delete().eq('parent_id', id);
    if (kidsError) throw kidsError;

    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) throw error;

    res.json({ message: 'Account deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, getUsers, setVenueOwnerPassword, deleteAccount };