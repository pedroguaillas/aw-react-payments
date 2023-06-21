import React, { Fragment } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import {
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  ListGroup,
  ListGroupItem,
  ListGroupItemText,
  Form,
  InputGroup,
  Input
} from 'reactstrap'
import PageTitle from '../../../Layout/AppMain/PageTitle'
import axios from '../../../services/api'

class Summary extends React.Component {
  state = {
    month: new Date().toISOString().slice(0, 7),
    ingress: 0,
    bad: 0,
    salary: 0,
    expense: 0,
    spare: 0
  }

  async componentDidMount () {
    let { month } = this.state
    try {
      await axios
        .post('summary', { month })
        .then(({ data: { ingress, bad, salary, expense, spare } }) => {
          this.setState({ ingress, bad, salary, expense, spare })
        })
    } catch (err) {
      console.log(err)
    }
  }

  onChange = async e => {
    let month = e.target.value
    try {
      await axios
        .post('summary', { month })
        .then(({ data: { ingress, bad, salary, expense, spare } }) => {
          this.setState({ ingress, bad, salary, expense, spare, month })
        })
    } catch (err) {
      console.log(err)
    }
  }

  render () {
    let { month, ingress, bad, salary, expense, spare } = this.state
    return (
      <Fragment>
        <PageTitle
          heading='Resumen Económico'
          subheading='Ingresos, Gastos'
          icon='pe-7s-note2 icon-gradient bg-sunny-morning'
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
              <Row>
                <Col lg='6'>
                  <Card className='main-card mb-3'>
                    <CardHeader>
                      <CardTitle>Resumen</CardTitle>
                      <div className='btn-actions-pane-right me-2'>
                        <Form className='text-right'>
                          <InputGroup size='sm'>
                            <Input
                              value={month}
                              type='month'
                              onChange={this.onChange}
                              className='search-input'
                            />
                          </InputGroup>
                        </Form>
                      </div>
                    </CardHeader>
                    <CardBody>
                      <ListGroup>
                        <ListGroupItem className='d-flex justify-content-between'>
                          <ListGroupItemText className='mb-0'>
                            <strong>DETALLE</strong>
                          </ListGroupItemText>
                          <ListGroupItemText className='mb-0'>
                            <strong>MONTO</strong>
                          </ListGroupItemText>
                        </ListGroupItem>
                        <ListGroupItem className='d-flex justify-content-between'>
                          <ListGroupItemText className='mb-0'>
                            Ingresos de la empresa
                          </ListGroupItemText>
                          <ListGroupItemText className='mb-0'>
                            {ingress}
                          </ListGroupItemText>
                        </ListGroupItem>
                        <ListGroupItem className='d-flex justify-content-between'>
                          <ListGroupItemText className='mb-0'>
                            Incobrables
                          </ListGroupItemText>
                          <ListGroupItemText className='mb-0'>
                            {bad}
                          </ListGroupItemText>
                        </ListGroupItem>
                        <ListGroupItem className='d-flex justify-content-between'>
                          <ListGroupItemText className='mb-0'>
                            Total de sueldos
                          </ListGroupItemText>
                          <ListGroupItemText className='mb-0'>
                            {salary}
                          </ListGroupItemText>
                        </ListGroupItem>
                        <ListGroupItem className='d-flex justify-content-between'>
                          <ListGroupItemText className='mb-0'>
                            Total gastos
                          </ListGroupItemText>
                          <ListGroupItemText className='mb-0'>
                            {expense}
                          </ListGroupItemText>
                        </ListGroupItem>
                        <ListGroupItem className='d-flex justify-content-between'>
                          <ListGroupItemText className='mb-0'>
                            Total sobrante
                          </ListGroupItemText>
                          <ListGroupItemText className='mb-0'>
                            {spare}
                          </ListGroupItemText>
                        </ListGroupItem>
                      </ListGroup>
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

export default Summary
