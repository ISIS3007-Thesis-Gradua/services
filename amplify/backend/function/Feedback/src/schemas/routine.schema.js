const mongoose = require('mongoose')

const routineSchema = new mongoose.Schema(
  {
    compoundId: { type: String, required: true },
    step00: [{ type: String, required: true }],
    step01: [{ type: String, required: true }],
    step1: [{ type: String, required: true }],
    step2: [{ type: String, required: true }],
    step3: [{ type: String, required: true }],
    step4: [{ type: String, required: true }],
    step5: [{ type: String, required: true }],
    step6: [{ type: String, required: true }],
    step7: [{ type: String, required: true }]
  },
  { autoCreate: true }
)
routineSchema.index({ compoundId: 1 }, { unique: true })
module.exports = routineSchema
