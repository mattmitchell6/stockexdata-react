/**
 * Model for most recent quote
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let mostRecentQuoteSchema = new Schema({
  symbol: {type: String, required: true},
  data: String,
  lastUpdated: Date
});

const MostRecentQuote = mongoose.model('MostRecentQuote', mostRecentQuoteSchema);

module.exports = BasicInfo;
