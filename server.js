const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({path: './config.env'});
const app = require('./app');

const PORT = process.env.PORT || 8000;

const DB = process.env.DB

mongoose.connect(DB, {
    useNewUrlParser: true,
}).then(() => console.log('Connected to DB'));

app.listen(PORT, () => {
    console.log('Listening on post: ' + process.env.PORT);
})