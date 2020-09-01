import React, { Component } from "react";
import axios from 'axios'

import StockChartGraph from './stockChartGraph'

/**
 * historical chart card
 */
export default class HistoricalChartCard extends Component {

  constructor(props){
    super(props)
    this.state = {
      historicalPrices: null,
      range: "1y"
    }
  }

  componentDidMount() {
    axios.get(`/api/stocks/${this.props.symbol}/historicalprices`).then(res => {
      this.setState({
        historicalPrices: res.data
      })
    })
  }

  updateDateRange = (range) => {
    this.setState({
      range: range
    })
  }



  render() {
    const historicalPrices = this.state.historicalPrices;

    return (
      <div>
        <div class="card mb20">
          <div class="card-body">
            <div className="row mbs">
              <div className="col-sm-5 col-12 mbs">
                <h5>Historical Performance</h5>
              </div>
              <div className="col-sm-7 col-12">
                <nav className="nav pull-right">
                  <span className="nav-link range" onClick={() => this.updateDateRange('6m')}>6M</span>
                  <span className="nav-link historical range" onClick={() => this.updateDateRange('ytd')}>YTD</span>
                  <span className="nav-link historical range active" onClick={() => this.updateDateRange('1y')}>1Y</span>
                  <span className="nav-link historical range" onClick={() => this.updateDateRange('5y')}>5Y</span>
                  <span className="nav-link historical range" onClick={() => this.updateDateRange('max')}>All Time</span>
                </nav>
              </div>

            {/* stock chart */}
            {!historicalPrices ? (
              <div>
                loading...
              </div>
            ) : (
              <div>
                <StockChartGraph historicalPrices={historicalPrices}/>
              </div>
            )}

            </div>
          </div>
        </div>
      </div>
    )
  }
}
