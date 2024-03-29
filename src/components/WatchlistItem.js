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

      setQuote({...res.data, ...resInfo.data})
    }

    if(!quote) {
      fetchQuote();
    }
  }, [quote, props])

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
    <div key={props.symbol} className="card-body watchlist-item">
      {quote ? (
        <div className="row" style={{fontSize: "90%"}}>
          <div className="col-2 d-none d-sm-block">
            <img src={quote.logo} height="30px" alt="" className="logo" />
          </div>
          <div className="col-7 col-sm-5 overflow">
            <a href={`/${props.symbol}`}><h5>{props.symbol}</h5></a>
            <span>{quote.companyName}</span>
          </div>
          <div className="col-5">
            <div className="price pull-right">
              {numeral(quote.latestPrice).format('$0,0.00')}
            </div>
            <br></br>
            {dailyChange(quote.dailyChange.change, quote.dailyChange.changePercent)}
          </div>
        </div>
      ) : (
        <Loader theme="dark"/>
      )}
    </div>
  )
}

export default WatchlistItem;
