// eslint-disable-next-line import/no-absolute-path
const connectToDatabase = require('../schemas')
const getTimeFromSSML = (text) => {
  // This is just for getting the numbers in te String. Shouldn't be more than 1 chain of numbers
  const numbers = /d+/g
  // This regex supports spaces between the number and the seconds key "s".
  const seconds = /d+s*s/g

  const miliseconds = /d+s*ms/g
  let matched
  try {
    matched = numbers.exec(text)
  } catch (error) {
    console.error(error)
  }
  const parsedNumbers = parseInt(matched ?? '100')
  if (miliseconds.test(text)) {
    return parsedNumbers / 1000
  } else if (seconds.test(text)) {
    return parsedNumbers
  } else {
    return parsedNumbers / 1000
  }
}

const randomize = async (req, res) => {
  const {
    models: { Step00, Step01, Step1, Step2, Step3, Step4, Step5, Step6, Step7 }
  } = await connectToDatabase()

  try {
    // ============================================================
    // ======================= variables ==========================
    // ============================================================
    const { time = 0, avgWordsPerMin = 170, charsPerWord = 10 } = req.query // the default values matches spanish
    const avgTimePerChar = 1 / ((avgWordsPerMin / 60) * charsPerWord)
    const maxTime = time * 60
    let currenTime = 0
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
    const routine = {
      [stepNames.step00]: [],
      [stepNames.step01]: [],
      [stepNames.step1]: [],
      [stepNames.step2]: [],
      [stepNames.step3]: [],
      [stepNames.step4]: [],
      [stepNames.step5]: [],
      [stepNames.step6]: [],
      [stepNames.step7]: []
    }
    // ============================================================
    // ======================= functions ==========================
    // ============================================================
    // retrives the content from a given step and inserts it into the response object
    const updateStep = async (Step, stepName) => {
      // calculates the time of a given ssml string
      const reduceToTime = (prevTime, currSSML) => {
        console.log(stepName, ' reducer ================ ', currSSML)
        // Docs for this Regex: https://regex101.com/r/6CreYZ/1
        // Esta es una opción más "bervosa" y exacta

        // Esta es más genérica. Usar cualquiera a discreción.
        // Docs for this Regex: https://regex101.com/r/bzmddu/1
        const filter = /<break[^/>]*\/>/g
        const tagsTime = (currSSML.content.match(filter) ?? []).reduce(
          (prev, curr) => {
            console.log('second reducer ==> ', prev, '===', curr)
            return prev + getTimeFromSSML(curr)
          },
          0
        )
        const textTime =
          currSSML.content.replace(/ *<[^>]*\) */g, '').length * avgTimePerChar
        console.log('===>> ', tagsTime, '===', textTime)
        return prevTime + tagsTime + textTime
      }
      // get the step
      const step = await Step.aggregate([{ $sample: { size: 1 } }])
      // set the new content
      routine[stepName] = [...routine[stepName], ...step]
      // return the time of the step
      return routine[stepName].reduce(reduceToTime, 0)
    }
    // returns true if the total time of the generated meditation is greater than maxTime
    const isLessThanTimeLimit = () => currenTime <= maxTime * 0.9

    // ============================================================
    // ======================= algorithm ==========================
    // ============================================================

    // retrives welcome message
    currenTime += await updateStep(Step00, stepNames.step00)
    // retrives the before start message
    currenTime += await updateStep(Step01, stepNames.step01)
    // retrives the first step
    currenTime += await updateStep(Step1, stepNames.step1)
    // retrives the sixth step
    currenTime += await updateStep(Step6, stepNames.step6)
    // retrives the last step
    currenTime += await updateStep(Step7, stepNames.step7)
    // randomly chose if the second step will be retrived
    if (Math.floor(Math.random() * 2) === 1) {
      currenTime += await updateStep(Step2, stepNames.step2)
    }
    // with the rest of the time we create a loop for the procedural
    // generation of the step sequece 3,4,5
    // stopping in any part of the procedural generation if the threshold is reached
    while (isLessThanTimeLimit()) {
      currenTime += await updateStep(Step3, stepNames.step3)
      if (!isLessThanTimeLimit()) {
        break
      }
      currenTime += await updateStep(Step4, stepNames.step4)
      if (!isLessThanTimeLimit()) {
        break
      }
      currenTime += await updateStep(Step5, stepNames.step5)
    }

    res.status(200).send({ routine: routine, totalTime: currenTime })
  } catch (err) {
    console.log(err)
    res.status(404).send({ message: err.message })
  }
}

module.exports = randomize
