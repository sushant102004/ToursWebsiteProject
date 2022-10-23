const Tour = require('./../models/tourModels')


exports.getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
    });
}

exports.addNewTour = async (req, res) =>  {
    try {
        const newTour = await Tour.create(req.body);
        res.status(200).json({
            status: 'success',
            data: {
                newTour
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'error',
            message: err
        })
    }    
}

exports.getSpecificTour = (req, res) => {

}