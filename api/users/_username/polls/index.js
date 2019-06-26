const Modela = require('modela')
const path = require('path')
const auth = require(path.resolve(__rootdir, './lib/auth.js'))
const bcrypt = require('bcryptjs')
const postPollModel = require(path.resolve(__rootdir, './schema/post-poll.modela.js'))

module.exports = {
  get: [
    auth.basic(false),
    async (req, res) => {
      const page = req.query.page ? parseInt(req.query.page) : 1
      const per_page = req.query.per_page ? parseInt(req.query.per_page) : 10
      const searchQuery = {
        user: req.params.username.toLowerCase()
      }
      const data = await database.getTable('polls').get(searchQuery, (page * per_page) - per_page, per_page, '-create_date')
      res.send(data)
    }
  ],
  post: [
    auth.recaptcha,
    auth.basic(true),
    async (req, res, next) => {
      if (req.parsedToken.username.toLowerCase() !== req.params.username.toLowerCase()) {
        return res.status(403).send({
          message: 'You dont have an access to do this job.'
        })        
      }
      next()
    }, async (req, res, next) => {
      const model = new Modela(postPollModel)
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
        const data = await database.getTable('polls').save({
          user: req.params.username.toLowerCase(),
          title: req.body.title,
          choices: req.body.choises,
          answers: Array(req.body.choises.length).fill(0),
          create_date: new Date()
        })
        res.send(data)
      } catch (e) {
        console.log(e)
        res.status(500).send('500')
      }
    }
  ]
}