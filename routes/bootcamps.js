const express = require('express')
const {getBootcamp,getBootcamps,createBootcamp,deleteBootcamp,updateBootcamp,getBootcampinRadius} =require('../controllers/bootcamps')

//include other resource routers
const courseRouter = require('./courses')

const router = express.Router()

//re-route into others resource routers
router.use('/:bootcampId/courses',courseRouter)
router.route('/radius/:zipcode/:distance').get(getBootcampinRadius)
router.route('/').get(getBootcamps).post(createBootcamp)
router.route('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp)
module.exports = router;