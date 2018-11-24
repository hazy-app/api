module.exports = {
  username: {
    type: ['string']
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
