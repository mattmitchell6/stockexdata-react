import React, { Component } from "react";
import axios from 'axios'

import IncomeChart from './incomeChart.js'

/**
 * earnings card
 */
export default class EarningsCards extends Component {

  constructor(props){
    super(props)
    this.state = {
      income: null,
      earnings: null,
      fiscalPeriods: null
    }
  }

  componentDidMount() {
    axios.get(`/api/stocks/${this.props.symbol}/earnings`).then(res => {
      this.setState({
        income: res.data.income,
        earnings: res.data.earnings,
        fiscalPeriods: res.data.fiscalPeriods
      })
    })
  }


  render() {
    const earnings = this.state.earnings;
    const income = this.state.income
    const fiscalPeriods = this.state.fiscalPeriods

    return (
      <div>
        {income &&
          // income card
          <div className="card card-body mb20">
            <div className="row mbs">
              <div className="col-sm-5 col-12 mbs">
                <h5>Financials</h5>
              </div>
              <div className="col-sm-7 col-12">
                <nav className="nav pull-right">
                  <span
                    className="nav-link financials range active"
                    // onClick={() => this.updateFinancialsRange('quarterly')}>
                    >
                    Quarterly
                  </span>
                  <span
                    className="nav-link financials range"
                    // onClick={() => this.updateFinancialsRange('annual')}>
                    >
                    Annual
                  </span>
                </nav>
              </div>

              <div className="col-12">
                <IncomeChart fiscalPeriods={fiscalPeriods} income={income}/>
              </div>
            </div>

          </div>
        }
      </div>
    )
  }
}
