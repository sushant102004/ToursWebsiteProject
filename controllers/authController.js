const User = require('./../models/userModel')
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/appError')

exports.signup = async (req, res, next) => {
    try {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            passwordChangedAt: req.body.passwordChangedAt        
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

exports.login = async (req, res, next) => {
    // In ES6 if variable name == property name then we can just write {variable}
    const { email, password } = req.body

    // 1. Check if email and password exists
    if(!email || !password) {
        return next(new AppError('Please provide a valid email and password'), 400)
    }
    let user = null

    try {
        user = await User.findOne({ email }).select('+password')
        
        if(!user || !await user.checkPassword(password, user.password)) {
            return next(new AppError('Entered email or password is incorrect.', 401))
        }
    } catch (err) {
        console.log(err)
    }

    const token = jwt.sign({ id: user._id}, process.env.JWTSecret, {expiresIn: process.env.JWTExpire})

    res.status(200).json({
        status:'success',
        token,
    })
}

exports.protectRoute = async (req, res, next) => {
    try {
        let token;
        let decoded;

        // Check if auth token exixts

        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token = await req.headers.authorization.split(' ')[1]
        }
        if(token === undefined){
            return next(new AppError('Authorization token is required', 401))
        } 
        
        // Deocde auth token
        try {
            decoded = jwt.verify(token, process.env.JWTSecret)
        } catch(err) {
            return next(new AppError('Invalid token', 401))
        }

        // Check if user is not deleted
        const freshUser = await User.findById(decoded.id)
        if(!freshUser) return next(new AppError('User has been deleted', 401))

        next()
    } catch (err) {
        return next(err)
    }
}