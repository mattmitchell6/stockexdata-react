import React, { Component } from "react";
import axios from 'axios'
import numeral from 'numeral';
import moment from 'moment';

import Quote from './quote';

/**
 * main info card
 */
export default class MainInfoCard extends Component {

  constructor(props){
    super(props)
    this.state = {
      logo: null,
      keyStats: null
    }
  }

  componentDidMount() {
    axios.get(`/api/stocks/${this.props.symbol}/keystats`).then(res => {
      this.setState({
        logo: res.data.logo,
        keyStats: res.data.keyStats
      })
    })
  }

  percentageClass = (change) => {
    let style;

    if(change > 0) {
      style = "green";
    } else if(change === 0) {
      style = "neutral"
    } else {
      style = "red";
    }

    return style;
  }

  render() {
    const logo = this.state.logo;
    const keyStats = this.state.keyStats;

    return (
      <div className="card card-body mb20">
        <div className="row">
          <div className="col-sm-8 col-xs-12">
            <Quote symbol={this.props.symbol}/>
          </div>

          {!logo ? (
            <div  className="pull-right" >loading...</div>
          ) : (
            <div className="col-sm-4 d-none d-sm-block mbm">
              <img src={logo} height="50px" alt="" className="pull-right logo" />
            </div>
          )}
        </div>

        {!keyStats ? (
          <div className="row">
            <div className="col-md-12">loading...</div>
          </div>
        ) : (
          <div className="row">
            <div className="col-lg-4 col-md-6 col-sm-12 col-xs-12">
              <div>
                52 Week Range <span className="pull-right bold">{keyStats.week52low} - {keyStats.week52high}</span>
              </div>
              <hr/>

              <div>
                Market Cap
                {keyStats.marketcap ? (
                  <span className="pull-right bold market-cap" data-market-cap="">
                    {numeral(keyStats.marketcap).format('0.00a').toUpperCase()}
                  </span>
                ) : (
                  <span className="pull-right bold">NA</span>
                )}
              </div>
              <hr/>

              <div>
                PE Ratio
                {keyStats.peRatio ? (
                  <span className="pull-right bold">{keyStats.peRatio}</span>
                ) : (
                  <span className="pull-right bold">NA</span>
                )}
              </div>
              <hr/>
            </div>

            <div className="col-lg-4 col-md-6 col-sm-12 col-xs-12">
              <div>
                Earnings Date
                {keyStats.nextEarningsDate ? (
                  <span className="pull-right bold earnings-date">
                    {moment(keyStats.nextEarningsDate).format('MMM DD, YYYY')}
                  </span>
                ): (
                  <span className="pull-right bold">NA</span>
                )}
              </div>
              <hr/>

              <div>
                EPS (ttm)
                {keyStats.ttmEPS ? (
                  <span className="pull-right bold">
                    {numeral(keyStats.ttmEPS).format('0.00')}
                  </span>
                ) : (
                  <span className="pull-right bold">NA</span>
                )}
              </div>
              <hr/>

              <div>
                Dividend Yield
                {keyStats.dividendYield ? (
                  <span className="pull-right bold">
                    {numeral(keyStats.dividendYield).format('0.00%')}
                  </span>
                ) : (
                  <span className="pull-right bold">NA</span>
                )}
              </div>
              <hr/>
            </div>

            <div className="col-lg-4 col-md-6 col-sm-12 col-xs-12">
              <div>
                Employees
                {keyStats.employees ? (
                  <span className="pull-right bold employees">
                    {numeral(keyStats.employees).format('0,0')}
                  </span>
                ) : (
                  <span className="pull-right bold">NA</span>
                )}
              </div>
              <hr/>

              <div>
                5 Year Price Change
                {keyStats.year5ChangePercent ? (
                  <span className={`pull-right bold ${this.percentageClass(keyStats.year5ChangePercent)}`}>
                    {numeral(keyStats.year5ChangePercent).format('+0.00%')}
                  </span>
                ) : (
                  <span className="pull-right bold">NA</span>
                )}
              </div>
              <hr/>

              <div>
                YTD Price Change
                {keyStats.ytdChangePercent ? (
                  <span className={`pull-right bold ${this.percentageClass(keyStats.ytdChangePercent)}`}>
                    {numeral(keyStats.ytdChangePercent).format('+0.00%')}
                  </span>
                ) : (
                  <span className="pull-right bold">NA</span>
                )}
              </div>
              <hr/>
            </div>
          </div>
        )}
      </div>
    )
  }
}
