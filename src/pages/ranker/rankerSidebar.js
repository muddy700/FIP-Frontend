import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link, useRouteMatch } from 'react-router-dom';
import Button from 'react-bootstrap/Button'
import 'react-pro-sidebar/dist/css/styles.css';
import Icon from 'supercons'
import { useState } from 'react';
import Card from 'react-bootstrap/Card'
import Accordion from 'react-bootstrap/Accordion'
import '../../styles/sidebar.css'


const RankerSidebar = () => {
    let { path, url } = useRouteMatch();

    return (
        <ul className="list-wrapper">
            <li className="list-item">
                <Link to = "dashboard" className="aside-link">
                     <Icon glyph="grid" size={32} /> <span>Dashboard</span>
                </Link>
            </li>
            <li className="list-item">
                <Link to = "/organization_management" className="aside-link">
                     <Icon glyph="settings" size={32} /> <span>Manage Organizations</span>
                </Link>
            </li>
            <li className="inner-list-item">
                <Link to = "/my_profile" className="aside-link">
                    <Icon glyph="person" size={24} /> <span>My Profile</span>
                </Link>
            </li>
            <li className="list-item">
                <Link to = "/password" className="aside-link">
                     <Icon glyph="settings" size={32} /> <span>Change Password</span>
                </Link>
            </li>
        </ul>
    )
}

export default RankerSidebar
