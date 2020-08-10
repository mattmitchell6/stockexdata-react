/**
 * Model for basic stock info
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let basicInfoSchema = new Schema({
  symbol: {type: String, required: true},
  info: String,
  logo: String,
  lastUpdated: Date
});

const BasicInfo = mongoose.model('BasicInfo', basicInfoSchema);

module.exports = BasicInfo;
