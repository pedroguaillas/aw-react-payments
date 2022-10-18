import React, { Component, Fragment } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import { Row, Col, Card, CardBody, CardTitle } from 'reactstrap'

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

import avatar1 from '../../../assets/utils/images/avatars/1.jpg'
import avatar2 from '../../../assets/utils/images/avatars/2.jpg'
import avatar3 from '../../../assets/utils/images/avatars/3.jpg'
import avatar4 from '../../../assets/utils/images/avatars/4.jpg'
import ByMonth from './ByMonth'
import ByType from './ByType'
import ByRangePay from './ByRangePay'
import axios from '../../../api/axios'

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
      await axios
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
                            dataKey='pv'
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
                            dataKey='uv'
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
                            dataKey='uv'
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
                          <CardTitle>Reporte por rango de pagos</CardTitle>
                          <ByRangePay />
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
              <Row>
                <Col md='12'>
                  <Card className='main-card mb-3'>
                    <div className='card-header'>
                      Ultimos cobros
                      {/* <div className='btn-actions-pane-right'>
                        <div role='group' className='btn-group-sm btn-group'>
                          <button className='active btn btn-info'>
                            Last Week
                          </button>
                          <button className='btn btn-info'>All Month</button>
                        </div>
                      </div> */}
                    </div>
                    <div className='table-responsive'>
                      <table className='align-middle mb-0 table table-borderless table-striped table-hover'>
                        <thead>
                          <tr>
                            <th className='text-center'>#</th>
                            <th>Cliente</th>
                            <th className='text-center'>Monto</th>
                            <th className='text-center'>Tipo</th>
                            <th className='text-center'>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className='text-center text-muted'>#345</td>
                            <td>
                              <div className='widget-content p-0'>
                                <div className='widget-content-wrapper'>
                                  <div className='widget-content-left me-3'>
                                    <div className='widget-content-left'>
                                      <img
                                        width={40}
                                        className='rounded-circle'
                                        src={avatar4}
                                        alt='Avatar'
                                      />
                                    </div>
                                  </div>
                                  <div className='widget-content-left flex2'>
                                    <div className='widget-heading'>
                                      John Doe
                                    </div>
                                    <div className='widget-subheading opacity-7'>
                                      Web Developer
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className='text-center'>Madrid</td>
                            <td className='text-center'>
                              <div className='badge bg-warning'>Pending</div>
                            </td>
                            <td className='text-center'>
                              <button
                                type='button'
                                className='btn btn-primary btn-sm'
                              >
                                Details
                              </button>
                            </td>
                          </tr>
                          <tr>
                            <td className='text-center text-muted'>#347</td>
                            <td>
                              <div className='widget-content p-0'>
                                <div className='widget-content-wrapper'>
                                  <div className='widget-content-left me-3'>
                                    <div className='widget-content-left'>
                                      <img
                                        width={40}
                                        className='rounded-circle'
                                        src={avatar3}
                                        alt='Avatar'
                                      />
                                    </div>
                                  </div>
                                  <div className='widget-content-left flex2'>
                                    <div className='widget-heading'>
                                      Ruben Tillman
                                    </div>
                                    <div className='widget-subheading opacity-7'>
                                      Etiam sit amet orci eget
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className='text-center'>Berlin</td>
                            <td className='text-center'>
                              <div className='badge bg-success'>Completed</div>
                            </td>
                            <td className='text-center'>
                              <button
                                type='button'
                                className='btn btn-primary btn-sm'
                              >
                                Details
                              </button>
                            </td>
                          </tr>
                          <tr>
                            <td className='text-center text-muted'>#321</td>
                            <td>
                              <div className='widget-content p-0'>
                                <div className='widget-content-wrapper'>
                                  <div className='widget-content-left me-3'>
                                    <div className='widget-content-left'>
                                      <img
                                        width={40}
                                        className='rounded-circle'
                                        src={avatar2}
                                        alt='Avatar'
                                      />
                                    </div>
                                  </div>
                                  <div className='widget-content-left flex2'>
                                    <div className='widget-heading'>
                                      Elliot Huber
                                    </div>
                                    <div className='widget-subheading opacity-7'>
                                      Lorem ipsum dolor sic
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className='text-center'>London</td>
                            <td className='text-center'>
                              <div className='badge bg-danger'>In Progress</div>
                            </td>
                            <td className='text-center'>
                              <button
                                type='button'
                                className='btn btn-primary btn-sm'
                              >
                                Details
                              </button>
                            </td>
                          </tr>
                          <tr>
                            <td className='text-center text-muted'>#55</td>
                            <td>
                              <div className='widget-content p-0'>
                                <div className='widget-content-wrapper'>
                                  <div className='widget-content-left me-3'>
                                    <div className='widget-content-left'>
                                      <img
                                        width={40}
                                        className='rounded-circle'
                                        src={avatar1}
                                        alt='Avatar'
                                      />
                                    </div>
                                  </div>
                                  <div className='widget-content-left flex2'>
                                    <div className='widget-heading'>
                                      Vinnie Wagstaff
                                    </div>
                                    <div className='widget-subheading opacity-7'>
                                      UI Designer
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className='text-center'>Amsterdam</td>
                            <td className='text-center'>
                              <div className='badge bg-info'>On Hold</div>
                            </td>
                            <td className='text-center'>
                              <button
                                type='button'
                                className='btn btn-primary btn-sm'
                              >
                                Details
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    {/* <div className='d-block text-center card-footer'>
                      <button className='me-2 btn-icon btn-icon-only btn btn-outline-danger'>
                        <i className='pe-7s-trash btn-icon-wrapper'> </i>
                      </button>
                      <button className='btn-wide btn btn-success'>Save</button>
                    </div> */}
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
