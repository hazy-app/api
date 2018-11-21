const express = require('express')
const fs = require('fs')
const path = require('path')
const apiDir = path.resolve(__dirname, '../api')

const getHandler = dir => {
  const hopeDir = path.resolve(dir, './index.js')
  if (!fs.existsSync(hopeDir)) {
    return false
  }
  const handler = require(hopeDir)
  const route = hopeDir
    .replace(apiDir, '')
    .replace('index.js', '')
    .split('/')
    .filter(x => !!x)
    .map(x => x.indexOf('_') === 0 ? x.replace('_', ':') : x)
    .join('/')
  return {
    handler,
    route
  }
}

const getChilds = dir => {
  return fs.readdirSync(dir).filter(x => x !== 'index.js').map(x => path.resolve(dir, x))
}

const api = []
const calcList = dir => {
  const found = getChilds(dir)
  found.forEach(subDir => {
    const absoluteSubDir = path.resolve(dir, subDir)
    const handler = getHandler(absoluteSubDir)
    if (handler !== false) {
      api.push(handler)
    }
    calcList(absoluteSubDir)
  })
}
calcList(apiDir)


const router = express.Router()
api.forEach(endpoint => {
  const route = router.route('/' + endpoint.route)
  for (let method of ['all', 'get', 'post', 'put', 'path']) {
    if (typeof endpoint.handler[method] !== 'undefined') {
      if (endpoint.handler[method] instanceof Array) {
        route[method](...endpoint.handler[method])
      } else {
        route[method](endpoint.handler[method])
      }
    }
  }
})

module.exports = router