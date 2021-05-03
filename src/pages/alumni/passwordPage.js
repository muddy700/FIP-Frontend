import React, {useState} from 'react'
import { Card, Button, Col, Form } from 'react-bootstrap'
import Message from '../../components/message'

const PasswordPage = () => {
    const pass = {
        oldp: '',
        newp:  '',
        repeat: ''
    }
    const [passwordCredentials, setPasswordCredentials] = useState(pass)

    const onFormChange = (e) => {
        e.preventDefault()
        setPasswordCredentials({
            ...passwordCredentials,
        [e.target.name] : e.target.value})
    }

    const onFinish = (e) => {
        e.preventDefault()
        console.log(passwordCredentials)
    }

    return (
        <Card>
            <Message  variant='info' >Change Password</Message>  
            <Card.Body>
                <Form onSubmit={e => onFinish(e)}>
                    <Form.Group controlId="formGridPassword">
                        <Form.Label>Old Password</Form.Label>
                        <Form.Control type="password" name="oldp" value={passwordCredentials.oldp} onChange={e => onFormChange(e)} placeholder="Enter Old Password" />
                    </Form.Group>
                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridPassword">
                            <Form.Label>New Password</Form.Label>
                            <Form.Control type="password" name="newp" value={passwordCredentials.newp} onChange={e => onFormChange(e)} placeholder="Enter New Password" />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridPassword">
                            <Form.Label>Repeat Password</Form.Label>
                            <Form.Control type="password" name="repeat" value={passwordCredentials.repeat} onChange={e => onFormChange(e)} placeholder=" Re-Enter Password" />
                        </Form.Group>
                    </Form.Row>
                    <Button variant="primary" type="submit"> Save </Button>
                </Form>
            </Card.Body>
        </Card>
    )
}

export default PasswordPage
