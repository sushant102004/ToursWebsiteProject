const mongoose = require('mongoose');

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
})

const Tour = new mongoose.model('Tour', tourSchema);

module.exports = Tour;