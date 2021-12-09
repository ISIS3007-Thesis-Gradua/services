const mongoose = require('mongoose')

const routineSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
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
routineSchema.index({ _id: 1 }, { unique: true })
module.exports = routineSchema
