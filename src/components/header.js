import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
import '../styles/header.css'
import Icon from 'supercons'
import { useSelector, useDispatch}  from 'react-redux'
import { selectUserData, saveUser, apiConfigurations } from '../slices/userSlice'
import { changePage, selectAppData } from '../slices/appSlice'
import { logoutUser } from '../app/api'

const Header = ({ changeCollapse, value }) => {
    const user = useSelector(selectUserData)
    const conf = useSelector(apiConfigurations)
    const dispatch = useDispatch()

    const handleLogOut = async () => {
        const config = { headers: { 'Authorization': `Token ${localStorage.getItem('token')}` } }
        console.log(config)

        try {
            const response = await logoutUser(config)
            console.log('logged out')
            console.log(response)
            dispatch(changePage({
                        activePage: 1
                    }))
            localStorage.removeItem('token')
        } catch (error) {
            console.log({
                'request': 'Logout Request',
                'Error => ': error
            })
            
        }

    }
    
    return (
        <div className="header-card">
            <Navbar className="header-card" sticky="top" fixed="top" >
                <Link to = "/home" className="link" style={{color: 'white'}}>
                    <Navbar.Brand href="#home" style={{ color: 'white' }}>CIVE-FIP</Navbar.Brand>
                </Link>
                <Nav className="mr-auto">
                <Icon glyph="list" size={32} onClick={changeCollapse} />
                </Nav>
                <span href="#pricing" style={{ color: 'white', marginRight: '15px' }}> {user.username} </span>
                <Icon glyph="door-leave" size={32} onClick={handleLogOut} />
            </Navbar>
        </div>
    )
}

export default Header
