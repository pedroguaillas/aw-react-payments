import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import {
  Row,
  Col,
  Card,
  CardBody,
  Table,
  Button,
  ButtonGroup,
  CardHeader,
  Form,
  InputGroup,
  Input
} from 'reactstrap'
import axios from '../../../api/axios'

import PageTitle from '../../../Layout/AppMain/PageTitle'
import Paginate from '../../Components/Paginate/Index'
import FormUserModal from './FormUserModal'

class Users extends React.Component {
  state = {
    users: [],
    search: '',
    links: null,
    meta: null,
    user: { rol: 'asesor' },
    modal: false
  }

  async componentDidMount() {
    let { search } = this.state

    try {
      await axios
        .post('listusser', { search })
        .then(({ data: { data, links, meta } }) => {
          this.setState({ users: data, links, meta })
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
            this.setState({ users: data, links, meta })
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
            this.setState({ users: data, links, meta })
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
          this.setState({ search: value, users: data, links, meta })
        })
      } else {
        this.setState({ search: value })
      }
    } catch (error) {
      console.log(error)
    }
  }

  newUser = () => {
    let user = { rol: 'asesor', name: '', user: '', email: '', password: '', salary: '' }
    let option = 'CREATE'
    this.setState({ modal: true, user, option })
  }

  toggle = () => {
    this.setState(state => ({ modal: !state.modal }))
  }

  handleChange = e => {
    this.setState({
      user: {
        ...this.state.user,
        [e.target.name]: e.target.value
      }
    })
  }

  submit = async () => {
    if (this.validate()) {
      let { user, option } = this.state

      if (option === 'CREATE') {
        document.getElementById('btn-save').disabled = true

        try {
          await axios.post('register', user).then(({ data: { success } }) => {
            if (success) {
              this.setState({ modal: false })
              this.reloadPage()
              document.getElementById('btn-save').disabled = false
            } else {
              alert('No se pudo registrar el usuario')
            }
          })
        } catch (error) {
          console.log(error)
        }
      } else {
        document.getElementById('btn-save').disabled = true

        try {
          await axios
            .put(`users/${this.state.custom.ruc}/update`, user)
            .then(({ data: { success } }) => {
              if (success) {
                this.setState({ modal: false })
                this.reloadPage()
                document.getElementById('btn-save').disabled = false
              } else {
                alert('No se pudo registrar el usuario')
              }
            })
        } catch (error) {
          console.log(error)
        }
      }
    }
  }

  validate = () => {
    let { name, user, email, password, salary } = this.state.user

    if (
      name === undefined ||
      user === undefined ||
      email === undefined ||
      salary === undefined ||
      password === undefined
    ) {
      alert('Todos los campos son obligatorios')
      return
    }

    return true
  }

  edit = id => {
    let option = 'EDIT'
    try {
      axios
        .get(`show/${id}/show`)
        .then(({ data: { user } }) => {
          this.setState({ user, modal: true, option })
        })
    } catch (err) {
      console.log(err)
    }
  }

  render() {
    let { users, search, links, meta, modal, user } = this.state

    return (
      <Fragment>
        <PageTitle
          options={[
            {
              id: 'tooltip-add-product',
              action: this.newUser,
              icon: 'plus',
              msmTooltip: 'Registrar usuario',
              color: 'primary'
            }
          ]}
          heading='Asesores'
          subheading='Lista de asesores de la empresa'
          icon='pe-7s-user icon-gradient bg-sunny-morning'
        />
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
              <FormUserModal
                modal={modal}
                user={user}
                handleChange={this.handleChange}
                toggle={this.toggle}
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
                          <tr style={{ 'text-align': 'center' }}>
                            <th>ASESOR</th>
                            <th>USUARIO</th>
                            <th>CORREO</th>
                            <th style={{ width: '5.2em' }}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.length > 0
                            ? users.map(({ id, atts }, index) => (
                              <tr key={`Row${index}`}>
                                <td>{atts.name}</td>
                                <td>{atts.user}</td>
                                <td>{atts.email}</td>
                                <td>
                                  <ButtonGroup size='sm'>
                                    <Button
                                      onClick={() => this.edit(id)}
                                      color='primary'
                                      title='Editar asesor'
                                      className='me-2'
                                    >
                                      <i className='nav-link-icon lnr-pencil'></i>
                                    </Button>
                                    <Link
                                      to={`/app/asesor/${id}/pagos`}
                                      className='btn btn-success'
                                      title='Lista de clientes con pagos'
                                    >
                                      <i className='nav-link-icon lnr-chart-bars'></i>
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

export default Users
