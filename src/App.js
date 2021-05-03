import React, {useState} from 'react';
import { LoginPage } from './pages/loginPage'
import { HomePage } from './pages/mainPage';
import { useSelector}  from 'react-redux'
import { selectAppData } from './slices/appSlice'

export const App = () => {
  const appInfo = useSelector(selectAppData)
  const pageNumber = appInfo.activePage;

  const login = <LoginPage />
  const home = <HomePage />

  const components = {
    1: login,
    2: home
  }

    return (
      <div className="app">
        <div className="app-container">
          {components[pageNumber]}
        </div>
      </div>
    );
  }