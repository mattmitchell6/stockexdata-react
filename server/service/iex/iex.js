/**
 * Class for making API calls to IEX and organizing data
 */
const axios = require('axios');
const moment = require('moment');
require('dotenv').config();

const Stock = require('../../models/stocks');
const Quote = require('../../models/quote')
const BasicInfo = require('../../models/basicInfo')
const KeyStats = require('../../models/keyStats')
const HistoricalPrices = require('../../models/historicalPrices')
const Earnings = require('../../models/earnings')
const News = require('../../models/news');
// const request = require('./request');

const baseUrl = "https://cloud.iexapis.com/stable/stock"
const token = `token=${process.env.IEX_TOKEN}`;

const MAX_NEWS_SUMMARY = 200;

class IEX {

  /**
   * get most recent quote
   */
  static async getQuote(symbol) {
    const url = `${baseUrl}/${symbol}/quote?${token}`
    let quote = await Quote.findOne({'symbol': symbol.toUpperCase()});

    // update or create
    if(!quote || moment().diff(quote.lastUpdated, 'minutes') > 5) {
      let result = await axios.get(url);
      result = result.data

      // calculate daily change
      result.dailyChange = dailyChange(result.latestPrice, result.previousClose)

      quote = await Quote.findOneAndUpdate(
        { 'symbol': symbol.toUpperCase() },
        {
          symbol: symbol.toUpperCase(),
          data: JSON.stringify(result),
          lastUpdated: moment()
        },
        { upsert: true, new: true});
      }

     return JSON.parse(quote.data)
   }

   /**
    * get basic stock info
    */
  static async getBasicInfo(symbol) {
    const logoUrl = `${baseUrl}/${symbol}/logo?${token}`
    const companyInfoUrl = `${baseUrl}/${symbol}/company?${token}`

    let basicInfo = await BasicInfo.findOne({'symbol': symbol.toUpperCase()});

    // update or create
    if(!basicInfo || moment().diff(basicInfo.lastUpdated, 'months') > 1) {
      let logoResult = await axios.get(logoUrl);

      let basicInfoResult = await axios.get(companyInfoUrl);
      basicInfoResult = basicInfoResult.data;

      basicInfoResult.logo = logoResult.data.url;

      basicInfo = await BasicInfo.findOneAndUpdate(
        { 'symbol': symbol.toUpperCase() },
        {
          symbol: symbol.toUpperCase(),
          data: JSON.stringify(basicInfoResult),
          lastUpdated: moment()
        },
        { upsert: true, new: true});
      }

      return JSON.parse(basicInfo.data)
    }

    /**
     * get stock key stats
     */
    static async getKeyStats(symbol) {
      const url = `${baseUrl}/${symbol}/stats?${token}`

      let keyStats = await KeyStats.findOne({'symbol': symbol.toUpperCase()});

      // update or create
      if(!keyStats || moment().isAfter(keyStats.lastUpdated, 'day')) {
        let keyStatsResult = await axios.get(url);
        keyStatsResult = keyStatsResult.data;

        keyStats = await KeyStats.findOneAndUpdate(
          { 'symbol': symbol.toUpperCase() },
          {
            symbol: symbol.toUpperCase(),
            data: JSON.stringify(keyStatsResult),
            lastUpdated: moment()
          },
          { upsert: true, new: true});
        }

       return JSON.parse(keyStats.data)
     }

    /**
     * get historical stock prices
     */
    static async getHistoricalPrices(symbol) {
      const maxPricesUrl = `${baseUrl}/${symbol}/chart/max?${token}&chartInterval=1&chartCloseOnly=true`
      let historicalPricesResult;

      let historicalPrices = await HistoricalPrices.findOne({'symbol': symbol.toUpperCase()});

      // if historicalPrices do not exist, fetch all
      if(!historicalPrices) {
        historicalPricesResult = await axios.get(maxPricesUrl);
        historicalPricesResult = historicalPricesResult.data;

        historicalPrices = await HistoricalPrices.findOneAndUpdate(
          { 'symbol': symbol.toUpperCase() },
          {
            symbol: symbol.toUpperCase(),
            data: JSON.stringify(historicalPricesResult),
            lastUpdated: moment()
          },
          { upsert: true, new: true});
      // if historicalPrices exist and haven't been updated in a day, update
      } else if(moment().isAfter(historicalPrices.lastUpdated, 'day')) {
        let history = JSON.parse(historicalPrices.data);
        let previousMostRecentQuote = history[history.length - 1];
        let currentTime = moment();
        let range;

        // see how many historical stock prices we've missed
        if(currentTime.diff(previousMostRecentQuote.date, 'days') <= 5) {
          range = '5d';
        } else if(currentTime.diff(previousMostRecentQuote.date, 'months') <= 1) {
          range = '1m';
        } else if(currentTime.diff(previousMostRecentQuote.date, 'months') <= 3) {
          range = '3m';
        } else if(currentTime.diff(previousMostRecentQuote.date, 'months') <= 6) {
          range = '6m';
        } else if(currentTime.diff(previousMostRecentQuote.date, 'years') <= 1) {
          range = '1y';
        } else if(currentTime.diff(previousMostRecentQuote.date, 'years') <= 2) {
          range = '2y';
        } else {
          range = 'max';
        }

        // fetch daily stock prices based on calculated range above
        const updatePricesUrl = `${baseUrl}/${symbol}/chart/${range}?${token}&chartInterval=1&chartCloseOnly=true`
        historicalPricesResult = await axios.get(updatePricesUrl);

        // fill in daily price gaps
        let toAddDates = historicalPricesResult.data.filter(function(day, index, arr) {
          return moment(day.date).isAfter(previousMostRecentQuote.date, 'day')
        });

        history = history.concat(toAddDates);

        // update prices
        historicalPrices = await HistoricalPrices.findOneAndUpdate(
          { 'symbol': symbol.toUpperCase() },
          {
            symbol: symbol.toUpperCase(),
            data: JSON.stringify(history),
            lastUpdated: moment()
          },
          { upsert: true, new: true});
      }

      return JSON.parse(historicalPrices.data)
    }

    /**
     * get earnings data
     */
    static async getEarnings(symbol) {
      let quarterlyIncomeResult, annualIncomeResult, earningsResult, lastReported;
      const quarterlyIncomeUrl = `${baseUrl}/${symbol}/income?last=4&period=quarter&${token}`;
      const annualIncomeUrl = `${baseUrl}/${symbol}/income?last=4&period=annual&${token}`;
      const earningsUrl = `${baseUrl}/${symbol}/earnings?last=4&${token}`;

      let earnings = await Earnings.findOne({'symbol': symbol.toUpperCase()});
      let keyStats = await this.getKeyStats(symbol);

      if(!earnings || !keyStats || moment(keyStats.nextEarningsDate).diff(earnings.lastReported, 'days') > 150) {

        // make calls to fetch last 4 four quarters of income / earnings statements
        [quarterlyIncomeResult, annualIncomeResult, earningsResult] = await Promise.all([
          axios.get(quarterlyIncomeUrl),
          axios.get(annualIncomeUrl),
          axios.get(earningsUrl)
        ])

        if(!isEmpty(earningsResult.data) && !isEmpty(quarterlyIncomeResult.data) && !isEmpty(annualIncomeResult.data)) {
          quarterlyIncomeResult = JSON.stringify(quarterlyIncomeResult.data.income.reverse());
          annualIncomeResult = JSON.stringify(annualIncomeResult.data.income.reverse());

          earningsResult = earningsResult.data.earnings.reverse();
          lastReported = earningsResult[earningsResult.length - 1].EPSReportDate
          earningsResult = JSON.stringify(earningsResult)
        } else {
          quarterlyIncomeResult = null;
          annualIncomeResult = null;
          earningsResult = null;
          lastReported = moment();
        }

        earnings = await Earnings.findOneAndUpdate(
          { 'symbol': symbol.toUpperCase() },
          {
            symbol: symbol.toUpperCase(),
            quarterlyIncomeData: quarterlyIncomeResult,
            annualIncomeData: annualIncomeResult,
            earningsData: earningsResult,
            lastReported: lastReported
          },
          { upsert: true, new: true});
     }

     return {
       earningsData: JSON.parse(earnings.earningsData),
       quarterlyIncomeData: JSON.parse(earnings.quarterlyIncomeData),
       annualIncomeData: JSON.parse(earnings.annualIncomeData)
     }
   }

   /**
    * get news
    */
    static async getNews(symbol) {
      const newsUrl = `${baseUrl}/${symbol}/news/last?${token}`

      let news = await News.findOne({'symbol': symbol.toUpperCase()});

      // update or create
      if(!news || moment().isAfter(news.lastUpdated, 'day')) {
        let newsResult = await axios.get(newsUrl);
        newsResult = newsResult.data

        // max out news summary character count at 200 chars
        for(let i = 0; i < newsResult.length; i++) {
          newsResult[i].summary = newsResult[i].summary.substr(0, MAX_NEWS_SUMMARY) + "..."
        }

        news = await News.findOneAndUpdate(
          { 'symbol': symbol.toUpperCase() },
          {
            symbol: symbol.toUpperCase(),
            data: JSON.stringify(newsResult),
            lastUpdated: moment()
          },
          { upsert: true, new: true});
        }

        return JSON.parse(news.data)
      }

  /**
   * fetch all stock data
   */
  // static async getStockData(symbol) {
  //   let quote, logoUrl, news, history, earningsResults, keyStats, companyInfo;
  //   let updateTasks = [], updateTaskResults = [], updateKeys = [], updates = {};
  //   let nextEarningsDate;
  //   const currentTime = moment();
  //
  //   // fetch stock by symbol from db
  //   let stock = await Stock.findOne({'symbol': symbol.toUpperCase()});
  //
  //   // does db entry for stock exist?
  //   if(stock) {
  //     console.log(`entry found for ${symbol}...`);
  //
  //     // update news once a day
  //     if(currentTime.isAfter(stock.news.lastUpdated, 'day')) {
  //       updateTasks.push(request.news(symbol))
  //       updateKeys.push('news')
  //     }
  //
  //     // update quote every 5 minutes
  //     if(currentTime.diff(stock.quote.lastUpdated, 'minutes') > 5) {
  //       updateTasks.push(request.quote(symbol))
  //       updateKeys.push('quote')
  //     }
  //
  //     // update company info once a month
  //     if(currentTime.diff(stock.companyInfo.lastUpdated, 'months') > 1) {
  //       updateTasks.push(request.companyInfo(symbol))
  //       updateKeys.push('companyInfo')
  //     }
  //
  //     // update history once a day
  //     if(currentTime.isAfter(stock.history.lastUpdated, 'day')) {
  //       updateTasks.push(request.updateHistoricalPrices(symbol, currentTime, stock.history.lastUpdated, stock.history.data))
  //       updateKeys.push('history')
  //     }
  //
  //     // update earnings results roughly once a quarter
  //     nextEarningsDate = unStringify(stock).keyStats.nextEarningsDate;
  //     if(moment(nextEarningsDate).diff(stock.earningsResults.lastReported, 'days') > 150) {
  //       updateTasks.push(request.earningsResults(symbol));
  //       updateKeys.push('earningsResults')
  //     }
  //
  //     // update key stats once a day
  //     if(!stock.keyStats || !stock.keyStats.data|| !stock.keyStats.lastUpdated || currentTime.isAfter(stock.keyStats.lastUpdated, 'day')) {
  //       updateTasks.push(request.keyStats(symbol));
  //       updateKeys.push('keyStats')
  //     }
  //
  //     // if updates exist, save updates to db
  //     if(updateTasks.length > 0) {
  //       console.log("updating stock db entry...");
  //       updateTaskResults = await Promise.all(updateTasks)
  //
  //       for(let i = 0; i < updateTaskResults.length; i++) {
  //         console.log(`updating ${symbol} ${updateKeys[i]}...`);
  //         updates[updateKeys[i]] = updateTaskResults[i]
  //       }
  //
  //       stock = await Stock.findOneAndUpdate({'symbol': symbol.toUpperCase()}, updates, {new: true});
  //     }
  //   // no entry exists for this stock, create a new one
  //   } else {
  //     console.log(`entry not found for ${symbol}...`);
  //
  //     // fetch stock info, logo, quarterly data, etc.
  //     [companyInfo, quote, logoUrl, news, history, earningsResults, keyStats] = await Promise.all([
  //       request.companyInfo(symbol),
  //       request.quote(symbol),
  //       request.logo(symbol),
  //       request.news(symbol),
  //       request.historicalPrices(symbol, 'max'),
  //       request.earningsResults(symbol),
  //       request.keyStats(symbol)
  //     ]);
  //
  //     // add new stock to db
  //     stock = new Stock({
  //       companyInfo: companyInfo,
  //       symbol: symbol.toUpperCase(),
  //       quote: quote,
  //       keyStats: keyStats,
  //       logoUrl: logoUrl,
  //       history: history,
  //       news: news,
  //       earningsResults: earningsResults
  //     })
  //     await stock.save()
  //   }
  //
  //   return unStringify(stock);
  // }

  /**
   * get all stocks available on IEX Symbols
   */
  static async getAllStocks() {
    const url = `https://cloud.iexapis.com/stable/ref-data/symbols?${token}`

    // make call to fetch all IEX symbols
    let result = await axios.get(url);
    result = result.data

    return result;
  }
}

/**
 * calculate daily stock price change percentage
 */
function dailyChange(latestPrice, previousClose) {
  let change = latestPrice - previousClose
  let changePercent = (latestPrice * 100) / previousClose - 100;

  changePercent = changePercent.toFixed(2);
  change = change.toFixed(2);

  return {
    changePercent: changePercent,
    change: change
  }
}

/**
 * is the object empty?
 */
function isEmpty(obj) {
  return Object.getOwnPropertyNames(obj).length === 0;
}

/**
 * convert all stringified data entries to json
 */
// function unStringify(stock) {
//   return {
//     symbol: stock.symbol,
//     logoUrl: stock.logoUrl,
//     companyInfo: JSON.parse(stock.companyInfo.data),
//     keyStats: JSON.parse(stock.keyStats.data),
//     quote: JSON.parse(stock.quote.data),
//     quoteLastUpdated: stock.quote.lastUpdated,
//     news: JSON.parse(stock.news.data)
//   }
// }

module.exports = IEX;
