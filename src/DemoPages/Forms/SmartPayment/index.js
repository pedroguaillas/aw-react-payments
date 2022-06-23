import React, { Fragment } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { Row, Col, Card, CardBody, Table, Button } from 'reactstrap'

import PageTitle from '../../../Layout/AppMain/PageTitle'
import FormPaymentModal from '../Payments/FormPaymentModal'

import { months } from '../PaymentHelpers'

class SmartPayment extends React.Component {
  state = {
    user: {},
    customers: [],
    payments: [],
    modal: false,
    payment: {}
  }

  componentDidMount () {
    const {
      match: { params }
    } = this.props
    // Simple POST request with a JSON body using fetch
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ year: 2022, id: params.id })
    }
    fetch(
      'https://ats.auditwhole.com/user/' + params.id + '/customers',
      requestOptions
    )
      .then(response => response.json())
      .then(res => {
        let { user, customers } = res
        this.setState({ user, customers })
      })
  }

  onPays = ruc => {
    fetch('https://ats.auditwhole.com/customers/' + ruc + '/payments')
      .then(response => response.json())
      .then(res => {
        let { customer, payments, year, month } = res
        this.setState({
          customer,
          payments,
          payment: {
            ...this.state.payment,
            cliente_auditwhole_ruc: ruc
          },
          year,
          month
        })
      })
  }

  //Show modal
  toggle = () => {
    let { year, month, customer } = this.state
    let payment = {
      year,
      month,
      cliente_auditwhole_ruc: customer.ruc,
      type: 'Efectivo',
      amount: customer.amount
    }
    this.setState(state => ({ modal: !state.modal, payment }))
  }

  handleChange = e => {
    this.setState({
      payment: {
        ...this.state.payment,
        [e.target.name]: e.target.value
      }
    })
  }

  handleChangeNumber = e => {
    let { value } = e.target
    if (isNaN(value)) {
      return
    }
    this.handleChange(e)
  }

  submit = () => {
    if (this.validate()) {
      // Simple POST request with a JSON body using fetch
      let { payment } = this.state
      const requestOptions = {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payment)
      }
      document.getElementById('btn-save').disabled = true
      requestOptions.method = 'POST'

      fetch('https://ats.auditwhole.com/payments', requestOptions)
        .then(response => response.json())
        .then(res => {
          let { payments, customers, customer } = this.state
          payments.unshift(res.payment)
          let indexcustom = customers.findIndex(
            item => item.ruc === customer.ruc
          )
          customers[indexcustom].total = payments.reduce(
            (sum, payment) => sum + Number(payment.amount),
            0
          )
          let { month, year } = res.payment
          if (month === 12) {
            month = 1
            year++
          } else {
            month++
          }
          this.setState({
            modal: false,
            customers,
            payments,
            year,
            month
          })
          document.getElementById('btn-save').disabled = false
        })
        .catch(() => {
          alert('Ya existe un cobro de ese mes')
        })
    }
  }

  validate = () => {
    let { payment } = this.state

    if (!(payment.amount > 0)) {
      alert('El monto debe ser un número')
      return
    }

    return true
  }

  render () {
    let { user, customers, customer, payments, modal, payment } = this.state
    const totalpayments = payments.reduce(
      (sum, payment) => sum + Number(payment.amount),
      0
    )

    return (
      <Fragment>
        <PageTitle
          heading='Cobros'
          subheading={user.name}
          icon='pe-7s-cash icon-gradient bg-tempting-azure'
        />
        <TransitionGroup>
          <CSSTransition
            component='div'
            className='TabsAnimation'
            appear={true}
            timeout={0}
            enter={false}
            exit={false}
          >
            {customers === null ? (
              <p>Cargando ...</p>
            ) : customers.length === 0 ? (
              <p>No existe pagos registrados</p>
            ) : (
              <Row>
                <FormPaymentModal
                  toggle={this.toggle}
                  modal={modal}
                  payment={payment}
                  handleChange={this.handleChange}
                  handleChangeNumber={this.handleChangeNumber}
                  submit={this.submit}
                />
                <Col lg='8'>
                  <Card className='main-card mb-3'>
                    <CardBody>
                      <Table size='sm' bordered responsive>
                        <thead>
                          <tr style={{ 'text-align': 'center' }}>
                            <th>RAZON SOCIAL</th>
                            <th>PAGADO</th>
                            <th style={{ width: '2em' }}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {customers.map((item, index) => (
                            <tr
                              key={index}
                              className={
                                customer !== undefined &&
                                customer.ruc === item.ruc
                                  ? 'table-active'
                                  : null
                              }
                            >
                              <td>{item.razonsocial}</td>
                              <td style={{ 'text-align': 'right' }}>
                                {item.total}
                              </td>
                              <th>
                                <Button
                                  className='font-icon-sm pb-0 pt-1'
                                  color='success'
                                  onClick={e => this.onPays(item.ruc)}
                                >
                                  <i className='pe-7s-cash'></i>
                                </Button>
                              </th>
                            </tr>
                          ))}
                        </tbody>
                        <thead>
                          <tr>
                            <th style={{ 'text-align': 'center' }}>TOTAL</th>
                            <th style={{ 'text-align': 'right' }}>
                              {customers.reduce((accumulator, object) => {
                                return accumulator + object.total
                              }, 0)}
                            </th>
                            <th></th>
                          </tr>
                        </thead>
                      </Table>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg='4'>
                  <Card className='main-card'>
                    <div className='card-header'>
                      {`${
                        customer === undefined ? 'Pagos' : customer.razonsocial
                      }`}
                      {customer === undefined ? null : (
                        <div className='btn-actions-pane-right'>
                          <div role='group' className='btn-group-sm btn-group'>
                            <button
                              onClick={e => this.toggle()}
                              className='btn btn-primary'
                            >
                              +
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    <CardBody>
                      <Table size='sm' bordered responsive>
                        <thead>
                          <tr style={{ 'text-align': 'center' }}>
                            <th>Mes</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {payments.map((payment, index) => (
                            <tr key={index}>
                              {/* -1 porque se refiere a la posicion del array */}
                              <td>{months[payment.month - 1].description}</td>
                              <td style={{ 'text-align': 'right' }}>
                                {payment.amount}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <th>Total</th>
                            <th style={{ 'text-align': 'right' }}>
                              {totalpayments}
                            </th>
                          </tr>
                        </tfoot>
                      </Table>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            )}
          </CSSTransition>
        </TransitionGroup>
      </Fragment>
    )
  }
}

export default SmartPayment
