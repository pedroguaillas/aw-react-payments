import { Route, Redirect } from 'react-router-dom'
import React, { Suspense, lazy, Fragment } from 'react'

import { ToastContainer } from 'react-toastify'

const Dashboards = lazy(() => import('../../DemoPages/Dashboards'))

const Forms = lazy(() => import('../../DemoPages/Forms'))

const AppMain = () => {
  return (
    <Fragment>
      {/* Forms */}

      <Suspense
        fallback={
          <div className='loader-container'>
            <div className='loader-container-inner'>
              <h6 className='mt-5'>
                Por favor espere esta cargando ...
                <small>Espere hasta que se cargue todo el contenido</small>
              </h6>
            </div>
          </div>
        }
      >
        <Route path='/app' component={Forms} />
      </Suspense>

      {/* Dashboards */}

      <Suspense
        fallback={
          <div className='loader-container'>
            <div className='loader-container-inner'>
              <h6 className='mt-3'>
                Por favor espere esta cargando ...
                <small>Espere hasta que se cargue todo el contenido</small>
              </h6>
            </div>
          </div>
        }
      >
        <Route path='/dashboards' component={Dashboards} />
      </Suspense>

      <Route
        exact
        path='/'
        render={() => <Redirect to='/dashboards/basic' />}
      />
      <ToastContainer />
    </Fragment>
  )
}

export default AppMain
