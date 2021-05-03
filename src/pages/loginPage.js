import React, { useState} from 'react'
import {Col, Row, Card } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import '../styles/loginPage.css'
import { useSelector, useDispatch}  from 'react-redux'
import { saveUser, apiConfigurations } from '../slices/userSlice'
import { changePage, selectAppData } from '../slices/appSlice'

export const LoginPage = () => {
  const dispatch = useDispatch();
  const config = useSelector(apiConfigurations)
    const initialUser = {
        username: '',
        password: ''
    }

    const [loginCredentials, setLoginCredentials] = useState(initialUser)
    const { username, password } = loginCredentials;
    var designation

    const onFinish = (e) => {
        e.preventDefault()
        console.log(loginCredentials)
        if (username === 'student') {
            designation = 'student'
        }
        else {
            designation = 'alumni'
        }

            dispatch(saveUser({
                isAuthenticated: true,
                username: username,
                designation
            }))
        
        dispatch(changePage({
            activePage: 2
        }))
    }

    const onFormChange = (e) => {
        e.preventDefault()
        setLoginCredentials({...loginCredentials, 
            [e.target.name]: e.target.value
        })
    }
    return (
        
        <div className="login-form-container">
            <Card style={{marginTop: '200px'}}>
                <Card.Header>
                    Login Form
                </Card.Header>
                <Card.Body>
                    <form onSubmit={(e) => onFinish(e)} className="login-form">
                        <Row className="login-form-rows">
                            <Col md={12} style={{marginBottom: '8px'}}>Username</Col>
                            <Col md={12} >
                                <input style={{}} className="inputs" type="text" onChange={onFormChange} placeholder="Username" name="username" value={loginCredentials.username} autoFocus/> <br />
                            </Col>
                        </Row>
                        <Row className="login-form-rows">
                            <Col md={12} style={{marginBottom: '8px'}}>Password</Col>
                            <Col md={12} >
                                <input style={{}}  className="inputs" type="password" onChange={onFormChange} placeholder="password" name="password" value={loginCredentials.password} /> <br />
                            </Col>
                        </Row>
                        <Row className="login-form-rows">
                            <Col md={{span: 4, offset: 8}}>
                                <button type="submit"  style={{borderRadius: '10px'}}>Submit</button>
                            </Col>
                        </Row>
                        </form>
                    </Card.Body>
                </Card>
            {/* <form className="login-form" onsubmit={e => onFinish(e) }>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" name="username" value={username} onChange={e => onFormChange(e)} placeholder="Enter Username" />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                        <Form.Control type="password" name="password" value={password} onChange={e => onFormChange(e)} placeholder="Password" />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Login
                </Button>
            </form> */}
        </div>
    )
}
