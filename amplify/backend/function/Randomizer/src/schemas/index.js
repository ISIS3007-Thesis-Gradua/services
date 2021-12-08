// Schema package acts as a singleton that storages the connection to db
// import libs and schemas
const mongoose = require('mongoose')
const stepSchema = require('./step.schema')
// mongoose config
mongoose.Promise = global.Promise
// lib variables
let isConnected,
  conn,
  Step00,
  Step01,
  Step1,
  Step2,
  Step3,
  Step4,
  Step5,
  Step6,
  Step7
// connection function
module.exports = async () => {
  // if the connection exists return it else initialize conection and schemas
  try {
    if (isConnected) {
      console.log('=> using existing database connection')
      return {
        conn: conn,
        models: {
          Step00,
          Step01,
          Step1,
          Step2,
          Step3,
          Step4,
          Step5,
          Step6,
          Step7
        }
      }
    } else {
      console.log('=> using new database connections')
      conn = mongoose.createConnection(process.env.CORPUS_DB)
      Step00 = conn.model('step00', stepSchema)
      Step01 = conn.model('step01', stepSchema)
      Step1 = conn.model('step1', stepSchema)
      Step2 = conn.model('step2', stepSchema)
      Step3 = conn.model('step3', stepSchema)
      Step4 = conn.model('step4', stepSchema)
      Step5 = conn.model('step5', stepSchema)
      Step6 = conn.model('step6', stepSchema)
      Step7 = conn.model('step7', stepSchema)
      isConnected = true
      return {
        conn: conn,
        models: {
          Step00,
          Step01,
          Step1,
          Step2,
          Step3,
          Step4,
          Step5,
          Step6,
          Step7
        }
      }
    }
  } catch (error) {
    console.error(error)
  }
}
