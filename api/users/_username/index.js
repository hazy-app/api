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
      _id: data._id,
      username: data.username,
      gravatar: data.gravatar || undefined,
      password_hint: data.password_hint,
      create_date: data.create_date
    })
  },
  delete: [
    auth.basic(true),
    async (req, res, next) => {
      if (
        (req.parsedToken.username.toLowerCase() !== req.params.username.toLowerCase() &&
        (!(req.parsedToken.role instanceof Array) || req.parsedToken.role.indexOf('admin') === -1))
      ) {
        return res.status(403).send({
          message: `You don't have an access to do this job.`
        })        
      }
      next()
    }, async (req, res, next) => {
      const data = await database.getTable('users').getOne({
        username: req.params.username.toLowerCase()
      })
  
      if (!data) {
        return res.status(404).send({
          message: 'User not found'
        })
      }
      next()
    }, async (req, res) => {
      try {
        await database.getTable('users').remove({
          username: req.params.username.toLowerCase()
        })
        await database.getTable('messages').remove({
          receiver: req.params.username.toLowerCase()
        })
        await database.getTable('polls').remove({
          creator: req.params.username.toLowerCase()
        })
        await database.getTable('questions').remove({
          creator: req.params.username.toLowerCase()
        })
        res.status(204).send()
      } catch (e) {
        return res.status(404).send({
          message: 'User not found.'
        })  
      }
    }
  ],
  patch: [
    auth.basic(true),
    async (req, res, next) => {
      if (
        req.parsedToken.username &&
        (req.parsedToken.username.toLowerCase() === req.params.username.toLowerCase() ||
        (req.parsedToken.role instanceof Array && req.parsedToken.role.indexOf('admin') > -1))
      ) {
        next()
      } else {
        return res.status(403).send({
          message: 'You dont have an access to do this job.'
        })
      }
    },
    async (req, res, next) => {
      if (typeof req.body.password !== 'undefined') {
        req.body.password = bcrypt.hashSync(req.body.password, BCRYPT_SALT_ROUNDS)
      }
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
        const editingData = {}
        if (typeof req.body.password !== 'undefined') {
          editingData.password = req.body.password
        }
        if (typeof req.body.password_hint !== 'undefined') {
          editingData.password_hint = req.body.password_hint
        }
        if (typeof req.body.gravatar !== 'undefined') {
          editingData.gravatar = req.body.gravatar
        }

        const data = await database.getTable('users').model.updateOne(
          {
            username: req.params.username.toLowerCase()
          }, 
          editingData,
          { multi: false }
        )
        const tokenObject = {
          username: req.params.username.toLowerCase(),
          gravatar: editingData.gravatar,
          role: []
        }
        // soooo hardcode!
        if (tokenObject.username === 'nainemom') {
          tokenObject.role.push('admin')
        }
        const token = await auth.sign(tokenObject)
        res.send(`bearer ${token}`)
      } catch (e) {
        console.log(e)
        return res.status(500).send('500')
      }
    }
  ],
  // custom
  // /avatar.jpg
  getAvatar: [
    async (req, res, next) => {
      try {
        const user = await database.getTable('users').getOne({
          username: req.params.username.toLowerCase()
        })
        if (!user.gravatar) {
          throw new Error()
        }
        return res.status(301).redirect(`https://www.gravatar.com/avatar/${user.gravatar}?size=${req.query.size || 128}`)
      } catch (e) {
        return res.sendFile(path.resolve(__rootdir, './assets/default-profile-picture.jpg'))
      }
    }
  ]
}