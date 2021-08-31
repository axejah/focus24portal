const {
  Customer,
  CustomerContact,
  CustomerContactAction,
} = require('../models');

exports.getCustomerPage = async (req, res) => {
  try {
    const customers = await Customer.findAll({
      include: { all: true },
    });

    const contacts = await CustomerContact.findAll({
      include: [{ all: true }],
    });

    console.log(contacts);
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

exports.getAddContacts = async (req, res) => {
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

  if (!voornaam || !telefoonnummer1 || !achternaam || !emailadres) {
    req.session.errorMessage = 'Vul alle verplichtte velden in.';
    return req.session.save((err) => {
      res.redirect(`/portal/customers/contacts/${companyId}/add`);
    });
  }

  try {
    const searchCompanyName = await Customer.findAll({
      where: { id: companyId },
      attributes: ['bedrijfsnaam'],
    });

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
      bedrijfsnaam: searchCompanyName[0].dataValues.bedrijfsnaam,
      CustomerId: companyId,
    });
    return res.redirect(`/portal/customers/contacts/${companyId}`);
  } catch (error) {
    console.log(error);
    req.session.errorMessage =
      'Er gaat iets fout. Neem contact op met de beheerder 🤓';
    req.session.save((err) => {
      console.log(err);
      res.redirect(`/portal/customers/contacts/${companyId}/add`);
    });
  }
};

exports.getContacts = async (req, res) => {
  const companyId = req.params.id;

  try {
    const contact = await CustomerContact.findAll({
      where: { CustomerId: companyId },
      include: [{ all: true }],
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

  if (!voornaam || !telefoonnummer1 || !achternaam || !emailadres) {
    req.session.errorMessage = 'Vul alle verplichtte velden in.';
    return req.session.save((err) => {
      res.redirect(`/portal/customers/contacts/edit/${id}`);
    });
  }

  try {
    const currentContact = await CustomerContact.findAll({ where: { id: id } });

    const searchCompanyName = await Customer.findAll({
      where: { id: currentContact[0].CustomerId },
      attributes: ['bedrijfsnaam'],
    });

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
        bedrijfsnaam: searchCompanyName[0].dataValues.bedrijfsnaam,
      },
      { where: { id: id } }
    );
    return res.redirect(
      `/portal/customers/contacts/${currentContact[0].CustomerId}`
    );
  } catch (error) {
    console.log(error);
    req.session.errorMessage =
      'Er gaat iets fout. Neem contact op met de beheerder 🤓';
    req.session.save((err) => {
      console.log(err);
      res.redirect(
        `/portal/customers/contacts/${currentContact[0].CustomerId}`
      );
    });
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

exports.addCustomerContactAction = async (req, res) => {
  const { actie, status, user, follow_up, follow_up_time } = req.body;
  const CustomerContactId = req.body.customerContactId;
  const customerId = req.body.customerId;
  const iso = new Date().toISOString();
  const datum = iso.substring(0, iso.length - 8);

  try {
    const action = await CustomerContactAction.create({
      actie,
      status,
      user,
      follow_up,
      follow_up_time,
      datum,
      CustomerContactId,
    });
    return res.redirect(`/portal/customers/contacts/${customerId}`);
  } catch (error) {
    if (error) console.log(error);
  }
};

exports.getActionsPage = async (req, res) => {
  try {
    const actions = await CustomerContactAction.findAll({
      include: [{ all: true }],
    });

    const openCount = actions.reduce((counter, obj) => {
      if (obj.status === 'Open') counter += 1;
      return counter;
    }, 0);

    const closedCount = actions.reduce((counter, obj) => {
      if (obj.status === 'Closed') counter += 1;
      return counter;
    }, 0);

    const holdCount = actions.reduce((counter, obj) => {
      if (obj.status === 'On-Hold') counter += 1;
      return counter;
    }, 0);

    const counters = {
      openCount,
      closedCount,
      holdCount,
    };

    return res.render('portal/apps/actions/', {
      actions,
      counters,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getOpenActionsPage = async (req, res) => {
  try {
    const actions = await CustomerContactAction.findAll({
      include: [{ all: true }],
      where: { status: 'Open' },
    });

    const actionsInfo = await CustomerContactAction.findAll({
      include: [{ all: true }],
    });

    const openCount = actionsInfo.reduce((counter, obj) => {
      if (obj.status === 'Open') counter += 1;
      return counter;
    }, 0);

    const closedCount = actionsInfo.reduce((counter, obj) => {
      if (obj.status === 'Closed') counter += 1;
      return counter;
    }, 0);

    const holdCount = actionsInfo.reduce((counter, obj) => {
      if (obj.status === 'On-Hold') counter += 1;
      return counter;
    }, 0);

    const counters = {
      openCount,
      closedCount,
      holdCount,
    };

    return res.render('portal/apps/actions/', { actions, counters });
  } catch (error) {
    console.log(error);
  }
};

exports.getClosedActionsPage = async (req, res) => {
  try {
    const actions = await CustomerContactAction.findAll({
      include: [{ all: true }],
      where: { status: 'Closed' },
    });

    const actionsInfo = await CustomerContactAction.findAll({
      include: [{ all: true }],
    });

    const openCount = actionsInfo.reduce((counter, obj) => {
      if (obj.status === 'Open') counter += 1;
      return counter;
    }, 0);

    const closedCount = actionsInfo.reduce((counter, obj) => {
      if (obj.status === 'Closed') counter += 1;
      return counter;
    }, 0);

    const holdCount = actionsInfo.reduce((counter, obj) => {
      if (obj.status === 'On-Hold') counter += 1;
      return counter;
    }, 0);

    const counters = {
      openCount,
      closedCount,
      holdCount,
    };

    return res.render('portal/apps/actions/', { actions, counters });
  } catch (error) {
    console.log(error);
  }
};

exports.getHoldActionsPage = async (req, res) => {
  try {
    const actions = await CustomerContactAction.findAll({
      include: [{ all: true }],
      where: { status: 'On-Hold' },
    });

    const actionsInfo = await CustomerContactAction.findAll({
      include: [{ all: true }],
    });

    const openCount = actionsInfo.reduce((counter, obj) => {
      if (obj.status === 'Open') counter += 1;
      return counter;
    }, 0);

    const closedCount = actionsInfo.reduce((counter, obj) => {
      if (obj.status === 'Closed') counter += 1;
      return counter;
    }, 0);

    const holdCount = actionsInfo.reduce((counter, obj) => {
      if (obj.status === 'On-Hold') counter += 1;
      return counter;
    }, 0);

    const counters = {
      openCount,
      closedCount,
      holdCount,
    };

    return res.render('portal/apps/actions/', { actions, counters });
  } catch (error) {
    console.log(error);
  }
};

exports.editAction = async (req, res) => {
  const id = req.params.id;

  try {
    const errorMessage = req.session.errorMessage;
    delete req.session.errorMessage;
    const action = await CustomerContactAction.findAll({ where: { id: id } });
    res.render('portal/apps/actions/edit', { action, errorMessage });
  } catch (error) {
    if (error) console.log(error);
  }
};

exports.postEditAction = async (req, res) => {
  const id = req.params.id;

  const { status, actie, follow_up, follow_up_time, user } = req.body;

  if (!status || !actie || !follow_up || !user) {
    req.session.errorMessage = 'Vul alle verplichtte velden in.';
    return req.session.save((err) => {
      res.redirect(`/portal/customers/actions/edit/${id}`);
    });
  }

  try {
    await CustomerContactAction.update(
      {
        status,
        actie,
        follow_up,
        user,
        follow_up_time,
      },
      { where: { id: id } }
    );
    return res.redirect(`/portal/customers/actions/all`);
  } catch (error) {
    console.log(error);
    req.session.errorMessage =
      'Er gaat iets fout. Neem contact op met de beheerder 🤓';
    req.session.save((err) => {
      console.log(err);
      res.redirect(`/portal/customers/contacts/actions/edit/${id}`);
    });
  }
};

exports.deleteAction = async (req, res) => {
  const id = req.params.id;

  try {
    await CustomerContactAction.destroy({
      where: {
        id: id,
      },
    });

    return res.redirect('/portal/customers/actions/all');
  } catch (error) {
    console.log(error);
    req.session.errorMessage =
      'Er gaat iets fout. Neem contact op met de beheerder 🤓';
    req.session.save((err) => {
      console.log(err);
      res.redirect(`/portal/customers/actions/all`);
    });
  }
};
