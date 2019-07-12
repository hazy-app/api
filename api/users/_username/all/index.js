const Modela = require('modela')
const path = require('path')
const auth = require(path.resolve(__rootdir, './lib/auth.js'))
const baseQuestion = require(path.resolve(__rootdir, './schema/base-question.js'))

module.exports = {
  get: [
    auth.basic(false),
    async (req, res) => {
      const page = req.query.page ? parseInt(req.query.page) : 1
      const per_page = req.query.per_page ? parseInt(req.query.per_page) : 10
      const searchQuery = {
        creator: req.params.username.toLowerCase()
      }

      Promise.all([
        database.getTable('polls').model.find(searchQuery).exec(),
        database.getTable('questions').model.find(searchQuery).exec()
      ]).then(data => {
        const all = []
        data[0].forEach(item => {
          all.push({
            type: 'poll',
            create_date: item.create_date,
            creator: item.creator,
            title: item.title,
            _id: item._id,
            uuid: item.uuid,
            answers: item.answers,
            choices: item.choices
          })
        })
        all.push(Object.assign(baseQuestion, {
          creator: req.params.username.toLowerCase(),
          type: 'question'
        }))
        data[1].forEach(item => {
          all.push({
            type: 'question',
            create_date: item.create_date,
            creator: item.creator,
            text: item.text,
            _id: item._id
          })
        })
        all.sort((a, b) => {
          if (a.create_date > b.create_date) {
            return -1;
          } else if (b.create_date > a.create_date) {
            return 1;
          } else {
            return 0;
          }
        })
        res.send(all)
      }).catch(e => {
        res.status(500).send()
        console.log(e)
      })
    }
  ]
}