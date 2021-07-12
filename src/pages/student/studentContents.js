import React from 'react'
import { Switch, Route } from 'react-router-dom';
import 'react-pro-sidebar/dist/css/styles.css';
import '../../styles/alumni.css'
import AvailablePosts from './availablePosts'
import {DashboardPage} from './dashboardPage'
import {PageNotFound} from '../pageNotFound'
import ProfilePage from './profilePage';
import ProjectsPage from './projectsPage';
import PasswordPage from './passwordPage';
import { FieldInfoPage } from './fieldInfoPage'
import LogBookPage from './logbookPage';

const StudentContents = () => {

    return (
      <div className="content">
            <Switch>
            <Route exact path={["/dashboard", "/"]}>
                <DashboardPage />
              </Route>
            <Route exact path={["/available_posts"]}>
                <AvailablePosts />
              </Route>
            <Route exact path={["/logbook"]}>
                <LogBookPage />
              </Route>
              <Route exact path={["/field_info"]}>
                <FieldInfoPage />
              </Route>
            <Route exact path={["/my_profile"]}>
                <ProfilePage />
              </Route>
            <Route exact path={["/my_projects"]}>
                <ProjectsPage />
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

export default StudentContents
