const { Customer, User, Hours } = require('../models');

exports.getHoursPage = async (req, res) => {
  try {
    const uren = await Hours.findAll({
      include: [Customer, User],
    });
    return res.render('portal/apps/hours', { uren });
  } catch (error) {
    console.log(error);
  }
};

exports.getAddHoursPage = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findAll({ where: { id: id } });
    const customers = await Customer.findAll();

    const errorMessage = req.session.errorMessage;
    delete req.session.errorMessage;

    return res.render('portal/apps/hours/add', { customers, errorMessage });
  } catch (error) {
    console.log(error);
  }
};

exports.postAddHours = async (req, res) => {
  const userId = req.params.id;
  const { hours, minutes, period_start, period_end, klant, invoice, remarks } =
    req.body;

  if (!klant || !hours || !minutes || !period_start || !period_end) {
    req.session.errorMessage = 'Vul alle verplichtte velden in.';
    return req.session.save((err) => {
      res.redirect(`/portal/hours/add/${userId}`);
    });
  }

  const hoursInMinutes = hours * 60;
  const totalMinutes = parseInt(hoursInMinutes) + parseInt(minutes);

  try {
    await Hours.create({
      hours,
      minutes,
      total: totalMinutes,
      remarks,
      invoice,
      period_start,
      period_end,
      CustomerId: klant,
      UserId: userId,
    });
    res.redirect('/portal/hours/');
  } catch (error) {
    console.log(error);
    req.session.errorMessage =
      'Er gaat iets fout. Neem contact op met de beheerder 🤓';
    req.session.save((err) => {
      console.log(err);
      res.redirect(`/portal/hours/add/${userId}`);
    });
  }
};

exports.getEditHours = async (req, res) => {
  try {
    const id = req.params.id;
    const customers = await Customer.findAll();
    const uren = await Hours.findAll({ where: { id: id } });

    const errorMessage = req.session.errorMessage;
    delete req.session.errorMessage;

    return res.render('portal/apps/hours/edit', {
      customers,
      uren,
      errorMessage,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postEditHours = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      hours,
      minutes,
      remarks,
      invoice,
      period_start,
      period_end,
      klant,
    } = req.body;

    if (!klant || !hours || !minutes || !period_start || !period_end) {
      req.session.errorMessage = 'Vul alle verplichtte velden in.';
      return req.session.save((err) => {
        res.redirect(`/portal/hours/edit/${id}`);
      });
    }

    const hoursInMinutes = hours * 60;
    const totalMinutes = parseInt(hoursInMinutes) + parseInt(minutes);

    await Hours.update(
      {
        hours,
        minutes,
        total: totalMinutes,
        remarks,
        invoice,
        period_start,
        period_end,
        CustomerId: klant,
      },
      { where: { id: id } }
    );
    res.redirect('/portal/hours');
  } catch (error) {
    console.log(error);
    req.session.errorMessage =
      'Er gaat iets fout. Neem contact op met de beheerder 🤓';
    req.session.save((err) => {
      console.log(err);
      res.redirect(`/portal/hours/edit/${id}`);
    });
  }
};
