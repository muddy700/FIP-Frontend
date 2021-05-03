import React from 'react'
import Modal from 'react-bootstrap/Modal'
import Table from 'react-bootstrap/Table'

const ContentModal = ({title, content, isTable, ...props }) => {
    return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{overflowX: 'scroll'}}>
       {isTable ?  
        <Table striped bordered hover>
            {content}
        </Table>
         : content}
      </Modal.Body>
    </Modal>
    )
}

export default ContentModal
