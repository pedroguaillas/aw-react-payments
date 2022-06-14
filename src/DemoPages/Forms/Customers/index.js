import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import {
  Row,
  Col,
  Card,
  CardBody,
  Table,
  Form,
  InputGroup,
  Input,
  Button,
  CardHeader,
  ButtonGroup
} from 'reactstrap'
import PageTitle from '../../../Layout/AppMain/PageTitle'
import Paginate from '../../Components/Paginate/Index'
import FormCustomModal from './FormCustomModal'

class FormElementsControls extends React.Component {
  state = {
    customers: [],
    search: '',
    links: null,
    meta: null,
    modal: false,
    custom: {
      user_id: 0
    },
    option: 'CREATE'
  }

  async componentDidMount () {
    let { search } = this.state
    // Simple POST request with a JSON body using fetch
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ search })
    }
    fetch('https://ats.auditwhole.com/customerlist', requestOptions)
      .then(response => response.json())
      .then(res => {
        let { data, links, meta } = res
        this.setState({
          customers: data,
          links,
          meta
        })
      })
  }

  reqNewPage = async (e, page) => {
    e.preventDefault()

    if (page !== null) {
      let { search, meta } = this.state
      try {
        // Simple POST request with a JSON body using fetch
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ search })
        }
        fetch(
          `${meta.path}?page=${page.substring(page.indexOf('=') + 1)}`,
          requestOptions
        )
          .then(response => response.json())
          .then(res => {
            let { data, links, meta } = res
            this.setState({
              customers: data,
              links,
              meta
            })
          })
      } catch (error) {
        console.log(error)
      }
    }
  }

  reloadPage = async () => {
    let { current_page, path } = this.state.meta
    if (current_page !== null) {
      let { search } = this.state
      try {
        // Simple POST request with a JSON body using fetch
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ search })
        }
        fetch(`${path}?page=${current_page}`, requestOptions)
          .then(response => response.json())
          .then(res => {
            let { data, links, meta } = res
            this.setState({
              customers: data,
              links,
              meta
            })
          })
      } catch (error) {
        console.log(error)
      }
    }
  }

  newCustom = () => {
    let custom = {
      ruc: '',
      razonsocial: '',
      sri: '',
      amount: '',
      user_id: 0
    }
    let option = 'CREATE'
    this.setState({ modal: true, custom, option })
  }

  toggle = () => {
    this.setState(state => ({ modal: !state.modal }))
  }

  selectUser = user_id => {
    this.setState({
      custom: {
        ...this.state.custom,
        user_id
      }
    })
  }

  handleChange = e => {
    this.setState({
      custom: {
        ...this.state.custom,
        [e.target.name]: e.target.value
      }
    })
  }

  handleChangeNumber = e => {
    let { value } = e.target
    if (isNaN(value)) {
      return
    }
    this.handleChange(e)
  }

  onChangeSearch = async e => {
    let { value } = e.target

    try {
      if (value.length > 2) {
        // Simple POST request with a JSON body using fetch
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ search: value })
        }
        fetch('https://ats.auditwhole.com/customerlist', requestOptions)
          .then(response => response.json())
          .then(res => {
            let { data, links, meta } = res
            this.setState({
              search: value,
              customers: data,
              links,
              meta
            })
          })
      } else {
        this.setState({ search: value })
      }
    } catch (error) {
      console.log(error)
    }
  }

  submit = () => {
    if (this.validate()) {
      // Simple POST request with a JSON body using fetch
      let { custom, option } = this.state
      const requestOptions = {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(custom)
      }

      if (option === 'CREATE') {
        document.getElementById('btn-save').disabled = true
        requestOptions.method = 'POST'

        fetch('https://ats.auditwhole.com/customers', requestOptions)
          .then(response => response.json())
          .then(res => {
            this.setState({ modal: false })
            this.reloadPage()
            document.getElementById('btn-save').disabled = false
          })
          .catch(() => {
            alert('Ya existe un cliente con ese RUC')
          })
      } else {
        document.getElementById('btn-save').disabled = true
        requestOptions.method = 'PUT'

        fetch(
          'https://ats.auditwhole.com/customers/' +
            this.state.custom.ruc +
            '/update',
          requestOptions
        )
          .then(response => response.json())
          .then(res => {
            this.setState({ modal: false })
            this.reloadPage()
            document.getElementById('btn-save').disabled = false
          })
          .catch(() => {
            alert('Ya existe un cliente con ese RUC')
          })
      }
    }
  }

  validate = () => {
    let { ruc, razonsocial, sri, amount, user_id } = this.state.custom

    if (
      ruc === undefined ||
      razonsocial === undefined ||
      sri === undefined ||
      amount === undefined
    ) {
      alert('Todos los campos son obligatorios')
      return
    }

    if (ruc.length < 13) {
      alert('El RUC debe tener 13 dígitos')
      return
    }

    if (razonsocial.length < 3) {
      alert('La razón social debe tener mínimo 3 caracteres')
      return
    }

    if (Number(amount) < 10) {
      alert('El monto de pago debe ser mínimo $10')
      return
    }

    if (Number(user_id) === 0) {
      alert('Seleccione un asesor')
      return
    }

    return true
  }

  edit = ruc => {
    let option = 'EDIT'
    fetch('https://ats.auditwhole.com/customers/' + ruc + '/show')
      .then(response => response.json())
      .then(res => {
        let { custom, user } = res
        custom.user_id = user.id
        this.setState({
          custom,
          users: [{ id: user.id, atts: { name: user.name } }],
          modal: true,
          option
        })
      })
  }

  render () {
    let { customers, search, links, meta, modal, custom, users } = this.state

    return (
      <Fragment>
        <TransitionGroup>
          <CSSTransition
            component='div'
            className='TabsAnimation'
            appear={true}
            timeout={0}
            enter={false}
            exit={false}
          >
            <div>
              <PageTitle
                options={[
                  {
                    id: 'tooltip-add-product',
                    action: this.newCustom,
                    icon: 'plus',
                    msmTooltip: 'Agregar cliente',
                    color: 'primary'
                  }
                ]}
                heading='Clientes'
                subheading='Registro de clientes.'
                icon='pe-7s-users icon-gradient bg-sunny-morning'
              />

              <FormCustomModal
                modal={modal}
                custom={custom}
                users={users}
                toggle={this.toggle}
                selectUser={this.selectUser}
                handleChange={this.handleChange}
                handleChangeNumber={this.handleChangeNumber}
                submit={this.submit}
              />

              <Row>
                <Col lg='12'>
                  <Card className='main-card mb-3'>
                    <CardHeader>
                      <div className='btn-actions-pane-right'>
                        <Form className='text-right'>
                          <InputGroup size='sm'>
                            <Input
                              value={search}
                              onChange={this.onChangeSearch}
                              placeholder='Buscar'
                              className='search-input'
                            />
                          </InputGroup>
                        </Form>
                      </div>
                    </CardHeader>
                    <CardBody>
                      <Table striped size='sm' responsive>
                        <thead>
                          <tr>
                            <th style={{ width: '7em' }}>RUC</th>
                            <th>RAZON SOCIAL</th>
                            <th>AESESOR</th>
                            <th>VALOR</th>
                            <th style={{ width: '5em' }}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {customers.length > 0
                            ? customers.map((customer, index) => (
                                <tr key={index}>
                                  <td>{customer.ruc}</td>
                                  <td>{customer.atts.razonsocial}</td>
                                  <td style={{ 'text-transform': 'uppercase' }}>
                                    {customer.atts.name}
                                  </td>
                                  <td>${customer.atts.amount}</td>
                                  <td>
                                    <ButtonGroup size='sm'>
                                      <Button
                                        onClick={() => this.edit(customer.ruc)}
                                        color='primary'
                                        title='Editar cliente'
                                        className='me-2'
                                      >
                                        <i className='nav-link-icon lnr-pencil'></i>
                                      </Button>
                                      <Link
                                        to={'/app/cliente/' + customer.ruc}
                                        className='btn btn-success'
                                        title='Lista de pagos'
                                      >
                                        <i className='pe-7s-cash'></i>
                                      </Link>
                                    </ButtonGroup>
                                  </td>
                                </tr>
                              ))
                            : null}
                        </tbody>
                      </Table>

                      <Paginate
                        links={links}
                        meta={meta}
                        reqNewPage={this.reqNewPage}
                      />
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </div>
          </CSSTransition>
        </TransitionGroup>
      </Fragment>
    )
  }
}

export default FormElementsControls
