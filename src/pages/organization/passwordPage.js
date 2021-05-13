import React, {useState} from 'react'
import { Card, Button, Col, Form } from 'react-bootstrap'
import Message from '../../components/message'

const PasswordPage = () => {
    const pass = {
        old_password: '',
        new_password:  '',
        repeat_password: ''
    }
    const [passwordCredentials, setPasswordCredentials] = useState(pass)
    const [errorMode, setErrorMode] = useState(false)
    const [errorMessage, setErrorMessage] = useState('error')

    const onFormChange = (e) => {
        e.preventDefault()
        setPasswordCredentials({
            ...passwordCredentials,
            [e.target.name]: e.target.value
        })
        setErrorMode(false)
    }

    const formmValidator = () => {
        const { old_password, new_password, repeat_password } = passwordCredentials
        
        if (old_password === '') {
            setErrorMode(true)
            setErrorMessage('Enter Current Password')
            return false;
        }
        else if (new_password === '') {
            setErrorMode(true)
            setErrorMessage('Enter New Password')
            return false;
        }
        else if (new_password.length < 8) {
            setErrorMode(true)
            setErrorMessage('Enter Atleast 8 Characters')
            return false;
        }
        else if (repeat_password === '') {
            setErrorMode(true)
            setErrorMessage('Re-enter New Password')
            return false;
        }
        else if (repeat_password !== new_password) {
            setErrorMode(true)
            setErrorMessage('Passwords Did Not Match!')
            return false;
        }
        else{
            setErrorMode(false)
            setErrorMessage('')
            return true;
        }
    }

    const onFinish = (e) => {
        e.preventDefault()
        const isFormValid = formmValidator()

        if (isFormValid) {
            console.log('Passwords Are Correct')
            console.log(passwordCredentials)
        }
        else {
            console.log('Password Form Is Not Valid')
        }
    }

    return (
        <Card>
            <Message  variant='info' >Change Password</Message>  
            <Card.Body>
                <Form onSubmit={e => onFinish(e)}>
                    <Form.Group controlId="formGridPassword">
                        <Form.Label>Old Password</Form.Label>
                        <Form.Control type="password" name="old_password" value={passwordCredentials.old_password} onChange={onFormChange} placeholder="Enter Old Password" />
                    </Form.Group>
                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridPassword">
                            <Form.Label>New Password</Form.Label>
                            <Form.Control type="password" name="new_password" value={passwordCredentials.new_password} onChange={onFormChange} placeholder="Enter New Password" />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridPassword">
                            <Form.Label>Repeat Password</Form.Label>
                            <Form.Control type="password" name="repeat_password" value={passwordCredentials.repeat_password} onChange={onFormChange} placeholder=" Re-Enter Password" />
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Button
                            type=""
                            variant='danger'
                            hidden={!errorMode}
                            style={{ width: '100%' }}
                        >{errorMessage}</Button>
                    </Form.Row><br />
                    <Button variant="primary" type="submit"> Save </Button>
                </Form>
            </Card.Body>
        </Card>
    )
}

export default PasswordPage
