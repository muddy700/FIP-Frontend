import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Switch , Route, useRouteMatch } from 'react-router-dom';
import Header from '../components/header';
import Sidebar2 from '../components/sidebar';
import { AlumniHomePage } from './alumniHomePage';
import { StudentHomePage } from './studentHomePage';
import Sidebar from "react-sidebar";
import './../styles/sidebar.css'
import Contents from '../components/contents';

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
  const dataContent =  <Contents />
  const sidebar = <Sidebar2 />

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
    <>
      <Header changeCollapse={changeCollapse} />
      <Sidebar {...sidebarProps}>
        {dataContent}
      </Sidebar>
    </>
    );
  }

