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
  Input
} from 'reactstrap'

import PageTitle from '../../../Layout/AppMain/PageTitle'
import Paginate from '../../Components/Paginate/Index'

class Users extends React.Component {
  state = {
    users: [],
    search: '',
    links: null,
    meta: null,
    user: { rol: 'asesor' },
    modal: false
  }

  componentDidMount () {
    // Simple POST request with a JSON body using fetch
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paginate: 15 })
    }
    fetch('https://ats.auditwhole.com/users/salaries', requestOptions)
      .then(response => response.json())
      .then(res => {
        let { data, meta, links } = res
        this.setState({ users: data, meta, links })
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
              users: data,
              links,
              meta
            })
          })
      } catch (error) {
        console.log(error)
      }
    }
  }

  onChangeSearch = async e => {
    let { value } = e.target

    try {
      // Simple POST request with a JSON body using fetch
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ search: value })
      }
      fetch('https://ats.auditwhole.com/users/salaries', requestOptions)
        .then(response => response.json())
        .then(res => {
          let { data, links, meta } = res
          this.setState({
            search: value,
            users: data,
            links,
            meta
          })
        })
    } catch (error) {
      console.log(error)
    }
  }

  render () {
    let { users, search, links, meta } = this.state

    return (
      <Fragment>
        <PageTitle
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
