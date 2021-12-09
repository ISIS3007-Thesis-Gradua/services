const connectToDatabase = require('../schemas')

const feedback = async (req, res) => {
  const {
    conns: { userFeedbackConn },
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
  } = await connectToDatabase()
  res.body.data = await Routine.find({})
  res.status(200).send(res.body)
  // start te upsert transaction
  await userFeedbackConn
    .transaction(async (session) => {
      // alias for routine parameter from request body
      const { routine = {}, feedback = {} } = req.body
      const stepNames = {
        step00: 'step00',
        step01: 'step01',
        step1: 'step1',
        step2: 'step2',
        step3: 'step3',
        step4: 'step4',
        step5: 'step5',
        step6: 'step6',
        step7: 'step7'
      }
      const steps = {
        [stepNames.step00]: Step00,
        [stepNames.step01]: Step01,
        [stepNames.step1]: Step1,
        [stepNames.step2]: Step2,
        [stepNames.step3]: Step3,
        [stepNames.step4]: Step4,
        [stepNames.step5]: Step5,
        [stepNames.step6]: Step6,
        [stepNames.step7]: Step7
      }
      const routineResult = {
        [stepNames.step00]: String,
        [stepNames.step01]: String,
        [stepNames.step1]: String,
        [stepNames.step2]: String,
        [stepNames.step3]: String,
        [stepNames.step4]: String,
        [stepNames.step5]: String,
        [stepNames.step6]: String,
        [stepNames.step7]: String
      }
      // reduce all object ids into one single compund id separated by '#' like:
      // 61b18038bc2fb87997e86304#61b18046e717245d28af643a#61b1804c96698813767c093a...
      // also extracts the raw info and creates the response routine
      let routineId = ''
      const names = Object.values(stepNames)
      for (let stepIndex = 0; stepIndex < names.length; stepIndex++) {
        const stepName = names[stepIndex]
        let tmpId = ''
        const stepIds = routine[stepName] ?? []
        for (let index = 0; index < stepIds.length; index++) {
          const _id = stepIds[index]
          tmpId += index ? '#' : '' + _id
          routineResult[stepName] +=
            routineResult[stepName] +
            (index ? ' # ' : '') +
            (await steps[stepName].findByid(_id)).content
        }
        routineId += stepIndex ? '#' : '' + tmpId
      }
      // upsert filter and update values
      const filter = { _id: routineId }
      const update = { _id: routineId, ...routineResult }
      // new routine if it doesn't already exist, else just tries to update and retrives the id
      const newRoutine = await Routine.findOneAndUpdate(
        filter,
        update,
        {
          new: true,
          upsert: true // Make this update into an upsert
        },
        { session }
      )
      // new feedback for the user
      const newFeedback = await Feedback.create(
        { routine: newRoutine._id, ...feedback },
        { session }
      )
      // ids for cache in application
      res
        .status(200)
        .send({ routineId: newFeedback.routine, feedbackId: newFeedback._id })
    })
    .catch((err) => {
      console.error(err)
      res.status(400).send({ message: err.message })
    })
}

module.exports = feedback
