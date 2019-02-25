const path = require('path')
const auth = require(path.resolve(__rootdir, './lib/auth.js'))
const bcrypt = require('bcryptjs')

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
      password_hint: data.password_hint,
      create_date: data.create_date
    })
  },
  patch: [
    auth.basic(true),
    async (req, res, next) => {
      if (
        req.parsedToken.username.toLowerCase() === req.params.username.toLowerCase() ||
        (req.parsedToken.role instanceof Array && req.parsedToken.role.indexOf('admin') > -1)
      ) {
        next()
      } else {
        return res.status(403).send({
          message: 'You dont have an access to do this job.'
        })
      }
    },
    async (req, res, next) => {
      req.body.password = bcrypt.hashSync(req.body.password || '1234', BCRYPT_SALT_ROUNDS)
      next()
    },
    async (req, res, next) => {
      const data = await database.getTable('users').getOne({
        username: req.params.username.toLowerCase()
      })

      if (!data) {
        return res.status(404).send({
          message: 'User not found'
        })
      }
      next()
    },
    async (req, res) => {
      try {
        const data = await database.getTable('users').model.update(
          {
            username: req.params.username.toLowerCase()
          }, 
          {
            password: req.body.password,
            password_hint: req.body.password_hint || 'One, Two, Three and Four?'
          },
          { multi: false }
        )
        return res.send(data)
      } catch (e) {
        console.log(e)
        return res.status(500).send('500')
      }
    }
  ]
}