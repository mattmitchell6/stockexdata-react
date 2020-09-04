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
      fiscalPeriods: null,
      incomePeriod: "quarterly"
    }
  }

  componentDidMount() {
    console.log('componentDidMount...');
    axios.get(`/api/stocks/${this.props.symbol}/earnings`).then(res => {
      this.setState({
        income: res.data.income,
        earnings: res.data.earnings,
        fiscalPeriods: res.data.fiscalPeriods
      })
    })
  }

  activePeriod = (period) => {
    const currentPeriod = this.state.incomePeriod;
    let periodClass = "";

    if(period === currentPeriod) {
      periodClass = "active"
    }

    return periodClass;
  }

  updateIncomePeriod = (period) => {
    this.setState({
      incomePeriod: period
    })
  }

  organizeIncomeData = (incomePeriod, income, fiscalPeriods) => {
    let incomePeriods, totalRevenueData, netIncomeData;

    if(income && incomePeriod == "quarterly") {
      incomePeriods = fiscalPeriods.quarterly;
      totalRevenueData = income.totalRevenueData.quarterly
      netIncomeData = income.netIncomeData.quarterly
    } else if(income && incomePeriod == "annual") {
      incomePeriods = fiscalPeriods.annual;
      totalRevenueData = income.totalRevenueData.annual
      netIncomeData = income.netIncomeData.annual
    }

    return {
      incomePeriods: incomePeriods,
      totalRevenueData: totalRevenueData,
      netIncomeData: netIncomeData
    }
  }

  render() {
    const incomePeriod = this.state.incomePeriod
    // const earnings = this.state.earnings;
    const incomeData = this.organizeIncomeData(incomePeriod, this.state.income, this.state.fiscalPeriods)

    return (
      <div>
        {!incomeData.totalRevenueData || !incomeData.netIncomeData ? (
          <div>
            loading...
          </div>
        ) : (
          // income card
          <div className="card card-body mb20">
            <div className="row mbs">
              <div className="col-sm-5 col-12 mbs">
                <h5>Financials</h5>
              </div>
              <div className="col-sm-7 col-12">
                <nav className="nav pull-right">
                  <span
                    className={`nav-link range ${this.activePeriod('quarterly')}`}
                    onClick={() => this.updateIncomePeriod('quarterly')}
                  >
                    Quarterly
                  </span>
                  <span
                    className={`nav-link range ${this.activePeriod('annual')}`}
                    onClick={() => this.updateIncomePeriod('annual')}
                  >
                    Annual
                  </span>
                </nav>
              </div>

              <div className="col-12">
                <IncomeChart
                  incomePeriods={incomeData.incomePeriods}
                  totalRevenueData={incomeData.totalRevenueData}
                  netIncomeData={incomeData.netIncomeData}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
}
