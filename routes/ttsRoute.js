const router = require('express').Router();
const ttsController = require('../controllers/ttsController');

const isAuth = require('../middleware/isAuth');

router.get('/portal/tts', isAuth, ttsController.audioIndexPage);
router.post('/portal/tts/generateAudio', isAuth, ttsController.generateAudio);

module.exports = router;
