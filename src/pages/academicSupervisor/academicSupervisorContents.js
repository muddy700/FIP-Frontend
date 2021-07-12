import React from 'react'
import {Switch, Route } from 'react-router-dom';
import 'react-pro-sidebar/dist/css/styles.css';
import {DashboardPage} from './dashboardPage'
import {PageNotFound} from '../pageNotFound'
import ProfilePage from './profilePage';
// import AnnouncementsPage from './announcementsPage';
import PasswordPage from './passwordPage';
import MyStudentsPage from './myStudentsPage';
import ResultSummaryPage from './resultSummaryPage';
import StudentsLogBooks from './studentsLogBook';

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
            <Route exact path={["/students_logbooks"]}>
                <StudentsLogBooks />
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
