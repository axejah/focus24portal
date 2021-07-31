const { User } = require('../models');

exports.login = (req, res) => {
  return res.render('auth/login.ejs');
};

exports.loginUser = async (req, res) => {
  const { emailadres, password } = req.body;

  try {
    const user = await User.findAll({ where: { emailadres: emailadres } });

    if (user[0].wachtwoord === password) {
      return res.render('portal/index.ejs');
    }
  } catch (error) {
    if (error) console.log(error);
  }
};
