/**
 * Model for all income data
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let incomeSchema = new Schema({
  symbol: {type: String, required: true},
  quarterlyIncomeData: String,
  annualIncomeData: String,
  lastReported: Date
});

const Income = mongoose.model('Income', incomeSchema);

module.exports = Income;
