const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err,req,res,next)=>{
    let error = {...err} 
    console.log(err.red);
    error.message=err.message

    //Mongoose bad ObjectId
    if(err.name==='CastError'){
        const message =`Resource not found`
        error=new ErrorResponse(message,404)
    }
    //Mongoose duplicate key
    if(err.code===11000){
        const message=`Duplicated field value entered`
        error=new ErrorResponse(message,400)

    }

    //Mongoose valiudation error
    if(err.name==='ValidationError'){
        const message=Object.values(err.errors).map(val => val.message)
        error=new ErrorResponse(message,400)
    }
    res.status(error.statusCode||500).json({
        success:false,
        error:error.message || 'Server Error'
    })
}

module.exports = errorHandler