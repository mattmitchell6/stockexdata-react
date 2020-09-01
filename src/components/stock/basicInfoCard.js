import React, { Component } from "react";
import axios from 'axios'

/**
 * main info card
 */
export default class BasicInfoCard extends Component {

  constructor(props){
    super(props)
    this.state = {
      basicInfo: null,
      readMore: false
    }
  }

  componentDidMount() {
    axios.get(`/api/stocks/${this.props.symbol}/basicinfo`).then(res => {
      this.setState({
        basicInfo: res.data
      })
    })
  }

  toggleReadMore = (e) => {
    e.preventDefault()

    const readMore = this.state.readMore;

    this.setState({
      readMore: !readMore
    })
  }


  render() {
    const basicInfo = this.state.basicInfo;
    const readMore = this.state.readMore

    return (
      <div className="row">
        <div className="col-lg-4 col-md-12">
          {basicInfo && basicInfo.description &&
            <div className="card card-body mb20">
              <div className="row">
                <div className="col-12">
                  <h5 className="mbm">About {basicInfo.companyName}</h5>
                  {!readMore ? (
                    <div>
                      <div>{basicInfo.description.substr(0, 200) + "... "}</div>
                      <a href="#" onClick={this.toggleReadMore}>Read More</a>
                    </div>
                  ) : (
                    <div>
                      <div>{basicInfo.description}</div>
                      <a href="#" onClick={this.toggleReadMore}>Read Less</a>
                    </div>
                  )}
                  <hr/>

                  <div className="row">
                    <div className="col-4">
                      Website
                    </div>
                    <div className="col-8 overflow">
                      <div className="pull-right">
                        <a href={basicInfo.website}>{basicInfo.website}</a>
                      </div>
                    </div>
                  </div>
                  <hr/>

                  <div className="row">
                    <div className="col-4">
                      CEO
                    </div>
                    <div className="col-8 overflow">
                      <div className="pull-right">
                        <span className="bold">{basicInfo.CEO}</span>
                      </div>
                    </div>
                  </div>
                  <hr/>

                  <div className="row">
                    <div className="col-4">
                      HQ
                    </div>
                    <div className="col-8 overflow">
                      <div className="pull-right">
                        <span className="bold">{basicInfo.city}, {basicInfo.state}</span>
                      </div>
                    </div>
                  </div>
                  <hr/>

                  <div className="row">
                    <div className="col-4">
                      Sector
                    </div>
                    <div className="col-8 overflow">
                      <div className="pull-right">
                        <span className="bold">{basicInfo.sector}</span>
                      </div>
                    </div>
                  </div>
                  <hr/>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    )
  }
}
