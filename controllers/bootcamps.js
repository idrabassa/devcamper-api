const Bootcamp = require("../modules/Bootcamp");
const asyncHandler=require('../middleware/async')
const errorResponse=require('../utils/errorResponse');
const geocoder = require("../utils/geocoder");


//@desc    Get all bootcamps
//@route   Get  /api/v1/bootcamps
//@access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    let query;
    //Copy request query
    const reqQuery = {...req.query}
    //fields to exclude
    const removeFields = ['select','page','limit','sort']
    //loop over remove fields and delete them from query
    removeFields.forEach(param => delete reqQuery[param])
    //create query string
    let queryStr = JSON.stringify(reqQuery)
    //create operator ($gt,$gte,etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match =>`$${match}` )
    //finding resource
    query=Bootcamp.find(JSON.parse(queryStr))
    //select fields
    if (req.query.select) {
        const fields =  req.query.select.split(',').join(' ')
        query = query.select(fields)
    }
    if(req.query.sort){

        const sortBy =req.query.sort.split(',').join(' ')
        query = query.sort(sortBy)
    }else{
        query = query.sort('-createdAt')
    }
    //pagination
    const page = parseInt(req.query.page,10)||1 
    const limit =parseInt(req.query.limit,10)||25
    const startIndex =(page - 1 ) * limit 
    const endIndex=page*limit
    const total =await Bootcamp.countDocuments()  
    query=query.skip(startIndex).limit(limit)
    //executing query
    const bootcamps = await Bootcamp.find(query);
    //pagination  result
    const pagination ={}
    if(endIndex < total){
      pagination.next={
        page:page+1,
        limit
      }
    }
    if(startIndex>0){
      pagination.prev={
        page:page-1,
        limit
      }
    }
    //const bootcamps = await query;
    //console.log(bootcamps)
    res.status(200).json({ success: true,count:bootcamps.length,pagination,data: bootcamps })
    
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
