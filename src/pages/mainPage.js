import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Switch , Route, useRouteMatch } from 'react-router-dom';
import Header from '../components/header';
import { AlumniHomePage } from './alumniHomePage';
import { StudentHomePage } from './studentHomePage';
import Sidebar from "react-sidebar";
import './../styles/sidebar.css'
import AlumniContents from './alumni/alumniContents';
import AlumniSidebar from './alumni/alumniSidebar';
import { Card, Row, Col, Badge, FormControl,  InputGroup, Button} from 'react-bootstrap'

const mql = window.matchMedia(`(min-width: 800px)`);

export const HomePage = () => {
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
  
  const dataContent =  <AlumniContents />
  const sidebar = <AlumniSidebar />

      const sidebarProps = {
        sidebar,
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
  return (
    <div className="main-page-container" style={{height: '100vh', overflowY: 'hidden'}}>
      <Header changeCollapse={changeCollapse} />
      <Sidebar {...sidebarProps}>
        <div style={{border: 'none', padding: 'none'}}>
          <Card.Body style={{overflowY: 'auto', maxHeight: '90vh', padding: 0, border: 'none'}}>
            {dataContent}
          </Card.Body>
          <div style={{ backgroundColor: '#2F4050', textAlign: 'center', color: 'white', paddingBottom: '7px', paddingTop: '2px' }}>
            <i>CIVE-FIP@2021</i>
          </div>
        </div>
      </Sidebar>
    </div>
    );
  }

