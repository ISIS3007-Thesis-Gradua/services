// import libs and schemas
const mongoose = require('mongoose')
const routineSchema = require('./routine.schema')
const feedbackSchema = require('./feedback.schema')
// mongoose config
mongoose.Promise = global.Promise
// lib variables
const estado = {
  isConnected: false,
  conn: undefined,
  models: { Routine: undefined, Feedback: undefined }
}

module.exports = async () => {
  if (estado.isConnected) {
    console.log('[info] using existing database connection')
    return estado
  }

  console.log('[info] using new database connections')
  estado.conn = mongoose.createConnection(process.env.USERFEEDBACK_DB)
  estado.models.Routine = estado.conn.model('routine', routineSchema)
  estado.models.Feedback = estado.conn.model('feedback', feedbackSchema)
  estado.isConnected = true
  return estado
}
