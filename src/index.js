import React from 'react'
import ReactDOM from 'react-dom'
// import registerServiceWorker from './registerServiceWorker';
import { unregister } from './registerServiceWorker'

import { HashRouter } from 'react-router-dom'
import './assets/base.css'
import configureStore from './config/configureStore'
import { Provider } from 'react-redux'

import Main from './DemoPages/Main'
import setupInterceptors from './services/setupInterceptors'

const store = configureStore()
const rootElement = document.getElementById('root')

const renderApp = Component => {
  ReactDOM.render(
    <Provider store={store}>
      <HashRouter>
        <Component />
      </HashRouter>
    </Provider>,
    rootElement
  )
}

renderApp(Main)

setupInterceptors(store)

if (module.hot) {
  module.hot.accept('./DemoPages/Main', () => {
    const NextApp = require('./DemoPages/Main').default
    renderApp(NextApp)
  })
}

unregister()

// registerServiceWorker();
