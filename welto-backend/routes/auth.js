// welto-backend/routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Route d'inscription
router.post('/register', async (req, res) => {
    console.log('Received request to /register with body:', req.body);  // <-- Ajouté pour débogage
    const { email, password, firstName, lastName, establishmentName, establishmentType, phone } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('Email already exists');  // <-- Ajouté pour débogage
            return res.status(400).json({ message: 'Email already exists' });
        }
        const hash = bcrypt.hashSync(password, 10);
        const newUser = new User({
            email,
            password: hash,
            firstName,
            lastName,
            establishmentName,
            establishmentType,
            phone
        });
        await newUser.save();
        console.log('User registered successfully');  // <-- Ajouté pour débogage
        res.status(200).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);  // <-- Ajouté pour débogage
        res.status(500).json({ message: 'Error registering user', error });
    }
});

// Route de connexion
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        if (!user.verifyPassword(password)) {
            return res.status(400).json({ message: 'Invalid password' });
        }
        const payload = { id: user._id };
        const token = jwt.sign(payload, 'secret_key', { expiresIn: '1h' });
        console.log('User logged in successfully');  // <-- Ajouté pour débogage
        res.status(200).json({ message: 'User logged in successfully', token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in user', error });
    }
});

module.exports = router;
