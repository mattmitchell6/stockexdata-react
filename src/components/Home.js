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
function Home(props) {
  const auth = UseGoogleAuthContext()

  const handleAuthFailure = (event) => {
    console.log("failed google login");
    console.log(event);
  }

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
        <div className="card-body watchlist-item">
          <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            buttonText="Login with Google"
            onSuccess={auth.logIn}
            onFailure={handleAuthFailure}
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
            <h4 className="text-center white-text d-none d-sm-block">Search by symbol or company name</h4>

            <SearchBar type="home" />
          </div>

          {/* TODO: user watchlist */}
          <div className="col-md-8 mtm">
            <div className="card mbm">
              <div className="card-header">
                <h5>Watchlist</h5>
              </div>
              {renderUserContent()}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Home;
