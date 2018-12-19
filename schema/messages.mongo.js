const uuidv4 = require('uuid/v4')

module.exports = {
  _id: {
    type: String,
    default: () => {
      return uuidv4()
    }
  },
  receiver: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  reply: {
    type: String
  },
  create_date: {
    type: Date
  },
  reply_date: {
    type: Date
  }
}
