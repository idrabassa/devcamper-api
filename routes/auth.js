const express = require('express');
const {register,login} = require('../controllers/auth');

const router =express.Router()

router.post('/register',register)
router.post('/login',register)

module.exports = router