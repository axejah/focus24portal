require('dotenv').config();
const PORT = process.env.PORT || 5000;
const path = require('path');
const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const db = require('./models');

app.use(
  session({
    secret: process.env.SECRET,
    store: new SequelizeStore({
      db: db.sequelize,
    }),
    resave: false,
    proxy: true,
  })
);

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const loginRoute = require('./routes/loginRoute');
const portalRoute = require('./routes/portalRoute');

app.use(loginRoute);
app.use(portalRoute);

db.sequelize.sync().then((req) => {
  app.listen(PORT, () => {
    console.log(`App is running on PORT: ${PORT}`);
  });
});
