// Allows a request only if the logged-in user's email is in ADMIN_EMAILS
// (Railway variable, comma-separated, e.g. "jad@planzy.jo,ops@planzy.jo").
// Use AFTER authenticateToken.
module.exports = (req, res, next) => {
  const admins = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const email = ((req.user && req.user.email) || '').toLowerCase();
  if (!email || !admins.includes(email)) {
    return res.status(403).json({ error: 'Admins only.' });
  }
  next();
};
