import React, { Component } from "react";

/**
 * quote
 */
export default class Quote extends Component {

  render() {

    return (
      <div className="col-sm-8 col-xs-12 mbm">
        {/* <h4>
          {{stock.quote.companyName}} <span class="text-muted">({{stock.quote.symbol}})</span>
          {{#if user}}
            {{#if_in_list stock.quote.symbol user.watchlist}}
              <a href="/watchlist/remove/{{stock.quote.symbol}}"><span class="watchlist"><i class="fas fa-star "></i></span></a>
            {{else}}
              <a href="/watchlist/add/{{stock.quote.symbol}}"><span class="watchlist"><i class="far fa-star"></i></span></a>
            {{/if_in_list}}
          {{else}}
            <a href="/auth/google"><span class="watchlist"><i class="far fa-star"></i></span></a>
          {{/if}}
        </h4>
        <h3>
          <span class="price" data-price="{{stock.quote.latestPrice}}" style="font-weight: 500"></span>
          <span class="daily-change" style="font-size: 70%"
            change="{{stock.quote.dailyChange.change}}"
            change-percent="{{stock.quote.dailyChange.changePercent}}">
          </span>
        </h3>
        <div class="text-muted" style="font-size: 80%">updated <span class="date" data-date="{{stock.quoteLastUpdated}}"></span></div> */}
      </div>
    )
  }
}
