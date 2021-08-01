const router = require('express').Router();
const loginController = require('../controllers/loginController');

router.post('/loginUser', loginController.loginUser);
router.get('/', loginController.login);
router.post('/logOutUser', loginController.logOutUser);

module.exports = router;
