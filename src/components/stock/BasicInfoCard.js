import React, { useState, useEffect } from "react";
import axios from 'axios'

/**
 * basic info card
 */
function BasicInfoCard(props) {
  const [basicInfo, setBasicInfo] = useState(null)
  const [readMore, setReadMore] = useState(false)

  useEffect(() => {
    async function fetchBasicInfo() {
      const res = await axios.get(`/api/stocks/${props.symbol}/basicinfo`)

      if(res.data) {
        setBasicInfo(res.data)
      }
    }

    fetchBasicInfo()
  }, [basicInfo, props])

  const toggleReadMore = (e) => {
    e.preventDefault()

    setReadMore(!readMore)
  }


  return (
    <div>
      {basicInfo && basicInfo.description &&
        <div className="card card-body mb20">
          <div className="row">
            <div className="col-12">
              <h5 className="mbm">About {basicInfo.companyName}</h5>
              {!readMore ? (
                <div>
                  <div>{basicInfo.description.substr(0, 200) + "... "}</div>
                  <a href="#" onClick={toggleReadMore}>Read More</a>
                </div>
              ) : (
                <div>
                  <div>{basicInfo.description}</div>
                  <a href="#" onClick={toggleReadMore}>Read Less</a>
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
  )
}

export default BasicInfoCard
