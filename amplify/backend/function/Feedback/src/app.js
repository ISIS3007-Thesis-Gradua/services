/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

const express = require('express')
const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const connectToDatabase = require('./schemas')
const { stepNames } = require('./utils')
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

/**********************
 *       routes       *
 **********************/

app.post('/feedback', async (req, res) => {
  console.log('[info] persisting feedback to database')
  // constants
  const {
    conn,
    models: { Routine, Feedback }
  } = await connectToDatabase()

  // start te upsert transaction
  await conn
    .transaction(async (session) => {
      // alias for routine parameter from request body
      const { routine, feedback } = req.body
      // reduce all object ids from each step into one single compound id for the routine
      // the result id format is (S(<stepCompoundId>)?)+
      // where stepCompoundId is ((<objectId>#)*<objectId>)
      // each new step array starts with S then each object id is separated by #
      // note that S and # will never appear in the object id because object ids are hexadecimal
      // Example compund id
      // S 61b18038bc2fb87997e86304 # 61b18046e717245d28af643a SSSS 61b1804c96698813767c093a...
      // Compound id
      let compoundId = ''
      // for loop to get the compound id
      // Stape names as a list
      for (const stepName of Object.values(stepNames)) {
        // current step name
        // compound id of the array
        let stepCompoundId = 'S'
        // default empty array if step is undefined
        const stepIds = routine[stepName] ?? []
        for (let index = 0; index < stepIds.length; index++) {
          const currId = stepIds[index]
          // if index is 0 then the # will not be writted
          stepCompoundId += (index ? '' : '#') + currId
        }
        compoundId += stepCompoundId
      }

      console.log('[info] final id => ', compoundId)
      // upsert filter and update values
      const filter = { compoundId: compoundId }
      const update = { compoundId: compoundId }
      // set all step values and set default to empty string if it does not exist
      for (const name of Object.values(stepNames)) {
        update[name] = routine[name] ?? []
      }
      // new routine if it doesn't already exist, else just tries to update and retrives the id
      const newRoutine = await Routine.findOneAndUpdate(filter, update, {
        new: true,
        upsert: true, // Make this update into an upsert
        session: session,
        returnNewDocument: true
      })
      // new feedback for the user
      const newFeebackModel = new Feedback({
        routineId: newRoutine.compoundId,
        ...feedback
      })
      const newFeedback = await newFeebackModel.save({ session: session })
      // ids for cache at flutter application
      res.status(200).send({
        routineId: newRoutine.compoundId,
        feedbackId: newFeedback._id
      })
    })
    .catch((err) => {
      console.error(err)
      res.status(400).send({ message: err.message })
    })
})

app.listen(3000, function () {
  console.log('[server] feedback service has started')
})

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
