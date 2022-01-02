// Schema package acts as a singleton that storages the connection to db
// import libs and schemas
const mongoose = require('mongoose')
const stepSchema = require('./step.schema')
const { stepNames } = require('../utils')
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
    Step00 = conn.model(stepNames.step00, stepSchema)
    Step01 = conn.model(stepNames.step01, stepSchema)
    Step1 = conn.model(stepNames.step1, stepSchema)
    Step2 = conn.model(stepNames.step2, stepSchema)
    Step3 = conn.model(stepNames.step3, stepSchema)
    Step4 = conn.model(stepNames.step4, stepSchema)
    Step5 = conn.model(stepNames.step5, stepSchema)
    Step6 = conn.model(stepNames.step6, stepSchema)
    Step7 = conn.model(stepNames.step7, stepSchema)
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
}
