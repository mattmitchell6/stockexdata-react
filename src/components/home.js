import React, { useState } from "react";
import axios from 'axios';
import GoogleLogin from 'react-google-login';

import { UseGoogleAuthContext } from './GoogleAuth';
import Nav from './nav';
import SearchBar from './SearchBar'
import Loader from './Loader';
import WatchListItems from './WatchlistItems'

/**
 * Home page component
 */
function Home() {
  const auth = UseGoogleAuthContext()

  const renderUserContent = () => {
    if(auth.loading) {
      return <Loader />
    } else if(auth.user) {
      return (
        <div>
          <WatchListItems />
        </div>
      )
    } else {
      return (
        <div>
          <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            buttonText="Login with Google"
            onSuccess={auth.logIn}
            onFailure={null}
            cookiePolicy={'single_host_origin'}
          />
          <span className="white-text">
            &nbsp;to create and view your watchlist
          </span>
        </div>
      )
    }
  }

  return (
    <div>
      <Nav displayNavSearch={false} />
      <div className="container mtm">
        <div className="row d-flex justify-content-center">

          <div className="col-md-6">
            {/* TODO: flash messages */}

            <h4 className="text-center white-text">Search by symbol or company name</h4>

            <SearchBar type="home" />
          </div>

          {/* TODO: user watchlist */}
          <div className="col-md-8 mtm">
            <h5 className="white-text">Watchlist</h5>
            <hr className="white-background"></hr>

            {renderUserContent()}
          </div>


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
    </div>
  )
}

export default Home;
