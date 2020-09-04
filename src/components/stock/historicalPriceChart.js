import React from 'react';
import {Line} from 'react-chartjs-2'

function HistoricalPriceChart(props) {

  const data = {
    labels: props.dates,
    datasets: [{
      lineTension: 0,
      data: props.prices,
      backgroundColor: 'rgba(0, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 2
    }]
  }
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: false
    },
    elements: {
      point:{
        radius: 0
      }
    },
    scales: {
      yAxes: [{
        scaleLabel: {
          labelString: "Price",
          display: false
        },
        gridLines: {
          borderDash: [8, 4]
        }
      }],
      xAxes: [{
        type: "time",
        ticks: {
          autoSkip: true,
          maxTicksLimit: 20
        },
        time: {
          displayFormats: {'day': 'MM/YY'},
          tooltipFormat: 'MMM D, YYYY',
          unit: 'month',
        },
        gridLines: {
          display: false
        },
        scaleLabel: {
          labelString: "Date"
        }
      }]
    },
    tooltips: {
      mode: 'index',
      intersect: false
    },
    hover: {
      mode: 'index',
      intersect: false
    }
  }

  return(
    <div>
      <Line data={data} options={options} height={407}/>
    </div>
  )
}

export default HistoricalPriceChart;
