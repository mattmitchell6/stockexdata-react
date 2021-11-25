import React from 'react';
import GoogleLogin from 'react-google-login';
import logo from '../logo.png';
import '../App.css';

import SearchBar from './SearchBar'
import Loader from './Loader'
import { UseGoogleAuthContext } from './GoogleAuth';

/**
 * Navbar component
 */
function Nav(props) {
  const auth = UseGoogleAuthContext()

  const handleAuthFailure = () => {
    console.log("failed google login");
  }

  const renderUserContent = () => {
    if(auth.loading) {
      return <Loader />
    } else if(auth.user) {
      return (
        <span className="login-link" onClick={auth.logOut}>Logout</span>
      )
    } else {
      return (
        <GoogleLogin
          clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
          buttonText="Login"
          onSuccess={auth.logIn}
          onFailure={handleAuthFailure}
          cookiePolicy={'single_host_origin'}
          style={{fontSize: "8px"}}
        />
      )
    }
  }

  return (
    <div>
      <nav className="navbar navbar-expand-sm navbar-dark">
        {/* navbar-dark bg-dark */}

        <div className="container">
          <div className="navbar-header">
            <a href="/" className="navbar-brand">
              <img src={logo} height="45px" alt="" />
              {/* stockex data */}
            </a>
          </div>

          <button className="navbar-toggler mb-2" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">

            {/* TODO: componentize this... */}
            {props.displayNavSearch &&
              <SearchBar type="nav" />
            }
            <ul className="navbar-nav mr-auto">
              <li className="nav-item active">
                {renderUserContent()}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Nav;
