const Modela = require('modela')
const path = require('path')
const auth = require(path.resolve(__rootdir, './lib/auth.js'))
const bcrypt = require('bcryptjs')
const postQuestionModel = require(path.resolve(__rootdir, './schema/post-question.modela.js'))
const baseQuestion = require(path.resolve(__rootdir, './schema/base-question.js'))

module.exports = {
  get: [
    async (req, res) => {
      const page = req.query.page ? parseInt(req.query.page) : 1
      const per_page = req.query.per_page ? parseInt(req.query.per_page) : 10
      const searchQuery = {
        creator: req.params.username.toLowerCase()
      }
      const data = await database.getTable('questions').get(searchQuery, (page * per_page) - per_page, per_page, '-create_date')
      if (page === 1) {
        data.result.push(Object.assign(baseQuestion, {
          creator: req.params.username.toLowerCase()
        }))
      }
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
      const model = new Modela(postQuestionModel)
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
        const data = await database.getTable('questions').save({
          creator: req.params.username.toLowerCase(),
          text: req.body.text,
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