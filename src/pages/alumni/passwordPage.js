import React from 'react'
import { Card, Button, Col, Form } from 'react-bootstrap'
import Message from '../../components/message'

const PasswordPage = () => {
    return (
        <Card>
            <Message  variant='info' >Change Password</Message>  
            <Card.Body>
                <Form>
                    <Form.Group controlId="formGridPassword">
                        <Form.Label>Old Password</Form.Label>
                        <Form.Control type="password" placeholder="Enter Old Password" />
                    </Form.Group>
                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridPassword">
                            <Form.Label>New Password</Form.Label>
                            <Form.Control type="password" placeholder="Enter New Password" />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridPassword">
                            <Form.Label>Repeat Password</Form.Label>
                            <Form.Control type="password" placeholder=" Re-Enter Password" />
                        </Form.Group>
                    </Form.Row>
                    <Button variant="primary" type="submit"> Save </Button>
                </Form>
            </Card.Body>
        </Card>
    )
}

export default PasswordPage
