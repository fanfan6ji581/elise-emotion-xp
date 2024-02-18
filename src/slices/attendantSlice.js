import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    loginAttendant: JSON.parse(localStorage.getItem('loginAttendant')),
}

const attendantSlice = createSlice({
    name: 'attendant',
    initialState,
    reducers: {
        login(state, action) {
            state.loginAttendant = action.payload;
        },
        logout(state) {
            state.loginAttendant = null;
        },
    },
})

export const {
    login,
    logout,
} = attendantSlice.actions
export const loginAttendant = (state) => state.attendant.loginAttendant;
export default attendantSlice.reducer