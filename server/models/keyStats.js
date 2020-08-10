/**
 * Model for key stats
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let keyStatsSchema = new Schema({
  symbol: {type: String, required: true},
  data: String,
  lastUpdated: Date
});

const KeyStats = mongoose.model('KeyStats', keyStatsSchema);

module.exports = KeyStats;
