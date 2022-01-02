const mongoose = require('mongoose')
module.exports = new mongoose.Schema(
  {
    owner: { type: String, required: true },
    moodBefore: { type: Number, required: true },
    moodAfter: { type: Number, required: true },
    anxietyBefore: { type: Number, required: true },
    anxietyAfter: { type: Number, required: true },
    stressBefore: { type: Number, required: true },
    stressAfter: { type: Number, required: true },
    score: { type: Number, required: true },
    routineId: { type: String, ref: 'compoundId', required: true }
  },
  { autoCreate: true }
)
