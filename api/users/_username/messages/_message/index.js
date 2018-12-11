const Modela = require('modela')
const path = require('path')
const auth = require(path.resolve(__rootdir, './lib/auth.js'))
const bcrypt = require('bcryptjs')
const messageModel = require(path.resolve(__rootdir, './schema/post-message.modela.js'))

module.exports = {
  get: [
    async (req, res) => {
      try {
        const message = await database.getTable('messages').getOne({
          _id: req.params.message
        })
        if (message.receiver.toLowerCase() !== req.params.username.toLowerCase()) {
          throw 404
        }
        res.status(200).send(message)
      } catch (e) {
        return res.status(404).send({
          message: 'Message not found.'
        })  
      }
    }
  ],
  delete: [
    auth.basic,
    async (req, res, next) => {
      if (req.parsedToken.username.toLowerCase() !== req.params.username.toLowerCase()) {
        return res.status(403).send({
          message: 'You dont have an access to delete this message'
        })        
      }
      next()
    }, async (req, res) => {
      try {
        await database.getTable('messages').remove({
          _id: req.params.message
        })
        res.status(204).send()
      } catch (e) {
        return res.status(404).send({
          message: 'Message not found.'
        })  
      }
    }
  ]
}