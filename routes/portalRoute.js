const router = require('express').Router();
const portalController = require('../controllers/portalController');

const isAuth = require('../middleware/isAuth');

router.get('/portal', isAuth, portalController.portalIndex);

module.exports = router;
