import React, { Component } from 'react';
import axios from 'axios';
import Fuse from 'fuse.js';
import FilteredResult from './filteredResult'

const WAIT_INTERVAL = 150;

export default class Search extends Component {

  constructor() {
    super();
    this.state = {
      fuseItems: null,
      pattern: "",
      quickSearchStyle: {
        display: "none"
      },
      quickSearchResults: []
    }
  }

  componentDidMount() {
    const fuseOptions = {
      keys: [{
        name: "symbol",
        weight: .6
      }, {
        name: "companyName",
        weight: .4
      }]
    }

    axios.get('/api/stocks/fetchall').then(res => {
      let stocks = res.data;
      this.setState({
        fuseItems: new Fuse(stocks, fuseOptions)
      })
    })
  }

  filteredResultsHandler = (event) => {
    clearTimeout(this.timer);

    this.setState({
      pattern: event.target.value
    })

    // Execute the debounced onChange method
    this.timer = setTimeout(this.triggerChange, WAIT_INTERVAL);
  }

  triggerChange = () => {
    const pattern = this.state.pattern;
    const filteredresults = this.state.fuseItems.search(pattern).slice(0, 6)

    const quickSearchResults = filteredresults.map((res) => {
      return (
        <FilteredResult key={res.item.symbol} symbol={res.item.symbol} companyName={res.item.companyName} />
      );
    });

    let stateConfig = {
      pattern: pattern,
      quickSearchResults: quickSearchResults
    }

    if(pattern.length >= 2 && quickSearchResults.length > 0) {
      stateConfig.quickSearchStyle = { display: "list-item" }
    } else {
      stateConfig.quickSearchStyle = { display: "none" }
    }

    this.setState(stateConfig)
  }

  render() {
    return(
      <div>
        {!this.state.fuseItems ? (
          <div>loading...</div>
        ) : (
          <form className="mt-4">
            <div className="input-group mb-3">
              <input
                type="text"
                autoComplete="off"
                className="form-control"
                name="symbol"
                placeholder="BOX, SQ, Apple, ..."
                onChange={this.filteredResultsHandler}
              />
              <div className="input-group-append">
                <button className="btn btn-blue" type="submit" data-loading="Searching...">Search</button>
              </div>

              <div className="dropdown-menu col-md-12" style={this.state.quickSearchStyle}>
                {this.state.quickSearchResults}
              </div>
            </div>
          </form>
        )}
      </div>
    )
  }
}
