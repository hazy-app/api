module.exports = {
  username: {
    type: ['string'],
    validator: (v) => {
      if (!/^[a-zA-Z0-9\_\-]+$/.test(v)) {
        return false
      } else if (['unknown', 'anonymous', 'noone', 'hazy', 'hazyapp'].indexOf(v.toLowerCase()) > -1) {
        return false
      }
      return true
    },
    formatter: (v) => v ? v.toLowerCase() : ''
  },
  password: {
    type: ['string'],
    message: v => `password field is missing.`
  },
  password_hint: {
    type: ['string'],
    default: () => ''
  },
  create_date: {
    type: ['date'],
    default: () => new Date()
  }
}
