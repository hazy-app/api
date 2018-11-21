const Table = require('./Table.js')
const mongoose = require('mongoose')

module.exports = class Database {
  constructor(){
    this._tables = {}
  }
  connect(fullUri){
    return new Promise((resolve, reject) => {
      mongoose.connect(fullUri, {
        useNewUrlParser: true
      })
      mongoose.connection.on('error', reject);
      mongoose.connection.on('open', resolve);
    })
  }

  setTable(name, schema) {
    this._tables[name] = new Table(name, schema)
  }

  getTable(name) {
    if (!this._tables[name]) {
      throw new Error(`there is no ${name} table!`)
    }
    return this._tables[name]
  }

}