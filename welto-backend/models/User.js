// welto-backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    establishmentName: { type: String, required: true },
    establishmentType: { type: String, required: false, enum: ['AirBnB', 'Hotel', 'Hostel', 'Motel', 'Resort', 'Villa'] },
    phone: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin', 'moderator'], default: 'user' },
    isVerified: { type: Boolean, default: false },
    isPaid: { type: Boolean, default: false },
    emailVerified: { type: Boolean, default: false }
  });

// Méthode pour vérifier le mot de passe
userSchema.methods.verifyPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
