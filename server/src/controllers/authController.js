const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { get, run, query } = require('../db');
const { JWT_SECRET } = require('../middleware/auth');

function createToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, company_id: user.company_id },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

exports.demoLogin = (req, res) => {
  try {
    const { role } = req.body;
    let targetEmail = 'seller@waste2market.com';
    if (role === 'buyer') targetEmail = 'buyer@waste2market.com';
    if (role === 'admin') targetEmail = 'admin@waste2market.com';

    const user = get(
      `SELECT u.id, u.name, u.email, u.role, u.company_id,
              c.name as company_name, c.industry, c.city, c.state, c.is_verified, c.rating
       FROM users u
       LEFT JOIN companies c ON u.company_id = c.id
       WHERE u.email = ?`,
      [targetEmail]
    );

    if (!user) {
      return res.status(404).json({ error: `Demo account for ${role} not found` });
    }

    const token = createToken(user);
    res.json({
      message: `Signed in as ${user.name}`,
      token,
      user
    });
  } catch (err) {
    console.error('Demo login error:', err);
    res.status(500).json({ error: 'Failed to authenticate demo account' });
  }
};

exports.login = (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = get(
      `SELECT u.*, c.name as company_name, c.industry, c.city, c.state, c.is_verified, c.rating
       FROM users u
       LEFT JOIN companies c ON u.company_id = c.id
       WHERE u.email = ?`,
      [email.toLowerCase().trim()]
    );

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    delete user.password_hash;
    const token = createToken(user);
    res.json({
      message: 'Login successful',
      token,
      user
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

exports.register = (req, res) => {
  try {
    const { name, email, password, role, companyName, industry, state, city, phone } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Name, email, password, and role are required' });
    }

    const existing = get('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (existing) {
      return res.status(400).json({ error: 'A user with this email already exists' });
    }

    let companyId = null;
    if (role !== 'admin' && companyName) {
      const compResult = run(
        `INSERT INTO companies (name, industry, state, city, phone, email, is_verified, rating)
         VALUES (?, ?, ?, ?, ?, ?, 0, 4.5)`,
        [companyName, industry || 'Industrial Processing', state || 'Punjab', city || 'Ludhiana', phone || '', email.toLowerCase().trim()]
      );
      companyId = compResult.lastInsertRowid;
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const userResult = run(
      `INSERT INTO users (name, email, password_hash, role, company_id)
       VALUES (?, ?, ?, ?, ?)`,
      [name, email.toLowerCase().trim(), passwordHash, role, companyId]
    );

    const newUser = get(
      `SELECT u.id, u.name, u.email, u.role, u.company_id,
              c.name as company_name, c.industry, c.city, c.state, c.is_verified, c.rating
       FROM users u
       LEFT JOIN companies c ON u.company_id = c.id
       WHERE u.id = ?`,
      [userResult.lastInsertRowid]
    );

    const token = createToken(newUser);
    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: newUser
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

exports.getMe = (req, res) => {
  try {
    const user = get(
      `SELECT u.id, u.name, u.email, u.role, u.company_id,
              c.name as company_name, c.industry, c.city, c.state, c.is_verified, c.rating,
              c.about, c.phone, c.address, c.materials_generated, c.materials_required
       FROM users u
       LEFT JOIN companies c ON u.company_id = c.id
       WHERE u.id = ?`,
      [req.user.id]
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (err) {
    console.error('Get me error:', err);
    res.status(500).json({ error: 'Failed to fetch user session' });
  }
};
