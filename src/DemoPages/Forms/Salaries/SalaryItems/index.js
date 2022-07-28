import React, { Fragment } from 'react'
import { Col, Card, CardBody, Table, Button, Input } from 'reactstrap'
import { months } from '../../PaymentHelpers'

import SelectPayOfCustom from './SelectPayOfCustom'

class SalaryItems extends React.Component {
  render () {
    let {
      salary,
      user_id,
      salaryadvances,
      salaryadvancesofpays,
      addSalaryAdvance,
      addSalaryAdvanceofpay,
      changeSalaryAdvance,
      changeSalaryAdvanceAmount,
      checkAdvance
    } = this.props

    if (salary === null) {
      return null
    }

    let { month, amount, balance, cheque, amount_cheque } = salary

    let sum_salary_advance = Number(
      salaryadvances
        .reduce((sum, salaryadvance) => sum + Number(salaryadvance.amount), 0)
        .toFixed(2)
    )

    return (
      <Fragment>
        <Col lg={7}>
          <Card className='main-card'>
            <div className='card-header'>
              {`PAGOS ${months[month.substring(5) - 1].description}`}
              {cheque === null && sum_salary_advance + balance < amount ? (
                <div className='btn-actions-pane-right'>
                  <div role='group' className='btn-group-sm btn-group'>
                    <Button
                      title='Agregar anticipo'
                      onClick={e => addSalaryAdvance()}
                      className='btn btn-primary'
                    >
                      +
                    </Button>
                    <button
                      title='Agregar anticipo de pago'
                      onClick={e => addSalaryAdvanceofpay()}
                      className='btn btn-success'
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
                    <th style={{ 'text-align': 'right' }}>
                      {amount.toFixed(2)}
                    </th>
                    <th></th>
                  </tr>
                  {balance > 0 ? (
                    <tr className='text-center'>
                      <td colSpan={2}>Saldo mes anterior</td>
                      <td style={{ 'text-align': 'right' }}>
                        {balance.toFixed(2)}
                      </td>
                      <th></th>
                    </tr>
                  ) : null}
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
                  {salaryadvancesofpays.length > 0
                    ? salaryadvancesofpays.map((salaryadvancesofpay, index) => (
                        <tr key={`salaryadvanceofpayrow${index}`}>
                          <td className='text-center'>{index + 1}</td>
                          <td>
                            {/* Cuando edit undefined O es editar entonces solo muestra texto */}
                            {/* Cuando es NO EDITAR entonces muestra el input porque esta negando el edit */}
                            {salaryadvancesofpay.edit === undefined ||
                            salaryadvancesofpay.edit ? (
                              'ssofpay.description'
                            ) : (
                              <SelectPayOfCustom user_id={user_id} />
                            )}
                          </td>
                          <td style={{ 'text-align': 'right' }}>
                            {salaryadvancesofpay.edit === undefined ||
                            salaryadvancesofpay.edit ? (
                              salaryadvancesofpay.amount
                            ) : (
                              <Input
                                name='amount'
                                onChange={changeSalaryAdvanceAmount(index)}
                                value={salaryadvancesofpay.amount}
                                style={{ width: '6em', 'text-align': 'right' }}
                              />
                            )}
                          </td>
                          <td className='text-center'>
                            <input
                              name='edit'
                              type='checkbox'
                              class='custom-control-input'
                              checked={
                                salaryadvancesofpay.edit === undefined
                                  ? true
                                  : salaryadvancesofpay.edit
                              }
                              onChange={checkAdvance(index)}
                            />
                          </td>
                        </tr>
                      ))
                    : null}
                  {salaryadvances.length > 0
                    ? salaryadvances.map((salaryadvance, index) => (
                        <tr key={`salaryadvancerow${index}`}>
                          <td className='text-center'>{index + 1}</td>
                          <td>
                            {/* Cuando edit undefined O es editar entonces solo muestra texto */}
                            {/* Cuando es NO EDITAR entonces muestra el input porque esta negando el edit */}
                            {salaryadvance.edit === undefined ||
                            salaryadvance.edit ? (
                              salaryadvance.description
                            ) : (
                              <Input
                                name='description'
                                onChange={changeSalaryAdvance(index)}
                                value={salaryadvance.description}
                              />
                            )}
                          </td>
                          <td style={{ 'text-align': 'right' }}>
                            {salaryadvance.edit === undefined ||
                            salaryadvance.edit ? (
                              salaryadvance.amount
                            ) : (
                              <Input
                                name='amount'
                                onChange={changeSalaryAdvanceAmount(index)}
                                value={salaryadvance.amount}
                                style={{ width: '6em', 'text-align': 'right' }}
                              />
                            )}
                          </td>
                          <td className='text-center'>
                            <input
                              name='edit'
                              type='checkbox'
                              class='custom-control-input'
                              checked={
                                salaryadvance.edit === undefined
                                  ? true
                                  : salaryadvance.edit
                              }
                              onChange={checkAdvance(index)}
                            />
                          </td>
                        </tr>
                      ))
                    : null}
                </tbody>
                <tfoot>
                  {/* Mostrar el total del anticipo si es mayor a CERO */}
                  {sum_salary_advance > 0 ? (
                    <tr className='text-center'>
                      <th colSpan={2}>Total anticipo</th>
                      <th style={{ 'text-align': 'right' }}>
                        {sum_salary_advance.toFixed(2)}
                      </th>
                      <th></th>
                    </tr>
                  ) : null}
                  {/* Mostrar si solo hay pago con cheque */}
                  {amount_cheque > 0 ? (
                    <tr className='text-center'>
                      <td colSpan={2}>Pagado segun cheque # {cheque}</td>
                      <th style={{ 'text-align': 'right' }}>
                        {amount_cheque.toFixed(2)}
                      </th>
                      <th></th>
                    </tr>
                  ) : null}
                  {/* Mostrar si no hay pago con cheque y falta ajustar el monto de pago */}
                  {/* No le sumo el monto del cheque porque asumimos que es CERO */}
                  {amount > sum_salary_advance + balance + amount_cheque ? (
                    <tr className='text-center'>
                      <td colSpan={2}>
                        <Button className='font-icon-sm py-0' color='success'>
                          Completar Pago
                        </Button>
                      </td>
                      <th style={{ 'text-align': 'right' }}>
                        {(
                          amount -
                          sum_salary_advance -
                          balance +
                          amount_cheque
                        ).toFixed(2)}
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
