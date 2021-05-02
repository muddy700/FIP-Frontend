import React, {useState} from 'react';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import { LoginPage } from './pages/loginPage'
import { HomePage } from './pages/mainPage';
import { PageNotFound } from './pages/pageNotFound';

export const App = () => {
  const [activePage, setActivePage] = useState(2)

  const login = <LoginPage />
  const home = <HomePage />

  const components = {
    1: login,
    2: home
  }

    return (
      <div className="app">
        <div className="app-container">
          {components[activePage]}
        </div>
      </div>
    );
  }