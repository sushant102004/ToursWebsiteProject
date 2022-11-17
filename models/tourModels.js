const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Tour name is required'],
        unique: true,
        trim: true,
        maxlength : [40, 'Max size of a name is 40 characters'],
        minlength : [3, 'Min size of a name is 3 characters']
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
        trim: true,
        enum : {
            values : ['easy', 'medium', 'hard'],
            message : 'Difficulty is either easy, medium or difficult'
        }
    },
    slug : String,
    ratingAverage: {
        type: Number,
        default: 4.5,
        max : [5, 'Max rating is 5'],
        min : [1, 'Min rating is 1'],
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
tourSchema.pre('save', function() {
    this.slug = slugify(`${this.name}`, { lower : true })
    next()
})

const Tour = new mongoose.model('Tour', tourSchema);

module.exports = Tour;