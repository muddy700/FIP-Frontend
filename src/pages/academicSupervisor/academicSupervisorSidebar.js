import React from 'react'
import {  Link} from 'react-router-dom';
import 'react-pro-sidebar/dist/css/styles.css';
import Icon from 'supercons'
import '../../styles/sidebar.css'

const AcademicSupervisorSidebar = () => {

    return (
        <ul className="list-wrapper">
            <li className="list-item">
                <Link to = "dashboard" className="aside-link">
                     <Icon glyph="grid" size={32} /> <span>Dashboard</span>
                </Link>
            </li>
            <li className="list-item">
                <Link to = "/my_students" className="aside-link">
                     <Icon glyph="pin" size={32} /> <span>My Students</span>
                </Link>
            </li> 
            <li className="list-item">
                <Link to = "/result_summary" className="aside-link">
                     <Icon glyph="pin" size={32} /> <span>Result Summary</span>
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

export default AcademicSupervisorSidebar
