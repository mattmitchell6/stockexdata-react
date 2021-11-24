import React from 'react';
import { Bar } from 'react-chartjs-2'
import numeral from 'numeral'

function IncomeChart(props) {

  let data = {
    labels: props.incomePeriods,
    datasets: [{
      label: "Revenue",
      data: props.totalRevenueData,
      backgroundColor: '#D3E4CD',
      borderColor: '#ADC2A9',
      borderWidth: 1
    }, {
      label: "Earnings",
      data: props.netIncomeData,
      backgroundColor: '#E6C4C0',
      borderColor: '#CA8A8B',
      borderWidth: 1
    }]
  }
  data = JSON.parse(JSON.stringify(data));

  const options = {
    legend: {
      display: true
    },
    elements: {
      point: {
        radius: 0
      }
    },
    scales: {
      yAxes: [{
        gridLines: {
          borderDash: [8, 4]
        },
        ticks: {
          callback: function(value, index, values) {
            return numeral(value).format('0.00a').toUpperCase()
          }
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
    <div>
      <Bar data={data} options={options}  height={224}/>
    </div>
  )
}

export default IncomeChart;
