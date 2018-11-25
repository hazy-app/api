const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const serverAddress = () => {
  return (req, res, next) => {
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
    req.$serverAddress = `${protocol}://${req.get('host')}`
    next()
  }
}

module.exports = [
  cors(),
  bodyParser.urlencoded({ extended: true }),
  bodyParser.json(),
  cookieParser(),
  serverAddress()
]