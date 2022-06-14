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

class FormUserModal extends Component {
  render = () => {
    let { user, handleChange, handleChangeNumber, toggle, submit } = this.props

    return (
      <Fragment>
        <Modal
          isOpen={this.props.modal}
          toggle={toggle}
          className={this.props.className}
          size={this.props.size}
        >
          <ModalHeader toggle={toggle}>Registrar asesor</ModalHeader>
          <ModalBody>
            <Form className='text-right'>
              <Row form>
                <p className='mt-2'>
                  <strong>Nota:</strong> Todos los campos son obligatorios
                </p>
              </Row>
              <FormGroup className='mb-1' row>
                <Label for='name' sm={4}>
                  Nombre
                </Label>
                <Col sm={6}>
                  <Input
                    bsSize='sm'
                    onChange={handleChangeNumber}
                    value={user.name}
                    name='name'
                    maxLength={50}
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

export default FormUserModal
