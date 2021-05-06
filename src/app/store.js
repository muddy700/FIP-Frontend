import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../slices/userSlice'
import appReducer from '../slices/appSlice'
import internship_postsReducer from '../slices/internshipPostSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    app: appReducer,
    internship_posts: internship_postsReducer,
  },
});
