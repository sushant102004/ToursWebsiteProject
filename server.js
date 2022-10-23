const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({path: './config.env'});
const app = require('./app');

const PORT = process.env.PORT || 8000;

const DB = process.env.DB

mongoose.connect(DB, {
    useNewUrlParser: true,
}).then(() => console.log('Connected to DB'));

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    rating: {
        type: Number,
        default: 0
    }
})

const tourModel = new mongoose.model('Tour', tourSchema);



app.listen(PORT, () => {
    console.log('Listening on post: ' + process.env.PORT);
})