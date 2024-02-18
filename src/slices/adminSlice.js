import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    loginAdmin: localStorage.getItem('loginAdmin'),
}

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        login(state, action) {
            state.loginAdmin = action.payload;
        },
        logout(state) {
            state.loginAdmin = null;
        },
    },
})

export const {
    login,
    logout,
} = adminSlice.actions
export const loginAdmin = (state) => state.admin.loginAdmin;
export default adminSlice.reducer