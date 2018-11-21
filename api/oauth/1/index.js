const path = require('path')
const oauth = require(path.resolve(__rootdir, './lib/oauth.js'))

module.exports = {
  get: oauth.stepOne('/oauth/2')
}