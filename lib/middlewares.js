const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const serverAddress = () => {
  return (req, res, next) => {
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
    req.$serverAddress = `${protocol}://${req.get('host')}`
    next()
  }
}

module.exports = [
  bodyParser.urlencoded({ extended: true }),
  bodyParser.json(),
  cookieParser(),
  serverAddress()
]