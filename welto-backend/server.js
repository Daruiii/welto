const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const app = express();
const port = process.env.PORT || 5000;

// Utilisation de MONGO_URI depuis les variables d'environnement
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/welto');

app.use(express.json());

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'secret_key', // Change this to your secret key
};

passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
  // Handle JWT validation
}));

app.use(passport.initialize());

app.get('/', (req, res) => {
  res.send('Welcome to Welto Backend');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});