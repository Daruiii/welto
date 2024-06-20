const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { body, validationResult } = require('express-validator'); // Pour la validation des données
const ensureRole = require('../middlewares/roles');

// Middleware de gestion des erreurs
const handleError = (res, error, message) => {
    console.error(message, error);
    res.status(500).json({ message, error });
};

// Route pour changer le mot de passe
router.put('/change-password', passport.authenticate('jwt', { session: false }), [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'Error changing password', error });
    }
});

// Récupérer tous les utilisateurs (seuls les admins peuvent utiliser cette route)
router.get('/', passport.authenticate('jwt', { session: false }), ensureRole('admin'), async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).json({ message: 'Error retrieving users', error });
    }
});

// Récupérer un utilisateur (seuls les admins peuvent utiliser cette route)
router.get('/:id', passport.authenticate('jwt', { session: false }), ensureRole('admin'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        handleError(res, error, 'Error retrieving user');
    }
});

// Mettre à jour un utilisateur
router.put('/:id',
    passport.authenticate('jwt', { session: false }),
    [
        body('email').optional().isEmail().withMessage('Please provide a valid email'),
        body('firstName').optional().isString().withMessage('First name must be a string'),
        body('lastName').optional().isString().withMessage('Last name must be a string'),
        // Ajoutez d'autres validations nécessaires ici
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { firstName, lastName, establishmentName, establishmentType, phone, isVerified, isPaid, role } = req.body;
        try {
            // Vérifier si l'utilisateur est celui qui est en train de faire la requête ou si c'est un admin
            if (req.user.id === req.params.id || req.user.role === 'admin') {
                // Préparer l'objet de mise à jour
                const updateFields = {
                    firstName,
                    lastName,
                    establishmentName,
                    establishmentType,
                    phone,
                    isVerified,
                    isPaid
                };

                // Seul un admin peut modifier le rôle
                if (req.user.role === 'admin' && role !== undefined) {
                    updateFields.role = role;
                }

                const updatedUser = await User.findByIdAndUpdate(req.params.id, updateFields, { new: true }).select('-password');

                if (!updatedUser) {
                    return res.status(404).json({ message: 'User not found' });
                }

                res.json(updatedUser);
            } else {
                // Si l'utilisateur n'est pas autorisé à mettre à jour le profil
                return res.status(403).json({ message: 'Forbidden: You are not allowed to update this user' });
            }
        } catch (error) {
            handleError(res, error, 'Error updating user');
        }
    }
);

// Supprimer un utilisateur
router.delete('/:id', passport.authenticate('jwt', { session: false }), ensureRole('admin'), async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        handleError(res, error, 'Error deleting user');
    }
});

// Récupérer les utilisateurs non vérifiés (admin uniquement)
router.get('/status/unverified', passport.authenticate('jwt', { session: false }), ensureRole('admin'), async (req, res) => {
    try {
        const users = await User.find({ isVerified: false }).select('-password');
        res.status(200).json(users);
    } catch (error) {
        handleError(res, error, 'Error retrieving unverified users');
    }
});

// Récupérer les utilisateurs vérifiés (admin uniquement)
router.get('/status/verified', passport.authenticate('jwt', { session: false }), ensureRole('admin'), async (req, res) => {
    try {
        const users = await User.find({ isVerified: true }).select('-password');
        res.status(200).json(users);
    } catch (error) {
        handleError(res, error, 'Error retrieving verified users');
    }
});

// Vérifier un utilisateur (admin uniquement)
router.post('/:id/verify', passport.authenticate('jwt', { session: false }), ensureRole('admin'), async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { isVerified: true }, { new: true }).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User verified successfully', user });
    } catch (error) {
        handleError(res, error, 'Error verifying user');
    }
});

// Dé-vérifier un utilisateur (admin uniquement)
router.post('/:id/unverify', passport.authenticate('jwt', { session: false }), ensureRole('admin'), async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { isVerified: false }, { new: true }).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User unverified successfully', user });
    } catch (error) {
        handleError(res, error, 'Error un-verifying user');
    }
});
module.exports = router;
