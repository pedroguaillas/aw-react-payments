import React from 'react'
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap'

class DialogDelete extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      modal: false
    }

    this.toggle = this.toggle.bind(this)
  }

  componentDidUpdate (prevProps) {
    if (this.props.item_id !== prevProps.item_id) {
      let modal = this.props.item_id > 0
      this.setState({ modal })
    }
  }

  delete = () => {
    let { deleteItem, item_id } = this.props
    deleteItem(item_id)
  }

  //Show & hidden modal
  toggle = () => this.setState(state => ({ modal: !state.modal }))

  render () {
    return (
      <Modal
        isOpen={this.state.modal}
        toggle={this.toggle}
        className={this.props.className}
      >
        <ModalBody>
          <div className='text-center text-danger'>
            <i
              style={{ 'font-size': '3.5rem' }}
              className='lnr-cross-circle'
            ></i>
          </div>
          <br />
          <h4 style={{ 'text-align': 'center' }}>
            Esta seguro eliminar el {this.props.title}!
          </h4>
        </ModalBody>
        <ModalFooter>
          <Button color='link' onClick={this.toggle}>
            Cancelar
          </Button>
          <Button color='danger' onClick={e => this.delete()}>
            Eliminar
          </Button>{' '}
        </ModalFooter>
      </Modal>
    )
  }
}

export default DialogDelete
