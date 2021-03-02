import React, { useState, useEffect } from "react";
import axios from 'axios'
import moment from 'moment';

import Loader from '../Loader'

/**
 * news card
 */
function NewsCard(props) {
  const [news, setNews] = useState(null)

  useEffect(() => {
    async function fetchNews() {
      const res = await axios.get(`/api/stocks/${props.symbol}/news`)

      if(res.data && res.data.news) {
        setNews(res.data.news)
      }
    }

    if(!news) {
      fetchNews()
    }
  }, [news, props])

  return (
    <div className="card mb20">
      <div className="card-body">
        <h5 className="mb20">News</h5>

        {!news ? (
          <div>
            <Loader theme="dark"/>
          </div>
        ) : (
          <div>
            {news.map((item) => {
              return (
                <div key={item.url}>
                  <div className="row mbs">
                    <div className="col-md-4">
                      <img className="news-image" src={item.image} alt="" />
                    </div>
                    <div className="col-md-8">
                      <div className="text-muted" style={{fontSize: "11px"}}>
                        <span className="news-date" ></span>{moment(item.datetime).format('MMM DD, YYYY')} | {item.source}
                      </div>
                      <a href={item.url}>
                        {item.headline}
                        <div className="text-muted news">
                          {item.summary}
                        </div>
                      </a>
                    </div>
                  </div>
                  <hr/>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default NewsCard
