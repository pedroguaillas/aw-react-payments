import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { Row, Col, Card, CardBody, Table, Button } from 'reactstrap'

import PageTitle from '../../../Layout/AppMain/PageTitle'
import Paginate from '../../Components/Paginate/Index'

class Users extends React.Component {
  state = {
    users: [],
    search: '',
    links: null,
    meta: null
  }

  componentDidMount () {
    // Simple POST request with a JSON body using fetch
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paginate: 15 })
    }
    fetch('https://ats.auditwhole.com/listusser', requestOptions)
      .then(response => response.json())
      .then(res => {
        let { data, meta, links } = res
        this.setState({ users: data, meta, links })
      })
  }

  toggle = () => {
    alert('Ases nates mas')
  }

  render () {
    let { users, links, meta } = this.state

    return (
      <Fragment>
        <PageTitle
          options={[
            {
              id: 'tooltip-add-product',
              action: this.toggle,
              icon: 'plus',
              msmTooltip: 'Registrar cobro',
              color: 'primary'
            }
          ]}
          heading='Asesores'
          subheading='Lista de asesores de la empresa'
          icon='pe-7s-wallet icon-gradient bg-premium-dark'
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
              {users === null ? (
                <p>Cargando ...</p>
              ) : users.length === 0 ? (
                <p>No existe asesores registrados</p>
              ) : (
                <Row>
                  <Col lg='12'>
                    <Card className='main-card mb-3'>
                      <CardBody>
                        <Table striped size='sm' responsive>
                          <thead>
                            <tr>
                              <th>Nombre</th>
                              <th>User</th>
                              <th>Rol</th>
                              <th>Correo Electrónico</th>
                              <th style={{ width: '7.2em' }}></th>
                            </tr>
                          </thead>
                          <tbody>
                            {users.map((user, index) => (
                              <tr key={`Row${index}`}>
                                <td>{user.atts.name}</td>
                                <td>{user.atts.user}</td>
                                <td>{user.atts.rol}</td>
                                <td>{user.atts.email}</td>
                                <td>
                                  <Button
                                    size='sm'
                                    color='primary'
                                    title='Editar'
                                    className='mr-4'
                                  >
                                    <i className='nav-link-icon lnr-pencil'></i>
                                  </Button>
                                  <Button
                                    className='ml-4'
                                    size='sm'
                                    color='danger'
                                    title='Eliminar'
                                  >
                                    <i className='nav-link-icon lnr-trash'></i>
                                  </Button>
                                  <Link to={`/app/asesor/${user.id}/pagos`}>
                                    <Button
                                      className='ml-4'
                                      size='sm'
                                      color='success'
                                      title='Pagos'
                                    >
                                      <i className='nav-link-icon lnr-chart-bars'></i>
                                    </Button>
                                  </Link>
                                </td>
                              </tr>
                            ))}
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
              )}
            </div>
          </CSSTransition>
        </TransitionGroup>
      </Fragment>
    )
  }
}

export default Users
