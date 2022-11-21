module.exports = (err, req, res, next) => {
    err.status = err.status || 'fail'
    err.statusCode = err.statusCode || 500

    res.status(err.statusCode).json({
        status: err.statusCode,
        message: err.message
    })
}