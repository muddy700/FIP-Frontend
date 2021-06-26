import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button'
import 'react-pro-sidebar/dist/css/styles.css';
import { useState } from 'react';
import '../../styles/alumni.css'
import {DashboardPage} from './dashboardPage'
import {PageNotFound} from '../pageNotFound'
import ProfilePage from './profilePage';
import AnnouncementsPage from './announcementsPage';
import PasswordPage from './passwordPage';
import AlumniProjectsPage from './alumniProjectsPage';
import FieldPostsPage from './fieldPostsPage';
import FieldApplications from './fieldApplications';
import ReportedStudentsPage from './reportedStudentsPage';
import ResultSummaryPage from './resultSummaryPage';

const CoordinatorContents = () => {

    return (
      <div className="content">
            <Switch>
            <Route exact path={["/dashboard", "/"]}>
                <DashboardPage />
              </Route>
            <Route exact path={["/my_profile"]}>
                <ProfilePage />
              </Route>
            <Route exact path={["/alumni_projects"]}>
                <AlumniProjectsPage />
              </Route>
            <Route exact path={["/field_posts"]}>
                <FieldPostsPage />
            </Route>
            <Route exact path={["/reported_students"]}>
                <ReportedStudentsPage />
            </Route>
            <Route exact path={["/result_summary"]}>
                <ResultSummaryPage />
            </Route>
            <Route exact path="/field_post/:id/applicants">
                <FieldApplications />
              </Route>
            <Route exact path={["/announcements"]}>
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
    )
}

export default CoordinatorContents
