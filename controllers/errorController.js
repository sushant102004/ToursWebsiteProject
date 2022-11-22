const sendDevelopmentError = (err, req, res, next) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack
    })
}

const sendProductionError = (err, req, res, next) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    })
}

module.exports = (err, req, res, next) => {
    err.status = err.status || 'fail'
    err.statusCode = err.statusCode || 500

    if(process.env.NODE_ENV == 'production'){
        sendProductionError(err, res)
    } else {
        sendDevelopmentError(err, res)
    }
}