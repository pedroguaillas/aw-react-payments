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

class FormSalaryItemModal extends Component {
  render = () => {
    let { modal, toggle } = this.props
    return (
      <Fragment>
        <Modal
          isOpen={modal}
          toggle={toggle}
          className={this.props.className}
          size={this.props.size}
        >
          <ModalHeader toggle={toggle}>Registrar pago</ModalHeader>
          <ModalBody>
            <Form className='text-right'>
              <Row form>
                <p className='mt-2'>
                  <strong>Nota:</strong> Todos los campos son obligatorios
                </p>
              </Row>
              <FormGroup className='mb-1' row>
                <Label for='type' sm={4}>
                  Tipo
                </Label>
                <Col sm={6}>
                  <Input bsSize='sm' name='type' maxLength={50} />
                </Col>
              </FormGroup>
              <FormGroup className='mb-1' row>
                <Label for='description' sm={4}>
                  Descripcion
                </Label>
                <Col sm={6}>
                  <Input bsSize='sm' name='description' maxLength={20} />
                </Col>
              </FormGroup>
              <FormGroup className='mb-1' row>
                <Label for='amount' sm={4}>
                  Monto
                </Label>
                <Col sm={6}>
                  <Input
                    type='email'
                    bsSize='sm'
                    name='amount'
                    maxLength={30}
                  />
                </Col>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button
              // onClick={submit}
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

export default FormSalaryItemModal
