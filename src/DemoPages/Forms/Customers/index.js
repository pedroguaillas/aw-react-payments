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
  CardHeader
} from 'reactstrap'
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
    }
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

  toggle = () => {
    this.setState(state => ({ modal: !state.modal }))
  }

  selectUser = user_id => {
    alert('Ya selecciona pero falta actualizar estado')
    // this.setState({
    //   custom: {
    //     ...this.state.custom,
    //     user_id
    //   }
    // })
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

  submit = () => alert('Falta guardar')

  render () {
    let { customers, search, links, meta, modal, custom } = this.state

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
                    action: this.toggle,
                    icon: 'plus',
                    msmTooltip: 'Registrar cobro',
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
                            <th style={{ width: '2em' }}></th>
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
                                    <Link to={'/app/cliente/' + customer.ruc}>
                                      <Button
                                        className='font-icon-sm pb-0 pt-1'
                                        color='success'
                                        onClick={e => this.onPays(customer.ruc)}
                                      >
                                        <i className='pe-7s-cash'></i>
                                      </Button>
                                    </Link>
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
