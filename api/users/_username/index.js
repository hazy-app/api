module.exports = {
  get: async (req, res) => {
    const data = await database.getTable('users').getOne({
      username: req.params.username.toLowerCase()
    })

    if (!data) {
      return res.status(404).send({
        message: 'User not found'
      })
    }
    res.send({
      username: data.username,
      create_date: data.create_date
    })
  }
}