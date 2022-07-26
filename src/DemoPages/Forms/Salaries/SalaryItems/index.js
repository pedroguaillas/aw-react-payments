import React, { Fragment } from 'react'
import { Col, Card, CardBody, Table, Button, Input } from 'reactstrap'
import { months } from '../../PaymentHelpers'
import FormSalaryModal from './FormSalaryItemModal'

class SalaryItems extends React.Component {
  state = {
    modal: false
  }

  toggle = () => {
    this.setState(state => ({ modal: !state.modal }))
  }

  render () {
    let { modal } = this.state
    let {
      salary,
      salaryadvances,
      addSalaryAdvance,
      changeSalaryAdvance,
      changeSalaryAdvanceAmount,
      saveAdvance
    } = this.props

    if (salary === null) {
      return null
    }

    let { month, amount, balance, cheque, amount_cheque } = salary.atts

    let sum_salary_advance = Number(
      salaryadvances
        .reduce((sum, salaryadvance) => sum + Number(salaryadvance.amount), 0)
        .toFixed(2)
    )

    return (
      <Fragment>
        <FormSalaryModal modal={modal} toggle={this.toggle} />
        <Col lg={6}>
          <Card className='main-card'>
            <div className='card-header'>
              {`PAGOS ${months[month.substring(5) - 1].description}`}
              {cheque === null && sum_salary_advance + balance < amount ? (
                <div className='btn-actions-pane-right'>
                  <div role='group' className='btn-group-sm btn-group'>
                    <button
                      title='Agregar anticipo'
                      onClick={e => addSalaryAdvance()}
                      className='btn btn-primary'
                    >
                      +
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
            <CardBody>
              <Table size='sm' bordered responsive>
                <thead>
                  <tr className='text-center'>
                    <th colSpan={2}>SUELDO</th>
                    <th style={{ 'text-align': 'right' }}>{amount}</th>
                    <th></th>
                  </tr>
                  {salaryadvances.length > 0 ? (
                    <tr className='text-center'>
                      <th>+</th>
                      <th>Anticipo</th>
                      <th>Monto</th>
                      <th style={{ width: '2em' }}></th>
                    </tr>
                  ) : null}
                </thead>
                <tbody>
                  {salaryadvances.length > 0
                    ? salaryadvances.map((salaryadvance, index) => (
                        <tr key={`salaryadvancerow${index}`}>
                          <td className='text-center'>{index + 1}</td>
                          <td>
                            {salaryadvance.id === undefined ? (
                              <Input
                                name='description'
                                onChange={changeSalaryAdvance(index)}
                                value={salaryadvance.description}
                              />
                            ) : (
                              salaryadvance.description
                            )}
                          </td>
                          <td style={{ float: 'right' }}>
                            {salaryadvance.id === undefined ? (
                              <Input
                                name='amount'
                                onChange={changeSalaryAdvanceAmount(index)}
                                value={salaryadvance.amount}
                                style={{ width: '6em', 'text-align': 'right' }}
                              />
                            ) : (
                              salaryadvance.amount
                            )}
                          </td>
                          <td>
                            <div class='custom-control custom-switch'>
                              {/* <Button
                                onClick={() => saveAdvance(index)}
                                class='btn btn-primary btn-sm'
                                type='button'
                              >
                                G
                              </Button> */}
                              <input
                                name='edit'
                                type='checkbox'
                                class='custom-control-input'
                                checked={salaryadvance.edit}
                                onChange={saveAdvance(index)}
                              />
                            </div>
                          </td>
                        </tr>
                      ))
                    : null}
                </tbody>
                <tfoot>
                  <tr className='text-center'>
                    <th colSpan={2}>Total anticipo</th>
                    <th style={{ 'text-align': 'right' }}>
                      {sum_salary_advance}
                    </th>
                    <th></th>
                  </tr>
                  {balance > 0 ? (
                    <tr className='text-center'>
                      <td colSpan={2}>Saldo mes anterior</td>
                      <td style={{ 'text-align': 'right' }}>{balance}</td>
                      <th></th>
                    </tr>
                  ) : null}
                  {amount > sum_salary_advance + balance + amount_cheque ? (
                    <tr className='text-center'>
                      <td colSpan={2}>
                        {/* NO le sumo al monto del cheque porque significa que no esta */}
                        {cheque === null &&
                        amount > sum_salary_advance + balance ? (
                          <Button className='font-icon-sm py-0' color='success'>
                            Completar Pago
                          </Button>
                        ) : (
                          'Pagado segun cheque # ' + cheque
                        )}
                      </td>
                      <th style={{ 'text-align': 'right' }}>
                        {amount - sum_salary_advance - balance}
                      </th>
                      <th></th>
                    </tr>
                  ) : null}
                </tfoot>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Fragment>
    )
  }
}

export default SalaryItems
