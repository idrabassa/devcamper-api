const Bootcamp = require("../modules/Bootcamp");
const asyncHandler=require('../middleware/async')
const errorResponse=require('../utils/errorResponse');
const geocoder = require("../utils/geocoder");
//@desc    Get all bootcamps
//@route   Get  /api/v1/bootcamps
//@access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    let query 
    //Copy request query
    const reqQuery = {...req.query}
    //fields to exclude
    const removeFields =['select']
    //loop over remove fields and delete them from query
    removeFields.forEach(params => delete reqQuery[params])
    console.log(reqQuery );
    //create query string
    let queryStr =JSON.stringify(req.query)
    //create operator ($gt,$gte,etc)
    queryStr = queryStr.replace(/\b(gt|gte|lte|in)\b/g, match =>`$${match}` )
    //finding resource
    query=Bootcamp.find(JSON.parse(queryStr))
    //select fields
    if (req.query.select) {
        const fields =  req.query.select.split(',').join(' ')
        query = query.select(fields)
    }
    //executing query
    const bootcamps = await Bootcamp.find(query);
    res.status(200).json({ success: true,count:bootcamps.length,data: bootcamps });
    
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
    
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
          if (!bootcamp) {
            return next(new errorResponse(`Boorcamp not found with id of ${req.params.id}`,404))
          }
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
