import React from 'react';

function FilteredResult(props) {
  return(
    <div>
      <a className="dropdown-item" href={`/${props.symbol}`}>
        <div className="row">
          <div className="bold col-md-4">{props.symbol}</div>
          <div className="col-md-8 overflow">{props.companyName}</div>
        </div>
      </a>
    </div>
  )
}

export default FilteredResult;
