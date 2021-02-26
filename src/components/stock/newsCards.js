import React, { Component } from "react";
import axios from 'axios'
import moment from 'moment';

import Loader from '../Loader'

/**
 * news cards
 */
export default class newsCards extends Component {

  constructor(props){
    super(props)
    this.state = {
      news: null
    }
  }

  componentDidMount() {
    axios.get(`/api/stocks/${this.props.symbol}/news`).then(res => {
      this.setState({
        news: res.data.news
      })
    })
  }


  render() {
    const news = this.state.news;

    return (
      <div className="card mb20">
        <div className="card-body">
          <h5 className="mb20">News</h5>

          {!news ? (
            <div>
              <Loader />
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
}
