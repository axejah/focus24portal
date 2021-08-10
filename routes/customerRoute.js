const router = require('express').Router();
const customerController = require('../controllers/customerController');
const isAuth = require('../middleware/isAuth');

router.get('/portal/customers/', isAuth, customerController.getCustomerPage);
router.get(
  '/portal/customers/add',
  isAuth,
  customerController.getAddCustomerPage
);
router.post('/portal/customers/add', isAuth, customerController.addNewCustomer);
router.get(
  '/portal/customers/edit/:id',
  isAuth,
  customerController.editCustomer
);
router.post(
  '/portal/customers/edit/:id',
  isAuth,
  customerController.postEditCustomer
);
router.get(
  '/portal/customers/contacts/:id',
  isAuth,
  customerController.getContacts
);
router.get(
  '/portal/customers/contacts/:id/add',
  isAuth,
  customerController.getAddContacts
);
router.post(
  '/portal/customers/contacts/:id/add',
  isAuth,
  customerController.addContacts
);

router.post(
  '/portal/customers/contacts/:id',
  isAuth,
  customerController.postEditContact
);

router.get(
  '/portal/customers/contacts/edit/:id',
  isAuth,
  customerController.getEditContact
);

module.exports = router;
