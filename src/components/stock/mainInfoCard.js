import React, { Component } from "react";
import axios from 'axios'
import Quote from './quote';

const numeral = require('numeral');

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

  // Similar to componentDidMount and componentDidUpdate:
  componentDidMount() {
    axios.get(`/api/stocks/${this.props.symbol}/keystats`).then(res => {
      this.setState({
        logo: res.data.logo,
        keyStats: res.data.keyStats
      })
    })
  }

  // useEffect(() => {
  //   console.log('call use effect...');
  //   //
  // });

  displayLogo = () => {
    const basicInfo = this.state.basicInfo;
    console.log("display logo");

    if(basicInfo) {

      return (
        <img src={basicInfo.logo} height="50px" alt="" className="pull-right logo" />
      )
    } else {
      return (
        <div  className="pull-right" >loading...</div>
      )
    }
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

          {!keyStats ? (
            <div className="col-md-12">loading...</div>
          ) : (
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
          )}

          {!keyStats ? (
            <div className="col-md-12">loading...</div>
          ) : (
            <div className="col-lg-4 col-md-6 col-sm-12 col-xs-12">
              <div>
                Earnings Date
                {keyStats.nextEarningsDate ? (
                  <span className="pull-right bold earnings-date">{keyStats.nextEarningsDate}</span>
                ): (
                  <span className="pull-right bold">NA</span>
                )}
              </div>
              <hr/>

              <div>
                EPS (ttm)
                {keyStats.ttmEPS ? (
                  <span className="pull-right bold">{keyStats.ttmEPS}</span>
                ) : (
                  <span className="pull-right bold">NA</span>
                )}
              </div>
              <hr/>

              <div>
                Dividend Yield
                {keyStats.dividendYield ? (
                  <span className="pull-right bold yield">{keyStats.dividendYield}</span>
                ) : (
                  <span className="pull-right bold">NA</span>
                )}
              </div>
              <hr/>
            </div>
          )}
        </div>

      </div>
    )
  }
}
