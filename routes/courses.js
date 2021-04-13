const express = require('express')
const {getCourses,getCourse,addCourse,updateCourse} = require('../controllers/courses')
const router = express.Router({mergeParams:true})
router.route('/').get(getCourses).post(addCourse)
router.route('/:id').get(getCourse).put(updateCourse)
// router.route('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp)
module.exports = router;