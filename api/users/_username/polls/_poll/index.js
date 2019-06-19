const Modela = require('modela')
const path = require('path')
const auth = require(path.resolve(__rootdir, './lib/auth.js'))
const bcrypt = require('bcryptjs')
const messageModel = require(path.resolve(__rootdir, './schema/post-message.modela.js'))

module.exports = {
  get: [
    async (req, res) => {
      const poll = await database.getTable('polls').getOne({
        uuid: req.params.message,
        user: req.params.username.toLowerCase()
      })
      if (!poll) {
        return res.status(404).send({
          message: 'Poll not found.'
        })
      }
      res.status(200).send(poll)
    }
  ],
  delete: [
    auth.basic(true),
    async (req, res, next) => {
      if (req.parsedToken.username.toLowerCase() !== req.params.username.toLowerCase()) {
        return res.status(403).send({
          message: 'You dont have an access to do this job.'
        })        
      }
      next()
    }, async (req, res, next) => {
      const poll = await database.getTable('polls').getOne({
        uuid: req.params.poll,
        user: req.params.username.toLowerCase()
      })
      if (!poll) {
        return res.status(404).send({
          message: 'Poll not found.'
        })
      }
      next()
    }, async (req, res) => {
      try {
        await database.getTable('polls').remove({
          uuid: req.params.poll
        })
        res.status(204).send()
      } catch (e) {
        return res.status(404).send({
          message: 'Message not found.'
        })  
      }
    }
  ],
  patch: [
    auth.basic(true),
    async (req, res, next) => {
      if (req.parsedToken.username.toLowerCase() !== req.params.username.toLowerCase()) {
        return res.status(403).send({
          message: 'You dont have an access to do this job.'
        })        
      }
      next()
    }, async (req, res, next) => {
      const poll = await database.getTable('poll').getOne({
        uuid: req.params.message,
        user: req.params.username.toLowerCase(),
      })
      if (!poll) {
        return res.status(404).send({
          message: 'Poll not found.'
        })
      }
      req.poll = poll
      next()
    }, async (req, res, next) => {
      if (!req.body.choice) {
        return res.status(401).send({
          message: 'You should pass your `choice` in body.'
        })
      }
      if (typeof req.body.choice !== 'number') {
        return res.status(401).send({
          message: '`choice` is number!'
        })
      }
      if (req.body.choice >= req.poll.choices.length || req.body.choice < 0) {
        return res.status(401).send({
          message: `Your \`choice\` must be from 0 to ${req.poll.choices.length - 1}.`
        })
      }
      next()
    },
    async (req, res) => {
      try {
        const data = await database.getTable('polls').model.update(
          {
            uuid: req.params.poll.toLowerCase()
          }, 
          {
            $inc: { "answers.$[element]": 1 }
          },
          {
            arrayFilters: [ { element: req.body.choice } ],
            multi: false
          }
        )

        res.send(data)
      } catch (e) {
        console.log(e)
        res.status(500).send('500')
      }
    }
  ]
}