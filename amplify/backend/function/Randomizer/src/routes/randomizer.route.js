const express = require('express')
const randomize = require('../controllers/randomizer.ctl')
const router = new express.Router()

/*
 * get a random meditation form the meditation framework
 * definition: /randomize?time={time}&avg={averageCharPerSec}
 * time => meditation's duration in minutes
 * averageTimePerLetter
 * response body:
    {
    "step00": [
            {
                "_id":"6169c53d201ebe4f6a58c76a",
                "content":"bienvenido a gradua..."
            }
        ],
    ...
    "step7": [
            {
                "_id":"6169ba2036651c7498ee7d5c",
                "content":"gracias por meditar con nosotros...",
            }
        ],
    }
 */
router.get('/', randomize)

module.exports = router
