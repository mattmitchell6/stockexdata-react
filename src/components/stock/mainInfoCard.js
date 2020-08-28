import React, { Component } from "react";
import axios from 'axios'
import Quote from './quote';

/**
 * main info card
 */
export default class MainInfoCard extends Component {

  constructor(props){
    super(props)
    this.state = {
      basicInfo: null
    }
  }

  // Similar to componentDidMount and componentDidUpdate:
  componentDidMount() {
    axios.get(`/api/stocks/${this.props.symbol}/basicinfo`).then(res => {
      this.setState({
        basicInfo: res.data
      })
    })
  }

  // useEffect(() => {
  //   console.log('call use effect...');
  //   //
  // });

  displayLogo = () => {
    const basicInfo = this.state.basicInfo;
    console.log("display logo");

    if(basicInfo) {

      return (
        <img src={basicInfo.logo} height="50px" alt="" className="pull-right logo" />
      )
    } else {
      return (
        <div  className="pull-right" >loading...</div>
      )
    }
  }

  render() {
    return (
      <div className="card card-body mb20">
        <div className="row">
          <div className="col-sm-8 col-xs-12 mbm">
            <Quote symbol={this.props.symbol}/>
          </div>

          <div className="col-sm-4 d-none d-sm-block mbm">
            {this.displayLogo()}
          </div>
        </div>

        {/* <div className="row">
        </div> */}
      </div>
    )
  }
}
