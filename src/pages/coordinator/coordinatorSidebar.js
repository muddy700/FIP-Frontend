import React from 'react'
import {  Link} from 'react-router-dom';
import 'react-pro-sidebar/dist/css/styles.css';
import Icon from 'supercons'
import Accordion from 'react-bootstrap/Accordion'
import '../../styles/sidebar.css'
import { FaUsers } from "react-icons/fa";
import { MdAssignment, MdAssignmentInd, MdPerson, MdSettings, MdFolder, MdExpandMore } from "react-icons/md";


const CoordinatorSidebar = () => {

    return (
        <ul className="list-wrapper">
            <li className="list-item">
                <Link to = "dashboard" className="aside-link">
                     <Icon glyph="grid" size={32} /> <span>Dashboard</span>
                </Link>
            </li>
            <li className="list-item">
                <Link to = "/field_posts" className="aside-link">
                     <Icon glyph="docs" size={32} /> <span>Field Posts</span>
                </Link>
            </li>
            <li className="list-item">
                <Link to = "/reported_students" className="aside-link">
                     <FaUsers style={{fontSize: '20px'}}/> <span>Reported Students</span>
                </Link>
            </li>
            <li className="list-item">
                <Link to = "/result_summary" className="aside-link">
                     <MdAssignment style={{fontSize: '20px'}}/> <span>Field Result Summary</span>
                </Link>
            </li>
            <li className="list-item">
                <Link to = "/announcements" className="aside-link">
                     <Icon glyph="pin" size={32} /> <span>My Announcements</span>
                </Link>
            </li>
            {/* <li className="list-item">
                <Link to = "/notifications" className="aside-link">
                     <Icon glyph="pin" size={32} /> <span>Notifications</span>
                </Link>
            </li> */}
            <li className="list-item">
                <Link to = "/alumni_projects" className="aside-link">
                     <MdFolder style={{fontSize: '20px'}}/> <span>Alumni Projects</span>
                </Link>
            </li>
            <li className="list-item">
                <Link to = "/roles" className="aside-link">
                     <MdAssignmentInd style={{fontSize: '20px'}}/> <span>Manage Roles</span>
                </Link>
            </li>
            <li className="list-item">
                <Link to = "/questions" className="aside-link">
                     <Icon glyph="docs-fill" size={32} /> <span> Add Questions</span>
                </Link>
            </li>
            <li className="list-item">
                <Accordion  style={{backgroundColor: 'inherit', border: 'none'}}>
                <div>
                    <Accordion.Toggle as="div" variant="link" eventKey="0">
                        {/* <Icon glyph="" size={32} /> */}
                        <span style={{ cursor: 'pointer' }}>College Summary</span>
                        <MdExpandMore style={{ fontSize: '20px', marginLeft: '10%' }} />
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                            <span>
                                <ul >
                                    <li className="list-item">
                                        <Link to = "/field_arrival_notes" className="aside-link">
                                            <Icon glyph="" size={32} /> <span>Field Arrival Notes</span>
                                        </Link>
                                    </li>
                                    <li className="list-item">
                                        <Link to = "/field_results" className="aside-link">
                                            <Icon glyph="" size={32} /> <span>Field Results</span>
                                        </Link>
                                    </li>
                                    <li className="list-item">
                                        <Link to = "/manage_alumni" className="aside-link">
                                           <Icon glyph="" size={32} /> <span>All Alumni</span>
                                        </Link>
                                    </li>
                                    {/* <li className="inner-list-item">
                                        <Link to = "/my_projects" className="aside-link">
                                            <Icon glyph="" size={32} />  <span>All organizations</span>
                                        </Link>
                                    </li> */}
                                </ul>
                                </span>
                    </Accordion.Collapse>
                </div> </Accordion> 
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

export default CoordinatorSidebar
