import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link, useRouteMatch } from 'react-router-dom';
import { DashboardPage } from './alumni/dashboardPage';
import AvailablePostsPage from './alumni/availablePosts';
import ResultsPage from './alumni/resultsPage';
import ProfilePage from './alumni/profilePage';
import CvPage from './alumni/cvPage';
import ProjectsPage from './alumni/projectsPage';
import ChatPage from './alumni/chatPage';
import AnnouncementsPage from './alumni/announcementsPage';
import PasswordPage from './alumni/passwordPage';


export const AlumniHomePage = () => {

  return (
    <div>
      <h1>Alumni Home Page</h1>
    </div>
    );
  }

