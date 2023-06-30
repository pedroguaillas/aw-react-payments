import React, { Fragment } from 'react'
import {
  Row,
  Col,
  Card,
  CardBody,
  Table,
  Button,
  ButtonGroup
} from 'reactstrap'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import PageTitle from '../../../../Layout/AppMain/PageTitle'
import FormSalaryModal from './FormSalaryModal'
import { months } from '../../PaymentHelpers'
import DialogDelete from '../../../Components/DialogDelete'
import axios from '../../../../services/api'
import SalaryItems from './SalaryItems'

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
    complete: false,
    salary_delete_id: 0
  }

  async componentDidMount () {
    const {
      match: { params }
    } = this.props
    try {
      await axios
        .post(`salarylist`, { paginate: 15, user_id: params.id })
        .then(({ data: { salaries, user } }) => {
          // Aun no le voy a paginar los salarios
          this.setState({ salaries, user })
        })
    } catch (err) {
      console.log(err)
    }
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
      cheque: '',
      paid: 0,
      date: new Date().toISOString().substring(0, 10)
    }
    this.setState({
      salary,
      type_salary: 'anticipo',
      modal: true,
      complete: false
    })
  }

  submitSaveSalary = async () => {
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

      if (salary.id === undefined) {
        document.getElementById('btn-save').disabled = true
        try {
          await axios.post(`salaries`, salary).then(({ data: { salary } }) => {
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
        } catch (err) {
          console.log(err)
        }
      } else {
        document.getElementById('btn-save').disabled = true

        // Modifico antes porque por que si guarda
        var index = salaries.findIndex(e => e.id === salary.id)
        salaries[index] = salary
        try {
          await axios.put(`salaries/${salary.id}`).then(res => {
            this.setState({
              modal: false,
              salaries,
              salary_selected: salary
            })
            document.getElementById('btn-save').disabled = false
          })
        } catch (err) {
          console.log(err)
        }
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

  onSelectSalary = async salary_selected => {
    this.setState({
      salary_selected,
      salaryadvances: [],
      salaryadvanceofpays: []
    })

    try {
      await axios
        .get(`salaryadvances/${salary_selected.id}`)
        .then(({ data: { salaryadvances, salaryadvanceofpays } }) => {
          this.setState({ salaryadvances, salaryadvanceofpays })
        })
    } catch (err) {
      console.log(err)
    }
  }

  deleteSalary = async id => {
    this.setState({ salary_delete_id: id })
  }

  destroySalary = async id => {
    try {
      await axios.delete(`salaries/${id}`).then(() => {
        let { salaries } = this.state
        salaries = salaries.filter(s => s.id !== id)
        this.setState({
          salaries,
          salary_delete_id: 0,
          salary_selected: null
        })
      })
    } catch (err) {
      console.log(err)
    }
  }

  // START Add salary advance
  addSalaryAdvance = () => {
    if (this.enableAdvance()) {
      let { salaryadvances } = this.state
      salaryadvances.push({
        description: '',
        amount: '',
        date: new Date().toISOString().substring(0, 10),
        edit: false
      })
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

  submitSalaryAdvance = async index => {
    if (this.validateSalaryAdvance(index)) {
      // Simple POST request with a JSON body using fetch
      let { salaryadvances, salaryadvanceofpays, salaries, salary_selected } =
        this.state
      let salaryadvance = salaryadvances[index]
      salaryadvance.salary_id = salary_selected.id

      if (salaryadvance.id === undefined) {
        // Desabilitar el Checkbox
        document.getElementById(
          'checkbox' + (salaryadvanceofpays.length + index)
        ).disabled = true

        try {
          await axios
            .post(`salaryadvances`, salaryadvance)
            .then(({ data: { salaryadvance } }) => {
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
        } catch (err) {
          console.log(err)
        }
      } else {
        // Desabilitar el Checkbox
        document.getElementById(
          'checkbox' + (salaryadvanceofpays.length + index)
        ).disabled = true

        try {
          await axios
            .put(`salaryadvances/${salaryadvance.id}`, salaryadvance)
            .then(({ data: { salaryadvance } }) => {
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
        } catch (err) {
          console.log(err)
        }
      }
    }
  }

  // Volver a calcular el PAID cuando se edita o elimina un anticipo
  recalculatePaid = () => {
    let { salaries, salary_selected, salaryadvances, salaryadvanceofpays } =
      this.state

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

    if (('' + amount).trim().length === 0) {
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

  deleteItem = async id => {
    try {
      await axios.delete(`salaryadvances/${id}`).then(() => {
        let { salaryadvances } = this.state
        salaryadvances = salaryadvances.filter(e => e.id !== id)
        this.setState({
          salaryadvances,
          item_id: 0
        })
        this.recalculatePaid()
      })
    } catch (err) {
      console.log(err)
    }
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
        date: new Date().toISOString().substring(0, 10),
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
  changeSalaryAdvanceOfPay = index => e => {
    let { name, value } = e.target
    let { salaryadvanceofpays } = this.state
    salaryadvanceofpays[index][name] = value
    this.setState({ salaryadvanceofpays })
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

  submitSalaryAdvanceofpays = async index => {
    if (this.validateSalaryAdvanceOfPay(index)) {
      // Simple POST request with a JSON body using fetch
      let { salaryadvanceofpays, salaries, salary_selected } = this.state
      let salaryadvanceofpay = salaryadvanceofpays[index]
      salaryadvanceofpay.salary_id = salary_selected.id

      if (salaryadvanceofpay.id === undefined) {
        document.getElementById('checkbox' + index).disabled = true

        try {
          await axios
            .post(`salaryadvanceofpays`, salaryadvanceofpay)
            .then(({ data: { salaryadvanceofpay } }) => {
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
        } catch (err) {
          console.log(err)
        }
      } else {
        document.getElementById('checkbox' + index).disabled = true
        try {
          await axios
            .put(
              `salaryadvanceofpays/${salaryadvanceofpay.id}`,
              salaryadvanceofpay
            )
            .then(() => {
              // Habilitar el Checkbox
              document.getElementById('checkbox' + index).disabled = false
              // Poner el anticipo guardado
              salaryadvanceofpays[index].edit = true
              this.setState({ salaryadvanceofpays })
              // Volver a calcular el pagado
              this.recalculatePaid()
            })
        } catch (err) {
          console.log(err)
        }
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

  deleteItemOfPay = async id => {
    try {
      await axios.delete(`salaryadvanceofpays/${id}`).then(() => {
        let { salaryadvanceofpays } = this.state
        salaryadvanceofpays = salaryadvanceofpays.filter(e => e.id !== id)
        this.setState({
          salaryadvanceofpays,
          item_id_of_pay: 0
        })
        this.recalculatePaid()
      })
    } catch (err) {
      console.log(err)
    }
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
      complete,
      salary_delete_id
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
              {/* Eliminar los items de los salarios */}
              <DialogDelete
                item_id={salary_delete_id}
                deleteItem={this.destroySalary}
                title=' sueldo'
              />

              {/* Eliminar los items de los anticipos */}
              <DialogDelete
                item_id={item_id > item_id_of_pay ? item_id : item_id_of_pay}
                deleteItem={
                  item_id > item_id_of_pay
                    ? this.deleteItem
                    : this.deleteItemOfPay
                }
                title=' anticipo'
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
                            <th style={{ width: '4em' }}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {salaries.length > 0
                            ? salaries.map((salary, index) => (
                                <tr
                                  // onClick={() => this.onSelectSalary(salary)}
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
                                  <td>
                                    <ButtonGroup zise='sm'>
                                      <Button
                                        title='Ver'
                                        className='font-icon-sm pb-0 pt-1 px-1 me-1'
                                        color='success'
                                        onClick={e =>
                                          this.onSelectSalary(salary)
                                        }
                                      >
                                        <i className='pe-7s-look'></i>
                                      </Button>
                                      <Button
                                        title='Eliminar salario'
                                        className='font-icon-sm pb-0 pt-1 px-1'
                                        color='danger'
                                        onClick={e =>
                                          this.deleteSalary(salary.id)
                                        }
                                      >
                                        <i className='pe-7s-trash'></i>
                                      </Button>
                                    </ButtonGroup>
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
                  salaryadvanceofpays={salaryadvanceofpays}
                  type_salary={type_salary}
                  user_id={user.id}
                  addSalaryAdvance={this.addSalaryAdvance}
                  addSalaryAdvanceofpay={this.addSalaryAdvanceofpay}
                  changeSalaryAdvance={this.changeSalaryAdvance}
                  changeSalaryAdvanceAmount={this.changeSalaryAdvanceAmount}
                  checkAdvance={this.checkAdvance}
                  selectPay={this.selectPay}
                  changeSalaryAdvanceOfPay={this.changeSalaryAdvanceOfPay}
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
