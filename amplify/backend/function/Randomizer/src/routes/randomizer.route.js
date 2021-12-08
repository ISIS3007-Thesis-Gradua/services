const express = require('express');
const randomize = require('../controllers/randomizer.ctl');
const router = new express.Router();

/*
 * get all estudiantes in the system
 */
router.get('/', randomize);

module.exports = router;
