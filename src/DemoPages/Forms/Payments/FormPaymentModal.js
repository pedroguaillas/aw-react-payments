import React, { Component, Fragment } from 'react'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  Form,
  Row,
  Col,
  FormGroup,
  Label,
  ModalFooter
} from 'reactstrap'

import { types, months } from './../PaymentHelpers'

class FormPaymentModal extends Component {
  render = () => {
    let {
      payment,
      handleChange,
      toggle,
      handleChangeNumber,
      submit
    } = this.props

    return (
      <Fragment>
        <Modal
          isOpen={this.props.modal}
          toggle={toggle}
          className={this.props.className}
          size={this.props.size}
        >
          <ModalHeader toggle={toggle}>Registrar cobro</ModalHeader>
          <ModalBody>
            <Form className='text-right'>
              <Row form>
                <p className='mt-2'>
                  <strong>Nota:</strong> Los campos marcados con * son
                  obligatorios
                </p>
              </Row>
              <FormGroup className='mb-1' row>
                <Label for='month' sm={4}>
                  Mes *
                </Label>
                <Col sm={8}>
                  <select
                    className='form form-control'
                    onChange={handleChange}
                    value={payment.month}
                    name='month'
                    id='month'
                  >
                    {months.map((month, index) => (
                      <option key={`month${index}`} value={month.code}>
                        {month.description}
                      </option>
                    ))}
                  </select>
                </Col>
              </FormGroup>
              <FormGroup className='mb-1' row>
                <Label for='amount' sm={4}>
                  Monto ($) *
                </Label>
                <Col sm={4}>
                  <Input
                    bsSize='sm'
                    onChange={handleChangeNumber}
                    value={payment.amount}
                    type='text'
                    id='amount'
                    name='amount'
                    maxlength='11'
                    requiered
                  />
                </Col>
              </FormGroup>
              <FormGroup className='mb-1' row>
                <Label for='type' sm={4}>
                  Tipo
                </Label>
                <Col sm={8}>
                  <select
                    className='form form-control'
                    onChange={handleChange}
                    value={payment.type}
                    name='type'
                    id='type'
                  >
                    {types.map((type, index) => (
                      <option value={type.code}>{type.description}</option>
                    ))}
                  </select>
                </Col>
              </FormGroup>
              <FormGroup className='mb-1' row>
                <Label for='voucher' sm={4}>
                  Comprobante
                </Label>
                <Col sm={4}>
                  <Input
                    bsSize='sm'
                    onChange={handleChangeNumber}
                    value={payment.voucher}
                    type='text'
                    id='voucher'
                    name='voucher'
                    maxlength={11}
                  />
                </Col>
              </FormGroup>
              <FormGroup className='mb-1' row>
                <Label for='date' sm={4}>
                  Fecha
                </Label>
                <Col sm={8}>
                  <Input
                    bsSize='sm'
                    onChange={handleChange}
                    value={payment.date}
                    type='date'
                    id='date'
                    name='date'
                  />
                </Col>
              </FormGroup>
              <FormGroup className='mb-1' row>
                <Label for='note' sm={4}>
                  Nota
                </Label>
                <Col sm={8}>
                  <Input
                    bsSize='sm'
                    onChange={handleChange}
                    value={payment.note}
                    type='text'
                    id='note'
                    name='note'
                  />
                </Col>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={submit}
              className='btn-transition'
              color='primary'
              id='btn-save'
            >
              Guardar
            </Button>
          </ModalFooter>
        </Modal>
      </Fragment>
    )
  }
}

export default FormPaymentModal
