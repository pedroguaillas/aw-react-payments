import React, { Component, Fragment } from 'react'
import PageTitle from '../../../../Layout/AppMain/PageTitle'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Col,
  Row,
  Table
} from 'reactstrap'
import axios from '../../../../services/api'
import FormExpenseItemModal from './FormExpenseItemModal'
import DialogDelete from '../../../Components/DialogDelete'

class expenseItems extends Component {
  state = {
    expense: {},
    expenseItems: [],
    expenseItem: {},
    error: {},
    isOpen: false,
    id_delete: 0
  }

  async componentDidMount () {
    let {
      match: { params }
    } = this.props
    await axios
      .get(`expense/${params.id}/items`)
      .then(({ data: { expense, expenseItems } }) => {
        this.setState({ expense, expenseItems })
      })
      .catch(err => console.log(err))
  }

  handleChange = e => {
    this.setState({
      expenseItem: {
        ...this.state.expenseItem,
        [e.target.name]: e.target.value
      }
    })
  }

  submit = async () => {
    let { expenseItem } = this.state

    if (expenseItem.id === undefined) {
      await axios
        .post('expenseitems', expenseItem)
        .then(res => {
          if (res.code === 'ERR_BAD_REQUEST') {
            this.setState({ error: res.response.data })
          } else if (res.status === 200) {
            let { expenseItems } = this.state
            expenseItems.push(res.data.expenseItem)
            this.setState({
              expenseItems,
              expenseItem: {},
              isOpen: false,
              error: {}
            })
          }
        })
        .catch(err => console.log(err))
    } else {
      await axios
        .put(`expenseitems/${expenseItem.id}`, expenseItem)
        .then(res => {
          if (res.code === 'ERR_BAD_REQUEST') {
            this.setState({ error: res.response.data })
          } else if (res.status === 200) {
            let { expenseItems } = this.state
            let index = expenseItems.findIndex(exp => exp.id === expenseItem.id)
            let { amount, month, pay_method } = res.data.expenseItem
            expenseItems[index] = {
              ...this.state.expenseItems[index],
              amount,
              month,
              pay_method
            }
            this.setState({
              expenseItems,
              expenseItem: {},
              isOpen: false,
              error: {}
            })
          }
        })
        .catch(err => console.log(err))
    }
  }

  newexpenseItem = () => {
    this.setState(state => ({
      expenseItem: { expense_id: state.expense.id },
      error: {},
      isOpen: true
    }))
  }

  delete = async id => {
    await axios
      .delete(`expenseitems/${id}`)
      .then(res => {
        if (res.code === 'ERR_BAD_REQUEST') {
          this.setState({ error: res.response.data })
        } else if (res.status === 200) {
          let { expenseItems } = this.state
          expenseItems = expenseItems.filter(expense => expense.id !== id)
          this.setState({ expenseItems, id_delete: 0 })
        }
      })
      .catch(err => console.log(err))
  }

  edit = expenseItem => {
    expenseItem.amount = parseFloat(expenseItem.amount)
    this.setState({ expenseItem, isOpen: true })
  }

  toogle = () => this.setState(state => ({ isOpen: !state.isOpen }))

  render () {
    let { expense, expenseItems, expenseItem, isOpen, error, id_delete } =
      this.state

    return (
      <Fragment>
        <PageTitle
          options={[
            {
              id: 'tooltip-add-expense-items',
              action: this.newexpenseItem,
              icon: 'plus',
              msmTooltip: 'Registrar gasto item',
              color: 'primary'
            }
          ]}
          heading={expense.description}
          subheading='Pagos'
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
            <div>
              <FormExpenseItemModal
                isOpen={isOpen}
                toggle={this.toogle}
                expenseItem={expenseItem}
                handleChange={this.handleChange}
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
                          <tr>
                            <th>Mes</th>
                            <th>Monto</th>
                            <th>Met. Pago</th>
                            <th style={{ width: '2em' }}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {expenseItems?.map((expenseItem, index) => (
                            <tr key={'expenseItem' + index}>
                              <td>{expenseItem.month}</td>
                              <td>{expenseItem.amount}</td>
                              <td>{expenseItem.pay_method}</td>
                              <td>
                                <ButtonGroup size='sm'>
                                  <Button
                                    onClick={() =>
                                      this.setState({
                                        id_delete: expenseItem.id
                                      })
                                    }
                                    color='danger'
                                    title='Eliminar'
                                    className='me-2'
                                  >
                                    <i className='nav-link-icon lnr-trash'></i>
                                  </Button>
                                  <Button
                                    onClick={() => this.edit(expenseItem)}
                                    color='primary'
                                    title='Editar'
                                    className='ml-2'
                                  >
                                    <i className='nav-link-icon lnr-pencil'></i>
                                  </Button>
                                </ButtonGroup>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
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
export default expenseItems
