import React, { Fragment } from 'react'
import PageTitle from '../../../Layout/AppMain/PageTitle'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import {
  Row,
  Col,
  Card,
  CardBody,
  Table,
  ButtonGroup,
  Button
} from 'reactstrap'
import FormExpenseModal from './FormExpenseModal'

import axios from '../../../services/api'
import DialogDelete from '../../Components/DialogDelete'
import { Link } from 'react-router-dom/cjs/react-router-dom'

class Expenses extends React.Component {
  state = {
    expenses: [],
    expense: {},
    modal: false,
    error: {},
    id_delete: 0
  }

  async componentDidMount () {
    await axios
      .get('expenses')
      .then(({ data: { expenses } }) => {
        this.setState({ expenses })
      })
      .catch(err => {
        console.log(err)
      })
  }

  newExpense = () => {
    this.setState({
      expense: {}
    })
    this.toggle()
  }

  handleChange = e => {
    this.setState({
      expense: {
        ...this.state.expense,
        [e.target.name]: e.target.value
      }
    })
  }

  toggle = () => this.setState(state => ({ modal: !state.modal }))

  edit = expense => {
    expense.amount = parseFloat(expense.amount)
    this.setState({ expense, modal: true })
  }

  submit = async () => {
    let { expense } = this.state

    if (expense.id === undefined) {
      await axios
        .post('expenses', expense)
        .then(res => {
          if (res.code === 'ERR_BAD_REQUEST') {
            this.setState({ error: res.response.data })
          } else if (res.status === 200) {
            let { expenses } = this.state
            expenses.push(res.data.expense)
            this.setState({ expenses, expense: {}, modal: false, error: {} })
          }
        })
        .catch(err => console.log(err))
    } else {
      await axios
        .put(`expenses/${expense.id}`, expense)
        .then(res => {
          if (res.code === 'ERR_BAD_REQUEST') {
            this.setState({ error: res.response.data })
          } else if (res.status === 200) {
            let { expenses } = this.state
            let index = expenses.findIndex(exp => exp.id === expense.id)
            let { description, amount } = res.data.expense
            expenses[index].description = description
            expenses[index].amount = amount
            this.setState({ expenses, expense: {}, modal: false, error: {} })
          }
        })
        .catch(err => console.log(err))
    }
  }

  delete = async id => {
    await axios
      .delete(`expenses/${id}`)
      .then(res => {
        if (res.code === 'ERR_BAD_REQUEST') {
          this.setState({ error: res.response.data })
        } else if (res.status === 200) {
          let { expenses } = this.state
          expenses = expenses.filter(expense => expense.id !== id)
          this.setState({ expenses, id_delete: 0 })
        }
      })
      .catch(err => console.log(err))
  }

  render () {
    let { expenses, expense, modal, error, id_delete } = this.state

    return (
      <Fragment>
        <PageTitle
          options={[
            {
              id: 'tooltip-add-expense',
              action: this.newExpense,
              icon: 'plus',
              msmTooltip: 'Registrar gasto',
              color: 'primary'
            }
          ]}
          heading='Gastos'
          subheading='Lista de todos los gastos'
          icon='pe-7s-wallet icon-gradient bg-sunny-morning'
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
            <Fragment>
              <FormExpenseModal
                modal={modal}
                expense={expense}
                handleChange={this.handleChange}
                toggle={this.toggle}
                submit={this.submit}
                error={error}
              />

              <Row>
                <Col lg={12}>
                  <Card className='main-card mb-3'>
                    <DialogDelete
                      item_id={id_delete}
                      deleteItem={this.delete}
                      title={'Gasto'}
                    />
                    <CardBody>
                      <Table striped size='sm' responsive>
                        <thead>
                          <tr style={{ 'text-align': 'center' }}>
                            <th>GASTO</th>
                            <th>MONTO</th>
                            <th style={{ width: '2em' }}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {expenses?.map((expense, index) => (
                            <tr key={`expense${index}`}>
                              <td>{expense.description}</td>
                              <td style={{ 'text-align': 'center' }}>
                                {expense.amount}
                              </td>
                              <th style={{ width: '2em' }}>
                                <ButtonGroup size='sm'>
                                  <Button
                                    onClick={() =>
                                      this.setState({ id_delete: expense.id })
                                    }
                                    color='danger'
                                    title='Eliminar gasto'
                                    className='me-2'
                                  >
                                    <i className='nav-link-icon lnr-trash'></i>
                                  </Button>
                                  <Button
                                    onClick={() => this.edit(expense)}
                                    color='primary'
                                    title='Editar'
                                    className='me-2'
                                  >
                                    <i className='nav-link-icon lnr-pencil'></i>
                                  </Button>
                                  <Link
                                    to={'/app/gasto/' + expense.id}
                                    className='btn btn-success'
                                    title='Lista de gastos'
                                  >
                                    <i className='pe-7s-cash'></i>
                                  </Link>
                                </ButtonGroup>
                              </th>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Fragment>
          </CSSTransition>
        </TransitionGroup>
      </Fragment>
    )
  }
}

export default Expenses
