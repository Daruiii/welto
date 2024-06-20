const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require('./models/User');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/swaggerConfig');
const i18n = require('./config/i18nConfig');
const cookieParser = require('cookie-parser');

const app = express();
// Route pour accéder à la documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
const port = process.env.PORT || 5000;
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
app.use(cookieParser());
app.use(i18n.init);

app.use((req, res, next) => {
  let locale = req.query.lang || req.cookies.lang || req.headers['accept-language'] || 'en';
  console.log('Locale détectée:', locale);

  if (locale) {
      locale = locale.split(',')[0].split('-')[0];
      console.log('Locale après traitement:', locale);
    console.log('Locales supportées:', i18n.getLocales());
      if (i18n.getLocales().includes(locale)) {
          i18n.setLocale(req, locale);
      } else {
          i18n.setLocale(req, 'en');
      }
  } else {
      i18n.setLocale(req, 'en');
  }
  next();
});

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'secret_key'
};

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    const user = await User.findById(jwt_payload.id);
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (err) {
    return done(err, false);
  }
}));

app.use(passport.initialize());
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

app.get('/', (req, res) => {
  res.send(res.__('basics.welcome'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});