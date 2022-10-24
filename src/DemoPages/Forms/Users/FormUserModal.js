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
    let { user, handleChange, toggle, submit } = this.props

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
                    onChange={handleChange}
                    value={user.name}
                    name='name'
                    maxLength={50}
                  />
                </Col>
              </FormGroup>
              <FormGroup className='mb-1' row>
                <Label for='user' sm={4}>
                  User
                </Label>
                <Col sm={6}>
                  <Input
                    bsSize='sm'
                    onChange={handleChange}
                    value={user.user}
                    name='user'
                    maxLength={20}
                  />
                </Col>
              </FormGroup>
              <FormGroup className='mb-1' row>
                <Label for='salary' sm={4}>
                  Salario
                </Label>
                <Col sm={6}>
                  <Input
                    type='number'
                    bsSize='sm'
                    onChange={handleChange}
                    value={user.salary}
                    name='salary'
                    min={20}
                    max={10000}
                  />
                </Col>
              </FormGroup>
              <FormGroup className='mb-1' row>
                <Label for='email' sm={4}>
                  Correo electronico
                </Label>
                <Col sm={6}>
                  <Input
                    type='email'
                    bsSize='sm'
                    onChange={handleChange}
                    value={user.email}
                    name='email'
                    maxLength={30}
                  />
                </Col>
              </FormGroup>
              <FormGroup className='mb-1' row>
                <Label for='password' sm={4}>
                  Contraseña
                </Label>
                <Col sm={6}>
                  <Input
                    type='password'
                    bsSize='sm'
                    onChange={handleChange}
                    value={user.password}
                    name='password'
                    maxLength={20}
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
