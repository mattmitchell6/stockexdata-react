import React from 'react';
import logo from '../logo.png';
import '../App.css';

/**
 * Navbar component
 */
function Nav(props) {
  return (
    <div>
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark">

        <div className="container">
          <div className="navbar-header">
            <a href="/" className="navbar-brand">
              <img src={logo} height="45px" alt="" />
            </a>
          </div>

          <button className="navbar-toggler mb-2" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">

            {/* TODO: componentize this... */}
            {props.displayNavSearch &&
              <form action="/search" method="get" className="form-inline" style={{paddingRight: ".8rem"}}>
                <div className="search">
                  <span className="fa fa-search form-control-feedback mt-2"></span>
                  <input type="text" autocomplete="off" className="form-control form-control-sm" id="stockInput" style={{width: "250px"}} name="symbol" placeholder="stock lookup" />
                  <div className="dropdown-menu col-md-12" id="filteredResultsContainer">
                    <div id="filteredResults"></div>
                  </div>
                </div>
              </form>
            }
            <ul className="navbar-nav mr-auto">
              <li className="nav-item active">
                {/* TODO: user auth */}
                {/* {{#if user}}
                  <a class="login-link" href="/auth/logout">Logout</a>
                {{else}}
                  <a class="btn btn-sm btn-light" href="/auth/google">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1024px-Google_%22G%22_Logo.svg.png" height="18px" style="margin-right: 3px" alt="">
                    Login
                  </a>
                {{/if}} */}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Nav;
