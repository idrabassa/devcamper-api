const Course = require("../modules/Course");
const asyncHandler=require('../middleware/async')
const errorResponse=require('../utils/errorResponse');


//@desc    Get all Courses
//@route   Get  /api/v1/courses
//@route   Get  /api/v1/bootcamps/:bootcampsId/courses
//@access  Public

exports.getCourses = asyncHandler(async (req,res,next)=>{
    let query
    if(req.params.bootcampId){
        query=Course.find({bootcamp:req.params.bootcampId})
    }else{
        query.Course.find()
    }
    const courses = await query

    res.status(200).json({
        success:true,
        count:courses.length,
        data:courses
    })
})