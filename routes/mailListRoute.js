const router = require('express').Router();
const mailListController = require('../controllers/mailListController');

const isAuth = require('../middleware/isAuth');

router.get('/portal/maillist/', isAuth, mailListController.getMailLists);
router.post(
  '/portal/maillist/add-list/',
  isAuth,
  mailListController.addMailList
);
router.get('/portal/maillist/add/:id', mailListController.getNewSubscriber);
router.post('/portal/maillist/add/:id', mailListController.AddNewSubscriber);

module.exports = router;
