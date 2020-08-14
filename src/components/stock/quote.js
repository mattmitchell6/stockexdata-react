import React, { Component } from "react";
import axios from 'axios'
import moment from 'moment'

/**
 * quote
 */
export default class Quote extends Component {

  constructor(props){
    super(props)
    this.state = {
      quote: null,
      dailyStyle: null
    }
  }

  componentDidMount() {
    let quote, dailyStyle;
    axios.get(`/api/stocks/${this.props.symbol}/quote`).then(res => {
      quote = res.data;

      if(quote.change > 0) {
        dailyStyle = "green"
      } else if(quote.change == 0) {
        dailyStyle = "neutral"
      } else {
        dailyStyle = "red"
      }
      this.setState({
        quote: quote,
        dailyStyle: dailyStyle
      })
    })
  }


  render() {
    let html;
    let quote = this.state.quote;

    if(quote) {
      html = (
        <div>
          <h4>
            {quote.companyName} <span className="textMuted">({quote.symbol})</span>
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
            <span className="price" style={{fontWeight: "500"}}>${quote.latestPrice}</span>

            <span className={`dailyChange ${this.state.dailyStyle}`} style={{fontSize: "70%"}}>
               {quote.dailyChange.change}% ({quote.dailyChange.changePercent})
              {/* // change="{{stock.quote.dailyChange.change}}"
              // change-percent="{{stock.quote.dailyChange.changePercent}}"> */}
            </span>
          </h3>
          <div className="textMuted" style={{fontSize: "80%"}}>updated <span className="date"></span>last updated...</div>
        </div>
      )
    } else {
      html = (
        <div>loading...</div>
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
