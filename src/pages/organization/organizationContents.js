import React, { useState } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button'
import 'react-pro-sidebar/dist/css/styles.css';
import '../../styles/alumni.css'
import {DashboardPage} from './dashboardPage'
import {PageNotFound} from '../pageNotFound'
import PasswordPage from './passwordPage';
import ProfilePage from './profilePage';
import FieldApplications from './fieldApplications';
import FieldChances from './fieldChances';
import FieldReports from './fieldReports';
import InternshipApplications from './internshipApplications';
import InternshipChances from './internshipChances';
import InternshipReports from './internshipReports';
import PostApplicants from './post_applicants';
import ApprovedAlumni from './approvedPage';

const OrganizationContents = () => {

    return (
      <div className="content">
            <Switch>
            <Route exact path={["/dashboard", "/"]}>
                <DashboardPage />
              </Route>
            <Route exact path="/field_applications">
                <FieldApplications />
              </Route>
            <Route exact path="/field_chances">
                <FieldChances />
              </Route>
            <Route exact path="/field_reports">
                <FieldReports />
              </Route>
            <Route exact path="/post_applications">
                <InternshipApplications />
              </Route>
            <Route exact path="/post_applicants">
                <PostApplicants />
              </Route>
            <Route exact path="/internship_chances">
                <InternshipChances />
              </Route>
            <Route exact path="/internship_reports">
                <InternshipReports />
              </Route>
            <Route exact path={["/approved_page"]}>
                <ApprovedAlumni />
            </Route>
            <Route exact path={["/my_profile"]}>
                <ProfilePage />
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

export default OrganizationContents
