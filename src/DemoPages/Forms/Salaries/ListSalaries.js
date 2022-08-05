import React, { Fragment } from 'react'
import { Row, Col, Card, CardBody, Table } from 'reactstrap'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import PageTitle from '../../../Layout/AppMain/PageTitle'
import SalaryItems from './SalaryItems'
import FormSalaryModal from './FormSalaryModal'
import { months } from '../PaymentHelpers'
import DialogDelete from '../../Components/DialogDelete'

class ListSalaries extends React.Component {
  state = {
    salaries: [],
    user: {},
    salary: {},
    salary_selected: null,
    modal: false,
    salaryadvances: [],
    salaryadvanceofpays: [],
    type_salary: 'anticipo',
    item_id: 0,
    item_id_of_pay: 0,
    complete: false
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
      type_salary: 'anticipo',
      modal: !state.modal,
      complete: false
    }))
  }

  submitSaveSalary = () => {
    if (this.validate()) {
      // Simple POST request with a JSON body using fetch
      let { type_salary, salary, salaries } = this.state

      if (salary.balance === '') {
        salary.balance = 0
      }

      // amount_cheque no es neceario inicializar porque su valor por defecto es cero
      if (type_salary === 'cheque') {
        salary.amount_cheque = salary.amount - salary.balance - salary.paid
      }

      // cash no es neceario inicializar porque su valor por defecto es cero
      if (type_salary === 'efectivo') {
        salary.cash = salary.amount - salary.balance - salary.paid
      }

      // Se elimina el atributo cheque porque se iria con ''
      if (type_salary === 'anticipo' || type_salary === 'efectivo') {
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
            salary.balance =
              salary.balance === undefined ? 0 : Number(salary.balance)
            if (salary.cheque === undefined) {
              salary.cheque = null
            }
            salary.amount_cheque =
              salary.amount_cheque === undefined
                ? 0
                : Number(salary.amount_cheque)

            salary.cash = salary.cash === undefined ? 0 : Number(salary.cash)
            salaries.unshift(salary)
            this.setState({
              modal: false,
              salaries,
              salary_selected: salary,
              salaryadvances: [],
              salaryadvanceofpays: []
            })
            document.getElementById('btn-save').disabled = false
          })
          .catch(() => {
            alert('Ya existe un cobro de ese mes')
          })
      } else {
        document.getElementById('btn-save').disabled = true
        requestOptions.method = 'PUT'

        // Modifico antes porque por que si guarda
        var index = salaries.findIndex(e => e.id === salary.id)
        salaries[index] = salary

        fetch(
          'https://ats.auditwhole.com/salaries/' + salary.id,
          requestOptions
        )
          .then(res => res.json())
          .then(({}) => {
            this.setState({
              modal: false,
              salaries,
              salary_selected: salary
            })
            document.getElementById('btn-save').disabled = false
          })
      }
    }
  }

  validate = () => {
    let { type_salary, salary } = this.state

    if (type_salary === 'cheque') {
      if (salary.cheque === '' || salary.cheque === null) {
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
      salaryadvanceofpays: []
    })

    fetch('https://ats.auditwhole.com/salaryadvances/' + salary_selected.id)
      .then(res => res.json())
      .then(({ salaryadvances, salaryadvanceofpays }) => {
        this.setState({ salaryadvances, salaryadvanceofpays })
      })
  }

  // START Add salary advance
  addSalaryAdvance = () => {
    if (this.enableAdvance()) {
      let { salaryadvances } = this.state
      salaryadvances.push({ description: '', amount: '', edit: false })
      this.setState({ salaryadvances })
    }
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
    } else if (this.enableAdvance()) {
      let { salaryadvances } = this.state
      salaryadvances[index][name] = checked
      this.setState({ salaryadvances })
    }
  }

  submitSalaryAdvance = index => {
    if (this.validateSalaryAdvance(index)) {
      // Simple POST request with a JSON body using fetch
      let {
        salaryadvances,
        salaryadvanceofpays,
        salaries,
        salary_selected
      } = this.state
      let salaryadvance = salaryadvances[index]
      salaryadvance.salary_id = salary_selected.id

      const requestOptions = {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(salaryadvance)
      }
      if (salaryadvance.id === undefined) {
        requestOptions.method = 'POST'
        // Desabilitar el Checkbox
        document.getElementById(
          'checkbox' + (salaryadvanceofpays.length + index)
        ).disabled = true

        fetch('https://ats.auditwhole.com/salaryadvances', requestOptions)
          .then(res => res.json())
          .then(({ salaryadvance }) => {
            // Habilitar el Checkbox
            document.getElementById(
              'checkbox' + (salaryadvanceofpays.length + index)
            ).disabled = false
            // Poner el anticipo guardado
            salaryadvances[index].edit = true
            // Agregar el atributo id
            salaryadvances[index].id = salaryadvance.id
            // sumar el atributo paid el monto del salaryadvance
            let fi = salaries.findIndex(s => s.id === salary_selected.id)
            salaries[fi].paid += Number(salaryadvance.amount)
            this.setState({ salaries, salaryadvances })
          })
          .catch(() => {
            alert('Se produjo un error')
          })
      } else {
        requestOptions.method = 'PUT'
        // Desabilitar el Checkbox
        document.getElementById(
          'checkbox' + (salaryadvanceofpays.length + index)
        ).disabled = true

        fetch(
          'https://ats.auditwhole.com/salaryadvances/' + salaryadvance.id,
          requestOptions
        )
          .then(res => res.json())
          .then(({ salaryadvance }) => {
            // Habilitar el Checkbox
            document.getElementById(
              'checkbox' + (salaryadvanceofpays.length + index)
            ).disabled = false
            // Poner el anticipo guardado
            salaryadvances[index].edit = true
            this.setState({ salaryadvances })
            // Volver a calcular el pagado
            this.recalculatePaid()
          })
          .catch(() => {
            alert('Se produjo un error')
          })
      }
    }
  }

  // Volver a calcular el PAID cuando se edita o elimina un anticipo
  recalculatePaid = () => {
    let {
      salaries,
      salary_selected,
      salaryadvances,
      salaryadvanceofpays
    } = this.state

    let sum = Number(salaryadvances.reduce((s, sa) => s + Number(sa.amount), 0))
    sum += salaryadvanceofpays.reduce((s1, sdop) => s1 + Number(sdop.amount), 0)

    let is = salaries.findIndex(s => s.id === salary_selected.id)

    sum = Number(sum.toFixed(2))
    salaries[is].paid = sum
    salary_selected.paid = sum

    this.setState({ salaries, salary_selected })
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

  deletesalaryadvance = item => {
    // 1. Si el item no tiene id borrar directo
    if (item.id === undefined) {
      let { salaryadvances } = this.state
      salaryadvances = salaryadvances.filter(s => s.id !== undefined)
      this.setState({ salaryadvances })
    }

    // 2. Si el item tiene id Mostrar DialogDelete
    if (this.enableAdvance()) {
      this.setState({ item_id: item.id })
    }
  }

  deleteItem = id => {
    fetch('https://ats.auditwhole.com/salaryadvances/' + id, {
      method: 'DELETE'
    }).then(() => {
      let { salaryadvances } = this.state
      salaryadvances = salaryadvances.filter(e => e.id !== id)
      this.setState({
        salaryadvances,
        item_id: 0
      })
      this.recalculatePaid()
    })
  }

  // END Add salary advance

  // START Add salary advance OF PAY
  addSalaryAdvanceofpay = () => {
    if (this.enableAdvance()) {
      let { salaryadvanceofpays } = this.state
      salaryadvanceofpays.push({
        salary_id: 0,
        payment_id: 0,
        amount: '',
        edit: false
      })
      this.setState({ salaryadvanceofpays })
    }
  }

  selectPay = (pay, index) => {
    let { salaryadvanceofpays } = this.state

    // Determinar que ese pago no este en esta lista
    if (
      salaryadvanceofpays.findIndex(saop => saop.payment_id === pay.id) > -1
    ) {
      alert('No se puede seleccionar el mismo pago dos veces')
      return
    }

    // Determinar cuanto falta para el cobro total
    // Si supera el monto del salario del cruce, poner el parcial no mas
    let amount = pay.amount
    salaryadvanceofpays[index].amount = amount
    salaryadvanceofpays[index].payment_id = pay.id
    this.setState({ salaryadvanceofpays })

    return true
  }

  changeSalaryAdvanceAmountOfPay = index => e => {
    let { name, value } = e.target
    if (isNaN(value)) {
      return
    }
    let { salaryadvanceofpays } = this.state
    salaryadvanceofpays[index][name] = value
    this.setState({ salaryadvanceofpays })
  }

  checkAdvanceofpays = index => e => {
    let { name, checked } = e.target
    if (checked) {
      this.submitSalaryAdvanceofpays(index)
    } else {
      let { salaryadvanceofpays } = this.state
      salaryadvanceofpays[index][name] = checked
      this.setState({ salaryadvanceofpays })
    }
  }

  submitSalaryAdvanceofpays = index => {
    if (this.validateSalaryAdvanceOfPay(index)) {
      // Simple POST request with a JSON body using fetch
      let { salaryadvanceofpays, salaries, salary_selected } = this.state
      let salaryadvanceofpay = salaryadvanceofpays[index]
      salaryadvanceofpay.salary_id = salary_selected.id

      const requestOptions = {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(salaryadvanceofpay)
      }
      if (salaryadvanceofpay.id === undefined) {
        requestOptions.method = 'POST'
        // Desabilitar el Checkbox
        document.getElementById('checkbox' + index).disabled = true

        fetch('https://ats.auditwhole.com/salaryadvanceofpays', requestOptions)
          .then(res => res.json())
          .then(({ salaryadvanceofpay }) => {
            // Habilitar el Checkbox
            document.getElementById('checkbox' + index).disabled = false
            // Poner el anticipo guardado
            salaryadvanceofpays[index].edit = true
            // Agregar el atributo id
            salaryadvanceofpays[index].id = salaryadvanceofpay.id
            // sumar el atributo paid de salarios el monto del salaryadvanceofpay
            let fi = salaries.findIndex(s => s.id === salary_selected.id)
            salaries[fi].paid += Number(salaryadvanceofpay.amount)
            this.setState({ salaries, salaryadvanceofpays })
          })
          .catch(() => {
            alert('Se produjo un error')
          })
      } else {
        requestOptions.method = 'PUT'
        // Desabilitar el Checkbox
        document.getElementById('checkbox' + index).disabled = true

        fetch(
          'https://ats.auditwhole.com/salaryadvanceofpays/' +
            salaryadvanceofpay.id,
          requestOptions
        )
          .then(res => res.json())
          .then(({ salaryadvance }) => {
            // Habilitar el Checkbox
            document.getElementById('checkbox' + index).disabled = false
            // Poner el anticipo guardado
            salaryadvanceofpays[index].edit = true
            this.setState({ salaryadvanceofpays })
            // Volver a calcular el pagado
            this.recalculatePaid()
          })
          .catch(() => {
            alert('Se produjo un error')
          })
      }
    }
  }

  validateSalaryAdvanceOfPay = index => {
    let { payment_id, amount } = this.state.salaryadvanceofpays[index]

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

  // Verificar si algun anticipo esta habilitado para editar
  enableAdvance = () => {
    let { salaryadvances, salaryadvanceofpays } = this.state
    let en = salaryadvances.findIndex(sa => sa.edit !== undefined && !sa.edit)
    let enop = salaryadvanceofpays.findIndex(
      saop => saop.edit !== undefined && !saop.edit
    )
    if (en > -1 || enop > -1) {
      alert('No puede estar un anticipo en edición')
      return
    } else {
      return true
    }
  }

  deletesalaryadvanceofpay = item => {
    // 1. Si el item no tiene id borrar directo
    if (item.id === undefined) {
      let { salaryadvanceofpays } = this.state
      salaryadvanceofpays = salaryadvanceofpays.filter(s => s.id !== undefined)
      this.setState({ salaryadvanceofpays })
    }

    // 2. Si el item tiene id Mostrar DialogDelete
    if (this.enableAdvance()) {
      this.setState({ item_id_of_pay: item.id })
    }
  }

  deleteItemOfPay = id => {
    fetch('https://ats.auditwhole.com/salaryadvanceofpays/' + id, {
      method: 'DELETE'
    }).then(() => {
      let { salaryadvanceofpays } = this.state
      salaryadvanceofpays = salaryadvanceofpays.filter(e => e.id !== id)
      this.setState({
        salaryadvanceofpays,
        item_id_of_pay: 0
      })
      this.recalculatePaid()
    })
  }

  completePay = () => {
    this.setState(state => ({
      complete: true,
      modal: !state.modal,
      type_salary: 'cheque',
      salary: state.salary_selected
    }))
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
      salaryadvanceofpays,
      item_id,
      item_id_of_pay,
      complete
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
              <DialogDelete
                item_id={item_id > item_id_of_pay ? item_id : item_id_of_pay}
                deleteItem={
                  item_id > item_id_of_pay
                    ? this.deleteItem
                    : this.deleteItemOfPay
                }
                title='anticipo'
              />
              <FormSalaryModal
                type_salary={type_salary}
                modal={modal}
                toggle={this.toggle}
                salary={salary}
                onChange={this.onChange}
                onChangeNumber={this.onChangeNumber}
                onCheck={this.onCheck}
                submit={this.submitSaveSalary}
                complete={complete}
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
                            <th>A cobrar</th>
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
                                      salary.paid +
                                      salary.cash
                                    ).toFixed(2)}
                                  </td>
                                  <td>
                                    {(
                                      salary.amount -
                                      salary.balance -
                                      salary.amount_cheque -
                                      salary.paid -
                                      salary.cash
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
                  salaryadvanceofpays={salaryadvanceofpays}
                  type_salary={type_salary}
                  user_id={user.id}
                  addSalaryAdvance={this.addSalaryAdvance}
                  addSalaryAdvanceofpay={this.addSalaryAdvanceofpay}
                  changeSalaryAdvance={this.changeSalaryAdvance}
                  changeSalaryAdvanceAmount={this.changeSalaryAdvanceAmount}
                  checkAdvance={this.checkAdvance}
                  selectPay={this.selectPay}
                  changeSalaryAdvanceAmountOfPay={
                    this.changeSalaryAdvanceAmountOfPay
                  }
                  checkAdvanceofpays={this.checkAdvanceofpays}
                  deletesalaryadvance={this.deletesalaryadvance}
                  deletesalaryadvanceofpay={this.deletesalaryadvanceofpay}
                  completePay={this.completePay}
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
