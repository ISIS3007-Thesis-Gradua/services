// Schema package acts as a singleton that storages the connection to db
// import libs and schemas
const mongoose = require('mongoose')
const stepSchema = require('./step.schema')
const { stepNames } = require('../utils')
// mongoose config
mongoose.Promise = global.Promise
// lib variables
const estado = {
  isConnected: false,
  conn: undefined,
  models: {
    Step00: undefined,
    Step01: undefined,
    Step1: undefined,
    Step2: undefined,
    Step3: undefined,
    Step4: undefined,
    Step5: undefined,
    Step6: undefined,
    Step7: undefined
  }
}
// connection function
module.exports = async () => {
  // if the connection exists return it else initialize conection and schemas
  if (estado.isConnected) {
    console.log('=> using existing database connection')
    return estado
  } else {
    console.log('=> using new database connections')
    estado.conn = mongoose.createConnection(process.env.CORPUS_DB)
    estado.models.Step00 = estado.conn.model(stepNames.step00, stepSchema)
    estado.models.Step01 = estado.conn.model(stepNames.step01, stepSchema)
    estado.models.Step1 = estado.conn.model(stepNames.step1, stepSchema)
    estado.models.Step2 = estado.conn.model(stepNames.step2, stepSchema)
    estado.models.Step3 = estado.conn.model(stepNames.step3, stepSchema)
    estado.models.Step4 = estado.conn.model(stepNames.step4, stepSchema)
    estado.models.Step5 = estado.conn.model(stepNames.step5, stepSchema)
    estado.models.Step6 = estado.conn.model(stepNames.step6, stepSchema)
    estado.models.Step7 = estado.conn.model(stepNames.step7, stepSchema)
    estado.isConnected = true
    return estado
  }
}
