
import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export const IdleTimeOutModal = ({showModal, handleClose, handleLogout, remainingTime}) => {

    return (
        <Modal show={showModal} onHide={handleClose} centered>
            <Modal.Header closeButton>
            <Modal.Title>You have been idle for a while!</Modal.Title>
            </Modal.Header>
            <Modal.Body>You will be logged out automatically. Do you want to stay?</Modal.Body>
            {/* <Modal.Body>You Will Get Timed Out In {remainingTime}. You want to stay?</Modal.Body> */}
            <Modal.Footer>
            <Button variant="danger" onClick={handleLogout}>
                Logout
            </Button>
            <Button variant="primary" onClick={handleClose}>
                Stay
            </Button>
            </Modal.Footer>
        </Modal>
    )
}