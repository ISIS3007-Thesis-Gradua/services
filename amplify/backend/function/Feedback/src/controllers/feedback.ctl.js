const connectToDatabase = require('../schemas')

const feedback = async (req, res) => {
  const {
    models: { Routine }
  } = await connectToDatabase()
  res.body.data = await Routine.find({})
  res.status(200).send(res.body)
  // Routine.create(req.body, (err, feedback) => {
  //   if (err) {
  //     console.log(err)
  //     res.status(400).send({ message: err.message })
  //   } else {
  //     res.status(200).send(feedback)
  //   }
  // })
}

module.exports = feedback
