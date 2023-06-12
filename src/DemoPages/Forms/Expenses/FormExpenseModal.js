import { Component, Fragment } from 'react'
import {
  Button,
  Col,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row
} from 'reactstrap'

class FormExpenseModal extends Component {
  render = () => {
    let { expense, handleChange, modal, toggle, submit, error } = this.props
    return (
      <Fragment>
        <Modal
          isOpen={modal}
          toggle={toggle}
          className={this.props.className}
          size={this.props.size}
        >
          <ModalHeader toggle={toggle}>Registrar gasto</ModalHeader>
          <ModalBody>
            <Form className='text-right'>
              <Row form>
                <p className='mt-2'>
                  <strong>Nota:</strong> Todos los campos son obligatorios
                </p>
              </Row>

              <FormGroup>
                <Label for='description'>Descripción</Label>
                <Input
                  bsSize='sm'
                  onChange={handleChange}
                  value={expense.description}
                  name='description'
                  maxLength={50}
                  invalid={error.description !== undefined}
                />
                <FormFeedback invalid>
                  {error.description !== undefined
                    ? error.description[0]
                    : null}
                </FormFeedback>
              </FormGroup>

              <FormGroup>
                <Label for='amount'>Monto</Label>
                <Input
                  type='number'
                  bsSize='sm'
                  onChange={handleChange}
                  value={expense.amount}
                  name='amount'
                  invalid={error.amount !== undefined}
                />
                <FormFeedback invalid>
                  {error.amount !== undefined ? error.amount[0] : null}
                </FormFeedback>
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

export default FormExpenseModal
