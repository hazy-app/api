module.exports = {
  get: [
    async (req, res) => {
      const usersCount = await database.getTable('users').model.count({}).exec()
      const messagesCount = await database.getTable('messages').model.count({}).exec()
      const repliesCount = await database.getTable('messages').model.count({
        reply_date: {
          $ne: null
        }
      }).exec()
      res.send({
        total_messages: messagesCount + repliesCount,
        total_users: usersCount
      })
    }
  ],
}