const Modela = require('modela')
const path = require('path')
const auth = require(path.resolve(__rootdir, './lib/auth.js'))
const bcrypt = require('bcryptjs')
const messageModel = require(path.resolve(__rootdir, './schema/post-message.modela.js'))

module.exports = {
  get: [
    async (req, res) => {
      const message = await database.getTable('messages').getOne({
        uuid: req.params.message,
        receiver: req.params.username.toLowerCase()
      })
      if (!message) {
        return res.status(404).send({
          message: 'Message not found.'
        })
      }
      res.status(200).send(message)
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
      const message = await database.getTable('messages').getOne({
        uuid: req.params.message,
        receiver: req.params.username.toLowerCase()
      })
      if (!message) {
        return res.status(404).send({
          message: 'Message not found.'
        })
      }
      next()
    }, async (req, res) => {
      try {
        await database.getTable('messages').remove({
          uuid: req.params.message
        })
        res.status(204).send()
      } catch (e) {
        return res.status(404).send({
          message: 'Message not found.'
        })  
      }
    }
  ],
  put: [
    auth.basic(true),
    async (req, res, next) => {
      if (req.parsedToken.username.toLowerCase() !== req.params.username.toLowerCase()) {
        return res.status(403).send({
          message: 'You dont have an access to do this job.'
        })        
      }
      next()
    }, async (req, res, next) => {
      const message = await database.getTable('messages').getOne({
        uuid: req.params.message,
        receiver: req.params.username.toLowerCase(),
      })
      if (!message) {
        return res.status(404).send({
          message: 'Message not found.'
        })
      }
      next()
    },
    async (req, res) => {
      try {
        const editingData = {}
        if (typeof req.body.reply !== 'undefined') {
          editingData.reply = req.body.reply
          editingData.reply_date = new Date()
        }
        if (typeof req.body.public !== 'undefined') {
          editingData.public = !!req.body.public
        }
        const data = await database.getTable('messages').model.update(
          {
            uuid: req.params.message.toLowerCase()
          }, 
          editingData,
          { multi: false }
        )

        res.send(data)
      } catch (e) {
        console.log(e)
        res.status(500).send('500')
      }
    }
  ]
}