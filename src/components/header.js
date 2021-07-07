import React from 'react'
import { Link, useHistory } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import { PoweroffOutlined } from '@ant-design/icons';
import '../styles/header.css'
import Icon from 'supercons'
import { useSelector, useDispatch}  from 'react-redux'
import {
    selectUserData,
    // apiConfigurations
} from '../slices/userSlice'
import { changePage, selectAppData } from '../slices/appSlice'
// import { logoutUser } from '../app/api'
import db from '../firebase';

const Header = ({ changeCollapse, value }) => {
    const user = useSelector(selectUserData)
    const appData = useSelector(selectAppData)
    // const config = useSelector(apiConfigurations)
    const dispatch = useDispatch()
    const usersRef = db.collection('users');
    const history = useHistory()

    const removeLoggedAlumni = () => {
        usersRef.doc(appData.alumniDocId).delete()
            .then(() => {
            console.log('User Doc Deleted')
        })
            .catch((error) => {
                console.error("Error Deleting Logged Alumni : ", error);
            });
    }

    const handleLogOut = async () => {
        // const config = { headers: { 'Authorization': `Token ${localStorage.getItem('token')}` } }
        try {
            // const response = await logoutUser(config)
            console.log('logged out')
            dispatch(changePage({
                        activePage: 1
            }))
            
            localStorage.removeItem('token');

            if (user.designation === 'alumni') {
                removeLoggedAlumni()
            }

            history.replace('/')
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
                <Link to = "/dashboard" className="link" style={{color: 'white'}}>
                    <Navbar.Brand href="#home" style={{ color: 'white' }}>FIPMS</Navbar.Brand>
                </Link>
                <Nav className="mr-auto">
                <Icon glyph="list" size={32} onClick={changeCollapse} />
                </Nav>
                <span href="#pricing" style={{ color: 'white', marginRight: '20px' }}> {user.designation} </span>
                <span style={{ cursor: 'pointer' }} className="logout-span" onClick={handleLogOut}>
                    <PoweroffOutlined /> &nbsp; Log out
                </span>
            </Navbar>
        </div>
    )
}

export default Header
