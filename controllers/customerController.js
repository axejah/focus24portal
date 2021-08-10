const { Customer, CustomerContact } = require('../models');

exports.getCustomerPage = async (req, res) => {
  try {
    const customers = await Customer.findAll({
      include: [CustomerContact],
    });

    console.log(customers);
    res.render('portal/apps/customers', { customers });
  } catch (error) {
    console.log(error.message);
    return;
  }
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
    huisnummer,
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
      huisnummer,
      postcode,
      plaats,
    });

    res.redirect('/portal/customers');
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
    huisnummer,
    postcode,
    plaats,
  } = req.body;
  const id = req.params.id;

  if (!bedrijfsnaam || !telefoonnummer1 || !emailadres) {
    req.session.errorMessage = 'Vul alle verplichtte velden in.';
    return req.session.save((err) => {
      console.log(err);
      res.redirect(`/portal/customers/edit/${id}`);
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
        huisnummer,
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
      res.redirect(`/portal/apps/customers/edit/${id}`);
    });
  }
};

exports.getAddContacts = (req, res) => {
  const companyId = req.params.id;
  const errorMessage = req.session.errorMessage;
  delete req.session.errorMessage;
  res.render('portal/apps/customers/contacts/add', {
    errorMessage,
    companyId,
  });
};

exports.addContacts = async (req, res) => {
  const companyId = req.params.id;
  const {
    voornaam,
    achternaam,
    geslacht,
    emailadres,
    telefoonnummer1,
    telefoonnummer2,
    functie,
    beslissingsbevoegd,
    remarks,
  } = req.body;

  if (!voornaam || !telefoonnummer1 || !emailadres) {
    req.session.errorMessage = 'Vul alle verplichtte velden in.';
    return req.session.save((err) => {
      res.redirect(`/portal/customers/contacts/${companyId}/add`);
    });
  }

  try {
    await CustomerContact.create({
      voornaam,
      achternaam,
      geslacht,
      emailadres,
      telefoonnummer1,
      telefoonnummer2,
      functie,
      beslissingsbevoegd,
      remarks,
      CustomerId: companyId,
    });
    return res.redirect(`/portal/customers/contacts/${companyId}`);
  } catch (error) {
    console.log(error);
  }
};

exports.getContacts = async (req, res) => {
  const companyId = req.params.id;

  try {
    const contact = await CustomerContact.findAll({
      where: { CustomerId: companyId },
    });
    return res.render('portal/apps/customers/contacts', { contact, companyId });
  } catch (error) {
    console.log(error);
  }
};

exports.postEditContact = async (req, res) => {
  const id = req.params.id;
  const {
    voornaam,
    achternaam,
    geslacht,
    emailadres,
    telefoonnummer1,
    telefoonnummer2,
    functie,
    beslissingsbevoegd,
    remarks,
  } = req.body;

  if (!voornaam || !telefoonnummer1 || !emailadres) {
    req.session.errorMessage = 'Vul alle verplichtte velden in.';
    return req.session.save((err) => {
      res.redirect(`/portal/customers/contacts/edit/${id}`);
    });
  }

  try {
    const currentContact = await CustomerContact.findAll({ where: { id: id } });

    await CustomerContact.update(
      {
        voornaam,
        achternaam,
        geslacht,
        emailadres,
        telefoonnummer1,
        telefoonnummer2,
        functie,
        beslissingsbevoegd,
        remarks,
      },
      { where: { id: id } }
    );
    return res.redirect(
      `/portal/customers/contacts/${currentContact[0].CustomerId}`
    );
  } catch (error) {
    console.log(error);
    return;
  }
};

exports.getEditContact = async (req, res) => {
  const id = req.params.id;

  try {
    const errorMessage = req.session.errorMessage;
    delete req.session.errorMessage;
    const contact = await CustomerContact.findAll({ where: { id: id } });
    res.render('portal/apps/customers/contacts/edit', {
      contact,
      errorMessage,
    });
  } catch (error) {
    if (error) console.log(error);
  }
};
