const router = require('express').Router();
const loginController = require('../controllers/loginController');

router.get('/', loginController.login);
router.post('/loginUser', loginController.loginUser);

module.exports = router;
