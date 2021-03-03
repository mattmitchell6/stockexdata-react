import React, { useState, useEffect } from "react";
import axios from "axios";

import Nav from './Nav'
import MainInfoCard from './stock/MainInfoCard'
import BasicInfoCard from './stock/BasicInfoCard'
import HistoricalPriceCard from './stock/HistoricalPriceCard'
import IncomeCard from './stock/IncomeCard'
import NewsCards from './stock/NewsCard'

/**
 * stock page
 */
function Stock(props) {
  const [stockExists, setStockExists] = useState("pending")
  const { match: { params } } = props;

  useEffect(() => {
    async function fetchAllStocks() {
      let res;
      res = await axios.get('/api/stocks/fetchall')

      setStockExists(res.data.some((item) => item.symbol === params.symbol))
    }

    if(stockExists === "pending") {
      fetchAllStocks();
    }
  }, [stockExists, params])

  return (
    <div>
      <Nav displayNavSearch={true} />
      <div className="container mtm">
        <div className="row d-flex justify-content-center">

          {stockExists ? (
            <div className="tab-content col-md-12">
              <div className="tab-pane show active" id="login" role="tabpanel" aria-labelledby="login">

                {/* main info card */}
                <MainInfoCard symbol={params.symbol} />

                <div className="row">
                  <div className="col-lg-4 col-md-12">
                    <BasicInfoCard symbol={params.symbol} />

                    <IncomeCard symbol={params.symbol} />
                  </div>

                  <div className="col-lg-8 col-md-12">
                    <HistoricalPriceCard symbol={params.symbol} />

                    <NewsCards symbol={params.symbol} />
                  </div>
                </div>

              </div>
            </div>
          ) : (
            <div className="alert alert-danger mbm col-8 text-center" role="alert">
              Could not find symbol for "{params.symbol}"

            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Stock
