import React, { Component, Fragment } from 'react'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  Form,
  FormGroup,
  Label,
  ModalFooter
} from 'reactstrap'

class EditAmountSalaryModal extends Component {
  render = () => {
    let { modal, toggle, user, onChangeNumber, submit } = this.props

    if (user === null) {
      return null
    }

    return (
      <Fragment>
        <Modal
          isOpen={modal}
          toggle={toggle}
          className={this.props.className}
          size={this.props.size}
        >
          <ModalHeader toggle={toggle}>Editar salario</ModalHeader>
          <ModalBody>
            <Form className='text-right'>
              <FormGroup className='mb-1' row>
                <Label for='amount' sm={2}>
                  Sueldo
                </Label>
                <Input
                  onChange={onChangeNumber}
                  value={user.salary}
                  type='number'
                  name='amount'
                />
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
              Editar
            </Button>
          </ModalFooter>
        </Modal>
      </Fragment>
    )
  }
}

export default EditAmountSalaryModal
