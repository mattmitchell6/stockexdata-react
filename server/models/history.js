/**
 * Model for quotes
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let historySchema = new Schema({
  symbol: {type: String, required: true},
  data: String,
  lastUpdated: Date
});

const History = mongoose.model('History', historySchema);

module.exports = History;
