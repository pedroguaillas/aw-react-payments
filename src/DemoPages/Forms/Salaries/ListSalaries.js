import React, { Fragment } from 'react'
import { Row, Col, Card, CardBody, Table, Button } from 'reactstrap'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import PageTitle from '../../../Layout/AppMain/PageTitle'
import SalaryItems from './SalaryItems'
import FormSalaryModal from './FormSalaryModal'
import { months } from '../PaymentHelpers'

class ListSalaries extends React.Component {
  state = {
    salaries: [],
    user: {},
    salary: {},
    salary_selected: null,
    modal: false,
    salaryadvances: [],
    salaryadvancesofpays: [],
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
      .then(res => res.json())
      .then(({ salaries, user }) => {
        // Aun no le voy a paginar los salarios
        this.setState({ salaries, user })
      })
  }

  calMonth = () => {
    let { salaries } = this.state

    if (salaries.length === 0) {
      let date = new Date()
      date.setMonth(date.getMonth() - 1)
      return date.toISOString().substring(0, 7)
    }

    let arrMonth = salaries[0].month.split('-')

    if (arrMonth[1] === '12') {
      // Mes de Diciembre a Enero
      arrMonth[1] = '01'
      // Se suma un año mas
      arrMonth[0] = parseInt(arrMonth[0]) + 1
    } else {
      // Se suma el mes
      let newMonth = parseInt(arrMonth[1]) + 1
      arrMonth[1] = newMonth < 10 ? '0' + newMonth : newMonth
    }

    return arrMonth.join('-')
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

  onCheck = e => {
    this.setState({
      type_salary: e.target.value
    })
  }

  toggle = () => {
    this.setState(state => ({ modal: !state.modal }))
  }

  newSalary = () => {
    let { user } = this.state
    let salary = {
      month: this.calMonth(),
      amount: user.salary,
      user_id: user.id,
      balance: '',
      cheque: ''
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

      if (salary.balance === '') {
        salary.balance = 0
      }

      if (type_salary === 'cheque') {
        salary.amount_cheque = salary.amount - salary.balance
      } else {
        // Se elimina el atributo porque se iria con ''
        delete salary.cheque
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
            let { salaries } = this.state
            salary.balance =
              salary.balance === undefined ? 0 : Number(salary.balance)
            if (salary.cheque === undefined) {
              salary.cheque = null
            }
            salary.amount_cheque =
              salary.amount_cheque === undefined
                ? 0
                : Number(salary.amount_cheque)
            salaries.unshift(salary)
            this.setState({
              modal: false,
              salaries
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
          .then(res => res.json())
          .then(salary => {
            let { salaries } = this.state
            var index = salaries.findIndex(e => e.id === salary.id)
            salaries[index] = salary
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
      if (salary.cheque === '') {
        alert('Debe llenar el numero de cheque')
        return
      }
    }

    return true
  }

  onSelectSalary = salary_selected => {
    this.setState({
      salary_selected,
      salaryadvances: [],
      salaryadvancesofpays: []
    })

    fetch('https://ats.auditwhole.com/salaryadvances/' + salary_selected.id)
      .then(res => res.json())
      .then(({ salaryadvances }) => {
        this.setState({ salaryadvances })
      })
  }

  // START Add salary advance
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

  checkAdvance = index => e => {
    let { name, checked } = e.target
    if (checked) {
      this.submitSalaryAdvance(index)
    } else {
      let { salaryadvances } = this.state
      salaryadvances[index][name] = checked
      this.setState({ salaryadvances })
    }
  }

  submitSalaryAdvance = index => {
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
          .then(() => {
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

  // END Add salary advance

  // START Add salary advance OF PAY
  addSalaryAdvanceofpay = () => {
    let { salaryadvancesofpays } = this.state
    salaryadvancesofpays.push({
      salary_id: 0,
      payment_id: 0,
      amount: '',
      edit: false
    })
    this.setState({ salaryadvancesofpays })
  }

  selectPay = (pay, index) => {
    let { salaryadvancesofpays } = this.state

    // Determinar que ese pago no este en esta lista
    if (
      salaryadvancesofpays.findIndex(saop => saop.payment_id === pay.id) > -1
    ) {
      alert('No se puede seleccionar el mismo pago dos veces')
      return
    }

    // Determinar cuanto falta para el cobro total
    // Si supera el monto del salario del cruce, poner el parcial no mas
    let amount = pay.amount
    salaryadvancesofpays[index].amount = amount
    salaryadvancesofpays[index].payment_id = pay.id
    this.setState({ salaryadvancesofpays })

    return true
  }

  checkAdvanceofpays = index => e => {
    let { name, checked } = e.target
    if (checked) {
      this.submitSalaryAdvanceofpays(index)
    } else {
      let { salaryadvancesofpays } = this.state
      salaryadvancesofpays[index][name] = checked
      this.setState({ salaryadvancesofpays })
    }
  }

  submitSalaryAdvanceofpays = index => {
    if (this.validateSalaryAdvanceOfPay(index)) {
      // Simple POST request with a JSON body using fetch
      let { salaryadvancesofpays, salary_selected } = this.state
      let salaryadvancesofpay = salaryadvancesofpays[index]
      salaryadvancesofpay.salary_id = salary_selected.id

      const requestOptions = {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(salaryadvancesofpay)
      }
      if (salaryadvancesofpay.id === undefined) {
        requestOptions.method = 'POST'

        fetch('https://ats.auditwhole.com/salaryadvanceofpays', requestOptions)
          .then(res => res.json())
          .then(({ salaryadvancesofpay }) => {
            let { salaryadvancesofpays } = this.state
            salaryadvancesofpays[index].edit = true
            salaryadvancesofpays[index].id = salaryadvancesofpay.id
            this.setState({ salaryadvancesofpays })
          })
          .catch(() => {
            alert('Se produjo un error')
          })
      } else {
        requestOptions.method = 'PUT'

        // fetch(
        //   'https://ats.auditwhole.com/salaryadvances/' + salaryadvancesofpay.id,
        //   requestOptions
        // )
        //   .then(res => res.json())
        //   .then(res => {
        //     let { salaryadvances } = this.state
        //     salaryadvances[index].edit = true
        //     this.setState({ salaryadvances })
        //   })
        //   .catch(() => {
        //     alert('Se produjo un error')
        //   })
      }
    }
  }

  validateSalaryAdvanceOfPay = index => {
    let { payment_id, amount } = this.state.salaryadvancesofpays[index]

    if (payment_id === 0) {
      alert('Seleccione el pago')
      return
    }

    if (('' + amount).trim().length === 0) {
      alert('Agregue el monto al anticipo')
      return
    }

    if (isNaN(amount)) {
      alert('El monto del anticipo debe ser un número')
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
      salaryadvances,
      salaryadvancesofpays
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
                <Col lg={5}>
                  <Card className='main-card mb-3'>
                    <div className='card-header'>
                      SALARIOS
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
                      <Table className='text-center' size='sm' responsive>
                        <thead>
                          <tr>
                            <th>Mes</th>
                            <th>Sueldo</th>
                            <th>Cobrado</th>
                            <th>Faltante</th>
                            {/* <th style={{ width: '2em' }}></th> */}
                          </tr>
                        </thead>
                        <tbody style={{ cursor: 'pointer' }}>
                          {salaries.length > 0
                            ? salaries.map((salary, index) => (
                                <tr
                                  onClick={() => this.onSelectSalary(salary)}
                                  key={`salary${index}`}
                                  className={
                                    salary_selected !== null &&
                                    salary_selected.id === salary.id
                                      ? 'table-active'
                                      : null
                                  }
                                >
                                  {/* -1 Por que se refiere a la posicion del array */}
                                  <td>
                                    {
                                      months[salary.month.substring(5) - 1]
                                        .description
                                    }
                                  </td>
                                  <td>{salary.amount}</td>
                                  <td>
                                    {(
                                      salary.balance +
                                      salary.amount_cheque +
                                      salary.paid
                                    ).toFixed(2)}
                                  </td>
                                  <td>
                                    {(
                                      salary.amount -
                                      salary.balance -
                                      salary.amount_cheque -
                                      salary.paid
                                    ).toFixed(2)}
                                  </td>
                                  {/* <td>
                                    <Button
                                      className='font-icon-sm pb-0 pt-1'
                                      color='success'
                                      onClick={e => this.onSelectSalary(salary)}
                                    >
                                      <i className='pe-7s-cash'></i>
                                    </Button>
                                  </td> */}
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
                  salaryadvancesofpays={salaryadvancesofpays}
                  type_salary={type_salary}
                  user_id={user.id}
                  addSalaryAdvance={this.addSalaryAdvance}
                  addSalaryAdvanceofpay={this.addSalaryAdvanceofpay}
                  changeSalaryAdvance={this.changeSalaryAdvance}
                  changeSalaryAdvanceAmount={this.changeSalaryAdvanceAmount}
                  checkAdvance={this.checkAdvance}
                  selectPay={this.selectPay}
                  checkAdvanceofpays={this.checkAdvanceofpays}
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
