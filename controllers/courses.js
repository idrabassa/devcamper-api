const Course = require("../modules/Course");
const Bootcamp = require("../modules/Bootcamp");
const asyncHandler=require('../middleware/async')
const errorResponse=require('../utils/errorResponse');
const ErrorResponse = require("../utils/errorResponse");


//@desc    Get single Course
//@route   GET  /api/v1/courses/:id
//@access  Public

exports.getCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id).populate({
      path: 'bootcamp',
      select: 'name description'
    });
  
    if (!course) {
      return next(
        new ErrorResponse(`No course with the id of ${req.params.id}`),
        404
      );
    }
  
    res.status(200).json({
      success: true,
      data: course
    });
  });

//@desc    Get all Courses
//@route   GET  /api/v1/courses
//@route   GET  /api/v1/bootcamps/:bootcampsId/courses
//@access  Public

exports.getCourses = asyncHandler(async (req,res,next)=>{
    let query
    if(req.params.bootcampId){
        query=Course.find({bootcamp:req.params.bootcampId})
    }else{
        query=Course.find().populate({
            path:'bootcamp',
            select:'name description'
        })
    }
    const courses = await query

    res.status(200).json({
        success:true,
        count:courses.length,
        data:courses
    })
})

//@desc    Add Course
//@route   POST  /api/v1/bootcamps/:bootcampId/courses
//@access  Private

exports.addCourse = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;
    //req.body.user = req.user.id;
  
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  
    if (!bootcamp) {
      return next(
        new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`),
        404
      );
    }
  
    // // Make sure user is bootcamp owner
    // if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    //   return next(
    //     new ErrorResponse(
    //       `User ${req.user.id} is not authorized to add a course to bootcamp ${bootcamp._id}`,
    //       401
    //     )
    //   );
    // }
  
    const course = await Course.create(req.body);
  
    res.status(200).json({
      success: true,
      data: course
    });
  });

//@desc    Update Course
//@route   PUT  /api/v1/courses/:id
//@access  Private

exports.updateCourse = asyncHandler(async (req, res, next) => {
  
    let course = await Course.findById(req.params.id);
  
    if (!course) {
      return next(
        new ErrorResponse(`No course with the id of ${req.params.id}`),
        404
      );
    }
  
    // // Make sure user is bootcamp owner
    // if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    //   return next(
    //     new ErrorResponse(
    //       `User ${req.user.id} is not authorized to add a course to bootcamp ${bootcamp._id}`,
    //       401
    //     )
    //   );
    // }
  
     course = await Course.findByIdAndUpdate(req.params.id,req.body,{
         new:true,
         runValidators:true
     });
  
    res.status(200).json({
      success: true,
      data: course
    });
  });  