import React, { Component, Fragment } from 'react'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  Form,
  Col,
  FormGroup,
  Label,
  ModalFooter
} from 'reactstrap'
import { months } from './../PaymentHelpers'

class FormSalaryModal extends Component {
  render = () => {
    let {
      type_salary,
      modal,
      toggle,
      salary,
      onChange,
      onChangeNumber,
      onCheck,
      submit,
      complete
    } = this.props
    return (
      <Fragment>
        <Modal
          isOpen={modal}
          toggle={toggle}
          className={this.props.className}
          size={this.props.size}
        >
          <ModalHeader toggle={toggle}>
            {complete ? 'Completar' : 'Registrar'} salario
          </ModalHeader>
          <ModalBody>
            <Form className='text-right'>
              <FormGroup className='mb-1' row>
                <Label for='amount' sm={2}>
                  Sueldo
                </Label>
                <Label sm={2}>{salary.amount}</Label>
              </FormGroup>
              <FormGroup className='mb-1' row>
                <Label for='month' sm={2}>
                  Mes
                </Label>
                <Col sm={6} hidden={complete}>
                  <Input
                    type='month'
                    onChange={onChange}
                    value={salary.month}
                    bsSize='sm'
                    name='month'
                  />
                </Col>
                {complete ? (
                  <Label for='month' sm={4}>
                    {`${
                      months[salary.month.substring(5) - 1].description
                    } del ${salary.month.substring(0, 4)}`}
                  </Label>
                ) : null}
              </FormGroup>
              <FormGroup
                className='mb-1'
                row
                hidden={complete && salary.balance === 0}
              >
                <Label for='balance' sm={2}>
                  Saldo
                </Label>
                <Col sm={6} hidden={complete}>
                  <Input
                    onChange={onChangeNumber}
                    value={salary.balance}
                    bsSize='sm'
                    name='balance'
                  />
                </Col>
                {complete ? (
                  <Label for='balance' sm={2}>
                    {salary.balance}
                  </Label>
                ) : null}
              </FormGroup>
              <FormGroup row>
                <Label sm={2} />
                <div className='col' sm={6}>
                  <FormGroup check hidden={complete}>
                    <Input
                      id='radio1'
                      type='radio'
                      value='anticipo'
                      checked={type_salary === 'anticipo'}
                      onChange={onCheck}
                    />
                    <Label check>Anticipo</Label>
                  </FormGroup>
                  <FormGroup check>
                    <Input
                      id='radio2'
                      type='radio'
                      value='cheque'
                      checked={type_salary === 'cheque'}
                      onChange={onCheck}
                    />
                    <Label check>Cheque</Label>
                  </FormGroup>
                  <FormGroup check>
                    <Input
                      id='radio3'
                      type='radio'
                      value='efectivo'
                      checked={type_salary === 'efectivo'}
                      onChange={onCheck}
                    />
                    <Label check>Efectivo</Label>
                  </FormGroup>
                </div>
              </FormGroup>
              <FormGroup
                className='mb-1'
                hidden={
                  type_salary === 'anticipo' || type_salary === 'efectivo'
                }
                row
              >
                <Label sm={2} for='cheque'>
                  Cheque
                </Label>
                <Col sm={6}>
                  <Input
                    onChange={onChangeNumber}
                    bsSize='sm'
                    name='cheque'
                    value={salary.cheque}
                    maxLength={10}
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

export default FormSalaryModal
