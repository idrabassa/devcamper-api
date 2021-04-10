const express = require('express')
const {getBootcamp,getBootcamps,createBootcamp,deleteBootcamp,updateBootcamp,getBootcampinRadius} =require('../controllers/bootcamps')
const router = express.Router()
router.route('/radius/:zipcode/:distance').get(getBootcampinRadius)
router.route('/').get(getBootcamps).post(createBootcamp)
router.route('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp)
module.exports = router;