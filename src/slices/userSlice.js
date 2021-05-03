import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
    userData: {
        userId: '',
        username: '',
        first_name: '',
        last_name: '',
        designation: '',
        profile_image: '',
        email: '',
        token: localStorage.getItem('token'),
        isAuthenticated: false,
    }
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
            saveUser: (state, action) => {
                state.userData = action.payload
            },
    }
});

export const apiConfigurations = () => {
    return {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${localStorage.getItem('token')}`
        }
    }
}

export const { saveUser } = userSlice.actions
export const selectUserData = (state) => state.user.userData
export default userSlice.reducer