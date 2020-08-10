import React, { Component } from 'react';
import axios from 'axios';
import Fuse from 'fuse.js';
import FilteredResult from './filteredResult'

export default class Search extends Component {

  constructor() {
    super();
    this.state = {
      fuseItems: null,
      pattern: null,
      options: {
        keys: [{
          name: "symbol",
          weight: .6
        }, {
          name: "companyName",
          weight: .4
        }]
      }
    }
  }

  componentDidMount() {
    axios.get('/api/stocks/all').then(res => {
      let stocks = res.data;
      this.setState({
        fuseItems: new Fuse(stocks, this.state.options)
      })
    })
  }

  filteredResultsHandler = (event) => {
    let pattern = event.target.value
    this.setState({
      pattern: pattern
    })
  }

  render() {
    let results;

    if(this.state.pattern && this.state.pattern.length >= 2) {
      const filteredresults = this.state.fuseItems.search(this.state.pattern).slice(0, 6)

      results = filteredresults.map((res) => {
        return (
          <FilteredResult key={res.item.symbol} symbol={res.item.symbol} companyName={res.itemcompanyName} />
          // <li key={move}>
          //   <button onClick={() => this.jumpTo(move)}>{desc}</button>
          // </li>
        );
      });
      console.log(results);
    }


    return(
      <div>
        <form className="mt-4">
          <div className="input-group mb-3">
            <input
              type="text"
              autoComplete="off"
              className="form-control"
              id="stockInput"
              name="symbol"
              placeholder="BOX, SQ, Apple, ..."
              onChange={this.filteredResultsHandler}
            />
            <div className="dropdown-menu col-md-12" id="filteredResultsContainer">
              {/* <div id="filteredResults"></div> */}
              {results &&
                results
              }
            </div>
            <div className="input-group-append">
              <button className="btn btn-blue" type="submit" data-loading="Searching...">Search</button>
            </div>
          </div>
        </form>
      </div>
    )
  }
}
