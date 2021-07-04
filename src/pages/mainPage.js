import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router} from 'react-router-dom';
import Header from '../components/header';
import Sidebar from "react-sidebar";
import './../styles/sidebar.css'
import AlumniContents from './alumni/alumniContents';
import AlumniSidebar from './alumni/alumniSidebar';
import { Card} from 'react-bootstrap'
import StudentContents from './student/studentContents';
import StudentSidebar from './student/studentSidebar';
import { useSelector, useDispatch,}  from 'react-redux'
import OrganizationSidebar from './organization/organizationSidebar';
import OrganizationContents from './organization/organizationContents';
import RankerContents from './ranker/rankerContents';
import RankerSidebar from './ranker/rankerSidebar';
import CoordinatorSidebar from './coordinator/coordinatorSidebar';
import CoordinatorContent from './coordinator/coordinatorContents'
import AcademicSupervisorContents from './academicSupervisor/academicSupervisorContents';
import AcademicSupervisorSidebar from './academicSupervisor/academicSupervisorSidebar';
import AdminContents from './admin/adminContents';
import AdminSidebar from './admin/adminSidebar';
import { selectUserData } from '../slices/userSlice'
import { changePage, selectAppData } from '../slices/appSlice'
import db from '../firebase';
import IdleTimer from 'react-idle-timer';
import { IdleTimeOutModal } from '../components/idleModal';

const mql = window.matchMedia(`(min-width: 800px)`);

export const HomePage = () => {
  const user = useSelector(selectUserData)
  const userRole = user.designation;
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarDocked, setsidebarDocked] = useState(true)
  const [collapse, setCollapse] = useState(false)
  
  var idleTimer = null
  const [isTimedOut, setIsTimedOut] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const appData = useSelector(selectAppData)
  const dispatch = useDispatch()
  const usersRef = db.collection('users');

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
    mediaQueryChanged();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
  else if (userRole === 'ranker') {
    activeContents =  <RankerContents />
    activeSidebar = <RankerSidebar />
  }
  else if (userRole === 'coordinator') {
    activeContents =  <CoordinatorContent />
    activeSidebar = <CoordinatorSidebar />
  }
  else if (userRole === 'academic supervisor') {
    activeContents =  <AcademicSupervisorContents />
    activeSidebar = <AcademicSupervisorSidebar />
  }
  else if (userRole === 'admin') {
    activeContents =  <AdminContents />
    activeSidebar = <AdminSidebar />
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
  
  const currentDate = new Date();

  const removeLoggedAlumni = () => {
      usersRef.doc(appData.alumniDocId).delete()
          .then(() => {
          console.log('User Doc Deleted')
      })
          .catch((error) => {
              console.error("Error Deleting Logged Alumni : ", error);
          });
  }

    const handleLogOut = async () => {
        try {
            // const response = await logoutUser(config)
            console.log('logged out')
            dispatch(changePage({
                        activePage: 1
            }))
            
            localStorage.removeItem('token');

            if (user.designation === 'alumni') {
                removeLoggedAlumni()
            }
        } catch (error) {
            console.log({
                'request': 'Logout Request',
                'Error => ': error
            })
            
        }

  }
  
  const handleClose = () => {
        setShowModal(false)
  }
  
   const onAction = (e) => {
        // console.log('User Did Something ', e)
        setIsTimedOut(false)
    }

    const onActive = (e) => {
        // console.log('User Is Active ', e)
        setIsTimedOut(false)
    }

    const onIdle = (e) => {
        // console.log('User Is Idle ', e)
        // if (isTimedOut) {
      handleLogOut()
      console.log(isTimedOut)
        // }
        // else {
        //     setShowModal(true)
        //     idleTimer.reset()
        //     setIsTimedOut(true)
        // }
    }

  return (
    <Router>
      <IdleTimer
        ref={ref => { idleTimer = ref }}
        element={document}
        onActive={onActive}
        onIdle={onIdle}
        onAction={onAction}
        debounce={250}
        timeout={ 1000 * 60 * 3} />
      <div className="main-page-container" style={{height: '100vh', overflowY: 'hidden'}}>
        <Header changeCollapse={changeCollapse} />
        <Sidebar {...sidebarProps}>
          <div style={{border: 'none', padding: 'none'}}>
            <Card.Body style={{overflowY: 'auto', maxHeight: '90vh', padding: 0, border: 'none'}}>
              {activeContents}
            </Card.Body>
            <div style={{ backgroundColor: '#2F4050', textAlign: 'center', color: 'white', paddingBottom: '7px', paddingTop: '2px' }}>
              <i>FIPMS&copy;{currentDate.getFullYear()}</i>
            </div>
          </div>
        </Sidebar>
      </div>
        <IdleTimeOutModal
            showModal={showModal}
            handleClose={handleClose}
            handleLogout={handleLogOut}
        />
    </Router>
    );
  }

