// import libs and schemas
const mongoose = require('mongoose')
const stepSchema = require('./steps.schema')
const routineSchema = require('./routine.schema')
const feedbackSchema = require('./feedback.schema')
// mongoose config
mongoose.Promise = global.Promise
// lib variables
let isConnected,
  corpusConn,
  userFeedbackConn,
  Step00,
  Step01,
  Step1,
  Step2,
  Step3,
  Step4,
  Step5,
  Step6,
  Step7,
  Routine,
  Feedback

module.exports = async () => {
  if (isConnected) {
    console.log('=> using existing database connection')
    return {
      conns: {
        corpusConn,
        userFeedbackConn
      },
      models: {
        Step00,
        Step01,
        Step1,
        Step2,
        Step3,
        Step4,
        Step5,
        Step6,
        Step7,
        Routine,
        Feedback
      }
    }
  }

  console.log('=> using new database connections')
  corpusConn = mongoose.createConnection(process.env.CORPUS_DB)
  userFeedbackConn = mongoose.createConnection(process.env.USERFEEDBACK)
  Step00 = corpusConn.model('step00', stepSchema)
  Step01 = corpusConn.model('step01', stepSchema)
  Step1 = corpusConn.model('step1', stepSchema)
  Step2 = corpusConn.model('step2', stepSchema)
  Step3 = corpusConn.model('step3', stepSchema)
  Step4 = corpusConn.model('step4', stepSchema)
  Step5 = corpusConn.model('step5', stepSchema)
  Step6 = corpusConn.model('step6', stepSchema)
  Step7 = corpusConn.model('step7', stepSchema)
  Routine = userFeedbackConn.model('routine', routineSchema)
  Feedback = userFeedbackConn.model('feedback', feedbackSchema)
  isConnected = true
  return {
    conns: {
      corpusConn,
      userFeedbackConn
    },
    models: {
      Step00,
      Step01,
      Step1,
      Step2,
      Step3,
      Step4,
      Step5,
      Step6,
      Step7,
      Routine,
      Feedback
    }
  }
}
