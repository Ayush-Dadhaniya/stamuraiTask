const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'mySecretAdminKey'; // use a secure secret in production
const JWT_SECRET = process.env.JWT_SECRET || 'secretKey';

// Register route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'user', adminSecret = '' } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Handle role assignment
    let assignedRole = 'user';
    if (role === 'admin') {
      if (adminSecret !== ADMIN_SECRET) {
        return res.status(403).json({ message: 'Invalid admin secret' });
      }
      assignedRole = 'admin';
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed, role: assignedRole });
    await user.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user && await bcrypt.compare(req.body.password, user.password)) {
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: '2h' }
      );
      res.json({ token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;
