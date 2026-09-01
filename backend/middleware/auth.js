const jwt = require('jsonwebtoken');
const config = require('../config/config');

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Authentication required.' });
  try {
    req.admin = jwt.verify(token, config.jwtSecret);
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Session expired. Please sign in again.' });
  }
}

module.exports = { requireAuth };
