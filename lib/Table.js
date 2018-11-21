const mongoose = require('mongoose')

module.exports = class Table { 
  constructor(name, schema = {}){
    this.name = name;
    this.schema = new mongoose.Schema(schema);
    this.model = mongoose.model(this.name, this.schema);
  }
  getById(id){
    const srchObj = {
      _id: id
    }
    return this.model.findOne(srchObj);
  }
  save(document = {}){
    const row = new this.model(document)
    return row.save()
  }
  async update(id, document = {}){
    let row
    try {
      row = await this.getById(id)
    } catch (e) {
      throw new Error(e)
    }
    try {
      row = Object.assign(row, document)
      return this.save(row)
    } catch (e) {
      throw new Error(e)
    }
  }
  async remove(id){
    let row
    try {
      row = await this.getById(id)
    } catch (e) {
      throw new Error(e)
    }
    try {
      row = Object.assign(row, document)
      return row.remove()
    } catch (e) {
      throw new Error(e)
    }
  }
  async get(searchObj = {}, skip = 0, limit = 20, sort = {}){
    let result
    let totalCount
    try {
      const query = this.model.find(searchObj).skip(skip).limit(limit+1).sort(sort)
      result = await query.exec()
    } catch (e) {
      throw new Error(e)
    }
    // try {
    //   totalCount = await this.model.count(searchObj).exec()
    // } catch (e) {
    //   throw new Error(e)
    // }
    return {
      result,
      totalCount: 0
    }
  }
}
