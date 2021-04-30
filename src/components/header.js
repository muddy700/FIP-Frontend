import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
import '../styles/header.css'
import Icon from 'supercons'

const Header = ({changeCollapse, value}) => {
    return (
        <div className="header-card">
            <Navbar className="header-card" sticky="top" fixed="top" >
                <Link to = "/home" className="link" style={{color: 'white'}}>
                    <Navbar.Brand href="#home" style={{ color: 'white' }}>CIVE-FIP</Navbar.Brand>
                </Link>
                <Nav className="mr-auto">
                <Icon glyph="list" size={32} onClick={changeCollapse} />
                </Nav>
                <span href="#pricing" style={{color: 'white', marginRight: '15px'}}>Alumni</span>
                <Icon glyph="door-leave" size={32} onClick="" />
            </Navbar>
        </div>
    )
}

export default Header
