const mongoose = require('mongoose')

module.exports = class Table { 
  constructor(name, schema = {}){
    this.name = name;
    this.schema = new mongoose.Schema(schema);
    this.model = mongoose.model(this.name, this.schema);
  }
  getOne(srchObj){
    return this.model.findOne(srchObj);
  }
  save(document){
    const row = new this.model(document)
    return row.save()
  }
  async update(id, document = {}){
    let row
    try {
      row = await this.getOne({
        _id: id
      })
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
  async remove(srchObj){
    let row
    try {
      row = await this.getOne(srchObj)
    } catch (e) {
      throw new Error(e)
    }
    try {
      return row.remove()
    } catch (e) {
      throw new Error(e)
    }
  }
  async get(searchObj = {}, skip = 0, limit = 20, sort = {}){
    let result
    let totalCount
    try {
      const query = this.model.find(searchObj).skip(skip).limit(limit).sort(sort)
      result = await query.exec()
    } catch (e) {
      throw new Error(e)
    }
    try {
      totalCount = await this.model.countDocuments(searchObj).exec()
    } catch (e) {
      throw new Error(e)
    }
    return {
      result,
      hasNext: (skip + result.length) < totalCount,
      totalPages: Math.ceil(totalCount / limit),
      totalCount
    }
  }
}
