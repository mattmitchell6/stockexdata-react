import React, { useState, useEffect } from "react";
import axios from 'axios'
import numeral from 'numeral';
import moment from 'moment';

import Quote from './Quote';
import Loader from '../Loader'

/**
 * main info card
 */
function MainInfoCard(props) {
  const [logo, setLogo] = useState(null)
  const [keyStats, setKeyStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchKeyStats() {
      const res = await axios.get(`/api/stocks/${props.symbol}/keystats`);

      setKeyStats(res.data.keyStats)
      setLogo(res.data.logo)

      setLoading(false)
    }

    fetchKeyStats();
  }, [logo, keyStats, props])

  const percentageClass = (change) => {
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


  return (
    <div className="card card-body mb20">
      <div className="row">
        <div className="col-sm-8 col-xs-12">
          <Quote symbol={props.symbol}/>
        </div>

        {logo && (
          <div className="col-sm-4 d-none d-sm-block mbm">
            <img src={logo} height="50px" alt="" className="pull-right logo" />
          </div>
        )}
      </div>

      {loading ? (
        <Loader theme="dark" />
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
                <span className="pull-right bold">
                  {numeral(keyStats.peRatio).format('0.00')}
                </span>
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
                <span className={`pull-right bold ${percentageClass(keyStats.year5ChangePercent)}`}>
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
                <span className={`pull-right bold ${percentageClass(keyStats.ytdChangePercent)}`}>
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

export default MainInfoCard
