const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');


const router = express.Router();

router.route('/').get(userController.getAllUsers).post(userController.addNewUser)
router.get('/:id').get(userController.getUser).delete(userController.deleteUser).patch(userController.updateUser)
router.post('/signup', authController.signup)
router.post('/login', authController.login)


module.exports = router;