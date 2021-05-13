import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Switch , Route, useRouteMatch } from 'react-router-dom';
import Header from '../components/header';
import Sidebar from "react-sidebar";
import './../styles/sidebar.css'
import AlumniContents from './alumni/alumniContents';
import AlumniSidebar from './alumni/alumniSidebar';
import { Card, Row, Col, Badge, FormControl,  InputGroup, Button} from 'react-bootstrap'
import StudentContents from './student/studentContents';
import StudentSidebar from './student/studentSidebar';
import { useSelector}  from 'react-redux'
import { selectUserData } from '../slices/userSlice'
import OrganizationSidebar from './organization/organizationSidebar';
import OrganizationContents from './organization/organizationContents';

const mql = window.matchMedia(`(min-width: 800px)`);

export const HomePage = () => {
    // let { path, url } = useRouteMatch();
  const user = useSelector(selectUserData)
  
  const userRole = user.designation;

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarDocked, setsidebarDocked] = useState(true)
  const [collapse, setCollapse] = useState(false)

  const onSetSidebarOpen = (open) => {
    setSidebarOpen(open)
  }
  const mediaQueryChanged = () => {
    setsidebarDocked(mql.matches)
    setSidebarOpen(false)
  }
  const changeCollapse = () => {
    setCollapse(!collapse)
    setSidebarOpen(!sidebarOpen)
}
  useEffect(() => {
    mediaQueryChanged()
  }, [mql])
  
  var activeContents;
  var activeSidebar;

  if (userRole === 'alumni') {
     activeContents =  <AlumniContents />
    activeSidebar = <AlumniSidebar />
    
  }
  else if (userRole === 'student') {
    activeContents =  <StudentContents />
    activeSidebar = <StudentSidebar />
  }
  else if (userRole === 'organization') {
    activeContents =  <OrganizationContents />
    activeSidebar = <OrganizationSidebar />
  }

      const sidebarProps = {
        sidebar: activeSidebar,
        docked: sidebarDocked,
      collapsed: collapse,
      sidebarClassName: "sidebar-card",
      // contentId: "custom-sidebar-content-id",
      open: sidebarOpen,
      // touch: this.state.touch,
      // shadow: this.state.shadow,
      // pullRight: this.state.pullRight,
      // touchHandleWidth: this.state.touchHandleWidth,
      // dragToggleDistance: this.state.dragToggleDistance,
      // transitions: this.state.transitions,
        onSetOpen: onSetSidebarOpen,
      rootClassName: "root-card"
    };
  return (<Router>
    <div className="main-page-container" style={{height: '100vh', overflowY: 'hidden'}}>
      <Header changeCollapse={changeCollapse} />
      <Sidebar {...sidebarProps}>
        <div style={{border: 'none', padding: 'none'}}>
          <Card.Body style={{overflowY: 'auto', maxHeight: '90vh', padding: 0, border: 'none'}}>
            {activeContents}
          </Card.Body>
          <div style={{ backgroundColor: '#2F4050', textAlign: 'center', color: 'white', paddingBottom: '7px', paddingTop: '2px' }}>
            <i>CIVE-FIP@2021</i>
          </div>
        </div>
      </Sidebar>
    </div> </Router>
    );
  }

