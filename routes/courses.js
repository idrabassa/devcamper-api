const express = require('express')
const {getCourses,getCourse} = require('../controllers/courses')
const router = express.Router({mergeParams:true})
router.route('/').get(getCourses)
router.route('/:id').get(getCourse)
// router.route('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp)
module.exports = router;