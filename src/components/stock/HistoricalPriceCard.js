import React, { useState, useEffect } from "react";
import axios from 'axios'
import moment from 'moment'

import HistoricalPriceChart from './charts/HistoricalPriceChart'
import Loader from '../Loader'

/**
 * historical chart card
 */
function HistoricalPriceCard(props) {
  const [dates, setDates] = useState(null);
  const [prices, setPrices] = useState(null)
  const [range, setRange] = useState("1y")

  useEffect(() => {
    async function fetchHistoricalPrices() {
      const res = await axios.get(`/api/stocks/${props.symbol}/historicalprices`)

      if(res.data) {
        setDates(res.data.dates)
        setPrices(res.data.prices)
      }
    }

    if(!dates && !prices) {
      fetchHistoricalPrices()
    }
  }, [dates, prices, props])

  const updateDateRange = (updatedRange) => {
    setRange(updatedRange)
    setDates(null)
    setPrices(null)
  }

  const activeRange = (updatedRange) => {
    let rangeClass = "";

    if(updatedRange === range) {
      rangeClass = "active"
    }

    return rangeClass;
  }

  const organizeRangeData = () => {
    let dataDates = [], dataPrices = [], dateLimit;
    const currentTime = moment();

    if(prices && dates) {
      // fetch date limit
      switch(range) {
        case '1m':
          dateLimit = currentTime.subtract({'months': 1})
          break;
        case '1y':
          dateLimit = currentTime.subtract({'years': 1})
          break;
        case '5y':
          dateLimit = currentTime.subtract({'years': 5})
          break;
        case 'ytd':
          dateLimit = moment().startOf('year');
          break;
        case 'max':
          dateLimit = currentTime.subtract({'years': 20}) // iex only returns 15 yrs of data
          break;
        default:
          dateLimit = moment().startOf('year')
      }

      // return appropriate date range values
      for(let i = 0; i < dates.length; i++) {
        if(dateLimit.isSameOrBefore(dates[i], 'day')) {
          if(range === 'max' && !(i % 10)) {
            dataDates.push(dates[i]);
            dataPrices.push(prices[i]);
          } else if(range === '5y' && !(i % 5)) {
            dataDates.push(dates[i]);
            dataPrices.push(prices[i]);
          } else if(range !== '5y' && range !== 'max') {
            dataDates.push(dates[i]);
            dataPrices.push(prices[i]);
          }
        }
      }
    } else {
      dataDates = null;
      dataPrices = null
    }

    return {dates: dataDates, prices: dataPrices}
  }

  const chartData = organizeRangeData()

  return (
    <div>
      <div className="card mb20">
        <div className="card-body">
          <div className="row mbs">
            <div className="col-sm-5 col-12 mbs">
              <h5>Historical Performance</h5>
            </div>
            <div className="col-sm-7 col-12">
              <nav className="nav pull-right">
                <span
                  className={`nav-link historical range ${activeRange('ytd')}`}
                  onClick={() => updateDateRange('ytd')}>
                  YTD
                </span>
                <span
                  className={`nav-link historical range ${activeRange('1y')}`}
                  onClick={() => updateDateRange('1y')}>
                  1Y
                </span>
                <span
                  className={`nav-link historical range ${activeRange('5y')}`}
                  onClick={() => updateDateRange('5y')}>
                  5Y
                </span>
                <span
                  className={`nav-link historical range ${activeRange('max')}`}
                  onClick={() => updateDateRange('max')}>
                  All Time
                </span>
              </nav>
            </div>

          {/* stock chart */}
          {!chartData.dates || !chartData.prices ? (
            <div className="col-12">
              <Loader theme="dark"/>
            </div>
          ) : (
            <div className="col-12" style={{padding: "10px 10px 0px 10px"}}>
              <HistoricalPriceChart dates={chartData.dates} prices={chartData.prices}/>
            </div>
          )}

          </div>
        </div>
      </div>
    </div>
  )
}

export default HistoricalPriceCard;
