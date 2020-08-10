/**
 * Model for news
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let newsSchema = new Schema({
  symbol: {type: String, required: true},
  data: String,
  lastUpdated: Date
});

const News = mongoose.model('News', newsSchema);

module.exports = News;
