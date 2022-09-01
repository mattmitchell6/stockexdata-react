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
// const Earnings = require('../../models/earnings')
const Income = require('../../models/income')
const News = require('../../models/news');

const baseUrl = "https://cloud.iexapis.com/stable/stock"
const token = `token=${process.env.IEX_TOKEN}`;

const MAX_NEWS_SUMMARY = 200;

class IEX {

  /**
   * get most recent quote
   */
  static async getQuote(symbol) {
    const url = `${baseUrl}/${symbol}/quote?${token}`
    let quote = await Quote.findOne({ 'symbol': symbol.toUpperCase() });

    // update or create
    if (!quote || moment().diff(quote.lastUpdated, 'minutes') > 5) {
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
        { upsert: true, new: true });
    }

    return JSON.parse(quote.data)
  }

  /**
   * get basic stock info
   */
  static async getBasicInfo(symbol) {
    const logoUrl = `${baseUrl}/${symbol}/logo?${token}`
    const companyInfoUrl = `${baseUrl}/${symbol}/company?${token}`

    let basicInfo = await BasicInfo.findOne({ 'symbol': symbol.toUpperCase() });

    // update or create
    if (!basicInfo || moment().diff(basicInfo.lastUpdated, 'days') > 10) {
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
        { upsert: true, new: true });
    }

    return JSON.parse(basicInfo.data)
  }

  /**
   * get stock key stats
   */
  static async getKeyStats(symbol) {
    const url = `${baseUrl}/${symbol}/stats?${token}`
    const advancedStatsUrl = `${baseUrl}/${symbol}/advanced-stats?${token}`

    let keyStats = await KeyStats.findOne({ 'symbol': symbol.toUpperCase() });

    // update or create
    if (!keyStats || moment().isAfter(keyStats.lastUpdated, 'day')) {
      const [keyStatsResult, advancedStatsResult] = await Promise.all([axios.get(url), axios.get(advancedStatsUrl)]);

      const allStats = { ...keyStatsResult.data, ...advancedStatsResult.data }

      keyStats = await KeyStats.findOneAndUpdate(
        { 'symbol': symbol.toUpperCase() },
        {
          symbol: symbol.toUpperCase(),
          data: JSON.stringify(allStats),
          lastUpdated: moment()
        },
        { upsert: true, new: true });
    }

    return JSON.parse(keyStats.data)
  }

  /**
   * get historical stock prices
   */
  static async getHistoricalPrices(symbol) {
    const maxPricesUrl = `${baseUrl}/${symbol}/chart/max?${token}&chartInterval=1&chartCloseOnly=true`
    let historicalPricesResult;

    let historicalPrices = await HistoricalPrices.findOne({ 'symbol': symbol.toUpperCase() });

    // if historicalPrices do not exist, fetch all
    if (!historicalPrices) {
      historicalPricesResult = await axios.get(maxPricesUrl);
      historicalPricesResult = historicalPricesResult.data;

      historicalPrices = await HistoricalPrices.findOneAndUpdate(
        { 'symbol': symbol.toUpperCase() },
        {
          symbol: symbol.toUpperCase(),
          data: JSON.stringify(historicalPricesResult),
          lastUpdated: moment()
        },
        { upsert: true, new: true });
      // if historicalPrices exist and haven't been updated in a day, update
    } else if (moment().isAfter(historicalPrices.lastUpdated, 'day')) {
      let history = JSON.parse(historicalPrices.data);
      let previousMostRecentQuote = history[history.length - 1];
      let currentTime = moment();
      let range;

      // see how many historical stock prices we've missed
      if (currentTime.diff(previousMostRecentQuote.date, 'days') <= 5) {
        range = '5d';
      } else if (currentTime.diff(previousMostRecentQuote.date, 'months') <= 1) {
        range = '1m';
      } else if (currentTime.diff(previousMostRecentQuote.date, 'months') <= 3) {
        range = '3m';
      } else if (currentTime.diff(previousMostRecentQuote.date, 'months') <= 6) {
        range = '6m';
      } else if (currentTime.diff(previousMostRecentQuote.date, 'years') <= 1) {
        range = '1y';
      } else if (currentTime.diff(previousMostRecentQuote.date, 'years') <= 2) {
        range = '2y';
      } else {
        range = 'max';
      }

      // fetch daily stock prices based on calculated range above
      const updatePricesUrl = `${baseUrl}/${symbol}/chart/${range}?${token}&chartInterval=1&chartCloseOnly=true`
      historicalPricesResult = await axios.get(updatePricesUrl);

      // fill in daily price gaps
      let toAddDates = historicalPricesResult.data.filter(function (day, index, arr) {
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
        { upsert: true, new: true });
    }

    return JSON.parse(historicalPrices.data)
  }

  /**
   * get income data
   */
  static async getIncome(symbol) {
    let quarterlyIncomeResult, annualIncomeResult;
    let lastReported = moment();
    const quarterlyIncomeUrl = `${baseUrl}/${symbol}/income?last=4&period=quarter&${token}`;
    const earningsUrl = `${baseUrl}/${symbol}/earnings?last=4&${token}`;
    const annualIncomeUrl = `${baseUrl}/${symbol}/income?last=4&period=annual&${token}`;

    const stockInfo = await this.getBasicInfo(symbol);
    const keyStats = await this.getKeyStats(symbol);

    // don't fetch income if not a basic stock (ex: ETFs)
    if (stockInfo.issueType != "cs") {
      return null
    }

    let income = await Income.findOne({ 'symbol': symbol.toUpperCase() });

    // TODO: this needs reworking. IEX needs to figure out the whole "next earnings date" thing
    if(!income || !income._doc.lastReported || moment(keyStats.nextEarningsDate).diff(income._doc.lastReported, 'days') > 130) {
      let quarterlyIncome, annualIncome;

      // make calls to fetch last 4 four quarters / years of income statements
      [quarterlyIncomeResult, annualIncomeResult] = await Promise.all([
        axios.get(quarterlyIncomeUrl),
        axios.get(annualIncomeUrl)
      ])

      if (!isEmpty(quarterlyIncomeResult.data)) {
        quarterlyIncome = quarterlyIncomeResult.data.income.reverse();
        lastReported = quarterlyIncome[quarterlyIncome.length - 1].reportDate
        quarterlyIncome = JSON.stringify(quarterlyIncome);
      }

      if (!isEmpty(annualIncomeResult.data)) {
        annualIncome = JSON.stringify(annualIncomeResult.data.income.reverse());
      }

      income = await Income.findOneAndUpdate(
        { 'symbol': symbol.toUpperCase() },
        {
          symbol: symbol.toUpperCase(),
          quarterlyIncomeData: quarterlyIncome,
          annualIncomeData: annualIncome,
          lastReported: lastReported
        },
        { upsert: true, new: true });
    }

    return {
      quarterlyIncomeData: JSON.parse(income.quarterlyIncomeData),
      annualIncomeData: JSON.parse(income.annualIncomeData)
    }
  }

  /**
   * get news
   */
  static async getNews(symbol) {
    const newsUrl = `${baseUrl}/${symbol}/news/last?${token}`

    let news = await News.findOne({ 'symbol': symbol.toUpperCase() });

    // update or create
    if (!news || moment().isAfter(news.lastUpdated, 'day')) {
      let newsResult = await axios.get(newsUrl);
      newsResult = newsResult.data

      // max out news summary character count at 200 chars
      for (let i = 0; i < newsResult.length; i++) {
        newsResult[i].summary = newsResult[i].summary.substr(0, MAX_NEWS_SUMMARY) + "..."
      }

      news = await News.findOneAndUpdate(
        { 'symbol': symbol.toUpperCase() },
        {
          symbol: symbol.toUpperCase(),
          data: JSON.stringify(newsResult),
          lastUpdated: moment()
        },
        { upsert: true, new: true }
      );
    }

    return JSON.parse(news.data)
  }

  /**
   * remove symbol db entries
   */
   static async removeEntry(symbol) {
    await HistoricalPrices.findOne({'symbol': symbol.toUpperCase()}).deleteOne();
    await Income.findOne({'symbol': symbol.toUpperCase()}).deleteOne();

    return true;
  }  

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

module.exports = IEX;
