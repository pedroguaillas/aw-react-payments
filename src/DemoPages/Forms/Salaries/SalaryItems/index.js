import React, { Fragment } from 'react'
import { Col, Card, CardBody, Table, Button } from 'reactstrap'
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
    let { salaryitems, addSalaryItem } = this.props
    return (
      <Fragment>
        <FormSalaryModal modal={modal} toggle={this.toggle} />
        <Col lg={6}>
          <Card className='main-card'>
            <div className='card-header'>
              PAGOS ENERO
              {/* {`${customer === undefined ? 'Pagos' : customer.razonsocial}`} */}
              {/* {customer === undefined ? null : ( */}
              <div className='btn-actions-pane-right'>
                <div role='group' className='btn-group-sm btn-group'>
                  <button
                    onClick={e => addSalaryItem()}
                    className='btn btn-primary'
                  >
                    +
                  </button>
                </div>
              </div>
              {/* )} */}
            </div>
            <CardBody>
              <Table size='sm' bordered responsive>
                <thead>
                  <tr className='text-center'>
                    <th colSpan={2}>SUELDO</th>
                    <th style={{ 'text-align': 'right' }}>1000</th>
                  </tr>
                  <tr className='text-center'>
                    <th>+</th>
                    <th>Anticipo</th>
                    <th>Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {salaryitems.length > 0
                    ? salaryitems.map((salaryitem, index) => (
                        <tr>
                          <td className='text-center'>{index + 1}</td>
                          <td>{salaryitem.rason}</td>
                          <td style={{ 'text-align': 'right' }}>
                            {salaryitem.amount}
                          </td>
                        </tr>
                      ))
                    : null}
                </tbody>
                <tfoot>
                  <tr className='text-center'>
                    <th colSpan={2}>Total pagado</th>
                    <th style={{ 'text-align': 'right' }}>845</th>
                  </tr>
                  <tr className='text-center'>
                    <th colSpan={2}>
                      <Button className='font-icon-sm py-0' color='success'>
                        Completar Pago
                      </Button>
                    </th>
                    <th style={{ 'text-align': 'right' }}>355</th>
                  </tr>
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
