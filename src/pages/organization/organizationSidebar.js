import React from 'react'
import { Link } from 'react-router-dom';
import 'react-pro-sidebar/dist/css/styles.css';
import Icon from 'supercons'
import Accordion from 'react-bootstrap/Accordion'
import '../../styles/sidebar.css'
import { FaUsers } from "react-icons/fa";
import { MdAssignment, MdPerson, MdSettings, MdExpandMore, MdAssignmentInd } from "react-icons/md";

const OrganizationSidebar = () => {
    return (
        <ul className="list-wrapper">
            <li className="list-item">
                <Link to = "dashboard" className="aside-link">
                     <Icon glyph="grid" size={32} /> <span>Dashboard</span>
                </Link>
            </li>
            <li className="list-item">
                <Link to = "/published_alumni" className="aside-link">
                     <MdAssignmentInd style={{fontSize: '25px'}}/> <span>Published Alumni</span>
                </Link>
            </li>
            <li className="list-item">
                <Accordion  style={{backgroundColor: 'inherit', border: 'none'}}>
                <div>
                    <Accordion.Toggle as="div" variant="link" eventKey="0">
                            <Icon glyph="docs" size={32} /> <span style={{ cursor: 'pointer' }}>Post Chance</span>
                            <MdExpandMore style={{ fontSize: '20px', marginLeft: '5%' }} />
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                            <span>
                                <ul >
                                    <li className="inner-list-item">
                                        <Link to = "/field_chances" className="aside-link">
                                            <Icon glyph="" size={24} /> <span>Field</span>
                                        </Link>
                                    </li>
                                    <li className="inner-list-item">
                                        <Link to = "/internship_chances" className="aside-link">
                                            <Icon glyph="" size={24} /> <span>Internship</span>
                                        </Link>
                                    </li>
                                </ul>
                                </span>
                    </Accordion.Collapse>
                </div> </Accordion> 
            </li>
            <li className="list-item">
                <Accordion  style={{backgroundColor: 'inherit', border: 'none'}}>
                <div>
                    <Accordion.Toggle as="div" variant="link" eventKey="0">
                        <MdAssignment style={{fontSize: '28px'}}/> <span style={{ cursor: 'pointer' }}>Report</span>
                        <MdExpandMore style={{ fontSize: '20px', marginLeft: '30%' }} />
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                            <span>
                                <ul >
                                    <li className="inner-list-item">
                                        <Link to = "/field_reports" className="aside-link">
                                            <Icon glyph="" size={24} /> <span>Field</span>
                                        </Link>
                                    </li>
                                    <li className="inner-list-item">
                                        <Link to = "/internship_reports" className="aside-link">
                                            <Icon glyph="" size={24} /> <span>Internship</span>
                                        </Link>
                                    </li>
                                </ul>
                                </span>
                    </Accordion.Collapse>
                </div> </Accordion> 
            </li>
            <li className="list-item">
                <Link to = "/approved_page" className="aside-link">
                    {/* <UsergroupAddOutlined style={{ fontSize: '20px', paddingRight: '2px' }}/><span>Approved Alumni</span> */}
                     <FaUsers style={{fontSize: '20px'}}/> <span>Approved Alumni</span>
                </Link>
            </li>
            <li className="list-item">
                <Link to = "/my_profile" className="aside-link">
                     <MdPerson style={{fontSize: '20px'}}/> <span>Profile</span>
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

export default OrganizationSidebar
