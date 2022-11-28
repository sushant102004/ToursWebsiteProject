const User = require('./../models/userModel')
const jwt = require('jsonwebtoken');

exports.signup = async (req, res, next) => {
    try {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm        
        })

        const token = jwt.sign(
            { id: newUser._id },
            process.env.JWTSecret,
            {expiresIn: process.env.JWTExpire}
        )

        res.status(201).json({
            status: 'success',
            token,
            data: {
                user: newUser
            }
        })
    } catch (err) {
        res.status(404).json({
            message: 'fail',
            error: err
        })
    }
}

