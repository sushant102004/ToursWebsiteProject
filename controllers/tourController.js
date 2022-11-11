const Tour = require('./../models/tourModels')

exports.getTopFiveTours = async (req, res, next) => {
    req.query.limit = '5'
    req.query.sort = '-ratingsAverage,price'
    req.query.fields = 'name,price,ratingAverage,summary,difficulty'
    console.log(req.query)
    next();
}

class APIFeatures {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }

    filter(){
        let queryObj = { ...this.queryString };
        const excludeFields = ['page', 'sort', 'limit', 'fields'];

        excludeFields.forEach(el => delete queryObj[el])

        // Filtering
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)


        this.query.find(JSON.parse(queryStr))
        return this
    }

    sort(){
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
        } else this.query = this.query.sort('-createdAt')
        
        return this
    }

    limit(){
        if(this.queryString.fields){
            const fields = this.queryString.fields.split(',').join(' ')
            this.query = this.query.select(fields)
        } else this.query = this.query.select('-__V')

        return this
    }

    pagination(){
        const page = this.queryString.page * 1 || 1
        const results = this.queryString.results * 1 || 100
        const skip = (page - 1) * results

        if(this.queryString.page){
            this.query = this.query.skip(skip).limit(results)
        }
        return this
    }
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