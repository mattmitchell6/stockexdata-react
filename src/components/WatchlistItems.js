import React, { useState } from "react";
import axios from 'axios';

import { UseGoogleAuthContext } from './GoogleAuth';
import Loader from './Loader';

/**
 * Home page component
 */
function WatchListItems() {
  const auth = UseGoogleAuthContext()

  const renderItems = () => {
    if(auth.user.watchlist.length > 0) {
      return (
        <div>Here are the watchlist items...</div>
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

export default WatchListItems;
