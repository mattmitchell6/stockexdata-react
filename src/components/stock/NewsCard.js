import React, { useState, useEffect } from "react";
import axios from 'axios'
import moment from 'moment';

import Loader from '../Loader'

/**
 * news card
 */
function NewsCard(props) {
  const [news, setNews] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchNews() {
      const res = await axios.get(`/api/stocks/${props.symbol}/news`)

      if(res.data && res.data.news) {
        setNews(res.data.news)
        setLoading(false)
      }
    }

    if(loading) {
      fetchNews()
    }
  }, [news, props])

  const renderContent = () => {
    if(loading) {
      return <Loader theme="dark"/>
    } else if(news && news.length > 0) {
      return (
        <div className="card mb20">
          <div className="card-body">
            <h5 className="mb20">News</h5>
            <hr/>
            {news.map((item) => {
              return (
                <div key={item.url}>
                  <div className="row mbs">
                    <div className="col-md-4 news-image-container">
                      <img className="news-image" src={item.image} alt="" />
                    </div>
                    <div className="col-md-8">
                      <div className="text-muted" style={{fontSize: "11px"}}>
                        <span className="news-date" ></span>{moment(item.datetime).format('MMM DD, YYYY')} | {item.source}
                      </div>
                      <a href={item.url}>
                        <div class="news-link">
                          {item.headline}
                        </div>                        
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
        </div>
      )
    }
  }

  return (
    <div>
      {renderContent()}
    </div>
  )
}

export default NewsCard
