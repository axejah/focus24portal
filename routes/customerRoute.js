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

router.post(
  '/portal/customers/contacts/add/action',
  isAuth,
  customerController.addCustomerContactAction
);

router.get(
  '/portal/customers/actions/all',
  isAuth,
  customerController.getActionsPage
);

router.get(
  '/portal/customers/actions/open',
  isAuth,
  customerController.getOpenActionsPage
);

router.get(
  '/portal/customers/actions/closed',
  isAuth,
  customerController.getClosedActionsPage
);

router.get(
  '/portal/customers/actions/hold',
  isAuth,
  customerController.getHoldActionsPage
);

router.get(
  '/portal/customers/actions/edit/:id',
  isAuth,
  customerController.editAction
);

router.post(
  '/portal/customers/actions/edit/:id',
  isAuth,
  customerController.postEditAction
);

router.post(
  '/portal/customers/actions/delete/:id',
  isAuth,
  customerController.deleteAction
);
module.exports = router;
