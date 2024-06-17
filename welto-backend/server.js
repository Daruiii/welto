const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require('./models/User');
const authRoutes = require('./routes/auth');

const app = express();
const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI;
console.log("MONGO_URI:", process.env.MONGO_URI);
console.log("JWT_SECRET:", process.env.JWT_SECRET);
// Utilisation de MONGO_URI depuis les variables d'environnement
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/welto').then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error(err);
  process.exit(1);
});

app.use(express.json());

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'secret_key'
};

passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
  User.findById(jwt_payload.id, (err, user) => {
    if (err) {
      return done(err, false);
    }
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  });
}));

app.use(passport.initialize());
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
  res.send(`Welcome to Welto API, Mongo URI: ${mongoUri}`);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});