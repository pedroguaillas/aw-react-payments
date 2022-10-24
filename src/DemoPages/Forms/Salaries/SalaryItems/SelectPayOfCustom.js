import React, { Component, Fragment } from 'react'
import {
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Col,
  InputGroup,
  Input,
  Button,
  Table
} from 'reactstrap'
import axios from '../../../../api/axios'

import { months } from './../../PaymentHelpers'

class SelectPayOfCustom extends Component {
  state = {
    modal: false,
    customers: [],
    customer_selected: null,
    payments: []
  }

  componentDidMount() {
    let { id, salaryadvanceofpays } = this.props
    let items =
      salaryadvanceofpays.length !== 0 && id > 0
        ? salaryadvanceofpays.filter(
          salaryadvancesofpay => salaryadvancesofpay.id === id
        )
        : null
    if (items !== null && items.length > 0) {
      let { razonsocial, month, amount } = items[0]
      this.setState({
        item: `${razonsocial} - ${months[month - 1].description} - ${amount}`
      })
    }
  }

  toggle = () => {
    this.setState(state => ({ modal: !state.modal }))
  }

  showModal = async () => {
    try {
      await axios
        .get(`user/${this.props.user_id}/customerswidthcross`)
        .then(({ data: { customers } }) => {
          if (customers.length > 0) {
            this.setState(state => ({ customers, modal: !state.modal }))
          } else {
            alert('Este usuario no tiene clientes con pagos tipo cruce')
          }
        })
    } catch (err) {
      console.log(err)
    }
  }

  onChange = customer_selected => async e => {
    e.preventDefault()
    try {
      await axios
        .get(`custom/${customer_selected.RUC}/paymentcross`)
        .then(({ data: { payments } }) => {
          let { customers } = this.state
          let index = customers.findIndex(c => (c.RUC = customer_selected.RUC))
          customers[index].select = false
          this.setState({ payments, customers, customer_selected })
        })
    } catch (err) {
      console.log(err)
    }
  }

  onSelectPay = pay => {
    let { customer_selected } = this.state

    let { selectPay, index } = this.props
    if (selectPay(pay, index)) {
      let item = `${customer_selected.razonsocial} - ${months[pay.month - 1].description
        } - ${pay.amount}`

      this.setState(state => ({ item, modal: !state.modal }))
    }
  }

  render = () => {
    let { modal, customers, payments, customer_selected, item } = this.state
    return (
      <Fragment>
        <div>
          <Row key={123}>
            <Col>
              <InputGroup>
                <Input
                  value={item}
                  placeholder='Cliente - Mes - Monto'
                  disabled
                />
                <Button color='success' onClick={this.showModal}>
                  <i className='pe-7s-search'> </i>
                </Button>
              </InputGroup>
            </Col>
          </Row>
        </div>
        <Modal
          isOpen={modal}
          toggle={this.toggle}
          className={this.props.className}
          size={payments.length === 0 ? 'md' : 'lg'}
        >
          <ModalHeader toggle={this.toggle}>
            Seleccionar cruce de pago
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col lg={payments.length === 0 ? 12 : 7}>
                <Table size='sm' responsive>
                  <thead>
                    <tr className='text-center'>
                      <th>Cliente / Razon social</th>
                      {/* <th style={{ width: '2em' }}></th> */}
                    </tr>
                  </thead>
                  <tbody style={{ cursor: 'pointer' }}>
                    {customers.map((customer, index) => (
                      <tr
                        key={`customer${index}`}
                        className={
                          customer_selected !== null &&
                            customer_selected.RUC === customer.RUC
                            ? 'table-active'
                            : null
                        }
                        onClick={this.onChange(customer)}
                      >
                        <td>{customer.razonsocial}</td>
                        {/* <td className='text-center'>
                          <input
                            onChange={this.onChange(customer)}
                            name='selectcustom'
                            type='checkbox'
                            class='custom-control-input'
                            checked={
                              customer_selected !== null &&
                              customer_selected.RUC === customer.RUC
                            }
                          />
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
              {payments.length > 0 ? (
                <Col lg={5}>
                  <Table size='sm' bordered responsive>
                    <thead>
                      <tr className='text-center'>
                        <th>Mes</th>
                        <th>Monto</th>
                      </tr>
                    </thead>
                    <tbody style={{ cursor: 'pointer' }}>
                      {payments.map((payment, index) => (
                        <tr
                          onClick={() => this.onSelectPay(payment)}
                          className='text-center'
                          key={`customer${index}`}
                        >
                          <td>{months[payment.month - 1].description}</td>
                          <td>{payment.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Col>
              ) : null}
            </Row>
          </ModalBody>
        </Modal>
      </Fragment>
    )
  }
}

export default SelectPayOfCustom
