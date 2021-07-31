require('dotenv').config();
const PORT = process.env.PORT || 5000;
const path = require('path');
const express = require('express');
const app = express();

const db = require('./models');

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const loginRoute = require('./routes/loginRoute');
app.use(loginRoute);

app.get('/portal', (req, res) => {
  return res.render('portal/index.ejs');
});

db.sequelize.sync().then((req) => {
  app.listen(PORT, () => {
    console.log(`App is running on PORT: ${PORT}`);
  });
});
