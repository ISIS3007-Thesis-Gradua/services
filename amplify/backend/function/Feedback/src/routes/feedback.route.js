const express = require('express')
const feedback = require('../controllers/feedback.ctl')
const router = new express.Router()
/*
 * creates an feedback for a meditation session
 */
router.post('/', feedback)

module.exports = router
