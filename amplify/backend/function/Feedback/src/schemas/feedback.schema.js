const mongoose = require('mongoose')
module.exports = new mongoose.Schema(
  {
    owner: String,
    moodBefore: Number,
    moodAfter: Number,
    anxietyBefore: Number,
    anxietyAfter: Number,
    stressBefore: Number,
    stressAfter: Number,
    score: Number,
    routine: { type: String, ref: 'routine' }
  },
  { autoCreate: true }
)
