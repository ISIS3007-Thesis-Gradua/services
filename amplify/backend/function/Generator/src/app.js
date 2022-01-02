/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

const express = require('express')
const { stepNames, getTimeFromSSML } = require('./utils')
const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

// declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')
  next()
})
// db init
const connectToDatabase = require('./schemas')

/**********************
 *       Routes       *
 **********************/

/*
 * get a random meditation form the meditation framework
 * generate: /generate?time=*3*&wordsPerMin=*170*&charsPerWord=*7*
    * time -> meditation's duration in minutes
    * wordsPerMin -> average number of words per minute
    * charsPerWord -> average number of characters in words

```
  body:
    {
    "step00": [
            {
                "_id":"6169c53d201ebe4f6a58c76a",
                "content":"bienvenido a gradua..."
            }
        ],
    ...
    "step7": [
            {
                "_id":"6169ba2036651c7498ee7d5c",
                "content":"gracias por meditar con nosotros...",
            }
        ],
    }
```
 */
app.get('/generate', async (req, res, next) => {
  const {
    models: { Step00, Step01, Step1, Step2, Step3, Step4, Step5, Step6, Step7 }
  } = await connectToDatabase()

  try {
    // ============================================================
    // ======================= constants ==========================
    // ============================================================
    const { time = 6, wordsPerMin = 170, charsPerWord = 10 } = req.query // the default values matches spanish
    const avgTimePerChar = 1 / ((wordsPerMin / 60) * charsPerWord)
    // ( time * seconds in min ) * threshold (10% => 90% => 0.9)
    const maxTime = time * 60 * 0.9
    let totalTime = 0
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
        // Docs for this Regex: https://regex101.com/r/6CreYZ/1
        // Esta es una opción más "bervosa" y exacta

        // Esta es más genérica. Usar cualquiera a discreción.
        // Docs for this Regex: https://regex101.com/r/bzmddu/1
        const filter = /<break[^/>]*\/>/g
        const tagsTime = (currSSML.content ?? '')
          .match(filter)
          .reduce((prev, curr) => {
            return prev + getTimeFromSSML(curr)
          }, 0)
        const textTime =
          currSSML.content.replace(/ *<[^>]*\) */g, '').length * avgTimePerChar
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
    const isLessThanTimeLimit = () => totalTime <= maxTime

    // ============================================================
    // ======================= algorithm ==========================
    // ============================================================

    // retrives welcome message
    totalTime += await updateStep(Step00, stepNames.step00)
    // retrives the before start message
    totalTime += await updateStep(Step01, stepNames.step01)
    // retrives the first step
    totalTime += await updateStep(Step1, stepNames.step1)
    // retrives the sixth step
    totalTime += await updateStep(Step6, stepNames.step6)
    // retrives the last step
    totalTime += await updateStep(Step7, stepNames.step7)
    // randomly chose if the second step will be retrived
    if (Math.floor(Math.random() * 2) === 1) {
      totalTime += await updateStep(Step2, stepNames.step2)
    }
    // with the rest of the time we create a loop for the procedural
    // generation of the step sequece 3,4,5
    // stopping in any part of the procedural generation if the threshold is reached
    while (isLessThanTimeLimit()) {
      totalTime += await updateStep(Step3, stepNames.step3)
      if (!isLessThanTimeLimit()) {
        break
      }
      totalTime += await updateStep(Step4, stepNames.step4)
      if (!isLessThanTimeLimit()) {
        break
      }
      totalTime += await updateStep(Step5, stepNames.step5)
    }

    res.status(200).send({ routine: routine, totalTime: totalTime })
  } catch (err) {
    console.log(err)
    res.status(404).send({ message: err.message })
  }
})

app.listen(3000, function () {
  console.log('==>> Generator has started')
})
// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
