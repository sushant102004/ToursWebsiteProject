const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();


router.route('/').get(userController.getAllUsers).post(userController.addNewUser)
router.get('/:id').get(userController.getUser).delete(userController.deleteUser).patch(userController.updateUser)

module.exports = router;