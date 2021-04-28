const jwt = require('jsonwebtoken')
const asyncHandler = require('./async');
const ErrorResponse = require("../utils/errorResponse");
const User = require('../modules/User')


exports.protect= asyncHandler(async(req,res,next)=>{
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token =req.headers.authorization.split(' ')[1]
    }
    // else if (req.cookies.token) {
    //     token =req.cookies.token
    // }
    //make sure token exists
    if(!token){
        return next(new ErrorResponse('Not authorize to access this route'),401)
    }
    try {
        //verify token
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        console.log(decoded);
        req.user = await User.findById(decoded.id)
        next()
    } catch (err) {
        return next(new ErrorResponse('Not authorize to access this route'),401)
        
    }
})

//Grant access to expecifics roles 
exports.authorize = (...roles)=>{
    return (req,res,next) =>{
      if (!roles.includes(req.user.role)) {
        return next(new ErrorResponse(`User role ${req.user.role} is not authorize this access this route`, 403));
      }
      next()
    }
  
  }