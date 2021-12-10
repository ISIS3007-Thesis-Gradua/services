const mongoose = require('mongoose')
// stepSchema, contains the raw text from corpus db
module.exports = new mongoose.Schema(
  {
    content: String
  },
  { autoCreate: true }
)
