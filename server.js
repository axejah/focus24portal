require('dotenv').config();
const PORT = process.env.PORT || 5000;
const path = require('path');
const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const csrf = require('csurf');

const app = express();
const db = require('./models');

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: new SequelizeStore({
      db: db.sequelize,
    }),
    resave: false,
    saveUninitialized: false,
    proxy: true,
  })
);

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const csrfProtection = csrf();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(csrfProtection);

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  res.locals.user = req.session.user;
  next();
});

const loginRoute = require('./routes/loginRoute');
const portalRoute = require('./routes/portalRoute');
const customerRoute = require('./routes/customerRoute');
const ttsRoute = require('./routes/ttsRoute');
const userRoute = require('./routes/userRoutes');
const hoursRoute = require('./routes/hoursRoute');
const mailListRoute = require('./routes/mailListRoute');
app.use(portalRoute);
app.use(loginRoute);
app.use(customerRoute);
app.use(ttsRoute);
app.use(userRoute);
app.use(hoursRoute);
app.use(mailListRoute);

db.sequelize.sync().then((req) => {
  app.listen(PORT, () => {
    console.log(`App is running on PORT: ${PORT}`);
  });
});
