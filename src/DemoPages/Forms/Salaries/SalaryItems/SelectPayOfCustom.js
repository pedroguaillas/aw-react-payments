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

import { months } from './../../PaymentHelpers'

class SelectPayOfCustom extends Component {
  state = {
    modal: false,
    customers: [],
    customer_selected: null,
    payments: []
  }

  toggle = () => {
    this.setState(state => ({ modal: !state.modal }))
  }

  showModal = () => {
    fetch(
      `https://ats.auditwhole.com/user/${this.props.user_id}/customerswidthcross`
    )
      .then(res => res.json())
      .then(({ customers }) => {
        if (customers.length > 0) {
          this.setState(state => ({ customers, modal: !state.modal }))
        } else {
          alert('Este usuario no tiene clientes con pagos tipo cruce')
        }
      })
  }

  onChange = customer_selected => e => {
    fetch(
      `https://ats.auditwhole.com/custom/${customer_selected.RUC}/paymentcross`
    )
      .then(res => res.json())
      .then(({ payments }) => {
        if (payments.length > 0) {
          let { customers } = this.state
          let index = customers.findIndex(c => (c.RUC = customer_selected.RUC))
          customers[index].select = false
          this.setState({ payments, customers, customer_selected })
        } else {
          alert('No tiene pagos con cruce')
        }
      })
  }

  onSelectPay = pay => {
    let { customer_selected } = this.state

    let item = `${customer_selected.razonsocial} - ${
      months[pay.month - 1].description
    } - ${pay.amount}`

    this.setState(state => ({ item, modal: !state.modal }))
    let { selectPay, index } = this.props
    selectPay(customer_selected, pay, index)
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
                <Button onClick={this.showModal}>Seleccionar pago</Button>
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
                      <th style={{ width: '2em' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer, index) => (
                      <tr
                        key={`customer${index}`}
                        className={
                          customer_selected !== null &&
                          customer_selected.RUC === customer.RUC
                            ? 'table-active'
                            : null
                        }
                      >
                        <td>{customer.razonsocial}</td>
                        <th className='text-center'>
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
                        </th>
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
                    <tbody>
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
