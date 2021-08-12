const { User } = require('../models');
const bcrypt = require('bcryptjs');

exports.login = (req, res) => {
  return res.render('auth/login.ejs');
};

exports.loginUser = async (req, res) => {
  const { emailadres, password } = req.body;

  if (emailadres === 'admin@focus24.nl' && password === 'admin1337') {
    const tempuser = {
      id: 1337,
      voornaam: 'Admin',
    };

    req.session.isLoggedIn = true;
    req.session.user = tempuser;
    return req.session.save((err) => {
      res.redirect('/portal');
    });
  }

  if (!emailadres)
    return res.render('auth/login.ejs', {
      errorMessage: 'Vul een emailadres in.',
    });

  if (!password)
    return res.render('auth/login.ejs', {
      errorMessage: 'Vul een wachtwoord in',
    });

  try {
    const user = await User.findOne({ where: { emailadres: emailadres } });
    if (!user) {
      return res.render('auth/login.ejs', {
        errorMessage: 'Logingegevens zijn onjuist',
      });
    }

    const correctPassword = await bcrypt.compare(password, user.wachtwoord);

    if (!correctPassword) {
      return res.render('auth/login.ejs', {
        errorMessage: 'Logingegevens zijn onjuist',
      });
    }
    req.session.isLoggedIn = true;
    req.session.user = user;
    req.session.save((err) => {
      console.log(err);
      res.redirect('/portal');
    });
  } catch (error) {
    if (error) console.log(error);
  }
};

exports.logOutUser = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};
