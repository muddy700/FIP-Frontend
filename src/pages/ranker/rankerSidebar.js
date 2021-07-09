import React from 'react'
import { Link } from 'react-router-dom';
import 'react-pro-sidebar/dist/css/styles.css';
import Icon from 'supercons'
import '../../styles/sidebar.css'
import { FaUsers } from "react-icons/fa";
import { MdPerson, MdSettings } from "react-icons/md";


const RankerSidebar = () => {

    return (
        <ul className="list-wrapper">
            <li className="list-item">
                <Link to = "dashboard" className="aside-link">
                     <Icon glyph="grid" size={32} /> <span>Dashboard</span>
                </Link>
            </li>
            <li className="list-item">
                <Link to = "/organization_management" className="aside-link">
                     <FaUsers style={{fontSize: '20px'}}/> <span>Manage Organizations</span>
                </Link>
            </li>
            <li className="inner-list-item">
                <Link to = "/my_profile" className="aside-link">
                    <MdPerson style={{fontSize: '20px'}}/> <span>My Profile</span>
                </Link>
            </li>
            <li className="list-item">
                <Link to = "/password" className="aside-link">
                     <MdSettings style={{fontSize: '20px'}}/> <span>Change Password</span>
                </Link>
            </li>
        </ul>
    )
}

export default RankerSidebar
