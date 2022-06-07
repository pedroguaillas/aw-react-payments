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
  Button
} from 'reactstrap'
import PageTitle from '../../../Layout/AppMain/PageTitle'
import Paginate from '../../Components/Paginate/Index'

class FormElementsControls extends React.Component {
  state = {
    customers: [],
    search: ''
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

  render () {
    let { customers, search, links, meta } = this.state

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
                heading='Clientes'
                subheading='Registro de clientes.'
                icon='pe-7s-users icon-gradient bg-premium-dark'
              />

              <Row>
                <Col lg='12' className='mb-4'>
                  <Card>
                    <div className='card-header'>
                      Busqueda
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
                    </div>
                  </Card>
                </Col>
              </Row>

              {customers === null ? (
                <p>Cargando ...</p>
              ) : customers.length === 0 ? (
                <p>No existe clientes registrados</p>
              ) : (
                <Row>
                  <Col lg='12'>
                    <Card className='main-card mb-3'>
                      <CardBody>
                        <Table striped size='sm' responsive>
                          <thead>
                            <tr>
                              <th style={{ width: '7em' }}>RUC</th>
                              <th>Razon social</th>
                              <th>Asesor</th>
                              <th>Valor</th>
                              <th style={{ width: '1em' }}></th>
                            </tr>
                          </thead>
                          <tbody>
                            {customers.map((customer, index) => (
                              <tr key={index}>
                                <td>{customer.ruc}</td>
                                <td>{customer.atts.razonsocial}</td>
                                <td style={{ 'text-transform': 'uppercase' }}>
                                  {customer.atts.name}
                                </td>
                                <td>${customer.atts.amount}</td>
                                <td>
                                  <Link to={'/app/cliente/' + customer.ruc}>
                                    <Button size='sm' color='primary'>
                                      <i className='nav-link-icon lnr-pencil'></i>
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

export default FormElementsControls
