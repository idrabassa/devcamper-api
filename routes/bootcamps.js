const express = require('express')
const {getBootcamp,getBootcamps,createBootcamp,deleteBootcamp,updateBootcamp,getBootcampinRadius,updatePhotoUpload} =require('../controllers/bootcamps')

const advancedResults= require('../middleware/advancedResults')
const Bootcamp = require('../modules/Bootcamp')
//include other resource routers
const courseRouter = require('./courses')

const router = express.Router()
const {protect} =require('../middleware/auth')
//re-route into others resource routers
router.use('/:bootcampId/courses',courseRouter)
router.route('/radius/:zipcode/:distance').get(getBootcampinRadius)
router.route('/').get(advancedResults(Bootcamp,'courses'),getBootcamps).post(protect,createBootcamp)
router.route('/:id').get(getBootcamp).put(protect,updateBootcamp).delete(protect,deleteBootcamp)
router.route('/:id/photo').put(protect,updatePhotoUpload)
module.exports = router;