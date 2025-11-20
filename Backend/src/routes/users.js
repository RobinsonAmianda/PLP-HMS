// routes/users.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const path = require('path');
const multer = require('multer');
const authenticate = require('../middleware/auth');
const User = require('../models/users');

// multer setup for avatar uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.random().toString(36).substring(2,8)}${ext}`;
    cb(null, name);
  }
});
const upload = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 } });

// Get all users - admin only
const isAdmin = require('../middleware/admin');
router.get('/', authenticate, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash');
    res.send(users);
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

// Get user by id - only admin or the user themself
router.get('/:id', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) return res.status(403).send({ error: 'Forbidden' });
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) return res.status(404).send({ error: 'User not found' });
    res.send(user);
  } catch (error) {
    res.status(400).send({ error: 'Invalid user id' });
  }
});

// Create new user
router.post('/', async (req, res) => {
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

// Update a user (must be authenticated and update own profile or be admin)
router.put('/:id', authenticate, async (req, res) => {
  try {
    // authorization: user can only update themselves unless admin
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).send({ error: 'Forbidden' });
    }
    const updates = { ...req.body };
    if (updates.password) {
      updates.passwordHash = await bcrypt.hash(updates.password, 10);
      delete updates.password;
    }
    // prevent changing role unless admin
    if (updates.role && req.user.role !== 'admin') delete updates.role;
    const options = { new: true, runValidators: true };
    const updated = await User.findByIdAndUpdate(req.params.id, updates, options).select('-passwordHash');
    if (!updated) return res.status(404).send({ error: 'User not found' });
    res.send(updated);
  } catch (error) {
    res.status(400).send({ error: 'Failed to update user', details: error.message });
  }
});

// Avatar upload endpoint - multipart/form-data, field: avatar
router.post('/:id/avatar', authenticate, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send({ error: 'No file uploaded' });
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).send({ error: 'Forbidden' });
    }
    const urlPath = `/uploads/${req.file.filename}`;
    const updated = await User.findByIdAndUpdate(req.params.id, { profilePic: urlPath }, { new: true }).select('-passwordHash');
    res.send({ profilePic: urlPath, user: updated });
  } catch (error) {
    res.status(500).send({ error: 'Upload failed', details: error.message });
  }
});

// Delete a user - only admin
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id).select('-passwordHash');
    if (!deleted) return res.status(404).send({ error: 'User not found' });
    res.send({ message: 'User deleted', id: req.params.id });
  } catch (error) {
    res.status(500).send({ error: 'Failed to delete user' });
  }
});

module.exports = router;
