// welto-backend/routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { body, validationResult } = require('express-validator'); // Pour la validation des données
const ensureRole = require('../middlewares/roles');
const sendEmail = require('../services/emailService');
const generateVerificationLink = require('../utils/generateVerificationLink');
const i18n = require('../i18nConfig');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';
const JWT_EXPIRY = '1h'; // Durée de validité du token JWT


// Route d'inscription
router.post('/register', [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('establishmentName').notEmpty().withMessage('Establishment name is required'),
    body('phone').isMobilePhone().withMessage('Invalid phone number')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, firstName, lastName, establishmentName, establishmentType, phone } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
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

        // Détection de la langue de l'utilisateur (grace au navigateur)
        let locale = req.headers['accept-language'].split(',')[0].split('-')[0];
        if (locale) {
            locale = locale.split(',')[0].split('-')[0];
            if (!i18n.getLocales().includes(locale)) {
                locale = 'en';
            }
        } else {
            locale = 'en';
        }

        console.log('locale:', locale);
        const verificationLink = generateVerificationLink(newUser._id);
        console.log('Verification link:', verificationLink);
        await sendEmail(newUser.email, 'emailTemplate', { verificationLink }, locale, newUser.firstName);

        res.status(200).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user', error });
    }
});

// Route de connexion
router.post('/login', [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        if (!user.verifyPassword(password)) {
            return res.status(400).json({ message: 'Invalid password' });
        }
        const payload = { id: user._id, role: user.role };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
        res.status(200).json({ message: 'User logged in successfully', token });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Error logging in user', error });
    }
});

module.exports = router;
