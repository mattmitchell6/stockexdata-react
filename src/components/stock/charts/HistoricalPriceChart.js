import React from 'react';
import { Line } from 'react-chartjs-2'

function HistoricalPriceChart(props) {

  const data = {
    labels: props.dates,
    datasets: [{
      lineTension: 0,
      data: props.prices,
      backgroundColor: '#D3E4CD',
      borderColor: '#ADC2A9',
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
    <div className="historical-container">
      <Line data={data} options={options} />
    </div>
  )
}

export default HistoricalPriceChart;
