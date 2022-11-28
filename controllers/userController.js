const User = require('./../models/userModel')
const mongoose = require('mongoose')
const AppError = require('./../utils/appError')

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        if(!users) {
            return next(new AppError('No users found', 400))
        }

        res.status(200).json({
            status: 'success',
            data: users
        })
    } catch (err) {
        console.log(err)
    }
}

exports.addNewUser = (req, res) => {

}

exports.getUser = (req, res) => {

}

exports.deleteUser = (req, res) => {

}

exports.updateUser = (req, res) => {

}