import React, { Component } from "react";
import axios from 'axios'
import moment from 'moment'

import HistoricalPriceChart from './historicalPriceChart'

/**
 * historical chart card
 */
export default class HistoricalPriceCard extends Component {

  constructor(props){
    super(props)
    this.state = {
      dates: null,
      prices: null,
      range: "1y"
    }
  }

  componentDidMount() {
    axios.get(`/api/stocks/${this.props.symbol}/historicalprices`).then(res => {
      this.setState({
        dates: res.data.dates,
        prices: res.data.prices
      })
    })
  }

  updateDateRange = (range) => {
    this.setState({
      range: range
    })
  }

  activeRange = (range) => {
    const currentRange = this.state.range;
    let rangeClass = "";

    if(range === currentRange) {
      rangeClass = "active"
    }

    return rangeClass;
  }

  organizeRangeData = (range, dates, prices) => {
    let dataDates = [], dataPrices = [], dateLimit;
    const currentTime = moment();

    if(prices) {
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
          if(range == 'max' && !(i % 10)) {
            dataDates.push(dates[i]);
            dataPrices.push(prices[i]);
          } else if(range == '5y' && !(i % 5)) {
            dataDates.push(dates[i]);
            dataPrices.push(prices[i]);
          } else if(range != '5y' && range != 'max') {
            dataDates.push(dates[i]);
            dataPrices.push(prices[i]);
          }
        }
      }
    } else {
      dataDates = null;
      dataPrices = null
    }

    // console.log(dataDates);
    return {dates: dataDates, prices: dataPrices}
  }


  render() {
    let range = this.state.range;
    const data = this.organizeRangeData(range, this.state.dates, this.state.prices)

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
                    className={`nav-link historical range ${this.activeRange('ytd')}`}
                    onClick={() => this.updateDateRange('ytd')}>
                    YTD
                  </span>
                  <span
                    className={`nav-link historical range ${this.activeRange('1y')}`}
                    onClick={() => this.updateDateRange('1y')}>
                    1Y
                  </span>
                  <span
                    className={`nav-link historical range ${this.activeRange('5y')}`}
                    onClick={() => this.updateDateRange('5y')}>
                    5Y
                  </span>
                  <span
                    className={`nav-link historical range ${this.activeRange('max')}`}
                    onClick={() => this.updateDateRange('max')}>
                    All Time
                  </span>
                </nav>
              </div>

            {/* stock chart */}
            {!data.dates || !data.prices ? (
              <div>
                loading...
              </div>
            ) : (
              <div className="col-12" style={{padding: "10px 10px 0px 10px"}}>
                <HistoricalPriceChart dates={data.dates} prices={data.prices}/>
              </div>
            )}

            </div>
          </div>
        </div>
      </div>
    )
  }
}
