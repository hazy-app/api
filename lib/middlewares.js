const path = require('path')
const express = require('express')
const cookieParser = require('cookie-parser')

const serverAddress = () => {
  return (req, res, next) => {
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
    req.$serverAddress = `${protocol}://${req.get('host')}`
    next()
  }
}

module.exports = [
  cookieParser(),
  serverAddress()
]