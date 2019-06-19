module.exports = {
  title: {
    type: ['string']
  },
  choices: {
    type: ['array'],
    default: () => [],
    validator: val => val.length >= 2,
    message: () => 'You should have atleast 2 item in array.'
  }
}
