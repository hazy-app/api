module.exports = {
  username: {
    type: String,
    required: true,
    unique: true,
    dropDups: true
  },
  password: { // hashed
    type: String,
    required: true
  },
  password_hint: {
    type: String
  },
  fcmTokens: {
    type: Array,
    default: []
  },
  create_date: {
    type: Date
  }
}
