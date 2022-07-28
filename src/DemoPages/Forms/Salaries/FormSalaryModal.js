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
      submit
    } = this.props
    return (
      <Fragment>
        <Modal
          isOpen={modal}
          toggle={toggle}
          className={this.props.className}
          size={this.props.size}
        >
          <ModalHeader toggle={toggle}>Registrar salario</ModalHeader>
          <ModalBody>
            <Form className='text-right'>
              <Row form>
                <p className='mt-2'>
                  <strong>Nota:</strong> Todos los campos son obligatorios
                </p>
              </Row>
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
                <Col sm={6}>
                  <Input
                    type='month'
                    onChange={onChange}
                    value={salary.month}
                    bsSize='sm'
                    name='month'
                  />
                </Col>
              </FormGroup>
              <FormGroup className='mb-1' row>
                <Label for='balance' sm={2}>
                  Saldo
                </Label>
                <Col sm={6}>
                  <Input
                    onChange={onChangeNumber}
                    value={salary.balance}
                    bsSize='sm'
                    name='balance'
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label sm={2} />
                <div className='col' sm={6}>
                  <FormGroup check>
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
                </div>
              </FormGroup>
              <FormGroup
                className='mb-1'
                hidden={type_salary === 'anticipo'}
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
                    maxLength={30}
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
