const jwt = require('jsonwebtoken');
const baseUrl = process.env.APP_URL || 'https://welto.fr';

const generateVerificationLink = (userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return `${baseUrl}/verify-email?token=${token}`;
};

module.exports = generateVerificationLink;
