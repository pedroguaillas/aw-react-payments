import React from 'react'
import { Bar } from 'react-chartjs-2'
import { months } from './../../Forms/PaymentHelpers'

class ByMonth extends React.Component {
  render () {
    let { payment_months } = this.props

    if (payment_months.lenght === 0) {
      return null
    }
    let data = {
      labels: payment_months.map(
        pm => months[months.findIndex(m => m.code === pm.month1)].description
      ),
      datasets: [
        {
          label: 'Ingresos por meses',
          backgroundColor: 'rgba(25,99,132,0.2)',
          borderColor: 'rgba(25,99,132,1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(25,99,132,0.4)',
          hoverBorderColor: 'rgba(25,99,132,1)',
          borderCapStyle: 'round',
          data: payment_months.map(element => element.amount)
        }
      ]
    }

    return (
      <div>
        <Bar
          data={data}
          width={100}
          height={50}
          options={{
            maintainAspectRatio: true
          }}
        />
      </div>
    )
  }
}

export default ByMonth
