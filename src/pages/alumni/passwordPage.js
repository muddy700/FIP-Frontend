import React, {useState} from 'react'
import { Card, Button, Col, Form } from 'react-bootstrap'
import Message from '../../components/message'
import { apiConfigurations, selectUserData } from '../../slices/userSlice';
import { useSelector, useDispatch}  from 'react-redux'
import { getUserInfo, changePassword } from '../../app/api';
import Loader from '../../components/loader';

const PasswordPage = () => {
    const pass = {
        old_password: '',
        new_password:  '',
        repeat_password: ''
    }

    const [passwordCredentials, setPasswordCredentials] = useState(pass)
    const [errorMode, setErrorMode] = useState(false)
    const [errorMessage, setErrorMessage] = useState('error')
    const [isLoading, setIsLoading] = useState(false)
    const [hasPasswordChanged, setHasPasswordChanged] = useState(false)
    const user = useSelector(selectUserData)
    const config = useSelector(apiConfigurations)

    const onFormChange = (e) => {
        e.preventDefault()
        setPasswordCredentials({
            ...passwordCredentials,
            [e.target.name]: e.target.value
        })
        setErrorMode(false)
        setHasPasswordChanged(false)
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
        else if (new_password.length < 6) {
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

    const onFinish = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        const isFormValid = formmValidator()

        if (isFormValid) {
            try {
                const payload = {
                    old_password: passwordCredentials.old_password,
                    new_password: passwordCredentials.new_password
                }
                    
                const response = await changePassword(payload, config)
                console.log('pass changed', response)
                setIsLoading(false)
                setHasPasswordChanged(true)
                setPasswordCredentials(pass)
            }
            catch (error) {
                console.log({
                    'request': 'Change User-Password Request',
                    'Error => ': error.response.data
                })
                setIsLoading(false)
                setErrorMode(true)
                if (error.response.status === 400) {
                    setErrorMessage('Incorrect Current Password!')
                }
                else {
                    setErrorMessage('Oops!!, Some error occured. Try again later!')
                }
            }
        }
        else {
            console.log('Password Form Is Not Valid')
            setIsLoading(false)
        }
    }

    return (
        <Card>
            <Message  variant='info' >Change Password</Message>  
            <Card.Body>
                <Form onSubmit={e => onFinish(e)}>
                    <Form.Group controlId="formGridPassword1">
                        <Form.Label>Current Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="old_password"
                            value={passwordCredentials.old_password}
                            onChange={onFormChange}
                            placeholder="Enter Current Password"
                            autoFocus />
                    </Form.Group>
                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridPassword2">
                            <Form.Label>New Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="new_password"
                                value={passwordCredentials.new_password}
                                onChange={onFormChange}
                                placeholder="Enter New Password" />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridPassword3">
                            <Form.Label>Repeat Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="repeat_password"
                                value={passwordCredentials.repeat_password}
                                onChange={onFormChange}
                                placeholder=" Re-Enter Password" />
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Button
                            type=""
                            variant='danger'
                            hidden={!errorMode}
                            style={{ width: '100%' }}
                        >{errorMessage}</Button>
                        <Button
                            type=""
                            variant='success'
                            hidden={!hasPasswordChanged}
                            style={{ width: '100%' }}
                        >Your password has changed successful.</Button>
                    </Form.Row><br />
                    <Button variant="primary" type="submit">
                        {isLoading ?
                            <Loader message="Saving..." /> : 'Save'}
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    )
}

export default PasswordPage
