const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Define routes and link them to controller functions
router.get('/', userController.users_get);
router.get('/one/:id', userController.userGetOne);
router.post('/signup', userController.signup_post);
router.post('/login', userController.login_post);
router.post('/logout', userController.logout_post);
router.get('/status', userController.auth_status);
router.patch('/admin/:id', userController.admin_user);
router.patch('/voted/:id', userController.voted_user);
router.patch('/password', userController.changePassword);
router.patch('/posted/:id', userController.posted_user);
router.patch('/category', userController.changeCategory);
router.patch('/downcategory', userController.changeCategory2);
router.delete('/delete/:id', userController.users_delete);

module.exports = router;