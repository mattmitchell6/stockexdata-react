import React, { Component } from 'react';

function FilteredResult(props) {
  // if(pattern.length >= 2 && fuse) {
  //   results = fuse.search(pattern)
  //
  //   if(results.length > 0) {
  //     filteredResultsContainer.style.display = "list-item";
  //     // update html
  //     var filteredResults = document.getElementById('filteredResults')
  //     var html = "";
  //     for(var i = 0; i < results.length && i < 7; i++) {
  //       html += `<a class="dropdown-item" href="/${results[i].item.symbol}">`
  //       html += '<div class="row">'
  //       html += `<div class="bold col-md-4">${results[i].item.symbol}</div>`
  //       html += `<div class="col-md-8 overflow">${results[i].item.companyName}</div>`
  //       html += '</div></a>'
  //     }
  return(
    <div>
      <a className="dropdown-item" href="#">
        <div className="row">
          <div className="bold col-md-4">{props.symbol}</div>
          <div className="col-md-8 overflow">{props.companyName}</div>
        </div>
      </a>
    </div>
  )
}

export default FilteredResult;
