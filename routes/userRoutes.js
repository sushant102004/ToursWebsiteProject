const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');


const router = express.Router();

router.route('/').get(userController.getAllUsers).post(userController.addNewUser)
router.get('/:id').get(userController.getUser).delete(userController.deleteUser).patch(userController.updateUser)
router.post('/signup', authController.signup)
router.post('/login', authController.login)

// router.route('/forgot-password').post(authController.forgotPassword)

router.post('/forgot-password', authController.forgotPassword)
router.post('/reset-password', authController.resetPassword)
router.patch('/update-me', authController.protectRoute, userController.updateUserItself)

module.exports = router;