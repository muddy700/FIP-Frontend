import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button'
import 'react-pro-sidebar/dist/css/styles.css';
import { useState } from 'react';
import '../styles/contents.css'
import AvailablePosts from '../pages/alumni/availablePosts'
import {DashboardPage} from '../pages/alumni/dashboardPage'
import {PageNotFound} from '../pages/pageNotFound'
import ResultsPage from '../pages/alumni/resultsPage';
import ProfilePage from '../pages/alumni/profilePage';
import CvPage from '../pages/alumni/cvPage';
import ProjectsPage from '../pages/alumni/projectsPage';
import AnnouncementsPage from '../pages/alumni/announcementsPage';
import ChatPage from '../pages/alumni/chatPage';
import PasswordPage from '../pages/alumni/passwordPage';



const Contents = () => {

    return (
      <Router>
      <div className="content">
            <Switch>
            <Route exact path={["/dashboard", "/"]}>
                <DashboardPage />
              </Route>
              <Route exact path="/available_posts">
                <AvailablePosts />
              </Route>
              <Route exact path="/application_results">
                <ResultsPage />
              </Route>
              <Route exact path="/my_profile">
                <ProfilePage />
              </Route>
              <Route exact path="/my_cv">
                <CvPage />
              </Route>
              <Route exact path="/my_projects">
                <ProjectsPage />
              </Route>
              <Route exact path="/chat_page">
                <ChatPage />
              </Route>
              <Route exact path="/announcements">
                <AnnouncementsPage />
              </Route>
              <Route exact path="/password">
                <PasswordPage />
              </Route>
              <Route path="*">
                <PageNotFound />
              </Route>
            </Switch> 
        </div>
    </Router>
    )
}

export default Contents
