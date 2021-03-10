require('dotenv').config();
const mongoose = require('mongoose');

const IEX = require('../server/service/iex/iex');
const Company = require('../server/models/companies');

// mongoose connect
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
 });

seed();

// seed "Companies" model
async function seed() {
  try {
    let companies = await IEX.getAllStocks();
    let addedCompany;
    // let entry;

    for(let i = 0; i < companies.length; i++) {
      // entry = await Company.findOne({'symbol': companies[i].symbol});

      // only add ETFs and Common Stocks to list
      if(companies[i].type === "cs" || companies[i].type === "et") {
        addedCompany = await Company.findOneAndUpdate(
          { 'symbol': companies[i].symbol.toUpperCase() },
          {
            symbol: companies[i].symbol.toUpperCase(),
            companyName: companies[i].name,
            stockType: companies[i].type
          },
          { upsert: true, new: true});
        console.log(addedCompany.symbol + " added");
      }
    }

  } catch(error) {
    console.log(error.message);
  }
}
