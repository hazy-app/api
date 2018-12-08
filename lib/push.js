const axios = require('axios')

module.exports.send = async (fcmTokens = [], data = {}) => {
  if (!fcmTokens || !fcmTokens.length) {
    return
  }
  try {
    const response = await axios.post(`https://fcm.googleapis.com/fcm/send`, {
      registration_ids: fcmTokens,
      data
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `key=${FIREBASE_SERVER_KEY}`
      }
    })
    console.log(response.data)
    const badTokenIndexes = (response.data.results || []).map((x, i) => x.error ? i : undefined).filter(x => typeof x !== 'undefined')
    if (badTokenIndexes.length) {
      return fcmTokens.filter((x, i) => badTokenIndexes.indexOf(i) !== -1)
    } 
    return []
  } catch (e) {
    console.log(e)
  }
}