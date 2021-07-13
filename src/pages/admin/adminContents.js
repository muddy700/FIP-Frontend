import React from 'react'
import { Switch, Route } from 'react-router-dom';
import 'react-pro-sidebar/dist/css/styles.css';
import '../../styles/alumni.css'
import {DashboardPage} from './dashboardPage'
import {PageNotFound} from '../pageNotFound'
import ProfilePage from './profilePage';
import AnnouncementsPage from './announcementsPage';
import PasswordPage from './passwordPage';
import AlumniManagementPage from './alumniManagementPage';
import StudentsManagementsPage from './studentsManagementsPage';
import FieldArrivalNotesPage from './fieldArrivalNotesPage';
import FieldResultsPage from './fieldResultsPage';
import {QuestionsPage} from './questionsPage';
import RolesPage from './rolesPage';

const AdminContents = () => {

    return (
      <div className="content">
            <Switch>
            <Route exact path={["/dashboard", "/"]}>
                <DashboardPage />
              </Route>
            <Route exact path={["/my_profile"]}>
                <ProfilePage />
              </Route>
            <Route exact path={["/announcements"]}>
                <AnnouncementsPage />
              </Route>
            <Route exact path={["/manage_alumni"]}>
                <AlumniManagementPage />
              </Route>
            <Route exact path={["/manage_students"]}>
                <StudentsManagementsPage />
              </Route>
            <Route exact path={["/field_arrival_notes"]}>
                <FieldArrivalNotesPage />
              </Route>
            <Route exact path={["/field_results"]}>
                <FieldResultsPage />
              </Route>
            <Route exact path={["/questions"]}>
                <QuestionsPage />
              </Route>
            <Route exact path={["/roles"]}>
                <RolesPage />
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

export default AdminContents
