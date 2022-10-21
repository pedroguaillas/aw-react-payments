import React, { Fragment, useState } from 'react'
import {
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
  Label,
  Row
} from 'reactstrap'

const Login = () => {
  const [user, setUser] = useState()
  const [password, setPassword] = useState()

  const submit = () => {
    alert(user)
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
                      <Label for='User'>Usuario</Label>
                      <Input
                        type='text'
                        value={user}
                        onChange={e => setUser(e.target.value)}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for='User'>Contraseña</Label>
                      <Input
                        type='password'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                      />
                    </FormGroup>
                    <Button onClick={submit} color='primary' type='submit'>
                      Ingresar
                    </Button>
                  </Form>
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

export default Login
