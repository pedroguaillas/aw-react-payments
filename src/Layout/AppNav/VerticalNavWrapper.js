import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router-dom'

import MetisMenu from 'react-metismenu'

import { FormsNav, MainNav } from './NavItems'
import { connect } from 'react-redux'

class Nav extends Component {
  render () {
    return (
      <Fragment>
        <MetisMenu
          content={MainNav}
          activeLinkFromLocation
          className='vertical-nav-menu'
          iconNamePrefix=''
          classNameStateIcon='pe-7s-angle-down'
        />
        <MetisMenu
          content={this.props.rol === 'admin' ? FormsNav : [FormsNav[0]]}
          activeLinkFromLocation
          className='vertical-nav-menu'
          iconNamePrefix=''
          classNameStateIcon='pe-7s-angle-down'
        />
      </Fragment>
    )
  }

  isPathActive (path) {
    return this.props.location.pathname.startsWith(path)
  }
}

const mapStateProp = state => ({
  rol: state.AuthOptions.user.rol
})

export default withRouter(connect(mapStateProp)(Nav))
