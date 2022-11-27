const mongoose = require("mongoose");
const fs = require('fs')
const Tour = require('./models/tourModels')

const data = JSON.parse(fs.readFileSync(__dirname + '/dev-data/data/tours-simple.json', 'utf-8'));


const connectToDB = async () => {
    await mongoose
    .connect('mongodb://localhost:27017/toursWebsiteDB', { useNewUrlParser: true })
    .then(() => console.log("Connected"));
}

const addDataToDB = async () => {
    try {
        await Tour.create(data)
        console.log('Data added successfully')
    } catch (err) {
        console.log(err)
    }
}

connectToDB().then(() => addDataToDB())