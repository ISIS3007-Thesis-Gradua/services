// import libs and schemas
const mongoose = require('mongoose')
// mongoose config
mongoose.Promise = global.Promise
// lib variables
let isConnected, conn, Routine, Feedback
// connection function
module.exports = async () => {
  try {
    // if the connection exists return it else initialize conection and schemas
    if (isConnected) {
      console.log('=> using existing database connection')
      return {
        conn: conn,
        models: {
          Routine,
          Feedback
        }
      }
    }
    console.log('=> using new database connections')
    conn = mongoose.createConnection(process.env.USERFEEDBACK)
    Routine = conn.model('routine', require('./routine.schema'))
    Feedback = conn.model('feedback', require('./feedback.schema'))
    isConnected = true
    return {
      conn,
      models: {
        Routine,
        Feedback
      }
    }
  } catch (error) {
    console.error(error)
  }
}
