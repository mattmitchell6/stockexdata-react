import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import axios from 'axios';
import Fuse from 'fuse.js';
import FilteredResult from './FilteredResult'

import Loader from "./Loader";


const WAIT_INTERVAL = 150;

function SearchBar(props) {
  const [fuseItems, setFuseItems] = useState(null)
  const [symbol, setSymbol] = useState("")
  const [quickSearchStyle, setQuickSearchStyle] = useState({display: "none"})
  const [quickSearchResults, setQuickSearchResults] = useState([])
  const [timer, setTimer] = useState(null)
  const [error, setError] = useState(null)
  let history = useHistory();

  useEffect(() => {
    async function fetchAllStocks() {
      let result;
      const fuseOptions = {
        keys: [
          {name: "symbol", weight: .6},
          {name: "companyName", weight: .4}
        ]
      }

      result = await axios.get('/api/stocks/fetchall')
      setFuseItems(new Fuse(result.data, fuseOptions))
      // TODO: some err handling
    }

    if(!fuseItems) {
      fetchAllStocks();
    }
  }, [fuseItems])


  const filteredResultsHandler = (event) => {
    let timerResult;
    setSymbol(event.target.value)
    clearTimeout(timer);

    // Execute the debounced onChange method
    timerResult = setTimeout(triggerChange(event.target.value), WAIT_INTERVAL)
    setTimer(timerResult);
  }

  const triggerChange = (updatedPattern) => {
    let updatedSearchStyle;
    const filteredresults = fuseItems.search(updatedPattern).slice(0, 6)

    const updatedQuickSearchResults = filteredresults.map((res) => {
      return (
        <FilteredResult key={res.item.symbol} symbol={res.item.symbol} companyName={res.item.companyName} />
      );
    });

    if(updatedPattern.length >= 2 && updatedQuickSearchResults.length > 0) {
      updatedSearchStyle = { display: "list-item" }
    } else {
      updatedSearchStyle = { display: "none" }
    }

    setQuickSearchStyle(updatedSearchStyle)
    setQuickSearchResults(updatedQuickSearchResults)
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    if(fuseItems._docs.some((item) => item.symbol === symbol)) {
      history.push(`/${symbol}`)
    } else {
      setError(`Could not find symbol "${symbol}"`)
    }
  }

  const renderContent = () => {
    if(!fuseItems) {
      return <Loader />
    } else if(props.type === "home") {
      return (
        <div>
          {error && (
            <div className="alert alert-danger mbs mts" role="alert">
              {error}
              <button type="button" className="close mls" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-4">
            <div className="search mb-3">
              <span className="fa fa-search form-control-feedback mt10"></span>
              <input
                type="text"
                autoComplete="off"
                className="form-control"
                name="symbol"
                placeholder="Search"
                onChange={filteredResultsHandler}
              />

              <div className="dropdown-menu col-md-12" style={quickSearchStyle}>
                {quickSearchResults}
              </div>
            </div>
          </form>
        </div>
      )
    } else if(props.type === "nav") {
      return (
        <form className="form-inline" onSubmit={(e) => e.preventDefault()} style={{paddingRight: ".8rem"}}>
          <div className="search">
            <span className="fa fa-search form-control-feedback mt-2"></span>
            <input
              type="text"
              autoComplete="off"
              className="form-control form-control-sm"
              style={{width: "250px"}}
              name="symbol"
              placeholder="Search"
              onChange={filteredResultsHandler}
            />
            <div className="dropdown-menu col-md-12" style={quickSearchStyle}>
                {quickSearchResults}
            </div>
          </div>
        </form>
      )
    }
  }

  return(
    <div>
      {renderContent()}
    </div>
  )
}

export default SearchBar;
