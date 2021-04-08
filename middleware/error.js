const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err,req,res,next)=>{
    let error = {...err} 
    console.log(err.red);
    error.message=err.message

    //Mongoose bad ObjectId
    if(err.name==='CastError'){
        const message =`Resource not found with id of ${err.value}`
        error=new ErrorResponse()
    }

    res.status(error.statusCode||500).json({
        success:false,
        error:error.message || 'Server Error'
    })
}

module.exports = errorHandler