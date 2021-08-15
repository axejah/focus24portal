const { User } = require('../models');
const bcrypt = require('bcryptjs');

exports.getUserPage = async (req, res) => {
  try {
    const users = await User.findAll();
    return res.render('portal/apps/users', { users });
  } catch (error) {
    console.log(error);
  }
};

exports.getAddUserPage = (req, res) => {
  const errorMessage = req.session.errorMessage;
  delete req.session.errorMessage;
  return res.render('portal/apps/users/add', { errorMessage });
};

exports.postAddUser = async (req, res) => {
  try {
    const { voornaam, achternaam, emailadres, wachtwoord, wachtwoord2 } =
      req.body;

    if (!voornaam || !achternaam || !emailadres || !wachtwoord) {
      req.session.errorMessage = 'Vul alle verplichtte velden in';
      return req.session.save((err) => {
        res.redirect(`/portal/users/add`);
      });
    }

    if (wachtwoord.length < 8) {
      req.session.errorMessage =
        'Wachtwoord moet minimaal 8 karakters bevatten';
      return req.session.save((err) => {
        res.redirect(`/portal/users/add`);
      });
    }

    if (wachtwoord !== wachtwoord2) {
      req.session.errorMessage = 'Wachtwoorden komen niet overeen';
      return req.session.save((err) => {
        res.redirect(`/portal/users/add`);
      });
    }

    const existingUser = await User.findAll({
      where: { emailadres: emailadres },
    });

    if (existingUser.length !== 0) {
      req.session.errorMessage =
        'Er bestaat al een gebruiker met dit emailadres';
      return req.session.save((err) => {
        res.redirect(`/portal/users/add`);
      });
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(wachtwoord, salt);

    await User.create({
      voornaam,
      achternaam,
      emailadres,
      wachtwoord: passwordHash,
    });
    return res.redirect('/portal/users');
  } catch (error) {
    console.log(error);
    req.session.errorMessage =
      'Er gaat iets fout. Neem contact op met de beheerder 🤓';
    req.session.save((err) => {
      console.log(err);
      res.redirect(`/portal/users/add`);
    });
  }
};

exports.getEditUserPage = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findAll({ where: { id: id } });

    const errorMessage = req.session.errorMessage;
    delete req.session.errorMessage;
    return res.render('portal/apps/users/edit', { user, errorMessage });
  } catch (error) {
    console.log(error);
  }
};

exports.postEditUser = async (req, res) => {
  try {
    const { voornaam, achternaam, emailadres, wachtwoord, wachtwoord2 } =
      req.body;
    const id = req.params.id;

    if (!voornaam || !achternaam || !emailadres) {
      req.session.errorMessage = 'Vul alle verplichtte velden in';
      return req.session.save((err) => {
        res.redirect(`/portal/users/edit/${id}`);
      });
    }

    if (!wachtwoord && !wachtwoord2) {
      await User.update(
        { voornaam, achternaam, emailadres },
        { where: { id: id } }
      );
      return res.redirect('/portal/users/');
    }

    if (wachtwoord !== wachtwoord2) {
      req.session.errorMessage = 'Het nieuwe wachtwoord komt niet overeen';
      return req.session.save((err) => {
        res.redirect(`/portal/users/edit/${id}`);
      });
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(wachtwoord, salt);

    User.update(
      { voornaam, achternaam, emailadres, wachtwoord: passwordHash },
      { where: { id: id } }
    );
    return res.redirect('/portal/users/');
  } catch (error) {
    console.log(error);
    req.session.errorMessage =
      'Er gaat iets fout. Neem contact op met de beheerder 🤓';
    req.session.save((err) => {
      console.log(err);
      res.redirect(`/portal/users/edit/${id}`);
    });
  }
};
