import React, { Fragment } from 'react'
import { Route } from 'react-router-dom'

// Forms
import Customers from './Customers/'
import Users from './Users'
import Payments from './Payments'
import Salaries from './Salaries'
import Expenses from './Expenses'
import SmartPayment from './SmartPayment'
import ListSalaries from './Salaries/ListSalaries'
import ExpenseItems from './Expenses/ExpenseItems'

// Layout
import AppHeader from '../../Layout/AppHeader/'
import AppSidebar from '../../Layout/AppSidebar/'

const Forms = ({ match }) => (
  <Fragment>
    <AppHeader />
    <div className='app-main'>
      <AppSidebar />
      <div className='app-main__outer'>
        <div className='app-main__inner'>
          {/* Form Elements */}

          <Route path={`${match.url}/clientes`} component={Customers} />
          <Route path={`${match.url}/cliente/:ruc`} component={Payments} />
          <Route path={`${match.url}/asesores`} component={Users} />
          <Route
            path={`${match.url}/asesor/:id/pagos`}
            component={SmartPayment}
          />
          <Route path={`${match.url}/sueldos`} component={Salaries} />
          <Route
            path={`${match.url}/asesor/:id/salarios`}
            component={ListSalaries}
          />
          <Route path={`${match.url}/gastos`} component={Expenses} />
          <Route path={`${match.url}/gasto/:id`} component={ExpenseItems} />
        </div>
      </div>
    </div>
  </Fragment>
)

export default Forms
