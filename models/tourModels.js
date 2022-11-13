const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Tour name is required'],
        unique: true,
        trim: true
    },
    duration: {
        type: Number,
        required: [true, 'Tour duration is required'],
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'Tour max group size is required'],

    },
    difficulty: {
        type: String,
        required: [true, 'Tour difficulty is required'],
        trim: true
    },
    slug : String,
    ratingAverage: {
        type: Number,
        default: 4.5
    },
    ratingQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'Tour price is required'],
    },
    priceDiscount: Number,
    summary: {
        type: String,
        required: [true, 'Tour summary is required'],
        trim: true
    },
    descriptions: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'Tour Image is required'],
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    startDates: [Date]
}, {
    toJSON: { virtuals: true },
    toObject : { virtuals: true }
})

// Using normal function because this keyword can't be accssed from arrow function
tourSchema.virtual('durationWeeks').get(function() {
    return this.duration / 7
})

// Document Middleware
tourSchema.pre('save').get(function(next) {
    this.slug = slugify(this.name, { lower : true })
    next()
})

const Tour = new mongoose.model('Tour', tourSchema);

module.exports = Tour;