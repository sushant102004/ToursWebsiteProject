const fs = require('fs');
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`))


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