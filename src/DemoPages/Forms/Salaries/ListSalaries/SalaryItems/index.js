import React, { Fragment } from 'react'
import {
  Col,
  Card,
  CardBody,
  Table,
  Button,
  Input,
  ButtonGroup
} from 'reactstrap'
import { months } from '../../../PaymentHelpers'
import SelectPayOfCustom from './SelectPayOfCustom'

class SalaryItems extends React.Component {
  render () {
    let {
      salary,
      user_id,
      salaryadvances,
      salaryadvanceofpays,
      addSalaryAdvance,
      addSalaryAdvanceofpay,
      changeSalaryAdvance,
      changeSalaryAdvanceAmount,
      checkAdvance,
      selectPay,
      changeSalaryAdvanceOfPay,
      changeSalaryAdvanceAmountOfPay,
      checkAdvanceofpays,
      deletesalaryadvance,
      deletesalaryadvanceofpay,
      completePay
    } = this.props

    if (salary === null) {
      return null
    }

    let { month, amount, balance, cheque, paid, amount_cheque, cash } = salary

    let sum_salary_advance = Number(
      salaryadvances.reduce((sum, sa) => sum + Number(sa.amount), 0)
    )

    sum_salary_advance += Number(
      salaryadvanceofpays.reduce((sum1, saop) => sum1 + Number(saop.amount), 0)
    )

    return (
      <Fragment>
        <Col lg={7}>
          <Card className='main-card'>
            <div className='card-header'>
              {`PAGOS ${months[month.substring(5) - 1].description}`}
              {cheque === null && paid + balance + cash < amount ? (
                <div className='btn-actions-pane-right'>
                  <ButtonGroup>
                    <Button
                      title='Agregar anticipo'
                      onClick={e => addSalaryAdvance()}
                      className='btn btn-primary me-1'
                    >
                      +
                    </Button>
                    <Button
                      title='Agregar anticipo de pago cliente'
                      onClick={e => addSalaryAdvanceofpay()}
                      className='btn btn-success'
                    >
                      +
                    </Button>
                  </ButtonGroup>
                </div>
              ) : null}
            </div>
            <CardBody>
              <Table className='text-center' size='sm' bordered responsive>
                <thead>
                  <tr>
                    <th colSpan={3}>SUELDO</th>
                    <th style={{ 'text-align': 'right' }}>{amount}</th>
                    <th></th>
                  </tr>
                  {balance > 0 ? (
                    <tr>
                      <td colSpan={3}>Saldo mes anterior</td>
                      <td style={{ 'text-align': 'right' }}>{balance}</td>
                      <th></th>
                    </tr>
                  ) : null}
                  {salaryadvances.length > 0 ||
                  salaryadvanceofpays.length > 0 ? (
                    <tr>
                      <th>+</th>
                      <th>Anticipo</th>
                      <th style={{ width: '10em' }}>Fecha</th>
                      <th style={{ width: '5em' }}>Monto</th>
                      <th style={{ width: '3em' }}></th>
                    </tr>
                  ) : null}
                </thead>
                <tbody>
                  {salaryadvanceofpays.length > 0
                    ? salaryadvanceofpays.map((salaryadvanceofpay, index) => (
                        <tr key={`salaryadvanceofpayrow${index}`}>
                          <td>{index + 1}</td>
                          <td>
                            {/* Cuando edit undefined O es editar entonces solo muestra texto */}
                            {/* Cuando es NO EDITAR entonces muestra el input porque esta negando el edit */}
                            <SelectPayOfCustom
                              // key={`salaryadvanceofpay${index}`}
                              id={
                                salaryadvanceofpay.id === undefined
                                  ? null
                                  : salaryadvanceofpay.id
                              }
                              user_id={user_id}
                              selectPay={selectPay}
                              index={index}
                              salaryadvanceofpays={salaryadvanceofpays}
                            />
                          </td>
                          {/* Para fecha */}
                          <td>
                            {salaryadvanceofpay.edit === undefined ||
                            salaryadvanceofpay.edit ? (
                              salaryadvanceofpay.date
                            ) : (
                              <Input
                                type='date'
                                name='date'
                                onChange={changeSalaryAdvanceOfPay(index)}
                                value={salaryadvanceofpay.date}
                              />
                            )}
                          </td>
                          <td style={{ 'text-align': 'right' }}>
                            {salaryadvanceofpay.edit === undefined ||
                            salaryadvanceofpay.edit ? (
                              salaryadvanceofpay.amount
                            ) : (
                              <Input
                                name='amount'
                                onChange={changeSalaryAdvanceAmountOfPay(index)}
                                value={salaryadvanceofpay.amount}
                                style={{ 'text-align': 'right' }}
                              />
                            )}
                          </td>
                          <td className='text-center'>
                            <ButtonGroup size='sm'>
                              <input
                                id={`checkbox${index}`}
                                name='edit'
                                type='checkbox'
                                className='custom-control-input me-2'
                                checked={
                                  salaryadvanceofpay.edit === undefined
                                    ? true
                                    : salaryadvanceofpay.edit
                                }
                                onChange={checkAdvanceofpays(index)}
                              />
                              <div
                                onClick={() =>
                                  deletesalaryadvanceofpay(salaryadvanceofpay)
                                }
                                style={{ cursor: 'pointer' }}
                                className='text-danger'
                              >
                                <i className='lnr-cross-circle'></i>
                              </div>
                            </ButtonGroup>
                          </td>
                        </tr>
                      ))
                    : null}
                  {salaryadvances.length > 0
                    ? salaryadvances.map((salaryadvance, index) => (
                        <tr key={`salaryadvancerow${index}`}>
                          <td className='text-center'>
                            {salaryadvanceofpays.length + index + 1}
                          </td>
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
                          {/* Para fecha */}
                          <td>
                            {salaryadvance.edit === undefined ||
                            salaryadvance.edit ? (
                              salaryadvance.date
                            ) : (
                              <Input
                                type='date'
                                name='date'
                                onChange={changeSalaryAdvance(index)}
                                value={salaryadvance.date}
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
                                style={{ 'text-align': 'right' }}
                              />
                            )}
                          </td>
                          <td className='text-center'>
                            <ButtonGroup size='sm'>
                              <input
                                id={`checkbox${
                                  salaryadvanceofpays.length + index
                                }`}
                                name='edit'
                                type='checkbox'
                                className='custom-control-input me-2'
                                checked={
                                  salaryadvance.edit === undefined
                                    ? true
                                    : salaryadvance.edit
                                }
                                onChange={checkAdvance(index)}
                              />
                              <div
                                onClick={() =>
                                  deletesalaryadvance(salaryadvance)
                                }
                                style={{ cursor: 'pointer' }}
                                className='text-danger'
                              >
                                <i className='lnr-cross-circle'></i>
                              </div>
                            </ButtonGroup>
                          </td>
                        </tr>
                      ))
                    : null}
                </tbody>
                <tfoot>
                  {/* Mostrar el total del anticipo si es mayor a CERO */}
                  {sum_salary_advance > 0 ? (
                    <tr className='text-center'>
                      <th colSpan={3}>Total anticipo</th>
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
                      <td style={{ 'text-align': 'right' }}>{amount_cheque}</td>
                      <th></th>
                    </tr>
                  ) : null}
                  {/* Mostrar si solo hay pago en efectivo */}
                  {cash > 0 ? (
                    <tr className='text-center'>
                      <td colSpan={2}>Pagado en efectivo</td>
                      <td style={{ 'text-align': 'right' }}>{cash}</td>
                      <th></th>
                    </tr>
                  ) : null}
                  {/* Mostrar si no hay pago con cheque y falta ajustar el monto de pago */}
                  {/* No le sumo el monto del cheque porque asumimos que es CERO */}
                  {amount >
                  sum_salary_advance + balance + amount_cheque + cash ? (
                    <tr className='text-center'>
                      <td colSpan={3}>
                        <Button
                          onClick={completePay}
                          className='font-icon-sm py-0'
                          color='success'
                        >
                          Completar Pago
                        </Button>
                      </td>
                      <td style={{ 'text-align': 'right' }}>
                        {(
                          amount -
                          sum_salary_advance -
                          balance +
                          amount_cheque +
                          cash
                        ).toFixed(2)}
                      </td>
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
