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
    let companyToAdd;
    let entry;

    // let result = await Company.fuzzySearch('box').limit(10);
    // console.log("search res:");
    // console.log(result);

    for(let i=0; i < companies.length; i++) {
      entry = await Company.findOne({'symbol': companies[i].symbol});
      if(!entry) {
        // add new company to db
        companyToAdd = new Company({
          symbol: companies[i].symbol,
          companyName: companies[i].name
        });
        companyToAdd.save()
        console.log(companies[i].symbol + " added");
      } else {
        console.log(companies[i].symbol + " exists");
        console.log(companies[i].name);
      }
    }

  } catch(error) {
    console.log(error.message);
  }
}
