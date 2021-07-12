import React from 'react'
import {  Link} from 'react-router-dom';
import 'react-pro-sidebar/dist/css/styles.css';
import Icon from 'supercons'
import '../../styles/sidebar.css'
import { FaUsers } from "react-icons/fa";
import { MdAssignment, MdPerson, MdSettings } from "react-icons/md";

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
                    <FaUsers style={{fontSize: '20px'}}/> <span>My Students</span>
                     {/* <Icon glyph="pin" size={32} /> <span>My Students</span> */}
                </Link>
            </li> 
            <li className="list-item">
                <Link to = "/students_logbooks" className="aside-link">
                    {/* <FaUsers style={{fontSize: '20px'}}/> <span>Students Logbooks</span> */}
                     <Icon glyph="post" size={32} /> <span>Students Logbooks</span>
                </Link>
            </li> 
            <li className="list-item">
                <Link to = "/result_summary" className="aside-link">
                    <MdAssignment style={{fontSize: '20px'}}/> <span>Result Summary</span>
                     {/* <Icon glyph="pin" size={32} /> <span>Result Summary</span> */}
                </Link>
            </li> 
            <li className="inner-list-item">
                <Link to = "/my_profile" className="aside-link">
                    {/* <Icon glyph="person" size={24} /> <span>My Profile</span> */}
                    <MdPerson style={{fontSize: '20px'}}/> <span>My Profile</span>
                </Link>
            </li>
            <li className="list-item">
                <Link to = "/password" className="aside-link">
                     {/* <Icon glyph="settings" size={32} /> <span>Change Password</span> */}
                    <MdSettings style={{fontSize: '20px'}}/> <span>Change Password</span>
                </Link>
            </li>
        </ul>
    )
}

export default AcademicSupervisorSidebar
