import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

import Nav from './Nav'
import MainInfoCard from './stock/MainInfoCard'
import BasicInfoCard from './stock/BasicInfoCard'
import HistoricalPriceCard from './stock/HistoricalPriceCard'
import IncomeCard from './stock/IncomeCard'
import NewsCards from './stock/NewsCard'
import Loader from './Loader'

/**
 * stock page
 */
function Stock(props) {
  const [stockExists, setStockExists] = useState("pending")
  const [stock, setStock] = useState(null)
  const [cardClass, setCardClass] = useState("col-lg-8")  
  const { match: { params } } = props;
  const queryParams = new URLSearchParams(window.location.search)
  const resetQuery = queryParams.get("reset")
  let history = useHistory();


  useEffect(() => {
    const symbol = params.symbol.toUpperCase()

    async function fetchAllStocks() {
      let res;      
      res = await axios.get('/api/stocks/fetchall')
      const foundStock = res.data.find((item) => item.symbol === symbol)

      setStock(foundStock)
      setStockExists(res.data.some((item) => item.symbol === symbol))
      if(foundStock && foundStock.stockType !== "cs") {
        setCardClass("")
      }
    }

    // delete / reset stock
    async function resetStock() {
      await axios.get(`/api/stocks/${symbol}/reset`)
    }

    if(resetQuery == "true") {
      resetStock()
      history.push(`/${symbol}`)
    }

    if(stockExists === "pending") {
      fetchAllStocks();
    }
  }, [stockExists, params])

  const renderContent = () => {
    if(stockExists === "pending") {
      return <Loader />
    } else if(!stockExists) {
      return (
        <div className="alert alert-danger mbm col-8 text-center" role="alert">
          Could not find symbol for "{params.symbol}"
        </div>
      )
    } else {
      return (
        <div className="tab-content col-md-12">
          <div className="tab-pane show active" id="login" role="tabpanel" aria-labelledby="login">

            {/* main info card */}
            <MainInfoCard symbol={params.symbol} />

            <div className="row">
              <div className="col-lg-4 col-md-12">
                <BasicInfoCard symbol={params.symbol} />

                <IncomeCard symbol={params.symbol} />
              </div>

              <div className={`col-md-12 ${cardClass}`}>
                <HistoricalPriceCard symbol={params.symbol} />

                <NewsCards symbol={params.symbol} />
              </div>
            </div>

          </div>
        </div>
      )
    }
  }

  return (
    <div>
      <Nav displayNavSearch={true} />
      <div className="container mtm">
        <div className="row d-flex justify-content-center">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default Stock
