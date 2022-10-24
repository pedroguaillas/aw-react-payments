import React, { Fragment } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { Row, Col, Card, CardBody, Table, Button } from 'reactstrap'

import PageTitle from '../../../Layout/AppMain/PageTitle'
import FormPaymentModal from '../Payments/FormPaymentModal'

import { months, types } from '../PaymentHelpers'
import axios from '../../../api/axios'

class SmartPayment extends React.Component {
  state = {
    user: {},
    customers: [],
    payments: [],
    modal: false,
    payment: {}
  }

  async componentDidMount() {
    const {
      match: { params }
    } = this.props
    try {
      await axios
        .post(`user/${params.id}/customers`, { year: 2022, id: params.id })
        .then(({ data: { user, customers } }) => {
          this.setState({ user, customers })
        })
    } catch (err) {
      console.log(err)
    }
  }

  onPays = async ruc => {
    try {
      await axios
        .get(`customers/${ruc}/payments`)
        .then(({ data: { customer, payments, year, month } }) => {
          this.setState({
            customer, payments,
            payment: {
              ...this.state.payment,
              cliente_auditwhole_ruc: ruc
            }, year, month
          })
        })
    } catch (err) {
      console.log(err)
    }
  }

  //Show modal
  toggle = () => {
    let date = new Date()
    date.setHours(date.getHours() - 5)
    date = date.toISOString().substring(0, 10)
    let { year, month, customer } = this.state
    let payment = {
      year,
      month,
      cliente_auditwhole_ruc: customer.ruc,
      type: 'Efectivo',
      amount: customer.amount,
      date
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

  submit = async () => {
    if (this.validate()) {
      // Simple POST request with a JSON body using fetch
      let { payment } = this.state
      document.getElementById('btn-save').disabled = true

      try {
        await axios
          .post('payments', payment)
          .then(res => {
            let { payments, customers, customer } = this.state
            payments.unshift(res.data.payment)
            let indexcustom = customers.findIndex(
              item => item.ruc === customer.ruc
            )
            customers[indexcustom].total = payments.reduce(
              (sum, payment) => sum + Number(payment.amount),
              0
            )
            let { month, year } = res.data.payment
            if (month === 12) {
              month = 1
              year++
            } else {
              month++
            }
            this.setState({ modal: false, customers, payments, year, month })
            document.getElementById('btn-save').disabled = false
          })
      } catch (err) {
        console.log(err)
      }
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

  viewPdf = async () => {
    const {
      match: { params }
    } = this.props

    try {
      await axios
        .get(`customerpdf/${params.id}`, { responseType: 'blob' })
        .then(({ data }) => {
          //Create a Blob from the PDF Stream
          const file = new Blob([data], { type: 'application/pdf' })
          //Build a URL from the file
          const fileURL = URL.createObjectURL(file)
          //Open the URL on new Window
          window.open(fileURL)
        })
    } catch (err) {
      console.log(err)
    }
  }

  render() {
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
                <Col lg={7}>
                  <Card className='main-card mb-3'>
                    <CardBody>
                      <Table size='sm' bordered responsive>
                        <thead>
                          <tr style={{ 'text-align': 'center' }}>
                            <th>RAZON SOCIAL</th>
                            <th>PAGADO</th>
                            <th style={{ width: '2em' }}>
                              <Button
                                className='font-icon-sm'
                                color='primary'
                                onClick={e => this.viewPdf()}
                              >
                                <i className='pe-7s-copy-file'></i>
                              </Button>
                            </th>
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
                                {item.total === null
                                  ? '0.00'
                                  : item.total.toFixed(2)}
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
                              {customers
                                .reduce((accumulator, object) => {
                                  return accumulator + object.total
                                }, 0)
                                .toFixed(2)}
                            </th>
                            <th></th>
                          </tr>
                        </thead>
                      </Table>
                    </CardBody>
                  </Card>
                </Col>
                <Col lg={5}>
                  <Card className='main-card'>
                    <div className='card-header'>
                      {`${customer === undefined ? 'Pagos' : customer.razonsocial
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
                            <th>Tipo</th>
                            <th>Fecha</th>
                            <th>Monto</th>
                          </tr>
                        </thead>
                        <tbody>
                          {payments.map((payment, index) => (
                            <tr key={index}>
                              {/* -1 porque se refiere a la posicion del array */}
                              <td>{months[payment.month - 1].description}</td>
                              <td style={{ 'text-align': 'center' }}>
                                <div
                                  className={`badge bg-${types.find(
                                    type => type.code === payment.type
                                  ).color
                                    }`}
                                >
                                  {`${payment.type}${payment.voucher !== null
                                    ? ' #' + payment.voucher
                                    : ''
                                    }`}
                                </div>
                              </td>
                              <td className='text-center'>{payment.date}</td>
                              <td style={{ 'text-align': 'right' }}>
                                {payment.amount}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <th colSpan={3}>Total</th>
                            <th style={{ 'text-align': 'right' }}>
                              {totalpayments.toFixed(2)}
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
