import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link, useRouteMatch } from 'react-router-dom';
import Button from 'react-bootstrap/Button'
import 'react-pro-sidebar/dist/css/styles.css';
import Icon from 'supercons'
import { useState } from 'react';
import Card from 'react-bootstrap/Card'
import Accordion from 'react-bootstrap/Accordion'
import '../../styles/sidebar.css'


const CoordinatorSidebar = () => {
    let { path, url } = useRouteMatch();

    return (
        <ul className="list-wrapper">
            <li className="list-item">
                <Link to = "dashboard" className="aside-link">
                     <Icon glyph="grid" size={32} /> <span>Dashboard</span>
                </Link>
            </li>
            {/* <li className="list-item">
                <Accordion  style={{backgroundColor: 'inherit', border: 'none'}}>
                <div>
                    <Accordion.Toggle as="div" variant="link" eventKey="0">
                        <Icon glyph="person" size={32} /> <span>My Account</span>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                            <span>
                                <ul >
                                    <li className="inner-list-item">
                                        <Link to = "/my_projects" className="aside-link">
                                            <Icon glyph="docs-fill" size={24} /> <span>My Projects</span>
                                        </Link>
                                    </li>
                                </ul>
                                </span>
                    </Accordion.Collapse>
                </div> </Accordion> 
            </li> */}
            
            <li className="list-item">
                <Link to = "/field_posts" className="aside-link">
                     <Icon glyph="pin" size={32} /> <span>Field Posts</span>
                </Link>
            </li>
            <li className="list-item">
                <Link to = "/reported_students" className="aside-link">
                     <Icon glyph="pin" size={32} /> <span>Reported Students</span>
                </Link>
            </li>
            <li className="list-item">
                <Link to = "/result_summary" className="aside-link">
                     <Icon glyph="pin" size={32} /> <span>Field Result Summary</span>
                </Link>
            </li>
            <li className="list-item">
                <Link to = "/announcements" className="aside-link">
                     <Icon glyph="pin" size={32} /> <span>My Announcements</span>
                </Link>
            </li>
            <li className="list-item">
                <Link to = "/alumni_projects" className="aside-link">
                     <Icon glyph="pin" size={32} /> <span>Alumni Projects</span>
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

export default CoordinatorSidebar
