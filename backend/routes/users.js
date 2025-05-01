const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('name email'); // Select 'name' and 'email' fields
    res.send(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).send({ error: 'Failed to fetch users' });
  }
});

module.exports = router;
