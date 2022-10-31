const Tour = require('./../models/tourModels')


exports.getAllTours = async (req, res) => {
    try {
        // Making a hard code copy of query
        const queryObj = { ...req.query };
        const excludeFields = ['page', 'sort', 'limit', 'fields'];

        // Using forEach to delete selected fields from query
        excludeFields.forEach(el => delete queryObj[el])

        // Advance Filtering
        // gte, gt, lte, lt
        let queryString = JSON.stringify(queryObj);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        // Saving the complete query so we can implement other functions later.
        const query = Tour.find(JSON.parse(queryString));        

        const tours = await query;
        res.status(200).json({
            status: 'success',
            data: {
                tours
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
}

exports.addNewTour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body);
        res.status(200).json({
            status: 'success',
            data: {
                newTour
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'error',
            message: err
        })
    }
}

exports.getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
}

exports.updateTour = async (req, res) => {
    try {
        const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({
            status: 'success',
            data: updatedTour
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
}

exports.deleteTour = async (req, res) => {
    try {
        const deletedTour = await Tour.findByIdAndRemove(req.params.id);
        res.status(200).json({
            status: 'success',
            data: deletedTour
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
}