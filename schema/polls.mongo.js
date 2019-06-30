const uuidv4 = require('uuid/v4')

module.exports = {
  uuid: {
    type: String,
    default: () => {
      return uuidv4()
    }
  },
  creator: {
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
  participants: {
    type: Array,
    required: true,
    default: () => []
  },
  active: {
    type: Boolean,
    default: () => true
  },
  public: {
    type: Boolean,
    default: () => true
  },
  create_date: {
    type: Date
  }
}
