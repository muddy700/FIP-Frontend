import React, { useState} from 'react'
import {Col, Row, Card, Button} from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import '../styles/loginPage.css'
import '../App.css'
import { useDispatch}  from 'react-redux'
import { saveUser} from '../slices/userSlice'
import { changePage } from '../slices/appSlice'
import { authenticateUser, getUserProfile } from '../app/api'
import Loader from '../components/loader';
import db from '../firebase';


export const LoginPage = () => {
  const dispatch = useDispatch();
    const usersRef = db.collection('users');

    const initialUser = {
        username: '',
        password: ''
    }

    const [loginCredentials, setLoginCredentials] = useState(initialUser)
    const [errorMode, setErrorMode] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const addLoggedAlumni = (id, name) => {
        const userData = {
            id: id,
            username: name
        }
        usersRef.add(userData)
            .then((docRef) => {
                dispatch(changePage({
                    alumniDocId: docRef.id,
                    activePage: 2
                }))
        })
            .catch((error) => {
                console.error("Error Adding Logged Alumni : ", error);
            });
    }

    const formValidator = (e) => {
        e.preventDefault()
        const username = e.target.username.value;
        const password = e.target.password.value;

        if (username === '') {
            setErrorMode(true);
            setErrorMessage('Username cannot be blank')
            return false;
        }
        else if (password === '') {
            setErrorMode(true);
            setErrorMessage('Password cannot be blank')
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
        setIsLoading(true)
        const isFormValid = formValidator(e);

        if (isFormValid) {
            const payload = {...loginCredentials, username: loginCredentials.username.replaceAll('/', '-')}
            try {
                const response = await authenticateUser(payload)
                const config = { headers: { 'Authorization': `Token ${response.token}` } }

                try {
                    const userProfile = await getUserProfile(config)
                    dispatch(saveUser({
                        userId: userProfile[0].user,
                        username: userProfile[0].username,
                        first_name: userProfile[0].first_name,
                        last_name: userProfile[0].last_name,
                        designation: userProfile[0].designation_name,
                        designation_id: userProfile[0].designation,
                        profile_image: userProfile[0].profile_image,
                        email: userProfile[0].email,
                        phone: userProfile[0].phone,
                        profileId: userProfile[0].id,
                        gender: userProfile[0].gender,
                        token: response.token,
                        isAuthenticated: true,
                    }))

                    if (userProfile[0].designation_name === 'alumni') {
                        addLoggedAlumni(userProfile[0].user, userProfile[0].username)
                    }

                    localStorage.setItem('token', response.token)
                    dispatch(changePage({
                        activePage: 2
                    }))
                    
                    setLoginCredentials(initialUser)
                    setIsLoading(false)
                    
                } catch (error) {
                    setIsLoading(false)
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
                setIsLoading(false)
                console.log({
                    'Request => ' : 'Login Request',
                    'Error => ' : error
                })
                
                if (error.response.request.status === 400) {
                    setErrorMode(true);
                    setErrorMessage('Invalid username or password')
                }
            }
            
        }
        else {
            setIsLoading(false)
            console.log('Login Form Is Not Valid')
        }
      
        
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
                        <Card.Header style={{backgroundColor: '#2F4050', color: 'white'}}>FIPMS</Card.Header>
                        <Card.Body>
                            <Form  onSubmit={(e) => onFinish(e)}>
                                <Form.Group controlId="formGroupEmail">
                                    <Form.Label>User Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        onChange={onFormChange}
                                        name="username"
                                        autoFocus
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
                                    >{isLoading ?
                                    <Loader message="Loading..." /> :  errorMode ? errorMessage : 'Sign In'}</Button>
                                </Form.Group>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}
