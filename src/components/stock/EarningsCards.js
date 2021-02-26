import React, { useState, useEffect } from "react";
import axios from 'axios'

import IncomeChart from './charts/incomeChart.js'
import EpsChart from './charts/epsChart.js'
import Loader from '../Loader'

/**
 * earnings card
 */
function EarningsCards(props) {
  const [income, setIncome] = useState(null)
  const [earnings, setEarnings] = useState(null)
  const [fiscalPeriods, setFiscalPeriods] = useState(null)
  const [incomePeriod, setIncomePeriod] = useState("quarterly")

  useEffect(() => {
    async function fetchEarnings() {
      const res = await axios.get(`/api/stocks/${props.symbol}/earnings`)

      if(res.data) {
        setIncome(res.data.income)
        setEarnings(res.data.earnings)
        setFiscalPeriods(res.data.fiscalPeriods)
      }
    }

    if(!income && !earnings) {
      fetchEarnings()
    }
  }, [income, earnings, fiscalPeriods])

  const activePeriod = (period) => {
    let periodClass = "";

    if(period === incomePeriod) {
      periodClass = "active"
    }

    return periodClass;
  }

  const updateIncomePeriod = (period) => {
    setIncomePeriod(period)
  }

  const organizeIncomeData = (incomePeriod, income, fiscalPeriods) => {
    let incomePeriods, totalRevenueData, netIncomeData;

    if(income && fiscalPeriods && incomePeriod == "quarterly") {
      incomePeriods = fiscalPeriods.quarterly;
      totalRevenueData = income.totalRevenueData.quarterly
      netIncomeData = income.netIncomeData.quarterly
    } else if(income && fiscalPeriods && incomePeriod == "annual") {
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

  const incomeData = organizeIncomeData(incomePeriod, income, fiscalPeriods)

  return (
    <div>
      {incomeData && earnings && fiscalPeriods && (
        <div>
          {/* income card */}
          <div className="card card-body mb20">
            <div className="row mbs">
              <div className="col-sm-5 col-12 mbs">
                <h5>Financials</h5>
              </div>
              <div className="col-sm-7 col-12">
                <nav className="nav pull-right">
                  <span
                    className={`nav-link range ${activePeriod('quarterly')}`}
                    onClick={() => updateIncomePeriod('quarterly')}
                  >
                    Quarterly
                  </span>
                  <span
                    className={`nav-link range ${activePeriod('annual')}`}
                    onClick={() => updateIncomePeriod('annual')}
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

          {/* income card */}
          <div className="card card-body mb20">
            <div className="row mbs">
              <div className="col-12 mbs">
                <h5>Earnings</h5>
              </div>

              <div className="col-12">
                <EpsChart
                  earningsPeriods={fiscalPeriods.quarterly}
                  earningsActual={earnings.earningsActual}
                  earningsEstimate={earnings.earningsEstimate}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EarningsCards;
