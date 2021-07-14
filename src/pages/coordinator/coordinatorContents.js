import React from 'react'
import { Switch, Route } from 'react-router-dom';
import 'react-pro-sidebar/dist/css/styles.css';
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
import NotificationsPage from './notificationsPage';
import NotificationViewersPage from './notificationViewersPage';

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
            <Route exact path={["/notifications"]}>
                <NotificationsPage />
              </Route>
            <Route exact path={["/notification/:id/viewers"]}>
                <NotificationViewersPage />
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
