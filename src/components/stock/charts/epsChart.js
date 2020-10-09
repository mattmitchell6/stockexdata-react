import React from 'react';
import { Line } from 'react-chartjs-2'
import numeral from 'numeral'

function epsChart(props) {

  let data = {
      labels: props.earningsPeriods,
      datasets: [{
        label: "Actual",
        data: props.earningsActual,
        backgroundColor: '#2BAAFF',
        borderColor: '#2BAAFF',
        borderWidth: 1,
        fill: false,
        showLine: false,
        pointHoverRadius: 8
      }, {
        label: "Estimate",
        data: props.earningsEstimate,
        backgroundColor: 'rgba(255, 208, 227, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        fill: false,
        showLine: false,
        pointHoverRadius: 8
      }]
    }
  data = JSON.parse(JSON.stringify(data));

  const options = {
    legend: {
      display: true
    },
    elements: {
      point:{
        radius: 8
      }
    },
    scales: {
      yAxes: [{
        gridLines: {
          borderDash: [8, 4]
        }
      }],
      xAxes: [{
        gridLines: {
          display: false
        }
      }]
    },
    tooltips: {
      mode: 'index',
      intersect: false
    }
  }

  return(
    <div>
      <Line data={data} options={options}  height={224}/>
    </div>
  )
}

export default epsChart;
