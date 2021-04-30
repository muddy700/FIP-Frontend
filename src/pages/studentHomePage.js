import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link, useRouteMatch } from 'react-router-dom';
import { DashboardPage } from './student/dashboardPage';
import AvailablePostsPage from './student/availablePosts';
import ProfilePage from './student/profilePage';
import ProjectsPage from './student/projectsPage';
import PasswordPage from './student/passwordPage';


export const StudentHomePage = () => {

    return (
    <div>
      <h1>Student Home Page</h1>
    </div>
       
    );
  }

