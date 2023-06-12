import React, { Fragment } from 'react'
import PageTitle from '../../../Layout/AppMain/PageTitle'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { Row, Col, Card, CardBody, Table } from 'reactstrap'
import FormExpenseModal from './FormExpenseModal'

import axios from '../../../services/api'

class Expenses extends React.Component {
  state = {
    expenses: [],
    expense: {},
    modal: false,
    error: {}
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

  submit = async () => {
    let { expense } = this.state

    await axios
      .post('expenses', expense)
      .then(res => {
        if (res.code === 'ERR_BAD_REQUEST') {
          this.setState({ error: res.response.data })
        } else if (res.status === 200) {
          let { expenses } = this.state
          expenses.push(res.data.expense)
          this.setState({ expenses, modal: false, error: {} })
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  render () {
    let { expenses, expense, modal, error } = this.state

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
                            <tr
                              key={`expense${index}`}
                              style={{ 'text-align': 'center' }}
                            >
                              <td>{expense.description}</td>
                              <td>{expense.amount}</td>
                              <th style={{ width: '2em' }}></th>
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
