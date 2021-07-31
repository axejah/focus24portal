require('dotenv').config();
const PORT = process.env.PORT || 5000;

const express = require('express');
const app = express();

const path = require('path');

app.use('/', express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  return res.render('auth/login.ejs');
});

app.get('/portal', (req, res) => {
  return res.render('portal/index.ejs');
});

app.listen(PORT, () => {
  console.log(`App is running on PORT: ${PORT}`);
});
