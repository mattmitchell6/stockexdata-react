import React, { useState } from "react";
import axios from 'axios';

import Loader from './Loader';

/**
 * Watchlist item
 */
function WatchlistItem(props) {

  return (
    <div>
      <div key={props.symbol} class="card mvs card-body">
        <div class="row watchlist-item">
          <div class="col-6 overflow">
            <a href={`/${props.symbol}`}><h5>{props.symbol}</h5></a>
            <span>comp name</span>
          </div>
          <div class="col-6">
            <div class="price pull-right">price</div>
            <br></br>
            <div class="daily-change-watchlist pull-right mtxs">chnge</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WatchlistItem;
