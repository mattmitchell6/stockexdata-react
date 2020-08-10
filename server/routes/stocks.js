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
router.get('/all', async function(req, res) {
  const allStocks = await Company.find({})
  res.send(allStocks);
});

module.exports = router;
