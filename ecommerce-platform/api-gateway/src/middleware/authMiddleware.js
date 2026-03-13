const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

// Optional auth — attaches user if token present, doesn't block if missing
const optionalAuth = (req, res, next) => {
  const header = req.headers.authorization;
  if (header) {
    const token = header.split(' ')[1];
    try {
      req.user = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      // token invalid, continue without user
    }
  }
  next();
};

// Required auth — blocks request if no valid token
const requireAuth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'No token provided' });

  const token = header.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = { optionalAuth, requireAuth };
