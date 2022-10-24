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
import axios from '../../../api/axios'
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

  async componentDidMount() {
    let { search } = this.state

    try {
      await axios
        .post('customerlist', { search })
        .then(({ data: { data, links, meta } }) => {
          this.setState({ customers: data, links, meta })
        })
    } catch (err) {
      console.log(err)
    }
  }

  reqNewPage = async (e, page) => {
    e.preventDefault()

    if (page !== null) {
      let { search, meta } = this.state

      try {
        await axios
          .post(`${meta.path}?page=${page.substring(page.indexOf('=') + 1)}`, {
            search
          })
          .then(res => {
            let { data, links, meta } = res.data
            this.setState({ customers: data, links, meta })
          })
      } catch (error) {
        console.log(error)
      }
    }
  }

  reloadPage = async () => {
    let {
      search,
      meta: { current_page, path }
    } = this.state

    if (current_page !== null) {
      try {
        await axios
          .post(`${path}?page=${current_page}`, { search })
          .then(res => {
            let { data, links, meta } = res.data
            this.setState({ customers: data, links, meta })
          })
      } catch (error) {
        console.log(error)
      }
    }
  }

  onChangeSearch = async e => {
    let { value } = e.target
    let { meta } = this.state

    try {
      if (value.length > 2) {
        await axios.post(meta.path, { search: value }).then(res => {
          let { data, links, meta } = res.data
          this.setState({ search: value, customers: data, links, meta })
        })
      } else {
        this.setState({ search: value })
      }
    } catch (error) {
      console.log(error)
    }
  }

  newCustom = () => {
    let custom = { ruc: '', razonsocial: '', sri: '', amount: '', user_id: 0 }
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

  submit = async () => {
    if (this.validate()) {
      // Simple POST request with a JSON body using fetch
      let { custom, option } = this.state
      if (custom.amount === undefined || custom.amount === '') {
        custom.amount = 0
      }

      if (option === 'CREATE') {
        document.getElementById('btn-save').disabled = true

        try {
          await axios.post('customers', custom).then(res => {
            this.setState({ modal: false })
            this.reloadPage()
            document.getElementById('btn-save').disabled = false
          })
        } catch (err) {
          console.log(err)
        }
      } else {
        document.getElementById('btn-save').disabled = true

        try {
          await axios
            .put('customers/' + this.state.custom.ruc + '/update', custom)
            .then(res => {
              this.setState({ modal: false })
              this.reloadPage()
              document.getElementById('btn-save').disabled = false
            })
        } catch (err) {
          console.log(err)
        }
      }
    }
  }

  validate = () => {
    let { ruc, razonsocial, sri, user_id } = this.state.custom

    if (ruc === undefined || razonsocial === undefined || sri === undefined) {
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

    if (Number(user_id) === 0) {
      alert('Seleccione un asesor')
      return
    }

    return true
  }

  edit = ruc => {
    let option = 'EDIT'
    try {
      axios
        .get('customers/' + ruc + '/show')
        .then(({ data: { custom, user } }) => {
          custom.user_id = user.id
          this.setState({
            custom,
            users: [{ id: user.id, atts: { name: user.name } }],
            modal: true,
            option
          })
        })
    } catch (err) {
      console.log(err)
    }
  }

  render() {
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
