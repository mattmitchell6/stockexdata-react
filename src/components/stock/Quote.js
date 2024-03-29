import React, { useState, useEffect } from "react";
import axios from 'axios'
import moment from 'moment'
import numeral from 'numeral';
import { useGoogleLogin } from 'react-google-login'

import { UseGoogleAuthContext } from '../GoogleAuth';
import Loader from "../Loader";

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID
const cookiePolicy = 'single_host_origin';

/**
 * quote
 */
function Quote(props) {
  const [quote, setQuote] = useState(null)
  const auth = UseGoogleAuthContext();

  useEffect(() => {
    async function fetchQuote() {
      const res = await axios.get(`/api/stocks/${props.symbol}/quote`)
      const resInfo = await axios.get(`/api/stocks/${props.symbol}/basicinfo`);

      setQuote({...res.data, ...resInfo.data})
    }

    if(!quote) {
      fetchQuote();
    }
  }, [quote, props])

  const onSuccess = async (res) => {
    await auth.logIn(res);
  }

  const onFailure = () => {
    console.log('failed login...');
  }

  const { signIn } = useGoogleLogin({onSuccess, clientId, onFailure, cookiePolicy})

  const dailyChange = (change, changePercent) => {
    let dailyStyle, changeText

    if(change > 0) {
      dailyStyle = "green";
      changeText = ` +${changePercent}% (+${change})`;
    } else if(change === 0) {
      dailyStyle = "neutral"
      changeText = ` ${changePercent}% (${change})`;
    } else {
      dailyStyle = "red";
      changeText = ` ${changePercent}% (${change})`;
    }

    return (
      <span className={`dailyChange ${dailyStyle}`} style={{fontSize: "70%"}}>
         {changeText}
      </span>
    )
  }

  const inWatchlist = () => {
    return auth.user.watchlist.includes(props.symbol)
  }

  const addToWatchlist = async () => {
    if(auth.user) {
      const res = await axios.get(`/api/watchlist/add/${props.symbol}`)
      auth.updateUser(res.data);
    } else {
      // redirect to google login...
      signIn();
    }
  }

  const removeFromWatchlist = async () => {
    const res = await axios.get(`/api/watchlist/remove/${props.symbol}`)
    auth.updateUser(res.data);
  }

  const renderContent = () => {

    if(quote) {
      return (
        <div>
          <h4>
            {quote.companyName} <span className="text-muted">({quote.symbol})</span>
            {(auth.user && inWatchlist()) ? (
              <span className="watchlist">
                &nbsp;<i onClick={removeFromWatchlist} className="fas fa-star"></i>
              </span>
            ) : (
              <span className="watchlist">
                &nbsp;<i onClick={addToWatchlist} className="far fa-star"></i>
              </span>
            )}
          </h4>
          <div class="main-info-price">
            <span >{numeral(quote.latestPrice).format('$0,0.00')}</span>

            {dailyChange(quote.dailyChange.change, quote.dailyChange.changePercent)}
          </div>
          <div className="textMuted" style={{fontSize: "80%"}}>
            updated {moment(quote.latestUpdate).format('MM/DD h:mm a z')}
          </div>
        </div>
      )
    } else {
      return (
        <Loader theme="dark"/>
      )
    }
  }


  return (
    <div className="row">
      <div className="col-sm-8 col-xs-12 mbm">
        {renderContent()}
      </div>
    </div>
  )
}

export default Quote;
