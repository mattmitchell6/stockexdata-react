/**
 * Stock api
 */
const router = require('express').Router();
const moment = require('moment');

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
    res.send(quote);
  } catch(e) {
    console.log(e);
    res.sendStatus(500)
  }
});

/**
 * get basic stock info
 */
router.get('/:symbol/basicinfo', async function(req, res) {
  try {
    const basicInfo = await IEX.getBasicInfo(req.params.symbol)
    res.send(basicInfo);
  } catch(e) {
    console.log(e);
    res.sendStatus(500)
  }
});

/**
 * get key stats and logo
 */
router.get('/:symbol/keystats', async function(req, res) {
  try {
    const basicInfo = await IEX.getBasicInfo(req.params.symbol)
    const keyStats = await IEX.getKeyStats(req.params.symbol)

    res.send({
      logo: basicInfo.logo,
      keyStats: keyStats
    });
  } catch(e) {
    console.log(e);
    res.sendStatus(500)
  }
});

/**
 * get news
 */
router.get('/:symbol/news', async function(req, res) {
  try {
    const news = await IEX.getNews(req.params.symbol)

    res.send({
      news: news
    });
  } catch(e) {
    console.log(e);
    res.sendStatus(500)
  }
});

/**
 * get historical stock prices
 */
router.get('/:symbol/historicalprices', async function(req, res) {
  try {
    const historicalPrices = await IEX.getHistoricalPrices(req.params.symbol)
    const latestQuote = await IEX.getQuote(req.params.symbol)
    let prices = [], dates = [];

    // return appropriate date range values
    for(i = 0; i < historicalPrices.length; i++) {
      dates.push(historicalPrices[i].date);
      prices.push(historicalPrices[i].close);
    }

    // append most recent quote price
    if(moment(latestQuote.latestUpdate).isAfter(historicalPrices[historicalPrices.length - 1].date, 'day')) {
      dates.push(moment(latestQuote.latestUpdate).format("YYYY-MM-DD"))
      prices.push(latestQuote.latestPrice)
    }

    res.send({dates: dates, prices: prices});
  } catch(e) {
    console.log(e);
    res.sendStatus(500)
  }
});

/**
 * get earnings data
 */
router.get('/:symbol/earnings', async function(req, res) {
  let fiscalPeriods = {quarterly: [], annual: []},
    totalRevenueData = {quarterly: [], annual: []},
    netIncomeData = {quarterly: [], annual: []},
    earningsActual = [],
    earningsEstimate = [];

  try {
    const earnings = await IEX.getEarnings(req.params.symbol)

    // populate quarterly income data
    for(let i = 0; i < earnings.earningsData.length; i++) {
      fiscalPeriods.quarterly.push(earnings.earningsData[i].fiscalPeriod);
      totalRevenueData.quarterly.push(earnings.quarterlyIncomeData[i].totalRevenue);
      netIncomeData.quarterly.push(earnings.quarterlyIncomeData[i].netIncome);
    }

    // populate annual income data
    for(i = 0; i < earnings.annualIncomeData.length; i++) {
      fiscalPeriods.annual.push(earnings.annualIncomeData[i].reportDate);
      totalRevenueData.annual.push(earnings.annualIncomeData[i].totalRevenue);
      netIncomeData.annual.push(earnings.annualIncomeData[i].netIncome);
    }

    // populate quarterly EPS data
    for(i = 0; i < earnings.earningsData.length; i++) {
      earningsActual.push(earnings.earningsData[i].actualEPS);
      earningsEstimate.push(earnings.earningsData[i].consensusEPS);
    }

    res.send({
      fiscalPeriods: fiscalPeriods,
      income: {
        totalRevenueData: totalRevenueData,
        netIncomeData: netIncomeData
      },
      earnings: {
        earningsActual: earningsActual,
        earningsEstimate: earningsEstimate
      }
    });
  } catch(e) {
    console.log(e);
    res.sendStatus(500)
  }
});

/**
 * get income data
 */
router.get('/:symbol/income', async function(req, res) {
  let fiscalPeriods = {quarterly: [], annual: []},
    totalRevenueData = {quarterly: [], annual: []},
    netIncomeData = {quarterly: [], annual: []};

  try {
    const income = await IEX.getIncome(req.params.symbol);

    // populate quarterly income data
    for(let i = 0; i < income.quarterlyIncomeData.length; i++) {
      fiscalPeriods.quarterly.push(
        `Q${income.quarterlyIncomeData[i].fiscalQuarter} ${income.quarterlyIncomeData[i].fiscalYear}`);
      totalRevenueData.quarterly.push(income.quarterlyIncomeData[i].totalRevenue);
      netIncomeData.quarterly.push(income.quarterlyIncomeData[i].netIncome);
    }

    // populate annual income data
    for(i = 0; i < income.annualIncomeData.length; i++) {
      fiscalPeriods.annual.push(income.annualIncomeData[i].fiscalDate);
      totalRevenueData.annual.push(income.annualIncomeData[i].totalRevenue);
      netIncomeData.annual.push(income.annualIncomeData[i].netIncome);
    }

    res.send({
      fiscalPeriods: fiscalPeriods,
      income: {
        totalRevenueData: totalRevenueData,
        netIncomeData: netIncomeData
      }
    });
  } catch(e) {
    console.log(e);
    res.sendStatus(500)
  }
});

module.exports = router;
