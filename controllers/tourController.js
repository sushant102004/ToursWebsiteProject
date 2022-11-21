const Tour = require('./../models/tourModels')
const APIFeatures = require('../utils/apifeatures')

exports.getTopFiveTours = async (req, res, next) => {
    req.query.limit = '5'
    req.query.sort = '-ratingsAverage,price'
    req.query.fields = 'name,price,ratingAverage,summary,difficulty'
    console.log(req.query)
    next();
}



exports.getAllTours = async (req, res) => {
    try {
        // let queryObj = { ...req.query };
        // const excludeFields = ['page', 'sort', 'limit', 'fields'];

        // excludeFields.forEach(el => delete queryObj[el])

        // // Filtering
        // let queryStr = JSON.stringify(queryObj)
        // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)


        // let query = Tour.find(JSON.parse(queryStr))

        // Sorting

        // if(this.queryString){
        //     const sortBy = req.query.sort.split(',').join(' ')
        //     query = this.query.sort(sortBy)
        // } else query = this.query.sort('-createdAt')

        // Limiting
        // if(req.query.fields){
        //     const fields = req.query.fields.split(',').join(' ')
        //     query = query.select(fields)
        // } else query = query.select('-name')

        // Pagination
        // const page = req.query.page * 1 || 1
        // const limit = req.query.limit * 1 || 100
        // const skip = (page - 1) * limit

        // if(req.query.page){
        //     query = query.skip(skip).limit(limit)
        // }



        // const tours = await query;

        const features = new APIFeatures(Tour.find(), req.query).filter().sort().limit().pagination()
        const tours = await features.query

        res.status(200).json({
            status: 'success',
            data: {
                tours
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
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

exports.getToursStats = async (req, res) => {
    try {
        const stats = await Tour.aggregate([
            {
                // Find documents with ratingAverage greater then or equal to 4
                $match: { ratingAverage: { $gte: 4 } }
            },
            {
                $group: {
                    // Grouping documents with difficultu so that we can have results for different difficulty
                    _id: '$difficulty',
                    numTours: { $sum: 1 },
                    numRating: { $sum: '$ratingQuantity' },
                    avgRating: { $avg: '$ratingAverage' },
                    avgPrice: { $avg: '$price' },
                    maxPrice: { $max: '$price' },
                    minPrice: { $min: '$price' },
                }
            },
            {
                // 1 -> Ascending & -1 Descending
                $sort: { avgPrice: 1 }
            }
        ])

        res.status(200).json({
            status: 'success',
            data: stats
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
}

exports.getMonthlyPlan = async (req, res) => {
    // Task -> Get detials of months. Like how many tours are in a evey month. 
    /*
        steps: 
        1. Unwing startDates to make copies of tour.
        2. Match tours with given year.
        3. Group them with id 'month'
    */
    try {
        const year = req.params.year * 1;
        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`),
                    }
                }
            },
            {
                $group: {
                    _id: { $month: '$startDates' },
                    numOfTours: { $sum: 1 },
                    tours: { $push: '$name' }
                }
            },
            // Adding custom fields in api
            {
                $addFields: { month: '$_id' }
            },
            // Hidi ng '_id' field
            {
                $project: { _id: 0 }
            },
            {
                $sort: { numOfTours: -1 }
            }
        ])
        res.status(200).json({
            stats: 'success',
            data: plan
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
}