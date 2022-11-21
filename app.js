const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError')
const errorHandler = require('./controllers/errorController');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(`${__dirname}/public`))


app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
    // res.status(404).json({
    //     status: 'not found',
    //     message: `The route ${req.originalUrl} not found.`
    // })

    // const err = new Error(`The route ${req.originalUrl} was not found`)
    // err.statusCode = 404
    // err.status = 'not found'

    next(new AppError(`The route ${req.originalUrl} was not found`, 404))
})

// Global Error Handler
app.use(errorHandler)

module.exports = app;