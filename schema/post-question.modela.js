module.exports = {
  text: {
    type: ['string'],
    validator: val => val.length >= 4 && val.length <= 120,
    message: () => 'Your text field should have more than 4 and less than 120 characters.'
  }
}
