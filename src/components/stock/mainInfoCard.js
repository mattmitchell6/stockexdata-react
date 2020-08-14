import React, { Component } from "react";
import Quote from './quote';

/**
 * main info card
 */
export default class MainInfoCard extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div className="card card-body mb20">
        <Quote symbol={this.props.symbol}/>
        <div className="row">
        </div>
      </div>
    )
  }
}
