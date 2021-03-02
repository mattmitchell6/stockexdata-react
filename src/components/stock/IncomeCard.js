import React, { useState, useEffect } from "react";
import axios from 'axios'

import IncomeChart from './charts/IncomeChart.js'

/**
 * income card
 */
function IncomeCard(props) {
  const [income, setIncome] = useState(null)
  const [fiscalPeriods, setFiscalPeriods] = useState(null)
  const [incomePeriod, setIncomePeriod] = useState("quarterly")

  useEffect(() => {
    async function fetchIncome() {
      const res = await axios.get(`/api/stocks/${props.symbol}/income`)

      if(res.data) {
        setIncome(res.data.income)
        setFiscalPeriods(res.data.fiscalPeriods)
      }
    }

    if(!income) {
      fetchIncome()
    }
  }, [income, fiscalPeriods, props])

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

    if(income && fiscalPeriods && incomePeriod === "quarterly") {
      incomePeriods = fiscalPeriods.quarterly;
      totalRevenueData = income.totalRevenueData.quarterly
      netIncomeData = income.netIncomeData.quarterly
    } else if(income && fiscalPeriods && incomePeriod === "annual") {
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
      {incomeData && fiscalPeriods && (
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

        </div>
      )}
    </div>
  )
}

export default IncomeCard;
