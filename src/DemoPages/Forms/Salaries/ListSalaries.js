import React, { Fragment } from 'react'
import { Row, Col, Card, CardBody, Table, Button } from 'reactstrap'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import PageTitle from '../../../Layout/AppMain/PageTitle'
import SalaryItems from './SalaryItems'
import FormSalaryModal from './FormSalaryModal'
import { months } from '../PaymentHelpers'

class ListSalaries extends React.Component {
  state = {
    search: '',
    salaries: [],
    links: null,
    meta: null,
    user: {},
    salary: {},
    modal: false,
    salaryitems: [
      { payment_id: 0, rason: 'Comercial los alamos', amount: 545 },
      { payment_id: 0, rason: 'Consorcio Adans', amount: 300 }
    ],
    type_salary: 'anticipo'
  }

  componentDidMount () {
    const {
      match: { params }
    } = this.props
    // Simple POST request with a JSON body using fetch
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paginate: 15, user_id: params.id })
    }
    fetch('https://ats.auditwhole.com/salarylist', requestOptions)
      .then(response => response.json())
      .then(res => {
        let { salaries, user, year, month } = res
        let salary = { month, year, amount: user.salary, user_id: user.id }
        this.setState({ salaries, user, year, month, salary })
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
              salaries: data,
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
      fetch('https://ats.auditwhole.com/listusser', requestOptions)
        .then(response => response.json())
        .then(res => {
          let { data, links, meta } = res
          this.setState({
            search: value,
            salaries: data,
            links,
            meta
          })
        })
    } catch (error) {
      console.log(error)
    }
  }

  onChange = e => {
    let { name, value } = e.target
    this.setState({
      salary: {
        ...this.salary,
        [name]: value
      }
    })
  }

  onChangeNumber = e => {
    if (!isNaN(e.target.value)) {
      this.onChange(e)
    }
  }

  addSalaryItem = () => {
    let { salaryitems } = this.state
    salaryitems.push({
      payment_id: 0,
      rason: 'Comercial los alamos',
      amount: 545
    })
    this.setState({ salaryitems })
  }

  onCheck = e => {
    this.setState({
      type_salary: e.target.value
    })
  }

  toggle = () => {
    this.setState(state => ({ modal: !state.modal }))
  }

  submitSaveSalary = () => {
    if (this.validate()) {
      // Simple POST request with a JSON body using fetch
      let { salary } = this.state
      const requestOptions = {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(salary)
      }
      if (salary.id === undefined) {
        document.getElementById('btn-save').disabled = true
        requestOptions.method = 'POST'

        fetch('https://ats.auditwhole.com/salaries', requestOptions)
          .then(response => response.json())
          .then(res => {
            let { salaries } = this.state
            salaries.unshift({ id: res.salary.id, atts: res.salary })
            let { month, year } = res.salary
            if (month === 12) {
              month = 1
              year++
            } else {
              month++
            }
            this.setState({
              modal: false,
              salaries,
              year,
              month
            })
            document.getElementById('btn-save').disabled = false
          })
          .catch(() => {
            alert('Ya existe un cobro de ese mes')
          })
      } else {
        document.getElementById('btn-save').disabled = true
        requestOptions.method = 'PUT'
        fetch(
          'https://ats.auditwhole.com/salaries/' + salary.id,
          requestOptions
        )
          .then(response => response.json())
          .then(res => {
            let { salaries } = this.state
            var { year, month, amount, type, voucher, note, date } = res.salary
            var index = salaries.findIndex(e => e.id === salary.id)
            salaries[index] = {
              id: salary.id,
              atts: { year, month, amount, type, voucher, note, date }
            }
            this.setState({
              modal: false,
              salaries
            })
            document.getElementById('btn-save').disabled = false
          })
      }
    }
  }

  validate = () => {
    let { type_salary, salary } = this.state

    console.log(salary)

    if (type_salary === 'cheque') {
      if (salary.advance === undefined || salary.advance === '') {
        alert('Debe llenar el numero de cheque')
        return
      }
    }

    return true
  }

  render () {
    let { type_salary, modal, user, salary, salaries, salaryitems } = this.state
    return (
      <Fragment>
        <PageTitle
          heading='Asesor'
          subheading={user.name === undefined ? null : user.name}
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
              <FormSalaryModal
                type_salary={type_salary}
                modal={modal}
                salary={salary}
                toggle={this.toggle}
                onCheck={this.onCheck}
                onChange={this.onChange}
                onChangeNumber={this.onChangeNumber}
                submit={this.submitSaveSalary}
              />
              <Row>
                <Col lg='6'>
                  <Card className='main-card mb-3'>
                    <div className='card-header'>
                      COBROS
                      <div className='btn-actions-pane-right'>
                        <div role='group' className='btn-group-sm btn-group'>
                          <button
                            onClick={e => this.toggle()}
                            className='btn btn-primary'
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    <CardBody>
                      <Table striped size='sm' responsive>
                        <thead>
                          <tr style={{ 'text-align': 'center' }}>
                            <th>Mes</th>
                            <th>Sueldo</th>
                            <th>Saldo</th>
                            <th>Pagado</th>
                            <th>Faltante</th>
                            <th style={{ width: '2em' }}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {salaries.length > 0
                            ? salaries.map(
                                (
                                  {
                                    id,
                                    atts: { month, amount, balance, paid_out }
                                  },
                                  index
                                ) => (
                                  <tr
                                    key={`salary${index}`}
                                    style={{ 'text-align': 'center' }}
                                  >
                                    {/* -1 Por que se refiere a la posicion del array */}
                                    <td>{months[month - 1].description}</td>
                                    <td>{amount}</td>
                                    <td>{balance}</td>
                                    <td>{paid_out}</td>
                                    <td>
                                      {(amount - balance - paid_out).toFixed(2)}
                                    </td>
                                    <td>
                                      <Button
                                        className='font-icon-sm pb-0 pt-1'
                                        color='success'
                                      >
                                        <i className='pe-7s-cash'></i>
                                      </Button>
                                    </td>
                                  </tr>
                                )
                              )
                            : null}
                        </tbody>
                      </Table>
                    </CardBody>
                  </Card>
                </Col>
                <SalaryItems
                  salaryitems={salaryitems}
                  type_salary={type_salary}
                />
              </Row>
            </div>
          </CSSTransition>
        </TransitionGroup>
      </Fragment>
    )
  }
}

export default ListSalaries
