import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import {
  Row,
  Col,
  Card,
  CardBody,
  Table,
  ButtonGroup,
  CardHeader,
  Form,
  InputGroup,
  Input,
  Button
} from 'reactstrap'
import axios from '../../../services/api'

import PageTitle from '../../../Layout/AppMain/PageTitle'
import Paginate from '../../Components/Paginate/Index'
import EditAmountSalaryModal from './EditAmountSalaryModal'

class Users extends React.Component {
  state = {
    users: [],
    search: '',
    links: null,
    meta: null,
    user: { rol: 'asesor' },
    modal: false,
    user: null
  }

  async componentDidMount () {
    try {
      await axios
        .post(`users/salaries`, { paginate: 15 })
        .then(({ data: { data, meta, links } }) => {
          this.setState({ users: data, meta, links })
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

  editSalary = u => {
    let user = {
      id: u.id,
      salary: u.atts.salary
    }
    this.setState({ user, modal: true })
  }

  onChangeNumber = e => {
    this.setState({
      user: {
        ...this.state.user,
        salary: e.target.value
      }
    })
  }

  toogle = () => this.setState(state => ({ modal: !state.modal }))

  submit = async () => {
    if (this.validate) {
      try {
        let { users, user } = this.state
        await axios
          .put(`user/${user.id}`, { salary: user.salary })
          .then(({ data: { user } }) => {
            let index = users.findIndex(u => u.id === user.id)
            users[index].atts.salary = user.salary
            this.setState({
              users,
              modal: false,
              user: null
            })
          })
      } catch (err) {
        console.log(err)
      }
    }
  }

  validate = () => {
    let { user } = this.state

    if (user.salary === '' || user.salary === undefined || user.salary <= 0) {
      alert('El sueldo debe ser mayor a cero')
      return
    }

    return true
  }

  render () {
    let { users, search, links, meta, modal, user } = this.state

    return (
      <Fragment>
        <PageTitle
          heading='Asesores'
          subheading='Lista de asesores con el sueldo'
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
              <EditAmountSalaryModal
                modal={modal}
                toogle={this.toogle}
                user={user}
                onChangeNumber={this.onChangeNumber}
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
                            <th>SUELDO</th>
                            <th style={{ width: '2em' }}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.length > 0
                            ? users.map((user, index) => (
                                <tr key={`Row${index}`}>
                                  <td>{user.atts.name}</td>
                                  <td>{user.atts.salary}</td>
                                  <td>
                                    <ButtonGroup size='sm'>
                                      <Button
                                        onClick={() => this.editSalary(user)}
                                        className='me-1'
                                        color='primary'
                                      >
                                        <i className='nav-link-icon lnr-pencil'></i>
                                      </Button>
                                      <Link
                                        to={`/app/asesor/${user.id}/salarios`}
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
