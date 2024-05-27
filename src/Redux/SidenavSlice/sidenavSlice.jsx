import { createSlice } from "@reduxjs/toolkit";

const initialState = {showMenu: false}
const sideNavToggle = createSlice({
    name: 'menuToggle',
    initialState: initialState,
    reducers: {
        toggle(state){
            state.showMenu = !state.showMenu
        }
    }
})

export const sidenavToggle = sideNavToggle.actions
export const sidenavReducer = sideNavToggle.reducer