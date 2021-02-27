import React, { useState, useEffect } from "react";
import axios from 'axios';
import numeral from 'numeral'

import Loader from './Loader';

/**
 * Watchlist item
 */
function WatchlistItem(props) {
  const [quote, setQuote] = useState(null)

  useEffect(() => {
    async function fetchQuote() {
      let res = await axios.get(`/api/stocks/${props.symbol}/quote`)
      const resInfo = await axios.get(`/api/stocks/${props.symbol}/basicinfo`);
      res.data.logo = resInfo.data.logo
      console.log(res.data);

      setQuote(res.data)
    }

    if(!quote) {
      fetchQuote();
    }
  }, [quote])

  const dailyChange = (change, changePercent) => {
    let dailyStyle, changeText

    if(change > 0) {
      dailyStyle = "green-background";
      changeText = ` +${changePercent}%`;
    } else if(change === 0) {
      dailyStyle = "neutral-background"
      changeText = ` ${changePercent}%`;
    } else {
      dailyStyle = "red-background";
      changeText = ` ${changePercent}%`;
    }

    return (
      <div className={`daily-change-watchlist pull-right mtxs ${dailyStyle}`}>
         {changeText}
      </div>
    )
  }

  return (
    <div key={props.symbol} class="card-body watchlist-item">
      {/* <div class="row"> */}
        {quote ? (
          <div class="row" style={{fontSize: "90%"}}>
            <div class="col-2">
              <img src={quote.logo} height="30px" alt="" className="logo" />
            </div>
            <div class="col-5 overflow">
              <a href={`/${props.symbol}`}><h5>{props.symbol}</h5></a>
              <span>{quote.companyName}</span>
            </div>
            <div class="col-5">
              <div class="price pull-right">
                {numeral(quote.latestPrice).format('$0,0.00')}
              </div>
              <br></br>
              {dailyChange(quote.dailyChange.change, quote.dailyChange.changePercent)}
            </div>
          </div>
        ) : (
          <Loader theme="dark"/>
        )}
      {/* </div> */}
    </div>
  )
}

export default WatchlistItem;
