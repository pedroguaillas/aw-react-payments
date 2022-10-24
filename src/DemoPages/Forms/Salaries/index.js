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
import axios from '../../../api/axios'

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

  async componentDidMount() {
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

  render() {
    let { users, search, links, meta } = this.state

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
