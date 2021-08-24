const axios = require('axios');

exports.getMailLists = async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.moosend.com/v3/lists.json?apikey=${process.env.MOOSEND_API_KEY}&WithStatistics=true&ShortBy=CreatedOn&SortMethod=ASC`
    );

    const mailList = response.data.Context.MailingLists;
    return res.render('portal/apps/maillist', { mailList });
  } catch (error) {
    if (error) console.log(error);
  }
};

exports.addMailList = async (req, res) => {
  const name = req.body.Name;

  try {
    const newMailList = await axios.post(
      `https://api.moosend.com/v3/lists/create.json?apikey=${process.env.MOOSEND_API_KEY}`,
      {
        Name: name,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const newMailId = newMailList.data.Context;

    const addCustomFieldBedrijfsnaam = await axios.post(
      `https://api.moosend.com/v3/lists/${newMailId}/customfields/create.json?apikey=${process.env.MOOSEND_API_KEY}`,
      {
        Name: 'Bedrijfsnaam',
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const addCustomFieldTelefoonnummer = await axios.post(
      `https://api.moosend.com/v3/lists/${newMailId}/customfields/create.json?apikey=${process.env.MOOSEND_API_KEY}`,
      {
        Name: 'Telefoonnummer',
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const addCustomFieldWebsite = await axios.post(
      `https://api.moosend.com/v3/lists/${newMailId}/customfields/create.json?apikey=${process.env.MOOSEND_API_KEY}`,
      {
        Name: 'Website',
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return res.redirect('/portal/maillist');
  } catch (error) {
    if (error) console.log(error);
  }
};

exports.getNewSubscriber = async (req, res) => {
  const mailListId = req.params.id;

  const entries = await axios.get(
    `https://api.moosend.com/v3/lists/${mailListId}/details.json?apikey=${process.env.MOOSEND_API_KEY}`
  );

  const data = entries.data;
  const successMessage = req.session.successMessage;
  delete req.session.successMessage;

  const errorMessage = req.session.errorMessage;
  delete req.session.errorMessage;

  return res.render(`portal/apps/maillist/add/`, {
    data,
    errorMessage,
    successMessage,
  });
};

exports.AddNewSubscriber = async (req, res) => {
  const mailListId = req.params.id;

  const { email, website, telefoonnummer, bedrijfsnaam } = req.body;
  try {
    const newSubscriber = await axios.post(
      `https://api.moosend.com/v3/subscribers/${mailListId}/subscribe.json?apikey=${process.env.MOOSEND_API_KEY}`,
      {
        Email: email,
        CustomFields: [
          `Telefoonnummer=${telefoonnummer}`,
          `Website=${website}`,
          `Bedrijfsnaam=${bedrijfsnaam}`,
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );

    if (newSubscriber.data.Code === 501) {
      req.session.errorMessage = 'Vul een geldig e-mailadres in.';
      return req.session.save((err) => {
        res.redirect(`/portal/maillist/add/${mailListId}`);
      });
    }
    // check whether contact exists based on updatedOn date. If null, contact not exists yet.

    if (newSubscriber.data.Context.UpdatedOn) {
      req.session.errorMessage =
        'Aanmelding bestond reeds al. Is nu overschreven met nieuwe informatie.';
      return req.session.save((err) => {
        res.redirect(`/portal/maillist/add/${mailListId}`);
      });
    }
    req.session.successMessage = 'Nieuwe aanmelding toegevoegd!';
    return req.session.save((err) => {
      res.redirect(`/portal/maillist/add/${mailListId}`);
    });
  } catch (error) {
    if (error) {
      console.log(error);
      req.session.errorMessage =
        'Oeps. Er is iets fout gegaan. Niet jouw fout! Vraag Kevin.';
      return req.session.save((err) => {
        res.redirect(`/portal/maillist/add/${mailListId}`);
      });
    }
  }
};
