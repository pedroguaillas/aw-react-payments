import React, { Fragment } from 'react'
import PageTitle from '../../../../Layout/AppMain/PageTitle'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { Card, CardHeader, Col, Row } from 'reactstrap'

const ExpenseItems = () => (
  <Fragment>
    <PageTitle
      heading='Gastos'
      subheading='Lista de gastos'
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
          <Row>
            <Col lg={12}>
              <Card className='main-card mb-3'>
                <CardHeader>Hola mundo</CardHeader>
              </Card>
            </Col>
          </Row>
        </div>
      </CSSTransition>
    </TransitionGroup>
  </Fragment>
)

export default ExpenseItems
