import { Component, Fragment } from 'react'
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputGroup,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Table
} from 'reactstrap'

import Paginate from '../../Components/Paginate/Index'
import axios from '../../../services/api'

class FormSelectAsesorModal extends Component {
  state = {
    users: [],
    search: '',
    modal: false,
    links: null,
    meta: null,
    item: '',
    searching: false
  }

  async componentDidMount () {
    let { search } = this.state

    try {
      await axios
        .post('listusser', { search, paginate: 10 })
        .then(({ data: { data, links, meta } }) => {
          this.setState({ users: data, links, meta })
        })
    } catch (err) {
      console.log(err)
    }
  }

  onChangeSearch = async e => {
    let { value } = e.target
    let { meta, searching } = this.state
    this.setState({ search: value })

    if (!searching) {
      try {
        this.setState({ searching: true })
        await axios
          .post(meta.path, { search: value, paginate: 10 })
          .then(res => {
            let { data, links, meta } = res.data
            this.setState({ searching: false, users: data, links, meta })
          })
      } catch (error) {
        console.log(error)
      }
    }
  }

  selectUser = user => {
    this.setState({ item: user.atts.name, modal: false })
    this.props.onChangeSearchByUser(user.id)
  }

  reqNewPage = async (e, page) => {
    e.preventDefault()

    if (page !== null) {
      let { search, meta } = this.state

      try {
        await axios
          .post(`${meta.path}?page=${page.substring(page.indexOf('=') + 1)}`, {
            search,
            paginate: 10
          })
          .then(res => {
            let { data, links, meta } = res.data
            this.setState({ users: data, links, meta })
          })
      } catch (error) {
        console.log(error)
      }
    }
  }

  toggle = () => {
    this.setState(state => ({ modal: !state.modal }))
  }

  render () {
    let { modal, search, links, meta, users, item } = this.state
    return (
      <Fragment>
        <div>
          <Row>
            <Col>
              <div className='input-group input-group-sm'>
                <Input placeholder='Asesor' value={item} disabled />
                <div className='input-group-append'>
                  <Button onClick={this.toggle}>
                    <i className='nav-link-icon lnr-magnifier'></i>
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <Modal
          isOpen={modal}
          toggle={this.toggle}
          className={this.props.className}
          // size={this.props.size ? this.props.size : 'lg'}
        >
          <ModalHeader toggle={this.toggle}>Seleccionar asesor</ModalHeader>
          <ModalBody>
            <Card className='mb-2'>
              <div className='card-header'>
                Busqueda
                <div className='btn-actions-pane-right'>
                  <Form className='text-right'>
                    <InputGroup size='sm'>
                      <Input
                        value={search}
                        onChange={this.onChangeSearch}
                        placeholder='Buscar'
                        className='search-input'
                      />
                    </InputGroup>
                  </Form>
                </div>
              </div>
            </Card>
            {users === null ? null : (
              <Table className='mb-2' responsive bordered>
                <thead>
                  <tr>
                    <th>Asesor</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={index}>
                      <td onClick={() => this.selectUser(user)}>
                        <a href='javascript:void(0);' className='alert-link'>
                          {user.atts.name}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
            <Paginate links={links} meta={meta} reqNewPage={this.reqNewPage} />
          </ModalBody>
        </Modal>
      </Fragment>
    )
  }
}

export default FormSelectAsesorModal
