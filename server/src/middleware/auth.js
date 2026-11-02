const jwt = require('jsonwebtoken');
const { get } = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'waste2market-super-secret-key-2026';

function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Support demo-user-id header for seamless testing
      const demoUserId = req.headers['x-demo-user-id'];
      if (demoUserId) {
        const user = get('SELECT u.*, c.name as company_name, c.is_verified, c.city, c.state FROM users u LEFT JOIN companies c ON u.company_id = c.id WHERE u.id = ?', [demoUserId]);
        if (user) {
          req.user = user;
          return next();
        }
      }
      return res.status(401).json({ error: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = get('SELECT u.*, c.name as company_name, c.is_verified, c.city, c.state FROM users u LEFT JOIN companies c ON u.company_id = c.id WHERE u.id = ?', [decoded.id]);
    
    if (!user) {
      return res.status(401).json({ error: 'User not found or session expired' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired authentication token' });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin privileges required' });
  }
  next();
}

module.exports = {
  JWT_SECRET,
  authenticate,
  requireAdmin
};
