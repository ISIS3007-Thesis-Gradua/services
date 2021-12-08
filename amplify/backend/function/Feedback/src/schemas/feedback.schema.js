const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')
module.exports = new mongoose.Schema(
  {
    owner: { type: String, default: uuidv4 },
    moodBefore: Number,
    moodAfter: Number,
    anxietyBefore: Number,
    anxietyAfter: Number,
    stressBefore: Number,
    stressAfter: Number,
    score: Number,
    feedbacks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'feedback' }]
  },
  { autoCreate: true }
)
