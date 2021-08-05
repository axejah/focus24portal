const { Customer } = require('../models');

exports.getCustomerPage = async (req, res) => {
  const customers = await Customer.findAll();
  res.render('portal/apps/customers', { customers });
};

exports.getAddCustomerPage = (req, res) => {
  const errorMessage = req.session.errorMessage;
  delete req.session.errorMessage;
  res.render('portal/apps/customers/add', {
    errorMessage,
  });
};

exports.addNewCustomer = async (req, res) => {
  const {
    bedrijfsnaam,
    kvk_nummer,
    telefoonnummer1,
    telefoonnummer2,
    emailadres,
    straat,
    huisnummmer,
    postcode,
    plaats,
  } = req.body;

  try {
    if (!bedrijfsnaam || !telefoonnummer1 || !emailadres) {
      req.session.errorMessage = 'Vul alle verplichtte velden in.';
      return req.session.save((err) => {
        console.log(err);
        res.redirect('/portal/customers/add');
      });
    }

    const customer = await Customer.create({
      bedrijfsnaam,
      kvk_nummer: parseInt(kvk_nummer),
      telefoonnummer1,
      telefoonnummer2,
      emailadres,
      straat,
      huisnummmer,
      postcode,
      plaats,
    });

    res.redirect('portal/customers');
  } catch (error) {
    console.log(error);
    req.session.errorMessage =
      'Er gaat iets fout. Neem contact op met de beheerder 🤓';
    req.session.save((err) => {
      console.log(err);
      res.redirect('/portal/apps/customers/add');
    });
  }
};

exports.editCustomer = async (req, res) => {
  const id = req.params.id;

  try {
    const errorMessage = req.session.errorMessage;
    delete req.session.errorMessage;
    const customer = await Customer.findAll({ where: { id: id } });
    res.render('portal/apps/customers/edit', { customer, errorMessage });
  } catch (error) {
    if (error) console.log(error);
  }
};

exports.postEditCustomer = async (req, res) => {
  const {
    bedrijfsnaam,
    kvk_nummer,
    telefoonnummer1,
    telefoonnummer2,
    emailadres,
    straat,
    huisnummmer,
    postcode,
    plaats,
  } = req.body;
  const id = req.params.id;

  if (!bedrijfsnaam || !telefoonnummer1 || !emailadres) {
    req.session.errorMessage = 'Vul alle verplichtte velden in.';
    return req.session.save((err) => {
      console.log(err);
      res.redirect(`portal/customers/edit/${id}`);
    });
  }

  try {
    await Customer.update(
      {
        bedrijfsnaam,
        kvk_nummer,
        telefoonnummer1,
        telefoonnummer2,
        emailadres,
        straat,
        huisnummmer,
        postcode,
        plaats,
      },
      { where: { id: id } }
    );
    return res.redirect('/portal/customers');
  } catch (error) {
    console.log(error);
    req.session.errorMessage =
      'Er gaat iets fout. Neem contact op met de beheerder 🤓';
    req.session.save((err) => {
      console.log(err);
      res.redirect(`portal/apps/customers/edit/${id}`);
    });
  }
};
