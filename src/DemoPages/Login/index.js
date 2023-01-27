import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Row
} from 'reactstrap'
import { startSesion } from '../../actions/AuthActions'

class Login extends React.Component {
  state = {
    user: '',
    password: ''
  }

  onChange = e => {
    this.setState({
      ...this.state,
      [e.target.name]: e.target.value
    })
  }

  submit = () => {
    // Serealized attributes
    let { user, password } = this.state

    // Validate attributes
    if (user.trim() === '' || password.trim() === '') {
      alert('El usuario y la contraña son obligatorios', 'alerta-error')
      return
    }

    // Call_to_action
    this.props.startSesion({ user, password })
  }

  render () {
    let { user, password } = this.state

    let { authenticated, message } = this.props

    if (authenticated) {
      return <Redirect to='/dashboard/basic' />
    }
    
    return (
      <Fragment>
        <div className='app-login mt-4'>
          <Container>
            <Row>
              <Col />
              <Col sm={8} md={4}>
                <Card inverse>
                  <CardHeader className='text-center'>
                    <CardTitle tag='h5'>Iniciar sesión</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <Form>
                      <FormGroup>
                        <Input
                          type='text'
                          value={user}
                          onChange={this.onChange}
                          placeholder='Usuario'
                          name='user'
                        />
                      </FormGroup>
                      <FormGroup>
                        <Input
                          type='password'
                          value={password}
                          onChange={this.onChange}
                          placeholder='Contraseña'
                          name='password'
                        />
                      </FormGroup>
                    </Form>
                    {message !== null ? (
                      <Alert color='danger'>
                        Usuario o contraseña incorrecto
                      </Alert>
                    ) : null}
                    <Button onClick={this.submit} color='primary' type='submit'>
                      Ingresar
                    </Button>
                  </CardBody>
                </Card>
              </Col>
              <Col />
            </Row>
          </Container>
        </div>
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({
  authenticated: state.AuthOptions.authenticated,
  message: state.AuthOptions.message
})

const mapDispatchToProps = dispatch => ({
  startSesion: user => dispatch(startSesion(user))
})

// export default Login
export default connect(mapStateToProps, mapDispatchToProps)(Login)
