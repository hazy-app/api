module.exports = {
  receiver: {
    type: ['string']
  },
  text: {
    type: ['string']
  },
  create_date: {
    type: ['date'],
    default: () => new Date()
  }
}
