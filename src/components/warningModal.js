import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom';

const WarningModal = ({title, content, closeModal, postId, professionId, organizationId, ...props }) => {
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
            <Modal.Body >
                {content}
            </Modal.Body>
            <Modal.Footer>
                <Link to={{ pathname: "/interview_page", postId, professionId, organizationId }}>
                    <Button variant="link" >Start</Button>
                </Link>
                <Button
                    variant="secondary"
                    onClick={closeModal}
                >Cancel</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default WarningModal
