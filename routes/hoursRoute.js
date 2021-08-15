const router = require('express').Router();
const hoursController = require('../controllers/hoursController');

const isAuth = require('../middleware/isAuth');

router.get('/portal/hours/', isAuth, hoursController.getHoursPage);
router.get('/portal/hours/add/:id', isAuth, hoursController.getAddHoursPage);
router.get('/portal/hours/edit/:id', isAuth, hoursController.getEditHours);
router.post('/portal/hours/add/:id', isAuth, hoursController.postAddHours);
router.post('/portal/hours/edit/:id', isAuth, hoursController.postEditHours);

module.exports = router;
