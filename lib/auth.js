const jwt = require('jsonwebtoken')

module.exports = {
  basic: (req, res, next) => {
    const token = req.headers.authorization || req.cookies.authorization || null;
    if (!token) {
      return res.status(401).send({
        result: false,
        message: 'Authorization field is missing'
      })
    }
    let parsed = token
    if(token.indexOf('bearer') === 0){
      parsed = token.substr(7, token.length-1);
    }
    jwt.verify(parsed, JWT_SECRET, {
        ignoreNotBefore: true
    }, (err, decoded) => {
        if( err ){
          return res.status(401).send({
            result: false,
            message: 'Authorization field is wrong'
          })
        }
        req.parsedToken = decoded
        next()
    });
  },
  userEqual: (username) => {
    return (req, res, next) => {
      if (req.parsedToken.username === username) {
        return next()
      }
      res.status(403).send({
        result: false,
        message: 'You dont have an access to this section'
      })
    }
  },
  sign: (data) => {
    return jwt.sign(data, JWT_SECRET, {
      algorithm: 'HS256',
      expiresIn: 1000 * 60 * 60 * 24 * 30
    })
  }

}