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

const logger = () => {
  return (req, res, next) => {
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    console.log('')
    console.log('')
    console.info(req.method, fullUrl)
    console.log('HEADERS:', req.headers)
    console.log('BODY:', req.body)
    console.log('')
    console.log('')
    next()
  }
}

module.exports = [
  cors(),
  bodyParser.urlencoded({ extended: true }),
  bodyParser.json(),
  cookieParser(),
  serverAddress(),
  logger(),
]