
import React, { Component } from "react";
import axios from 'axios'
import moment from 'moment'
import numeral from 'numeral';

import Loader from "../Loader";

/**
 * quote
 */
export default class Quote extends Component {

  constructor(props){
    super(props)
    this.state = {
      quote: null
    }
  }

  componentDidMount() {
    axios.get(`/api/stocks/${this.props.symbol}/quote`).then(res => {
      this.setState({
        quote: res.data
      })
    })
  }

  dailyChange = (change, changePercent) => {
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


  render() {
    let html;
    let quote = this.state.quote;

    if(quote) {
      html = (
        <div>
          <h4>
            {quote.companyName} <span className="text-muted">({quote.symbol})</span>
            {/* {{#if user}}
              {{#if_in_list stock.quote.symbol user.watchlist}}
                <a href="/watchlist/remove/{{stock.quote.symbol}}"><span class="watchlist"><i class="fas fa-star "></i></span></a>
              {{else}}
                <a href="/watchlist/add/{{stock.quote.symbol}}"><span class="watchlist"><i class="far fa-star"></i></span></a>
              {{/if_in_list}}
            {{else}}
              <a href="/auth/google"><span class="watchlist"><i class="far fa-star"></i></span></a>
            {{/if}} */}
          </h4>
          <h3>
            <span className="price" style={{fontWeight: "500"}}>{numeral(quote.latestPrice).format('$0,0.00')}</span>

            {this.dailyChange(quote.dailyChange.change, quote.dailyChange.changePercent)}
          </h3>
          <div className="textMuted" style={{fontSize: "80%"}}>
            updated {moment(quote.latestUpdate).format('MM/DD h:mm a z')}
          </div>
        </div>
      )
    } else {
      html = (
        <Loader />
      )
    }


    return (
      <div className="row">
        <div className="col-sm-8 col-xs-12 mbm">
          {html}
        </div>
      </div>
    )
  }
}
