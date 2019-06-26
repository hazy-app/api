const Modela = require('modela')
const path = require('path')
const auth = require(path.resolve(__rootdir, './lib/auth.js'))
const bcrypt = require('bcryptjs')
const messageModel = require(path.resolve(__rootdir, './schema/post-message.modela.js'))

module.exports = {
  get: [
    auth.basic(false),
    async (req, res) => {
      const page = req.query.page ? parseInt(req.query.page) : 1
      const per_page = req.query.per_page ? parseInt(req.query.per_page) : 10
      const searchQuery = {
        receiver: req.params.username.toLowerCase()
      }
      if (!req.parsedToken.username || req.parsedToken.username.toLowerCase() !== req.params.username.toLowerCase()) {
        searchQuery.public = true
      }
      console.log(searchQuery)
      const data = await database.getTable('messages').get(searchQuery, (page * per_page) - per_page, per_page, '-create_date')
      res.send(data)
    }
  ],
  post: [
    auth.recaptcha,
    async (req, res, next) => {
      const receiver = await database.getTable('users').getOne({
        username: req.params.username.toLowerCase()
      })
      if (!receiver) {
        return res.status(404).send({
          message: 'User not found'
        })
      }
      req.receiver = receiver
      next()
    }, async (req, res) => {
      try {
        const data = await database.getTable('messages').save({
          receiver: req.params.username.toLowerCase(),
          text: req.body.text,
          reply: null,
          reply_date: null,
          public: false,
          create_date: new Date()
        })
        res.send(data)

        // Send push notification to receiver
        if (req.receiver.fcmTokens && req.receiver.fcmTokens.length) {
          push.send(req.receiver.fcmTokens, data).then(badTokens => {
            if (!badTokens.length) {
              return
            }
            // Delete invalid or expired tokens from database
            database.getTable('users').model.updateOne(
              {
                username: req.params.username.toLowerCase()
              }, 
              {
                $pullAll: {
                  fcmTokens: badTokens
                }
              },
              { multi: false },
              err => {}
            )
          })
          
        }
      } catch (e) {
        console.log(e)
        res.status(500).send('500')
      }
    }
  ]
}