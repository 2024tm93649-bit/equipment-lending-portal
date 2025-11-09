const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    user = new User({ name, email, passwordHash, role: role || 'student' });
    await user.save();

    const payload = { user: { id: user._id, name: user.name, email: user.email, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'VerySecretKeyForAssignment', { expiresIn: '8h' });

    res.json({ token, user: payload.user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { user: { id: user._id, name: user.name, email: user.email, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'VerySecretKeyForAssignment', { expiresIn: '8h' });

    res.json({ token, user: payload.user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
