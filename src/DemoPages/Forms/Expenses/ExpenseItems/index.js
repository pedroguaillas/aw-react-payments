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

class ExpenseItems extends Component {
  state = {
    expense: {},
    expenseItems: [],
    expenseitem: {},
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
      expenseitem: {
        ...this.state.expenseitem,
        [e.target.name]: e.target.value
      }
    })
  }

  submit = async () => {
    let { expenseitem } = this.state

    if (expenseitem.id === undefined) {
      await axios
        .post('expenseitems', expenseitem)
        .then(res => {
          if (res.code === 'ERR_BAD_REQUEST') {
            this.setState({ error: res.response.data })
          } else if (res.status === 200) {
            let { expenseitems } = this.state
            expenseitems.push(res.data.expenseitem)
            this.setState({
              expenseitems,
              expenseitem: {},
              isOpen: false,
              error: {}
            })
          }
        })
        .catch(err => console.log(err))
    }
  }

  newExpenseItem = () => {
    this.setState(state => ({
      expenseitem: { expense_id: state.expense.id },
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

  toogle = () => this.setState(state => ({ isOpen: !state.isOpen }))

  render () {
    let { expense, expenseItems, expenseitem, isOpen, error, id_delete } =
      this.state

    return (
      <Fragment>
        <PageTitle
          options={[
            {
              id: 'tooltip-add-expense-items',
              action: this.newExpenseItem,
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
                expenseitem={expenseitem}
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
                            <th></th>
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
export default ExpenseItems
