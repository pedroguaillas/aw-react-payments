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
    salary_selected: null,
    modal: false,
    salaryadvances: [],
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
      .then(({ salaries, user, year, month }) => {
        let salary = {
          month: `${year}-${month < 10 ? '0' : ''}${month}`,
          amount: user.salary,
          user_id: user.id
        }
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
        ...this.state.salary,
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

  newSalary = () => {
    let { year, month, user } = this.state
    let salary = {
      month: `${year}-${month < 10 ? '0' : ''}${month}`,
      amount: user.salary,
      user_id: user.id
    }
    this.setState(state => ({
      salary,
      modal: !state.modal
    }))
  }

  submitSaveSalary = () => {
    if (this.validate()) {
      // Simple POST request with a JSON body using fetch
      let { type_salary, salary } = this.state

      if (type_salary === 'cheque') {
        salary.amount_cheque =
          salary.amount - (salary.balance === undefined ? 0 : salary.balance)
      }

      const requestOptions = {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(salary)
      }
      if (salary.id === undefined) {
        document.getElementById('btn-save').disabled = true
        requestOptions.method = 'POST'

        fetch('https://ats.auditwhole.com/salaries', requestOptions)
          .then(res => res.json())
          .then(({ salary }) => {
            salary.paid = 0
            let { salaries, year } = this.state
            if (salary.balance === undefined) {
              salary.balance = 0
            }
            if (salary.amount_cheque === undefined) {
              salary.amount_cheque = 0
            }
            salaries.unshift({ id: salary.id, atts: salary })
            let { month } = salary
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

    if (type_salary === 'cheque') {
      if (salary.cheque === undefined || salary.cheque === '') {
        alert('Debe llenar el numero de cheque')
        return
      }
    }

    return true
  }

  onSelectSalary = salary_selected => {
    this.setState({ salary_selected })

    fetch('https://ats.auditwhole.com/salaryadvances/' + salary_selected.id)
      .then(res => res.json())
      .then(({ salaryadvances }) => {
        this.setState({ salaryadvances })
      })
  }

  addSalaryAdvance = () => {
    let { salaryadvances } = this.state
    salaryadvances.push({ description: '', amount: '', edit: false })
    this.setState({ salaryadvances })
  }

  changeSalaryAdvance = index => e => {
    let { name, value } = e.target
    let { salaryadvances } = this.state
    salaryadvances[index][name] = value
    this.setState({ salaryadvances })
  }

  changeSalaryAdvanceAmount = index => e => {
    let { name, value } = e.target
    if (isNaN(value)) {
      return
    }
    let { salaryadvances } = this.state
    salaryadvances[index][name] = value
    this.setState({ salaryadvances })
  }

  saveAdvance = index => e => {
    let { name, checked } = e.target
    this.submitSaveSalaryAdvance(index)
    if (checked) {
    } else {
      let { salaryadvances } = this.state
      salaryadvances[index][name] = checked
      this.setState({ salaryadvances })
    }
  }

  submitSaveSalaryAdvance = index => {
    if (this.validateSalaryAdvance(index)) {
      // Simple POST request with a JSON body using fetch
      let { salaryadvances, salary_selected } = this.state
      let salaryadvance = salaryadvances[index]
      salaryadvance.salary_id = salary_selected.id

      const requestOptions = {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(salaryadvance)
      }
      if (salaryadvance.id === undefined) {
        requestOptions.method = 'POST'

        fetch('https://ats.auditwhole.com/salaryadvances', requestOptions)
          .then(response => response.json())
          .then(res => {
            let { salaryadvances } = this.state
            salaryadvances[index].edit = true
            this.setState({ salaryadvances })
          })
          .catch(() => {
            alert('Se produjo un error')
          })
      } else {
        requestOptions.method = 'PUT'

        fetch(
          'https://ats.auditwhole.com/salaryadvances/' + salaryadvance.id,
          requestOptions
        )
          .then(response => response.json())
          .then(res => {
            let { salaryadvances } = this.state
            salaryadvances[index].edit = true
            this.setState({ salaryadvances })
          })
          .catch(() => {
            alert('Se produjo un error')
          })
      }
    }
  }

  validateSalaryAdvance = index => {
    let { description, amount } = this.state.salaryadvances[index]

    if (description.trim().length < 3) {
      alert('Agregue una descripción al anticipo')
      return
    }

    if (amount.trim().length === 0) {
      alert('Agregue el monto al anticipo')
      return
    }

    if (isNaN(amount)) {
      alert('El monto del acticipo debe ser un numero')
      return
    }

    return true
  }

  render () {
    let {
      type_salary,
      modal,
      user,
      salary,
      salary_selected,
      salaries,
      salaryadvances
    } = this.state
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
                            onClick={e => this.newSalary()}
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
                            ? salaries.map((salary, index) => (
                                <tr
                                  key={`salary${index}`}
                                  style={{ 'text-align': 'center' }}
                                >
                                  {/* -1 Por que se refiere a la posicion del array */}
                                  <td>
                                    {
                                      months[salary.atts.month.substring(5) - 1]
                                        .description
                                    }
                                  </td>
                                  <td>{salary.atts.amount}</td>
                                  <td>{salary.atts.balance}</td>
                                  <td>
                                    {salary.atts.amount_cheque +
                                      salary.atts.paid}
                                  </td>
                                  <td>
                                    {(
                                      salary.atts.amount -
                                      salary.atts.balance -
                                      salary.atts.amount_cheque -
                                      salary.atts.paid
                                    ).toFixed(2)}
                                  </td>
                                  <td>
                                    <Button
                                      className='font-icon-sm pb-0 pt-1'
                                      color='success'
                                      onClick={e => this.onSelectSalary(salary)}
                                    >
                                      <i className='pe-7s-cash'></i>
                                    </Button>
                                  </td>
                                </tr>
                              ))
                            : null}
                        </tbody>
                      </Table>
                    </CardBody>
                  </Card>
                </Col>
                <SalaryItems
                  salary={salary_selected}
                  salaryadvances={salaryadvances}
                  type_salary={type_salary}
                  addSalaryAdvance={this.addSalaryAdvance}
                  changeSalaryAdvance={this.changeSalaryAdvance}
                  changeSalaryAdvanceAmount={this.changeSalaryAdvanceAmount}
                  saveAdvance={this.saveAdvance}
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
