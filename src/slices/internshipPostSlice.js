import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    InternshipPostList: []
}

const postSlice = createSlice({
    name: 'internship_posts',
    initialState,
    reducers: {
            savePost: (state, action) => {
                state.InternshipPostList.push(action.payload)
            },
            postUpdated: (state, action) => {
                state.InternshipPostList.map((post) => post.id === action.payload.id ?
                    action.payload : post)
            },
            fetchInternshipPosts: (state, action) => {
                state.InternshipPostList = action.payload
            },
            deletePost: (state, action) => {
                state.InternshipPostList = state.InternshipPostList.filter((post) => post.id !== action.payload)
            },
        }
    });
    
  
export const fetchUserPosts = (state, uid) => {
    return state.posts.InternshipPostList.filter((post) => post.author === uid) }
  
export const getPostById = (state, pid) => {
    return state.internship_posts.InternshipPostList.find((post) => post.id === pid) }
        
export const { savePost, fetchInternshipPosts, postUpdated, deletePost } = postSlice.actions
export const selectInternshipPostList = state => state.internship_posts.InternshipPostList
// export const selectUserPosts = state => state.posts.InternshipPostList
export default postSlice.reducer