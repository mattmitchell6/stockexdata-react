import React from 'react';

function Loader(props) {
  const theme = props.theme ? props.theme : "light"

  return(
    <div className="mts" style={{textAlign: "center"}}>
      <div className={`loader ${theme}`} ></div>
    </div>
  )
}

export default Loader;
