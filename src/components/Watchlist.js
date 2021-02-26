import React, { useState } from "react";
import axios from 'axios';

import { UseGoogleAuthContext } from './GoogleAuth';
import Loader from './Loader';
import WatchlistItem from './WatchlistItem'

/**
 * Home page component
 */
function Watchlist() {
  const auth = UseGoogleAuthContext()

  const renderItems = () => {
    if(auth.user.watchlist.length > 0) {
      return (
        auth.user.watchlist.map((symbol) => {
          return <WatchlistItem key={symbol} symbol={symbol}/>
        })
      )
    } else {
      return (
        <div className="white-text">
          Your watchlist is empty. Search for stocks and add them to your watchlist.
        </div>
      )
    }
  }

  return (
    <div>
      {renderItems()}
    </div>
  )
}

export default Watchlist;
