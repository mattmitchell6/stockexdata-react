import React from "react";
import GoogleLogin from 'react-google-login';

import { UseGoogleAuthContext } from './GoogleAuth';
import Nav from './Nav';
import SearchBar from './SearchBar'
import Loader from './Loader';
import Watchlist from './Watchlist'

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
          <Watchlist />
        </div>
      )
    } else {
      return (
        <div class="card-body watchlist-item">
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
            <div class="card mbm">
              <div className="card-header">
                <h5>Watchlist</h5>
              </div>
              {renderUserContent()}
            </div>
            {/* <h5 className="white-text">Watchlist</h5> */}
            {/* <hr className="white-background"></hr> */}
          </div>

        </div>
      </div>
    </div>
  )
}

export default Home;
