const path = require('path')
const auth = require(path.resolve(__rootdir, './lib/auth.js'))
const baseQuestion = require(path.resolve(__rootdir, './schema/base-question.js'))


module.exports = {
  get: [
    async (req, res, next) => {
      if (req.params.question === 'default') {
        res.send(Object.assign(baseQuestion, {
          creator: req.params.username.toLowerCase()
        }))
      } else {
        next()
      }
    },
    async (req, res) => {
      const question = await database.getTable('questions').getOne({
        _id: req.params.question,
        creator: req.params.username.toLowerCase()
      })
      if (!question) {
        return res.status(404).send({
          message: 'Question not found.'
        })
      }
      res.status(200).send(question)
    }
  ],
  delete: [
    auth.basic(true),
    async (req, res, next) => {
      if (req.parsedToken.username.toLowerCase() !== req.params.username.toLowerCase()) {
        return res.status(403).send({
          message: `You don't have an access to do this job.`
        })        
      }
      next()
    }, async (req, res, next) => {
      const poll = await database.getTable('questions').getOne({
        _id: req.params.question,
        creator: req.params.username.toLowerCase()
      })
      if (!question) {
        return res.status(404).send({
          message: 'Question not found.'
        })
      }
      next()
    }, async (req, res) => {
      try {
        await database.getTable('questions').remove({
          _id: req.params.question
        })
        res.status(204).send()
      } catch (e) {
        return res.status(404).send({
          message: 'Poll not found.'
        })  
      }
    }
  ]
}