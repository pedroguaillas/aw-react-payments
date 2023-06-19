import { Component } from 'react'
import { Fragment } from 'react'
import { ModalTitle } from 'react-bootstrap'
import {
  Button,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row
} from 'reactstrap'

class FormExpenseItemModal extends Component {
  render () {
    let {
      expenseItem,
      error,
      submit,
      handleChange,
      isOpen,
      toggle,
      className,
      size
    } = this.props
    return (
      <Fragment>
        <Modal
          isOpen={isOpen}
          toggle={toggle}
          className={className}
          size={size}
        >
          <ModalHeader toggle={toggle}>
            {expenseItem.id === undefined ? 'Registrar' : 'Editar'} gasto
          </ModalHeader>
          <ModalBody>
            <Form className='text-right'>
              <Row form>
                <p className='mt-2'>
                  <strong>Nota:</strong> Todos los campos son obligatorios
                </p>
              </Row>

              <FormGroup>
                <Label for='month'>Mes</Label>
                <Input
                  type='month'
                  bsSize='sm'
                  onChange={handleChange}
                  value={expenseItem.month}
                  name='month'
                  maxLength={10}
                  invalid={error.month !== undefined}
                />
                <FormFeedback invalid>
                  {error.month !== undefined ? error.month[0] : null}
                </FormFeedback>
              </FormGroup>

              <FormGroup>
                <Label for='amount'>Monto</Label>
                <Input
                  type='number'
                  bsSize='sm'
                  onChange={handleChange}
                  value={expenseItem.amount}
                  name='amount'
                  maxLength={10}
                  invalid={error.amount !== undefined}
                />
                <FormFeedback invalid>
                  {error.amount !== undefined ? error.amount[0] : null}
                </FormFeedback>
              </FormGroup>

              <FormGroup>
                <Label for='pay_method'>Método de pago</Label>
                <Input
                  type='select'
                  bsSize='sm'
                  onChange={handleChange}
                  value={expenseItem.pay_method}
                  name='pay_method'
                  invalid={error.pay_method !== undefined}
                >
                  <option value=''>Seleccione</option>
                  <option value='Efectivo'>Efectivo</option>
                  <option value='Transferencia'>Transferencia</option>
                </Input>
                <FormFeedback invalid>
                  {error.pay_method !== undefined ? error.pay_method[0] : null}
                </FormFeedback>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalHeader>
            <Button
              onClick={submit}
              className='btn-transition'
              color='primary'
              id='btn-save'
            >
              Guardar
            </Button>
          </ModalHeader>
        </Modal>
      </Fragment>
    )
  }
}
export default FormExpenseItemModal
