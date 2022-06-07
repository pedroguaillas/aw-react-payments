import React, { Fragment } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { Row, Col, Card, CardBody, Table } from 'reactstrap'

import PageTitle from '../../../Layout/AppMain/PageTitle'

import { months } from './../PaymentHelpers'

class ReportPayment extends React.Component {
  state = {
    user: {},
    customers: []
  }

  componentDidMount () {
    const {
      match: { params }
    } = this.props
    // Simple POST request with a JSON body using fetch
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ year: 2022, id: params.id })
    }
    fetch('https://ats.auditwhole.com/listtablebyuser', requestOptions)
      .then(response => response.json())
      .then(res => {
        let { user, customers } = res
        this.setState({ user, customers })
      })
  }

  render () {
    let { user, customers } = this.state

    return (
      <Fragment>
        <PageTitle
          heading='Cobros'
          subheading={user.name}
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
            {customers === null ? (
              <p>Cargando ...</p>
            ) : customers.length === 0 ? (
              <p>No existe pagos registrados</p>
            ) : (
              <Row>
                <Col lg='12'>
                  <Card className='main-card mb-3'>
                    <CardBody>
                      <Table size='sm' bordered responsive>
                        <thead>
                          <tr style={{ 'text-align': 'center' }}>
                            <th>Razon social</th>
                            {months.map((month, index) => (
                              <th key={`${month.description}${index}`}>
                                {month.description}
                              </th>
                            ))}
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {customers.map((customer, index) => (
                            <tr key={index}>
                              <td>{customer.razonsocial}</td>
                              {months.map((month, index) => (
                                <td
                                  style={{ 'text-align': 'right' }}
                                  key={`${month.description}${index}`}
                                >
                                  {customer[month.description.toLowerCase()]}
                                </td>
                              ))}
                              <th style={{ 'text-align': 'right' }}>
                                {customer.total}
                              </th>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            )}
          </CSSTransition>
        </TransitionGroup>
      </Fragment>
    )
  }
}

export default ReportPayment
