const mongoose = require('mongoose');
const validator = require('validator')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email address'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        minlength: 8,
        validate : {
            validator: function(value) {
                return value === this.password;
            },
            message : 'Password not matched.'
        }
    },
    passwordChangedAt: Date,
    role: {
        type: String,
        enum : ['admin', 'lead-guide', 'guide', 'user'],
        default : 'user', 
    },
    passwordResetToken : String
});

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12)
    this.passwordConfirm = undefined;
    next()
})

userSchema.methods.checkPassword = async function(enteredPassword, userPassword) {
    return await bcrypt.compare(enteredPassword, userPassword)
}

userSchema.methods.checkPasswordChange = async function(JWTTimestamp){
    const passwordChangeTime = this.passwordChangedAt.getTime() / 1000

    if(this.passwordChangedAt){
        console.log(JWTTimestamp)
        console.log(passwordChangeTime)
        if(JWTTimestamp < passwordChangeTime){
            return true
        }
    }
    return false
}

userSchema.methods.createPasswordResetToken = async function() {
    this.passwordResetToken = jwt.sign({_id: this._id}, process.env.JWT_Password_Rest, {expiresIn : '10m'})
    return this.passwordResetToken
}

const User = new mongoose.model('User', userSchema)

module.exports = User;