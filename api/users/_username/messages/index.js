const Modela = require('modela')
const path = require('path')
const auth = require(path.resolve(__rootdir, './lib/auth.js'))
const bcrypt = require('bcrypt')
const messageModel = require(path.resolve(__rootdir, './schema/post-message.modela.js'))

module.exports = {
  get: [auth.basic,
  async (req, res, next) => {
    if (req.parsedToken.username !== req.params.username) {
      return res.status(403).send({
        message: 'You dont have an access to this section'
      })
    }
    next()
  }, async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1
    const per_page = req.query.per_page ? parseInt(req.query.per_page) : 10
    const data = await database.getTable('messages').get({
      receiver: req.params.username
    }, (page * per_page) - per_page, per_page, '-create_date')
    res.send(data)
  }],

  post: [
    async (req, res, next) => {
      const receiver = await database.getTable('users').getOne({
        username: req.params.username
      })
  
      if (!receiver) {
        return res.status(404).send({
          message: 'User not found'
        })
      }
      next()
    }, async (req, res) => {
      try {
        const data = await database.getTable('messages').save({
          receiver: req.params.username,
          text: req.body.text,
          create_date: new Date()
        })
        res.send(data)
      } catch (e) {
        res.status(500).send('500')
      }
    }
  ]
}