/**
 * Stock api
 */
const router = require('express').Router();

// const Stock = require('../models/stocks');
// const User = require('../models/users');
const Company = require('../models/companies');
const IEX = require('../service/iex/iex');
// const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn('/');


/**
 *  test route
 */
router.get('/', async function(req, res) {
  res.send(200);
});

/**
 * get all available stocks for filtering
 */
router.get('/fetchall', async function(req, res) {
  const allStocks = await Company.find({})
  res.send(allStocks);
});

/**
 * get stock quote
 */
router.get('/:symbol/quote', async function(req, res) {
  try {
    const quote = await IEX.getQuote(req.params.symbol)
    res.send(quote.data);
  } catch(e) {
    console.log(e.message);
    res.sendStatus(500)
  }
});

module.exports = router;
