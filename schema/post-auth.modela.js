module.exports = {
  username: {
    type: ['string'],
    formatter: (v) => v ? v.toLowerCase() : ''
  },
  password: {
    type: ['string']
  }
}
