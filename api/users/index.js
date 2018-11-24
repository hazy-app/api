const path = require('path')
const Modela = require('modela')
const bcrypt = require('bcrypt')
const userModel = require(path.resolve(__rootdir, './schema/users.modela.js'))

module.exports = {
  post: [
    async (req, res, next) => {
      if (req.body.password) {
        req.body.password = bcrypt.hashSync(req.body.password, BCRYPT_SALT_ROUNDS)
      }
      next()
    }, async (req, res, next) => {
      const model = new Modela(userModel)
      model.$set(req.body).$clean()
      const check = model.$check()
      if (!check.result) {
        return res.status(400).send(Object.assign(check, {
          message: 'Bad request'
        }))
      }
      req.body = model.$export()
      next()
    }, async (req, res) => {
      try {
        const data = await database.getTable('users').save(req.body)
        res.send(data)
      } catch (e) {
        res.status(400).send({
          result: false,
          message: 'Dublicate error',
          errors: {
            username: 'Username cannot be dublicate.'
          }
        })
      }
    }
  ]
}