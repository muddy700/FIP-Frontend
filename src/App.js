import React, {useState, useEffect} from 'react';
import { LoginPage } from './pages/loginPage'
import { HomePage } from './pages/mainPage';
import { useSelector, useDispatch}  from 'react-redux'
import Loader from './components/loader';
import { saveUser, apiConfigurations } from './slices/userSlice'
import { changePage, selectAppData } from './slices/appSlice'
import { getUserProfile } from './app/api'

export const App = () => {
  const appInfo = useSelector(selectAppData)
  const dispatch = useDispatch();
  const pageNumber = appInfo.activePage;
  const config = useSelector(apiConfigurations)
  const [isFetching, setIsFetching] = useState(false)

  const login = <LoginPage />
  const home = <HomePage />

  const components = {
    1: login,
    2: home
  }

  const checkUserState = async () => {
    setIsFetching(true)

    try {
        const userProfile = await getUserProfile(config)
        dispatch(saveUser({
            userId: userProfile[0].user,
            username: userProfile[0].username,
            first_name: userProfile[0].first_name,
            last_name: userProfile[0].last_name,
            designation: userProfile[0].designation_name,
            designation_id: userProfile[0].designation,
            profile_image: userProfile[0].profile_image,
            email: userProfile[0].email,
            phone: userProfile[0].phone,
            gender: userProfile[0].gender,
            token: localStorage.getItem('token'),
            isAuthenticated: true,
        }))

        dispatch(changePage({
            activePage: 2
        }))
        setIsFetching(false)
        
    } catch (error) {
        setIsFetching(false)
        console.log({
            'Request': 'Refreshing User Data Request',
            'Error => ' : error,
        })
        
        if (error.response.request.status === 401) {
          console.log('Invalid Token')
        }
      
        dispatch(changePage({
            activePage: 1
        }))
    }

  }

  useEffect(() => {
   checkUserState()
  }, [])

    return (
      <div className="app">
        <div className="app-container">
          {isFetching ?
            <Loader message="Loading... " /> :
            components[pageNumber]}
        </div>
      </div>
    );
  }