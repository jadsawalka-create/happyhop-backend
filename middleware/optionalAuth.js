// Like authenticateToken, but lets the request through without a login
// (req.user is only set when a valid token is sent).
const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
  const h = req.headers['authorization'];
  const token = h && h.split(' ')[1];
  if (token) {
    try { req.user = jwt.verify(token, process.env.JWT_SECRET); } catch (_) { /* treat as guest */ }
  }
  next();
};
