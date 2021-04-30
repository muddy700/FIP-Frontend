import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button'
import 'react-pro-sidebar/dist/css/styles.css';
import { useState } from 'react';
import '../../styles/alumni.css'
import AvailablePosts from './availablePosts'
import {DashboardPage} from './dashboardPage'
import {PageNotFound} from '../pageNotFound'
import ResultsPage from './resultsPage';
import ProfilePage from './profilePage';
import CvPage from './cvPage';
import ProjectsPage from './projectsPage';
import AnnouncementsPage from './announcementsPage';
import ChatPage from './chatPage';
import PasswordPage from './passwordPage';



const AlumniContents = () => {

    return (
      <Router>
      <div className="content">
            <Switch>
            <Route exact path={["/dashboard"]}>
                <DashboardPage />
              </Route>
            <Route exact path={["/available_posts"]}>
                <AvailablePosts />
              </Route>
              <Route exact path={["/application_results"]}>
                <ResultsPage />
              </Route>
            <Route exact path={["/my_profile"]}>
                <ProfilePage />
              </Route>
            <Route exact path={["/my_cv"]}>
                <CvPage />
              </Route>
            <Route exact path={["/my_projects"]}>
                <ProjectsPage />
              </Route>
            <Route exact path={["/chat_page"]}>
                <ChatPage />
              </Route>
            <Route exact path={["/announcements", "/"]}>
                <AnnouncementsPage />
              </Route>
            <Route exact path={["/password"]}>
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

export default AlumniContents
