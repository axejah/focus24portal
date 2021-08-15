const router = require('express').Router();
const loginController = require('../controllers/loginController');

const isAlreadyAuth = require('../middleware/isAlreadyAuth');

router.post('/loginUser', loginController.loginUser);
router.get('/', isAlreadyAuth, loginController.login);
router.post('/logOutUser', loginController.logOutUser);

module.exports = router;
