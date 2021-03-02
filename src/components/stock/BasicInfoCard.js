import React, { useState, useEffect } from "react";
import axios from 'axios'
import numeral from 'numeral'

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

    if(!basicInfo) {
      fetchBasicInfo()
    }
  }, [basicInfo, props])

  const toggleReadMore = (e) => {
    e.preventDefault()

    setReadMore(!readMore)
  }


  return (
    <div>
      {basicInfo && basicInfo.issueType === "cs" && (
        <div className="card card-body mb20">
          <div className="row">
            <div className="col-12">
              <h5 className="mbm">About {basicInfo.companyName}</h5>
              {basicInfo.description && (
                <div>
                  {!readMore ? (
                    <div>
                      <div>{basicInfo.description.substr(0, 200) + "... "}</div>
                      <span className="readmore" onClick={toggleReadMore}>Read More</span>
                    </div>
                  ) : (
                    <div>
                      <div>{basicInfo.description}</div>
                      <span className="readmore" onClick={toggleReadMore}>Read Less</span>
                    </div>
                  )}
                </div>
              )}
              <hr/>

              {basicInfo.website && (
                <div>
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
                </div>
              )}

              {basicInfo.website && (
                <div>
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
                </div>
              )}

              {basicInfo.city && basicInfo.state && (
                <div>
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
                </div>
              )}

              {basicInfo.sector && (
                <div>
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
              )}

              {basicInfo.employees && (
                <div>
                  <div className="row">
                    <div className="col-4">
                      Employees
                    </div>
                    <div className="col-8 overflow">
                      <span className="pull-right bold employees">
                        {numeral(basicInfo.employees).format('0,0')}
                      </span>
                    </div>
                  </div>
                  <hr/>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BasicInfoCard
