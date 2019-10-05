// ENVS
global.PORT = process.env.PORT ? parseInt(process.env.PORT) : 3002
global.MONGO_URI = process.env.MONGO_URI
global.BCRYPT_SALT_ROUNDS = process.env.BCRYPT_SALT_ROUNDS ? parseInt(process.env.BCRYPT_SALT_ROUNDS) : 12
global.JWT_SECRET = process.env.JWT_SECRET
global.RECAPTCHA_SITE_KEY = process.env.RECAPTCHA_SITE_KEY
global.RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY
global.FIREBASE_SERVER_KEY = process.env.FIREBASE_SERVER_KEY
global.RECAPTCHA_SKIP_VALUE = process.env.RECAPTCHA_SKIP_VALUE

/// MODULES
global.__rootdir = __dirname
const express = require('express')
const routes = require('./lib/routes.js')
const middlewares = require('./lib/middlewares.js')
const Database = require('./lib/Database.js')
global.push = require('./lib/push.js')
global.database = new Database()

// APP
const init = async () => {
  await database.connect(MONGO_URI)
  console.log('mongo connected')
  database.setTable('users', require('./schema/users.mongo.js'))
  database.setTable('messages', require('./schema/messages.mongo.js'))
  database.setTable('polls', require('./schema/polls.mongo.js'))
  database.setTable('questions', require('./schema/questions.mongo.js'))
  const server = express()
  server.use(...middlewares)
  server.use(routes)
  server.get('/users/:username/avatar.jpg', require('./api/users/_username/index.js').getAvatar)
  server.get('/ping', (req, res) => res.send('pong'))
  server.listen(PORT, () => {
    console.log(`Hazy start listening on port ${PORT}!`)
  })
}


// STARTING...
init()

