const fs = require('fs');
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`))


exports.checkID = (req, res, next, value) => {
    if(req.params.id * 1 > tours.length){
        return res.status(404).json({
            'status' : 'fail',
            'message' : 'Invalid Id'
        })
    }
    next();
}

exports.checkBody = (req, res, next) => {
    if(!req.body.name || !req.body.price){
        return res.status(400).json({
            'status' : 'fail',
            'message' : 'Either tour name or price is not specified'
        })
    }
    next()
}

exports.getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        totalResults: tours.length,
        data: { tours }
    });
}

exports.addNewTour = (req, res) => {
    const newId = (tours.length - 1) + 1;
    const newObject = Object.assign({ id: newId }, req.body);
    tours.push(newObject);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: 'success',
            data: newObject
        })
    });
}

exports.getSpecificTour = (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find(el => el.id === id);
    res.status(200).json({
        response: 'success',
        data: tour,
    });
}