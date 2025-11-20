// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/users');
const authenticate = require('../middleware/auth');
router.post('/register', async (req, res) => {
  try {
    const { name, email, role, password, profilePic } = req.body;
    if (!name || !email || !role || !password) {
      return res.status(400).send({ error: 'name, email, role and password are required' });
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).send({ error: 'Email already in use' });
    const passwordHash = await bcrypt.hash(password, 10);     
    const user = new User({ name, email, role, passwordHash, profilePic });
    await user.save();
    const out = user.toObject();
    delete out.passwordHash;
    res.status(201).send(out);
  } catch (error) {
    res.status(400).send({ error: 'Failed to create user', details: error.message });
  }
});
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    const isValidPassword = await user.comparePassword(req.body.password);
    if (!isValidPassword) {
      return res.status(401).send({ error: 'Invalid password' });
    }
    const token = await user.generateToken();
    res.send({ token });
  } catch (error) {
    res.status(500).send({ error: 'Failed to log in', details: error.message });
  }
});

// return current authenticated user
router.get('/me', authenticate, async (req, res) => {
  try {
    const out = req.user.toObject();
    delete out.passwordHash;
    res.send(out);
  } catch (err) {
    res.status(500).send({ error: 'Failed to fetch user' });
  }
});

module.exports = router;
