module.exports = {
  get: async (req, res) => {
    const data = await database.getTable('users').get()
    res.send(data)
  },
  post: async (req, res) => {
    const data = await database.getTable('users').save({
      public_id: '123123',
      private_id: 'salammmm'
    })
    res.send(data)
  }
}