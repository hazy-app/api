module.exports = {
  delete: [async (req, res) => {
    try {
      await database.getTable('users').model.updateMany(
        {
          fcmTokens: req.params.fcmToken
        }, 
        {
          $pullAll: {
            fcmTokens: [req.params.fcmToken]
          }
        },
        { multi: true }
      )
      res.send('Done!')
    } catch (e) {
      res.status(500).send(e)
    }
  }],
  get: [async (req, res) => {
    try {
      const user = await database.getTable('users').getOne({
        username: req.params.username.toLowerCase(),
        fcmTokens: req.params.fcmToken
      })
      if (user) {
        res.send({
          isExists: true
        })
      } else {
        throw '404'
      }
    } catch (e) {
      res.status(404).send({
        isExists: false
      })
    }
  }]
}