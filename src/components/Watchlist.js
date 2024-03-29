import React from "react";

import { UseGoogleAuthContext } from './GoogleAuth';
import WatchlistItem from './WatchlistItem'

/**
 * Watchlist
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
        <div className="card-body watchlist-item">
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
