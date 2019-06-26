const uuidv4 = require('uuid/v4')

module.exports = {
  uuid: {
    type: String,
    default: () => {
      return uuidv4()
    }
  },
  user: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  choices: {
    type: Array,
    required: true
  },
  answers: {
    type: Array,
    required: true,
    default: () => []
  },
  create_date: {
    type: Date
  }
}
