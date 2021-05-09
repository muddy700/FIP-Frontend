import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    appData: {
        activePage: 1,
        alumniDocId: ''
    }
}

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
            changePage: (state, action) => {
                state.appData = action.payload
            },
    }
});

export const { changePage } = appSlice.actions
export const selectAppData = (state) => state.app.appData
export default appSlice.reducer