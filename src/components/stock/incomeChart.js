import React from 'react';
import {Bar} from 'react-chartjs-2'
import numeral from 'numeral'

function IncomeChart(props) {

  const data = {
    labels: props.fiscalPeriods.quarterly,
    datasets: [{
      label: "Revenue",
      data: props.income.totalRevenueData.quarterly,
      backgroundColor: 'rgba(130, 205, 255, 0.2)',
      borderColor: '#2BAAFF',
      borderWidth: 1
    }, {
      label: "Earnings",
      data: props.income.netIncomeData.quarterly,
      backgroundColor: 'rgba(255, 208, 227, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1
    }]
  }

  const options = {
    legend: {
      display: true
    },
    elements: {
      point:{
        radius: 0
      }
    },
    scales: {
      yAxes: [{
        gridLines: {
          borderDash: [8, 4]
        },
        // ticks: {
        //   callback: function(value, index, values) {
        //     return numeral(value).format('0.00a').toUpperCase()
        //   }
        // }
      }],
      xAxes: [{
        gridLines: {
          display: false
        }
      }]
    },
    tooltips: {
      mode: 'index',
      intersect: false,
      callbacks: {
        label: function(tooltipItem, data) {
          return data.datasets[tooltipItem.datasetIndex].label + ": " +
            numeral(tooltipItem.value).format('0.00a').toUpperCase()
        }
      }
    },
    hover: {
      mode: 'index',
      intersect: false
    }
  }

  return(
    <div style={{height: "224px"}}>
      <Bar data={data} options={options}/>
    </div>
  )
}

export default IncomeChart;
