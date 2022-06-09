import React, { Fragment } from 'react'
import { Route } from 'react-router-dom'

// Forms
import Customers from './Customers/'
import Users from './Users'
import Payments from './Payments'

// Layout
import AppHeader from '../../Layout/AppHeader/'
import AppSidebar from '../../Layout/AppSidebar/'
import SmartPayment from './SmartPayment'

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
        </div>
      </div>
    </div>
  </Fragment>
)

export default Forms
