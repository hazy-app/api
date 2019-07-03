const Modela = require('modela')
const path = require('path')
const auth = require(path.resolve(__rootdir, './lib/auth.js'))
const utils = require(path.resolve(__rootdir, './lib/utils.js'))
const sha256 = require('js-sha256')

module.exports = {
  get: [
    async (req, res) => {
      const poll = await database.getTable('polls').getOne({
        uuid: req.params.poll,
        creator: req.params.username.toLowerCase()
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
          message: `You don't have an access to do this job.`
        })        
      }
      next()
    }, async (req, res, next) => {
      const poll = await database.getTable('polls').getOne({
        uuid: req.params.poll,
        creator: req.params.username.toLowerCase()
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
          message: 'Poll not found.'
        })  
      }
    }
  ],
  patch: [
    auth.recaptcha,
    auth.basic(false),
    async (req, res, next) => {
      const poll = await database.getTable('polls').getOne({
        uuid: req.params.poll,
        creator: req.params.username.toLowerCase(),
      })
      if (!poll) {
        return res.status(404).send({
          message: 'Poll not found.'
        })
      }
      req.poll = poll
      next()
    }, async (req, res, next) => {
      if (typeof req.body.choice !== 'number') {
        return res.status(401).send({
          message: 'You should pass your `choice` with number type in request body.'
        })
      }
      if (req.body.choice >= req.poll.choices.length || req.body.choice < 0) {
        return res.status(401).send({
          message: `Your \`choice\` must be from 0 to ${req.poll.choices.length - 1}.`
        })
      }
      if (!req.headers['x-browser-fingerprint']) {
        return res.status(403).send({
          message: `You dont't have an access to do this job.`
        })
      }
      const ip = req.connection.remoteAddress || req.headers['x-forwarded-for']
      // we wont keep real ip address!!!
      // req.headers['x-browser-fingerprint'] hashed before (inside web-app)
      req.userFingerprints = [`${sha256(ip)}-${utils.roundedHourTime(10)}` , `${req.headers['x-browser-fingerprint']}-${utils.roundedHourTime(240)}`]
      next()
    }, async (req, res, next) => {
      if (
        req.parsedToken.username &&
        (req.parsedToken.username.toLowerCase() === req.params.username.toLowerCase() ||
        (req.parsedToken.role instanceof Array && req.parsedToken.role.indexOf('admin') > -1))
      ) {
        next()
      } else {
        const poll = await database.getTable('polls').getOne({
          uuid: req.params.poll,
          creator: req.params.username.toLowerCase(),
          participants: {
            $in: req.userFingerprints
          }
        })
        if (poll) {
          return res.status(403).send({
            message: `It seems you voted before. Please try again later.`
          })
        }
        next()
      }
    }, async (req, res) => {
      try {
        const updateModel = {
          $inc: {},
          $push: {}
        }
        updateModel.$inc[`answers.${req.body.choice}`] = 1
        updateModel.$push.participants = req.userFingerprints
        const data = await database.getTable('polls').model.updateOne(
          {
            uuid: req.params.poll.toLowerCase()
          }, 
          updateModel
        )

        res.send(data)
      } catch (e) {
        console.log(e)
        res.status(500).send('500')
      }
    }
  ]
}