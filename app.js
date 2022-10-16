const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 3000;
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

app.use(express.json());

app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        status: 'success',
        totalResults: tours.length,
        data: { tours }
    });
})

app.post('/api/v1/tours', (req, res) => {
    const newId = (tours.length - 1) + 1;
    const newObject = Object.assign({ id: newId }, req.body);
    tours.push(newObject);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: 'success',
            data: newObject
        })
    });
})

app.get('/api/v1/tours/:id', (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find(el => el.id === id);
    res.status(200).json({
        response : 'success',
        data : tour,
    });
})

app.patch('/api/v1/tours/:id', (req, res) => {
    
});

app.listen(PORT, () => {
    console.log('listening on port ' + PORT);
})