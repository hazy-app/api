module.exports = {
  post: [async (req, res, next) => {
    // this is just works for appending fcm token
    if (!req.body.fcmToken) {
      return res.status(400).send({
        message: 'Bad request'
      })
    }
    next()
  }, async (req, res) => {
    try {
      await database.getTable('users').model.update(
        {
          username: req.params.username.toLowerCase()
        }, 
        {
          $push: {
            fcmTokens: req.body.fcmToken
          }
        },
        { multi: false }
      )
      res.send('Done!')
    } catch (e) {
      res.status(500).send(e)
    }
  }]
}