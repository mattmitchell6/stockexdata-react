import React, { Component } from "react";
import Nav from './nav'
import MainInfoCard from './stock/mainInfoCard'

/**
 * stock page
 */
export default class Stock extends Component {

  render() {
    const { match: { params } } = this.props;


    return (
      <div>
        <Nav displayNavSearch={true} />
        <div className="container mtm">
          <div className="row d-flex justify-content-center">
            <div className="tab-content col-md-12">
              <div className="tab-pane show active" id="login" role="tabpanel" aria-labelledby="login">

                {/* main info card */}
                <MainInfoCard symbol={params.symbol} />

              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
