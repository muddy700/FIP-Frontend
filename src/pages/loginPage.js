import React, { useState} from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import '../styles/loginPage.css'

export const LoginPage = () => {
    const user = {
        username: '',
        password: ''
    }

    const [loginCredentials, setLoginCredentials] = useState(user)
    // const [username, setUsername] = useState('')
    // const [password, setPassword] = useState('')
    const { username, password} = loginCredentials

    const onFinish = (e) => {
        e.preventDefault()
        console.log(loginCredentials)
        // console.log(username, password)
    }

    const onFormChange = (e) => {
        e.preventDefault()
        setLoginCredentials({
            [e.target.name]: e.target.value
        })
    }
    return (
        
        <div className="login-form-container">
            <form className="login-form" onsubmit={e => onFinish(e) }>
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
            </form>
        </div>
    )
}
