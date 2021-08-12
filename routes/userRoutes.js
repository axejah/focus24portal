const router = require('express').Router();
const userController = require('../controllers/userController');

const isAuth = require('../middleware/isAuth');

router.get('/portal/users', isAuth, userController.getUserPage);
router.get('/portal/users/add', isAuth, userController.getAddUserPage);
router.get('/portal/users/edit/:id', isAuth, userController.getEditUserPage);
router.post('/portal/users/add', isAuth, userController.postAddUser);
router.post('/portal/users/edit/:id', isAuth, userController.postEditUser);

module.exports = router;
