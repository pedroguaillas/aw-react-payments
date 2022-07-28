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

class SelectPayOfCustom extends Component {
  state = {
    modal: false,
    customers: []
  }

  toggle = () => {
    this.setState(state => ({ modal: !state.modal }))
  }

  showModal = () => {
    let { user_id } = this.props
    // Simple POST request with a JSON body using fetch
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ year: 2022, id: user_id })
    }
    // Crear otro punto de consulta para traer solo los clientes que tienen pagos con cruce habilitados
    fetch(
      'https://ats.auditwhole.com/user/' + user_id + '/customers',
      requestOptions
    )
      .then(res => res.json())
      .then(({ customers }) => {
        this.setState(state => ({ customers, modal: !state.modal }))
      })
  }

  render = () => {
    let { modal, customers } = this.state
    return (
      <Fragment>
        <div>
          <Row key={123}>
            <Col>
              <InputGroup>
                <Input placeholder='Cliente - Pago' disabled />
                <Button onClick={this.showModal}>Seleccionar pago</Button>
              </InputGroup>
            </Col>
          </Row>
        </div>
        <Modal
          isOpen={modal}
          toggle={this.toggle}
          className={this.props.className}
          size={this.props.size}
        >
          <ModalHeader toggle={this.toggle}>
            Seleccionar cruce de pago
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col lg={7}>
                <Table size='sm' bordered responsive>
                  <thead>
                    <tr style={{ 'text-align': 'center' }}>
                      <th>Cliente / Razon social</th>
                      <th style={{ width: '2em' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((item, index) => (
                      <tr key={`customer${index}`}>
                        <td>{item.razonsocial}</td>
                        <th className='text-center'>
                          <input
                            name='selectcustom'
                            type='checkbox'
                            class='custom-control-input'
                          />
                        </th>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </ModalBody>
        </Modal>
      </Fragment>
    )
  }
}

export default SelectPayOfCustom
