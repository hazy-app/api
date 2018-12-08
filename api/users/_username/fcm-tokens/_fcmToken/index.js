module.exports = {
  delete: [async (req, res) => {
    try {
      await database.getTable('users').model.update(
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
  }]
}