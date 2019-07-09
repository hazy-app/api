const path = require('path')
const Modela = require('modela')
const bcrypt = require('bcryptjs')
const auth = require(path.resolve(__rootdir, './lib/auth.js'))
const authModel = require(path.resolve(__rootdir, './schema/post-auth.modela.js'))

module.exports = {
  post: [
    auth.recaptcha,
    async (req, res, next) => {
      const model = new Modela(authModel)
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
      const user = await database.getTable('users').getOne({
        username: req.body.username
      })
      if (!user) {
        return res.status(404).send({
          result: false,
          message: 'User not found'
        })
      }

      const check = bcrypt.compareSync(req.body.password, user.password)
      if (!check) {
        return res.status(401).send({
          result: false,
          message: 'Wrong password'
        })
      }
      try {
        const tokenObject = {
          username: user.username,
          gravatar: user.gravatar || '',
          role: []
        }
        // soooo hardcode!
        if (req.body.username === 'nainemom') {
          tokenObject.role.push('admin')
        }
        const token = await auth.sign(tokenObject)
        res.send(`bearer ${token}`)
      } catch (e) {
        console.log(e)
        res.status(500).send(e)
      }
    }
  ]
}