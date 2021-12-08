// eslint-disable-next-line import/no-absolute-path
const connectToDatabase = require('../schemas')

const randomize = async (req, res) => {
  const {
    models: { Step00, Step01, Step1, Step2, Step3, Step4, Step5, Step6, Step7 }
  } = await connectToDatabase()

  try {
    const { time = 0, avg = 5 } = req.query
    const routine = {
      step00: await Step00.aggregate([{ $sample: { size: 1 } }]),
      step01: await Step01.aggregate([{ $sample: { size: 1 } }]),
      step1: await Step1.aggregate([{ $sample: { size: 1 } }]),
      step2: [],
      step3: [],
      step4: [],
      step5: [],
      step6: await Step6.aggregate([{ $sample: { size: 1 } }]),
      step7: await Step7.aggregate([{ $sample: { size: 1 } }])
    }
    const reduceToLen = (curr, doc) => curr + doc.content.length
    const totalLetters = (time || 0) * (avg || 0)
    let routineLeght = Object.values(routine).reduce(
      (curr, step) => curr + step.reduce(reduceToLen, 0),
      0
    )
    if (Math.floor(Math.random() * 2) === 1) {
      routine.step2 = await Step2.aggregate([{ $sample: { size: 1 } }])
      routineLeght += routine.step2.reduce(reduceToLen, 0)
    }
    do {
      const step3 = await Step3.aggregate([{ $sample: { size: 1 } }])
      routine.step3 = [...routine.step3, ...step3]
      routineLeght += step3.reduce(reduceToLen, 0)

      const step4 = await Step4.aggregate([{ $sample: { size: 1 } }])
      routine.step4 = [...routine.step4, ...step4]
      routineLeght += step4.reduce(reduceToLen, 0)

      const step5 = await Step5.aggregate([{ $sample: { size: 1 } }])
      routine.step5 = [...routine.step5, ...step5]
      routineLeght += step5.reduce(reduceToLen, 0)
    } while (routineLeght <= totalLetters * 0.9)

    res.status(200).send(routine)
  } catch (err) {
    console.log(err)
    res.status(404).send({ message: err.message })
  }
}

module.exports = randomize
