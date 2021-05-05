import React, { useState} from 'react'
import {Col, Row, Card, Button} from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import '../styles/loginPage.css'
import { useSelector, useDispatch}  from 'react-redux'
import { saveUser, apiConfigurations } from '../slices/userSlice'
import { changePage, selectAppData } from '../slices/appSlice'
import { authenticateUser, getUserInfo } from '../app/api'

export const LoginPage = () => {
  const dispatch = useDispatch();
  const config = useSelector(apiConfigurations)
    const initialUser = {
        username: '',
        password: ''
    }

    const [loginCredentials, setLoginCredentials] = useState(initialUser)
    const { username, password } = loginCredentials;
    const [errorMode, setErrorMode] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    var designation

    const formValidator = (e) => {
        e.preventDefault()
        const username = e.target.username.value;
        const password = e.target.password.value;

        if (username === '') {
            setErrorMode(true);
            setErrorMessage('Username Cannot Be Blank')
            return false;
        }
        else if (password === '') {
            setErrorMode(true);
            setErrorMessage('Password Cannot Be Blank')
            return false;
        }
        else {
            setErrorMode(false);
            setErrorMessage('')
            return true;
        }
    }
    
    const onFinish = async (e) => {
        e.preventDefault()
        const isFormValid = formValidator(e);

        if (isFormValid) {
            try {
                const response = await authenticateUser(loginCredentials)
                const config = { headers: { 'Authorization': `Token ${response.token}` } }

                try {
                    const userProfile = await getUserInfo(config)
                    console.log(userProfile)
                } catch (error) {
                    console.log({
                        'Request': 'Getting User Profile Request',
                        'Error => ' : error,
                    })

                    if (error.response.request.status === 401) {
                        console.log('Invalid Token')
                    }
                }
            }
            catch (error) {
                console.log({
                    'Request => ' : 'Login Request',
                    'Error => ' : error
                })
                
                if (error.response.request.status === 400) {
                    setErrorMode(true);
                    setErrorMessage('Invalid Username Or Password')
                }
             }

        }
        else {
            console.log('Login Form Is Not Valid')
        }
      
        //     dispatch(saveUser({
        //         isAuthenticated: true,
        //         username: username,
        //         designation
        //     }))
        
        // dispatch(changePage({
        //     activePage: 2
        // }))
    }

    const onFormChange = (e) => {
        e.preventDefault()
        setErrorMode(false)
        setLoginCredentials({...loginCredentials, 
            [e.target.name]: e.target.value
        })
    }
    return (
        
        <div className="login-form-container" style={{backgroundColor: '#F3F3F4'}}>
            <Row style={{ width: '100%'}}>
                <Col md={{span: 4, offset: 4}}>
                    <Card >
                        <Card.Header style={{backgroundColor: '#2F4050', color: 'white'}}>CIVE FIP</Card.Header>
                        <Card.Body>
                            <Form  onSubmit={(e) => onFinish(e)}>
                                <Form.Group controlId="formGroupEmail">
                                    <Form.Label>User Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        onChange={onFormChange}
                                        name="username"
                                        value={loginCredentials.username}
                                        placeholder="Enter username" />
                                </Form.Group>
                                <Form.Group controlId="formGroupPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        onChange={onFormChange}
                                        name="password"
                                        value={loginCredentials.password}
                                        placeholder=" Enter Password" />
                                </Form.Group>
                                <Form.Group >
                                    <Button type="submit"
                                        variant={errorMode ? 'danger' : 'primary'}
                                        style={{ width: '100%' }}
                                    >{errorMode ? errorMessage : 'Sign In'}</Button>
                                </Form.Group>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}
