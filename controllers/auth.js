const User = require("../modules/User");
const asyncHandler=require('../middleware/async')
const errorResponse=require('../utils/errorResponse');
const ErrorResponse = require("../utils/errorResponse");

//@desc    Register user
//@route   Post  /api/v1/auth/register
//@access  Public

exports.register = asyncHandler(async(req,res,next)=>{
    const {name,email,password,role}=req.body
    

    //validate email & pass
    if(!email||!password){
        return next(new ErrorResponse('Please provide email and password'),400)
    }
    //check for the user
    const  user = await User.findOne({email}).select('+password')
    if (!user) {
        return next(new ErrorResponse('Invalid Credentials'),401)
    }
    //check if password matches
    const isMatch = await user.matchPassword(password)
    if(!isMatch){
        return next(new ErrorResponse('Invalid Credentials'),401)
    }
    const token= user.getSignedJwtToken()
    res.status(200).json({success:true,token:token})
})

//@desc    Login user
//@route   POST  /api/v1/auth/login
//@access  Public

exports.login = asyncHandler(async(req,res,next)=>{
    const {email,password}=req.body
    

    //create user
    const user= await User.create({
        name,
        email,
        password,
        role
    })
    const token= user.getSignedJwtToken()
    res.status(200).json({success:true,token:token})
})