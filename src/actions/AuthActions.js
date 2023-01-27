import api from '../services/api'

import {
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  REFRESH_TOKEN,
  LOGOUT_SESSION
} from '../types'

// When the user click in submit
export function startSesion (user) {
  return async dispatch => {
    try {
      await api.post('login', user).then(({ data }) => {
        dispatch({
          type: LOGIN_SUCCESS,
          payload: data
        })
      })
    } catch (error) {
      const alert = {
        message: 'Usuario o contraseña incorrecto',
        category: 'alert-error'
      }
      dispatch({
        type: LOGIN_ERROR,
        payload: alert
      })
    }
  }
}

export function refresthToken (token) {
  return dispatch => {
    dispatch({
      type: REFRESH_TOKEN,
      payload: token
    })
  }
}

export function logout (token) {
  return async dispatch => {
    try {
      await api.get('logout')
      dispatch({
        type: LOGOUT_SESSION
      })
    } catch (error) {
      console.log(error)
    }
  }
}
