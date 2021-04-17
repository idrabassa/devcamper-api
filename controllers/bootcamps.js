const Bootcamp = require("../modules/Bootcamp");
const path = require('path')
const asyncHandler=require('../middleware/async')
const errorResponse=require('../utils/errorResponse');
const geocoder = require("../utils/geocoder");


//@desc    Get all bootcamps
//@route   Get  /api/v1/bootcamps
//@access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  
    res.status(200).json(res.advancedResults)
    
});

//@desc    Get single bootcamp
//@route   Get  /api/v1/bootcamps/:id
//@access  Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
      return next(new errorResponse(`Boorcamp not found with id of ${req.params.id}`,404))
    }
    res.status(200).json({ success: true, data: bootcamp });
  
    //   next(new errorResponse(`Boorcamp not found with id of ${req.params.id}`,404))
    //res.status(400).json({ success: false });
  
});

//@desc    Create new bootcamp
//@route   Post  /api/v1/bootcamps
//@access  Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  
    const bootcamp = await Bootcamp.create(req.body);
    // console.log(req.body);
    // res.status(200).json({success:true,msg:"Create new bootcamp"})
    res.status(201).json({ success: true, data: bootcamp });
  
});

//@desc    Update bootcamp
//@route   Put  /api/v1/bootcamps/:id
//@access  Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    
        
        let bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body,{
          new: true,
          runValidators: true
        });
        if (!bootcamp) {
          return next(new errorResponse(`Boorcamp not found with id of ${req.params.id}`,404))
        }
          res.status(200).json({ success: true, data:bootcamp});
    
});

//@desc    Delete bootcamp
//@route   Delete  /api/v1/bootcamps/:id
//@access  Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    
        const bootcamp = await Bootcamp.findById(req.params.id)
        if (!bootcamp) {
            return next(new errorResponse(`Boorcamp not found with id of ${req.params.id}`,404))
        }
        bootcamp.remove()  
        res.status(200).json({ success: true, data:{}});
    
});


//@desc    get bootcamps within radius 
//@route   Get  /api/v1/bootcamps/radius/:zipcode/:distance
//@access  Public
exports.getBootcampinRadius = asyncHandler(async (req, res, next) => {
    
    const {zipcode,distance} = req.params
    const loc = await geocoder.geocode(zipcode)
    const lat = loc[0].latitude
    const lng = loc[0].longitude

    //Calc radius using radians
    //Div dist by radius of earth
    // Earth Radius = 3,963 mi/ 6,378 km
    const radius = distance / 3963
    const bootcamps = await Bootcamp.find({
        location:{ $geoWithin: { $centerSphere: [ [ lng, lat ], radius ] }}
    })
    res.status(200).json({
        success:true,
        count: bootcamps.length,
        data:bootcamps
    })
});

//@desc    Upload photo for bootcamp
//@route   PUT  /api/v1/bootcamps/:id/photo
//@access  Private
exports.updatePhotoUpload = asyncHandler(async (req, res, next) => {
    
  const bootcamp = await Bootcamp.findById(req.params.id)
  if (!bootcamp) {
      return next(new errorResponse(`Boorcamp not found with id of ${req.params.id}`,404))
  }
  if(!req.files){
    return next(new errorResponse(`Please upload the file`,400))
  }

  const file=req.files.file
  //make sure the image is photo
  if(!file.mimetype.startsWith('image')){
    return next(new errorResponse(`Please upload a image file`,400))
  }
  if (file.size>process.env.MAX_FILE_UPLOAD) {
    return next(new errorResponse(`Please upload a image less than ${process.env.MAX_FILE_UPLOAD}`,400))
  }
  //create custom filename
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`,async err =>{
    if (err) {
      console.error(err)
      return next(new errorResponse(`Problem with the file upload`,500))
    }
    await Bootcamp.findByIdAndUpdate(req.params.id,{photo:file.name})
    res.status(200).json({
      success:true,
      data:file.name
    })
  })
});
