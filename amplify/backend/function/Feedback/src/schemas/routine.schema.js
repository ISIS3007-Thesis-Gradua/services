const mongoose = require('mongoose')

const routineSchema = new mongoose.Schema(
  {
    step00: String,
    step01: String,
    step1: String,
    step2: String,
    step3: String,
    step4: String,
    step5: String,
    step6: String,
    step7: String
  },
  { autoCreate: true }
)
routineSchema.index(
  {
    step00: 1,
    step01: 1,
    step1: 1,
    step2: 1,
    step3: 1,
    step4: 1,
    step5: 1,
    step6: 1,
    step7: 1
  },
  { unique: true }
)
module.exports = routineSchema
