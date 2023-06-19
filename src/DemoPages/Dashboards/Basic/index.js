import React, { Component, Fragment } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  ListGroup,
  ListGroupItem,
  ListGroupItemText
} from 'reactstrap'

import PageTitle from '../../../Layout/AppMain/PageTitle'

import {
  AreaChart,
  Area,
  Line,
  ResponsiveContainer,
  Bar,
  BarChart,
  LineChart
} from 'recharts'

import {
  faAngleUp,
  faArrowLeft,
  faAngleDown
} from '@fortawesome/free-solid-svg-icons'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import ByMonth from './ByMonth'
import ByType from './ByType'
import ByRangePay from './ByRangePay'

import api from '../../../services/api'

const data = [
  { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
  { name: 'Page C', uv: 2000, pv: 6800, amt: 2290 },
  { name: 'Page D', uv: 4780, pv: 7908, amt: 2000 },
  { name: 'Page E', uv: 2890, pv: 9800, amt: 2181 },
  { name: 'Page F', uv: 1390, pv: 3800, amt: 1500 },
  { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 }
]

export default class AnalyticsDashboard1 extends Component {
  constructor () {
    super()

    this.state = {
      dropdownOpen: false,
      total_customers: 0,
      total_users: 0,
      total_payments: 0,
      payment_months: [],
      payment_types: []
    }
  }

  async componentDidMount () {
    try {
      await api
        .get('dashboard')
        .then(
          ({
            data: {
              total_customers,
              total_users,
              total_payments,
              payment_months,
              payment_types
            }
          }) => {
            this.setState({
              total_customers,
              total_users,
              total_payments,
              payment_months,
              payment_types
            })
          }
        )
    } catch (err) {
      console.log(err)
    }
  }

  render () {
    let {
      total_customers,
      total_users,
      total_payments,
      payment_months,
      payment_types
    } = this.state
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
                heading='Dashboard'
                subheading='Resumen'
                icon='pe-7s-car icon-gradient bg-mean-fruit'
              />
              <Row>
                <Col md='4'>
                  <div className='card mb-3 widget-chart'>
                    <div className='widget-chart-content'>
                      <div className='icon-wrapper rounded-circle'>
                        <div className='icon-wrapper-bg bg-primary' />
                        <i className='lnr-users text-primary' />
                      </div>
                      <div className='widget-numbers'>{total_customers}</div>
                      <div className='widget-subheading'>Total Clientes</div>
                      <div className='widget-description text-success'>
                        <FontAwesomeIcon icon={faAngleUp} />
                        <span className='ps-1'>175.5%</span>
                      </div>
                    </div>
                    <div className='widget-chart-wrapper'>
                      <ResponsiveContainer width='100%' aspect={3.0 / 1.0}>
                        <LineChart
                          data={data}
                          margin={{ top: 0, right: 5, left: 5, bottom: 0 }}
                        >
                          <Line
                            type='monotone'
                            stroke='#3ac47d'
                            strokeWidth={3}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </Col>
                <Col md='4'>
                  <div className='card mb-3 widget-chart'>
                    <div className='widget-chart-content'>
                      <div className='icon-wrapper rounded-circle'>
                        <div className='icon-wrapper-bg bg-success' />
                        <i className='lnr-user text-success' />
                      </div>
                      <div className='widget-numbers'>{total_users}</div>
                      <div className='widget-subheading'>Total Asesores</div>
                      <div className='widget-description text-warning'>
                        <span className='pe-1'>15.5%</span>
                        <FontAwesomeIcon icon={faArrowLeft} />
                      </div>
                    </div>
                    <div className='widget-chart-wrapper'>
                      <ResponsiveContainer width='100%' aspect={3.0 / 1.0}>
                        <AreaChart
                          data={data}
                          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                        >
                          <Area
                            type='monotoneX'
                            stroke='#fd7e14'
                            fill='#ffb87d'
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </Col>
                <Col md='4'>
                  <div className='card mb-3 widget-chart'>
                    <div className='widget-chart-content'>
                      <div className='icon-wrapper rounded-circle'>
                        <div className='icon-wrapper-bg bg-danger' />
                        <i className='lnr-chart-bars text-danger' />
                      </div>
                      <div className='widget-numbers'>${total_payments}</div>
                      <div className='widget-subheading'>Total de Ingresos</div>
                      <div className='widget-description text-danger'>
                        <FontAwesomeIcon icon={faAngleDown} />
                        <span className='ps-1'>54.1%</span>
                      </div>
                    </div>
                    <div className='widget-chart-wrapper'>
                      <ResponsiveContainer width='100%' aspect={3.0 / 1.0}>
                        <BarChart data={data}>
                          <Bar
                            fill='#81a4ff'
                            stroke='#3f6ad8'
                            strokeWidth={2}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col lg='6'>
                  <Row>
                    <Col lg={12}>
                      <Card className='main-card mb-3'>
                        <CardBody>
                          <CardTitle>Reporte mensual 2022</CardTitle>
                          <ByMonth payment_months={payment_months} />
                        </CardBody>
                      </Card>
                    </Col>
                    <Col lg={12}>
                      <Card className='main-card mb-3'>
                        <CardBody>
                          <CardTitle>Resumen economico mensual</CardTitle>
                          <ListGroup>
                            <ListGroupItem className='d-flex justify-content-between'>
                              <ListGroupItemText className='mb-0'>
                                <strong>DETALLE</strong>
                              </ListGroupItemText>
                              <ListGroupItemText className='mb-0'>
                                <strong>MONTO</strong>
                              </ListGroupItemText>
                            </ListGroupItem>
                            <ListGroupItem className='d-flex justify-content-between'>
                              <ListGroupItemText className='mb-0'>
                                Ingresos de la empresa
                              </ListGroupItemText>
                              <ListGroupItemText className='mb-0'>
                                32,948.81
                              </ListGroupItemText>
                            </ListGroupItem>
                            <ListGroupItem className='d-flex justify-content-between'>
                              <ListGroupItemText className='mb-0'>
                                Incobrables
                              </ListGroupItemText>
                              <ListGroupItemText className='mb-0'>
                                21,540.00
                              </ListGroupItemText>
                            </ListGroupItem>
                            <ListGroupItem className='d-flex justify-content-between'>
                              <ListGroupItemText className='mb-0'>
                                Total sueldos
                              </ListGroupItemText>
                              <ListGroupItemText className='mb-0'>
                                21,540.00
                              </ListGroupItemText>
                            </ListGroupItem>
                            <ListGroupItem className='d-flex justify-content-between'>
                              <ListGroupItemText className='mb-0'>
                                Total gastos
                              </ListGroupItemText>
                              <ListGroupItemText className='mb-0'>
                                6,537.00
                              </ListGroupItemText>
                            </ListGroupItem>
                            <ListGroupItem className='d-flex justify-content-between'>
                              <ListGroupItemText className='mb-0'>
                                Total sobrante
                              </ListGroupItemText>
                              <ListGroupItemText className='mb-0'>
                                1,576.93
                              </ListGroupItemText>
                            </ListGroupItem>
                          </ListGroup>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                </Col>
                <Col lg='6'>
                  <Card className='main-card mb-3'>
                    <CardBody>
                      <CardTitle>Reporte por tipo de pago</CardTitle>
                      <ByType payment_types={payment_types} />
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
