const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

const app = express();
const PORT = 3000;
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

app.use(express.json());
app.use(morgan('dev'));

// app.use((req, res, next) => {
//     console.log('Hello From Middleware');
//     next();
// })

// app.use((req, res, next) => {
//     req.resquestTime = new Date().toISOString();
//     next();
// })

const getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        totalResults: tours.length,
        data: { tours }
    });
}

const addNewTour = (req, res) => {
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

const getSpecificTour = (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find(el => el.id === id);
    res.status(200).json({
        response: 'success',
        data: tour,
    });
}

app.route('/api/v1/tours/').get(getAllTours).post(addNewTour)
app.route('/api/v1/tours/:id').get(getSpecificTour)


app.listen(PORT, () => {
    console.log('listening on port ' + PORT);
})