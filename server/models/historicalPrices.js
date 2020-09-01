/**
 * Model for quotes
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let historicalPricesSchema = new Schema({
  symbol: {type: String, required: true},
  data: String,
  lastUpdated: Date
});

const HistoricalPrices = mongoose.model('HistoricalPrices', historicalPricesSchema);

module.exports = HistoricalPrices;
