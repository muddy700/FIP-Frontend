import React from 'react'
import { Link } from 'react-router-dom';
import 'react-pro-sidebar/dist/css/styles.css';
import Icon from 'supercons'
import '../../styles/sidebar.css'
import { FaUsers } from "react-icons/fa";
import { MdPerson, MdSettings } from "react-icons/md";

const AdminSidebar = () => {

    return (
        <ul className="list-wrapper">
            <li className="list-item">
                <Link to = "dashboard" className="aside-link">
                     <Icon glyph="grid" size={32} /> <span>Dashboard</span>
                </Link>
            </li>
            <li className="list-item">
                <Link to = "/manage_users" className="aside-link">
                     <FaUsers style={{fontSize: '20px'}}/>  <span>Add User</span>
                </Link>
            </li>
            <li className="list-item">
                <Link to = "/manage_students" className="aside-link">
                     <FaUsers style={{fontSize: '20px'}}/>  <span>All Students</span>
                </Link>
            </li>
            <li className="list-item">
                <Link to = "/manage_alumni" className="aside-link">
                     <FaUsers style={{fontSize: '20px'}}/> <span>All Alumni</span>
                </Link>
            </li>
            {/* <li className="list-item">
                <Link to = "/field_arrival_notes" className="aside-link">
                     <Icon glyph="docs" size={32} /> <span>Field Arrival Notes</span>
                </Link>
            </li> */}
            {/* <li className="list-item">
                <Link to = "/field_results" className="aside-link">
                     <MdAssignmentInd style={{fontSize: '20px'}}/> <span>Field Results</span>
                </Link>
            </li> */}
            <li className="list-item">
                <Link to = "/questions" className="aside-link">
                     <Icon glyph="docs-fill" size={32} /> <span>Add Question</span>
                </Link>
            </li>
            {/* <li className="list-item">
                <Link to = "/roles" className="aside-link">
                     <MdAssignmentInd style={{fontSize: '20px'}}/> <span>Roles</span>
                </Link>
            </li> */}
            <li className="inner-list-item">
                <Link to = "/my_profile" className="aside-link">
                    <MdPerson style={{fontSize: '20px'}}/>  <span>My Profile</span>
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

export default AdminSidebar
