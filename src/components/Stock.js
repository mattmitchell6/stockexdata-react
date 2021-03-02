import React, { Component } from "react";
import Nav from './Nav'
import MainInfoCard from './stock/MainInfoCard'
import BasicInfoCard from './stock/BasicInfoCard'
import HistoricalPriceCard from './stock/HistoricalPriceCard'
import IncomeCard from './stock/IncomeCard'
import NewsCards from './stock/NewsCard'

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

                <div className="row">
                  <div className="col-lg-4 col-md-12">
                    <BasicInfoCard symbol={params.symbol} />

                    <IncomeCard symbol={params.symbol} />
                  </div>

                  <div className="col-lg-8 col-md-12">
                    <HistoricalPriceCard symbol={params.symbol} />

                    <NewsCards symbol={params.symbol} />
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
