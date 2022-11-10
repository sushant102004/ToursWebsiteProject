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
        const queryObj = {...this.query};
        const fieldsToExclude = ['page', 'sort', 'limit', 'fields'];
        fieldsToExclude.forEach(el => delete queryObj[el])

        // Advance Filtering
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)

        this.query.find(JSON.parse(queryStr))
        return this
    }

    sort(){
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
        } else {
            this.query = this.query.sort('-createdAt')
        }
        return this
    }

    limitFields(){
        if(this.queryString.fields){
            const fields = this.queryString.fields.split(',').join(' ')
            this.query = this.query.select(fields)
        } else this.query = this.query.select('-__v')
        return this
    }

    pagination(){
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit)
        return this
    }
}

exports.getAllTours = async (req, res) => {
    try {
        // Making a hard code copy of query
        // const queryObj = { ...req.query };
        // const excludeFields = ['page', 'sort', 'limit', 'fields'];
        
        // // Using forEach to delete selected fields from query
        // excludeFields.forEach(el => delete queryObj[el])
        
        // // Advance Filtering
        // // {difficulty: 'easy', duration: {$gte: 5}}
        // // gte, gt, lte, lt
        // let queryString = JSON.stringify(queryObj);
        // queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);


        // // Saving the complete query so we can implement other functions later.
        // let query = Tour.find(JSON.parse(queryString));   
                
        
        // Sorting
        // if(req.query.sort){
        //     const sortBy = req.query.sort.split(',').join(' ')
        //     query = query.sort(sortBy)
        // } else {
        //     query = query.sort('-createdAt')
        // }

        // Field Limiting -> Showing only some useful information
        /*
            query.select('name rating difficulty')
        */
    //    if(req.query.fields){
    //     const fields = req.query.fields.split(',').join(' ')
    //     query = query.select(fields)
    //    } else query = query.select('-__v')

        //Pagination
        /*
            Let page = 3 & limit = 10
            so page 1 will have 1 - 10 results and page 2 will have 11 - 20
            page 3 will have 21 to 30 results
        */

        // const page = req.query.page * 1 || 1;
        // const limit = req.query.limit * 1 || 100;
        // const skip = (page - 1) * limit;

        // query = query.skip(skip).limit(limit)

        
        const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().pagination()

        const tours = await features.query;
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