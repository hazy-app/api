const uuidv4 = require('uuid/v4')

module.exports = {
  creator: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  create_date: {
    type: Date
  }
}
