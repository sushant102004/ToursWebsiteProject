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

exports.updateUserItself = async (req, res, next) => {
    if(req.body.password || req.body.passwordConfirm){
        return next(new AppError('Password Change Not Allowed Here', 400))
    }
}