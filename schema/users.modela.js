module.exports = {
  username: {
    type: ['string'],
    validator: (v) => /^[a-zA-Z0-9\_\-]+$/.test(v)
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
