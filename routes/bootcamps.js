const express = require('express')
const {getBootcamp,getBootcamps,createBootcamp,deleteBootcamp,updateBootcamp,getBootcampinRadius,updatePhotoUpload} =require('../controllers/bootcamps')

const Bootcamp = require('../modules/Bootcamp')
//include other resource routers
const courseRouter = require('./courses')

const router = express.Router()
const advancedResults= require('../middleware/advancedResults')
const {protect,authorize} =require('../middleware/auth')
//re-route into others resource routers
router.use('/:bootcampId/courses',courseRouter)
router.route('/radius/:zipcode/:distance').get(getBootcampinRadius)
router.route('/').get(advancedResults(Bootcamp,'courses'),getBootcamps).post(protect,authorize('publisher','admin'),createBootcamp)
router.route('/:id').get(getBootcamp).put(protect,authorize('publisher','admin'),updateBootcamp).delete(protect,authorize('publisher','admin'),deleteBootcamp)
router.route('/:id/photo').put(protect,authorize('publisher','admin'),updatePhotoUpload)
module.exports = router;