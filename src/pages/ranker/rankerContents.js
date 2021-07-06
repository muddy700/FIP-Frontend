import React from 'react'
import { Switch, Route} from 'react-router-dom';
import 'react-pro-sidebar/dist/css/styles.css';
import '../../styles/alumni.css'
import {DashboardPage} from './dashboardPage'
import {PageNotFound} from '../pageNotFound'
import ProfilePage from './profilePage';
import PasswordPage from './passwordPage';
import OrganizationManagementPage from './organizationManagementPage'

const RankerContents = () => {

    return (
      <div className="content">
            <Switch>
              <Route exact path={["/dashboard", "/"]}>
                  <DashboardPage />
                </Route>
              <Route exact path={["/my_profile"]}>
                  <ProfilePage />
                </Route>
              <Route exact path={["/organization_management"]}>
                  <OrganizationManagementPage />
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

export default RankerContents
