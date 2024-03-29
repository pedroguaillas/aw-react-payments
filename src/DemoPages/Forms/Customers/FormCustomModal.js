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
  ModalFooter,
  ListGroup,
  ListGroupItem
} from 'reactstrap'
import axios from '../../../services/api'
import { ModalTitle } from 'react-bootstrap'
import { withRouter } from 'react-router-dom/cjs/react-router-dom'
import { connect } from 'react-redux'

class FormCustomModal extends Component {
  state = {
    users: [],
    item: '',
    suggestions: []
  }

  onChangeItem = async e => {
    let { value } = e.target

    try {
      await axios
        .post('listusser', { paginate: 3, search: value })
        .then(res => {
          let { data } = res.data
          this.setState({ suggestions: data, item: value })
        })
    } catch (err) {
      console.log(err)
    }
  }

  componentDidUpdate (prevProps) {
    if (
      this.props.custom.user_id !== prevProps.custom.user_id &&
      this.props.custom.user_id > 0
    ) {
      // Se actualiza el nombre del cliente una vez termine cargar la pagina
      // Este se utiliza solo cuando va ver un registro
      if (
        this.props.users !== prevProps.users &&
        this.props.users.length === 1
      ) {
        this.setState((state, props) => ({
          item: props.users[0].atts.name,
          suggestions: []
        }))
      } else {
        let { users, suggestions } = this.state

        if (users.length > 0 || suggestions.length > 0) {
          let items = suggestions.length !== 0 ? suggestions : users
          this.setState((state, props) => ({
            item:
              items.length !== 0
                ? items.find(user => user.id === props.custom.user_id).atts.name
                : '',
            users: [],
            suggestions: []
          }))
        }
      }
    }
  }

  render = () => {
    let {
      custom,
      handleChange,
      handleChangeNumber,
      toggle,
      selectUser,
      submit
    } = this.props

    let { suggestions, item } = this.state
    return (
      <Fragment>
        <Modal
          isOpen={this.props.modal}
          toggle={toggle}
          className={this.props.className}
          size={this.props.size}
        >
          <ModalHeader toggle={toggle}>{`${
            custom.ruc === '' ? 'Registrar' : 'Editar'
          } cliente`}</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup row>
                <Label for='ruc' sm={4}>
                  RUC
                </Label>
                <Col sm={6}>
                  <Input
                    bsSize='sm'
                    onChange={handleChangeNumber}
                    value={custom.ruc}
                    name='ruc'
                    maxLength={13}
                  />
                </Col>
              </FormGroup>
              <FormGroup className='mb-1' row>
                <Label for='razonsocial' sm={4}>
                  Razón social
                </Label>
                <Col sm={8}>
                  <Input
                    bsSize='sm'
                    onChange={handleChange}
                    value={custom.razonsocial}
                    name='razonsocial'
                    maxLength={300}
                  />
                </Col>
              </FormGroup>
              {this.props.rol === 'admin' ? (
                <FormGroup className='mb-0' row>
                  <Label for='amount' sm={4}>
                    Monto de pago ($)
                  </Label>
                  <Col sm={4}>
                    <Input
                      type='number'
                      bsSize='sm'
                      onChange={handleChangeNumber}
                      value={custom.amount}
                      name='amount'
                      maxLength={8}
                    />
                  </Col>
                </FormGroup>
              ) : null}
              <FormGroup className='mb-1' row>
                <Label for='item' sm={4}>
                  Asesor
                </Label>
                <Col sm={8}>
                  <div>
                    <Row key={123}>
                      <Col>
                        <Input
                          bsSize='sm'
                          onChange={this.onChangeItem}
                          value={item}
                          placeholder='...'
                        />
                      </Col>
                    </Row>
                    <Row key={111}>
                      <Col style={{ width: '100%' }}>
                        <ListGroup style={{ cursor: 'pointer' }}>
                          {suggestions.map(({ id, atts }, index) => (
                            <ListGroupItem
                              onClick={() => selectUser(id)}
                              style={{
                                padding: '.4em',
                                'font-size': '.9em',
                                'text-align': 'left'
                              }}
                              key={index}
                            >
                              {atts.name}
                            </ListGroupItem>
                          ))}
                        </ListGroup>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </FormGroup>
              <hr />
              <FormGroup row>
                <Label for='sri' sm={4}>
                  SRI
                </Label>
                <Col sm={6}>
                  <Input
                    bsSize='sm'
                    onChange={handleChange}
                    value={custom.sri}
                    name='sri'
                    maxLength={50}
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for='iess1' sm={4}>
                  IESS 1
                </Label>
                <Col sm={6}>
                  <Input
                    bsSize='sm'
                    onChange={handleChange}
                    value={custom.iess1}
                    name='iess1'
                    maxLength={50}
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for='iess1' sm={4}>
                  IESS 2
                </Label>
                <Col sm={6}>
                  <Input
                    bsSize='sm'
                    onChange={handleChange}
                    value={custom.iess2}
                    name='iess1'
                    maxLength={50}
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for='mt' sm={4}>
                  MT
                </Label>
                <Col sm={6}>
                  <Input
                    bsSize='sm'
                    onChange={handleChange}
                    value={custom.mt}
                    name='mt'
                    maxLength={50}
                  />
                </Col>
              </FormGroup>
              <FormGroup className='mb-1' row>
                <Label for='mrl' sm={4}>
                  MRL
                </Label>
                <Col sm={6}>
                  <Input
                    bsSize='sm'
                    onChange={handleChange}
                    value={custom.mrl}
                    name='mrl'
                    maxLength={50}
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for='super' sm={4}>
                  Super
                </Label>
                <Col sm={6}>
                  <Input
                    bsSize='sm'
                    onChange={handleChange}
                    value={custom.super}
                    name='super'
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

const mapStateProp = state => ({
  rol: state.AuthOptions.user.rol
})

export default withRouter(connect(mapStateProp)(FormCustomModal))
