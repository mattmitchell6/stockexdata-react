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
    let allCompanies = await IEX.getAllStocks();
    let dbCompanies = await Company.find()
    let entry;
    let dbExists;
    let numberAdded = 0;
    let firstAll = allCompanies[0]
    let firstDb = dbCompanies[0]

    for (let i = 0; i < allCompanies.length; i++) {
      // entry = await Company.findOne({'symbol': companies[i].symbol});

      dbExists = dbCompanies.some(item => item._doc.symbol === allCompanies[i].symbol);

      // only add ETFs and Common Stocks that are not already in db
      if ((allCompanies[i].type === "cs" || allCompanies[i].type === "et") && !dbExists) {

        addedCompany = await Company.findOneAndUpdate(
          { 'symbol': allCompanies[i].symbol.toUpperCase() },
          {
            symbol: allCompanies[i].symbol.toUpperCase(),
            companyName: allCompanies[i].name,
            stockType: allCompanies[i].type
          },
          { upsert: true, new: true });
        console.log(addedCompany.symbol + " added");
        numberAdded++;
      }
    }

    console.log(`Added ${numberAdded} new companies.`)
    process.exit(1);
  } catch (error) {
    console.log(error.message);
  }
}
