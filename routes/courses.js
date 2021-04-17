const express = require('express')
const {getCourses,getCourse,addCourse,updateCourse,deleteCourse} = require('../controllers/courses')
const Course=require('../modules/Course')
const advancedResults=require('../middleware/advancedResults')
const router = express.Router({mergeParams:true})
router.route('/').get(advancedResults(Course, {
      path: 'bootcamp',
      select: 'name description'
    }),
    getCourses
  )
  .post(addCourse);
router.route('/:id').get(getCourse).put(updateCourse).delete(deleteCourse)
// router.route('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp)
module.exports = router;