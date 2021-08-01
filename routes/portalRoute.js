const router = require('express').Router();
const portalController = require('../controllers/portalController');

router.get('/portal', portalController.portalIndex);

module.exports = router;
