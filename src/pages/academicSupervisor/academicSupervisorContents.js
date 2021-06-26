import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button'
import 'react-pro-sidebar/dist/css/styles.css';
import { useState } from 'react';
// import '../../styles/alumni.css'
import {DashboardPage} from './dashboardPage'
import {PageNotFound} from '../pageNotFound'
import ProfilePage from './profilePage';
// import AnnouncementsPage from './announcementsPage';
import PasswordPage from './passwordPage';
import MyStudentsPage from './myStudentsPage';
import ResultSummaryPage from './resultSummaryPage';
// import AlumniProjectsPage from './alumniProjectsPage';
// import FieldPostsPage from './fieldPostsPage';
// import FieldApplications from './fieldApplications';
// import ReportedStudentsPage from './reportedStudentsPage';

const AcademicSupervisorContents = () => {

    return (
      <div className="content">
            <Switch>
            <Route exact path={["/dashboard", "/"]}>
                <DashboardPage />
              </Route>
            <Route exact path={["/my_profile"]}>
                <ProfilePage />
              </Route>
            <Route exact path={["/my_students"]}>
                <MyStudentsPage />
              </Route>
            <Route exact path={["/result_summary"]}>
                <ResultSummaryPage />
              </Route>
            <Route exact path={["/password"]}>
                <PasswordPage />
              </Route>
              <Route path="*">
                <PageNotFound />
              </Route>
          </Switch>
        </div>
    )
}

export default AcademicSupervisorContents
