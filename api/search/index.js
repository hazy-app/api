const path = require('path')
const auth = require(path.resolve(__rootdir, './lib/auth.js'))
const Modela = require('modela')
const bcrypt = require('bcryptjs')
const userModel = require(path.resolve(__rootdir, './schema/users.modela.js'))

module.exports = {
  get: [
    auth.basic(false),
    async (req, res, next) => {
      if (!req.query.q || req.query.q.length < 3) {
        return res.status(401).send({
          message: 'Your `q` query param should be fill with atleast 3 characters.'
        }) 
      }
      next()
    }, async (req, res, next) => {
      const searchQuery = {
        username: {
          $regex: req.query.q.toLowerCase()
        }
      }
      const data = await database.getTable('users').get(searchQuery, 0, 10, 'create_date')
      const result = data.result.map(user => ({
        _id: user._id,
        username: user.username,
        highlighted: '@' + user.username.replace(req.query.q.toLowerCase(), `<u>${req.query.q.toLowerCase()}</u>`),
        create_date: user.create_date
      })).filter(user => user.username !== req.parsedToken.username)
      res.send(result)
    }
  ]
}