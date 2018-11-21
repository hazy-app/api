const axios = require('axios')
const gitxios = axios.create({
  headers: {
    'Content-Type': 'application/json'
  }
});

module.exports.stepOne = (redirectRoute) => {
  return (req, res) => {
    const redirectUrl = encodeURI(req.$serverAddress + redirectRoute)
    console.log(redirectUrl, 'step one')
    const url = `https://github.com/login/oauth/authorize?client_id=${
      process.env.CLIENT_ID
      }&scope=${'public_repo'}&redirect_uri=${redirectUrl}`;
    res.redirect(url)
  }
}

module.exports.stepTwo = (redirectRoute = '/#') => {
  return async (req, res) => {
    const redirectUrl = encodeURI(`${req.$serverAddress}${redirectRoute}`)
    console.log(redirectUrl, 'step two')
    try {
      const { data } = await gitxios.post('https://github.com/login/oauth/access_token', {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code: req.query.code
      })
      res.cookie('github_token', data)
      res.redirect(redirectUrl)
    } catch (e) {
      res.redirect(redirectUrl)
    }
  }
}