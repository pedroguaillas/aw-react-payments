import React from 'react'
import { Pie } from 'react-chartjs-2'

class ByType extends React.Component {
  render () {
    let { payment_types } = this.props

    if (payment_types.lenght === 0) {
      return null
    }

    let data = {
      labels: payment_types.map(pt => pt.type),
      datasets: [
        {
          data: payment_types.map(pt => pt.amount),
          backgroundColor: ['#444054', '#F7B924', '#3AC47D', '#30B1FF'],
          hoverBackgroundColor: ['#111021', '#D49601', '#08A14B', '#0090DD']
        }
      ]
    }
    return (
      <div>
        <Pie dataKey='value' data={data} />
      </div>
    )
  }
}

export default ByType
