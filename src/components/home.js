import React, { Component } from "react";

/**
 * Home page component
 */
export default class Home extends Component {

  render() {
    return (
      <div className="container mtm">
        <div className="row d-flex justify-content-center">

          <div className="col-md-6">
            {/* TODO: flash messages */}

            <h4 className="text-center white-text">Search by symbol or company name</h4>

            {/* TODO: replace with search component */}
            <form className="mt-4">
              <div className="input-group mb-3">
                <input type="text" autocomplete="off" className="form-control" id="stockInput" name="symbol" placeholder="BOX, SQ, Apple, ..." />
                <div className="dropdown-menu col-md-12" id="filteredResultsContainer">
                  <div id="filteredResults"></div>
                </div>
                <div className="input-group-append">
                  <button className="btn btn-blue" type="submit" data-loading="Searching...">Search</button>
                </div>
              </div>
            </form>
          </div>

          {/* TODO: user watchlist */}
          {/* <div class="col-md-8 mtm">
            <h5 class="white-text">Watchlist</h5>
            <hr class="white-background">
            {{#if user}}
              {{#if user.watchlist}}
                <div id="watchlist-container">
                  <div id="watchlist-spinner" class="text-center"></div>
                </div>
              {{else}}
              <div class="white-text">
                Your watchlist is empty. Search for stocks and add them to your watchlist.
              </div>
              {{/if}}
            {{else}}
              <a href="/auth/google" class="btn btn-light btn-sm">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1024px-Google_%22G%22_Logo.svg.png" height="18px" style="margin-right: 3px" alt="">
                Login with Google
              </a>
              <span class="white-text">
                to create and view your watchlist
              </span>
            {{/if}}
          </div> */}

        </div>
      </div>
    )
  }
}
