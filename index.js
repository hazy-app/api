// ENVS
const PORT = process.env.PORT || 3002
const MONGO_URI = process.env.MONGO_URI

/// MODULES
const path = require('path')
global.__rootdir = __dirname
const express = require('express')
const routes = require('./lib/routes.js')
const middlewares = require('./lib/middlewares.js')
const Database = require('./lib/Database.js')
global.database = new Database()

// APP
const init = async () => {
  const dbmsg = await database.connect(MONGO_URI)
  console.log(dbmsg)
  database.setTable('users', require('./schema/users.js'))
  database.setTable('messages', require('./schema/messages.js'))
  const server = express()
  routes.use(...middlewares)
  server.use(routes)
  server.get('/ping', (req, res) => res.send('pong'))
  server.listen(PORT, () => {
    console.log(`Hazy start listening on port ${PORT}!`)
  })
}


// STARTING...
init()

