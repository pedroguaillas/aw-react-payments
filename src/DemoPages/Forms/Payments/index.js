import React, { Fragment } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import {
  Row,
  Col,
  Card,
  CardBody,
  Table,
  Button,
  ButtonGroup
} from 'reactstrap'

import PageTitle from '../../../Layout/AppMain/PageTitle'
import DialogDelete from '../../Components/DialogDelete'
import Paginate from '../../Components/Paginate/Index'

import FormPaymentModal from './FormPaymentModal'
import { months, types } from './../PaymentHelpers'
import axios from '../../../services/api'

class Payments extends React.Component {
  state = {
    customer: {},
    payment: {},
    payments: [],
    modal: false,
    item_id: 0,
    search: '',
    links: null,
    meta: null
  }

  async componentDidMount () {
    const {
      match: { params }
    } = this.props

    try {
      await axios
        .post('paymentlist', { ruc: params.ruc })
        .then(({ data: { customer, payments } }) => {
          this.setState({
            customer,
            payments,
            payment: {
              ...this.state.payment,
              cliente_auditwhole_ruc: params.ruc
            }
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
    const {
      match: { params }
    } = this.props
    let { customer } = this.state
    let payment = {
      year_month: this.calMonth(),
      cliente_auditwhole_ruc: params.ruc,
      type: 'Efectivo',
      amount: customer.amount,
      date
    }
    this.setState(state => ({ modal: !state.modal, payment }))
  }

  calMonth = () => {
    let { payments } = this.state

    if (payments.length === 0) {
      let date = new Date()
      date.setMonth(date.getMonth() - 1)
      return date.toISOString().substring(0, 7)
    }

    let arrMonth = payments[0].atts.year_month.split('-')

    if (arrMonth[1] === '12') {
      // Mes de Diciembre a Enero
      arrMonth[1] = '01'
      // Se suma un año mas
      arrMonth[0] = parseInt(arrMonth[0]) + 1
    } else {
      // Se suma el mes
      let newMonth = parseInt(arrMonth[1]) + 1
      arrMonth[1] = newMonth < 10 ? '0' + newMonth : newMonth
    }

    return arrMonth.join('-')
  }

  toogleEdit = pay => {
    let { id, atts } = pay
    let payment = atts
    payment.id = id
    this.setState({ payment, modal: true })
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
    let { name, value } = e.target
    if (isNaN(value)) {
      return
    }
    this.setState({
      payment: {
        ...this.state.payment,
        [name]: value
      }
    })
  }

  submit = async () => {
    if (this.validate()) {
      // Simple POST request with a JSON body using fetch
      let { payment } = this.state

      if (payment.id === undefined) {
        document.getElementById('btn-save').disabled = true

        try {
          await axios.post('payments', payment).then(({ data }) => {
            let { payments } = this.state
            payments.unshift({ id: data.payment, atts: data.payment })
            this.setState({ modal: false, payments })
            document.getElementById('btn-save').disabled = false
          })
        } catch (err) {
          console.log(err)
        }
      } else {
        document.getElementById('btn-save').disabled = true
        try {
          await axios
            .put(`payments/${payment.id}`, payment)
            .then(({ data }) => {
              let { payments } = this.state
              var { amount, type, voucher, note, date, year_month } =
                data.payment
              var index = payments.findIndex(e => e.id === payment.id)
              payments[index] = {
                id: payment.id,
                atts: { amount, type, voucher, note, date, year_month }
              }
              this.setState({ modal: false, payments })
              document.getElementById('btn-save').disabled = false
            })
        } catch (err) {
          console.log(err)
        }
      }
    }
  }

  toogleDelete = item_id => {
    this.setState({ item_id })
  }

  deleteItem = async id => {
    try {
      await axios.delete(`payments/${id}`).then(() => {
        let { payments } = this.state
        payments = payments.filter(e => e.id !== id)
        this.setState({
          payments,
          item_id: 0
        })
      })
    } catch (err) {
      console.log(err)
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
    let { payments, payment, customer, item_id, links, modal, meta } =
      this.state

    return (
      <Fragment>
        <PageTitle
          options={[
            {
              id: 'tooltip-add-product',
              action: this.toggle,
              icon: 'plus',
              msmTooltip: 'Registrar cobro',
              color: 'primary'
            }
          ]}
          heading='Cobros'
          subheading={
            customer.razonsocial === undefined ? null : customer.razonsocial
          }
          icon='pe-7s-wallet icon-gradient bg-premium-dark'
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
            <div>
              <FormPaymentModal
                toggle={this.toggle}
                modal={modal}
                payment={payment}
                handleChange={this.handleChange}
                handleChangeNumber={this.handleChangeNumber}
                submit={this.submit}
              />
              {payments === null ? (
                <p>Cargando ...</p>
              ) : payments.length === 0 ? (
                <p>No existe pagos registrados</p>
              ) : (
                <Row>
                  <Col lg='12'>
                    <Card className='main-card mb-3'>
                      <DialogDelete
                        item_id={item_id}
                        deleteItem={this.deleteItem}
                        title='pago'
                      />
                      <CardBody>
                        <Table striped size='sm' responsive>
                          <thead>
                            <tr>
                              <th>Año</th>
                              <th>Mes</th>
                              <th>Monto</th>
                              <th className='text-center'>Tipo Comprobante</th>
                              <th style={{ width: '4em' }}>Comprobante</th>
                              <th className='text-center'>Fecha</th>
                              <th style={{ width: '5em' }}></th>
                            </tr>
                          </thead>
                          <tbody>
                            {payments.map((payment, index) => (
                              <tr key={index}>
                                <td>
                                  {payment.atts.year_month.substring(0, 4)}
                                </td>
                                <td>
                                  {/* -1 porque se refiere a la posicion del array */}
                                  {
                                    months[
                                      payment.atts.year_month.substring(5) - 1
                                    ].description
                                  }
                                </td>
                                <td>${payment.atts.amount}</td>
                                <td className='text-center'>
                                  <div
                                    className={`badge bg-${
                                      types.find(
                                        type => type.code === payment.atts.type
                                      ).color
                                    }`}
                                  >
                                    {payment.atts.type}
                                  </div>
                                </td>
                                <td>#{payment.atts.voucher}</td>
                                <td className='text-center'>
                                  {payment.atts.date}
                                </td>
                                <td>
                                  <ButtonGroup size='sm'>
                                    <Button
                                      onClick={e => this.toogleEdit(payment)}
                                      color='primary'
                                      title='Editar'
                                      className='me-2'
                                    >
                                      <i className='nav-link-icon lnr-pencil'></i>
                                    </Button>
                                    <Button
                                      onClick={e =>
                                        this.toogleDelete(payment.id)
                                      }
                                      color='danger'
                                      title='Eliminar'
                                    >
                                      <i className='nav-link-icon lnr-trash'></i>
                                    </Button>
                                  </ButtonGroup>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>

                        <Paginate
                          links={links}
                          meta={meta}
                          reqNewPage={this.reqNewPage}
                        />
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              )}
            </div>
          </CSSTransition>
        </TransitionGroup>
      </Fragment>
    )
  }
}

export default Payments
