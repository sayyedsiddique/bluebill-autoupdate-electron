import {createSlice} from "@reduxjs/toolkit"

const checkInternetSlice = createSlice({
    name: "checkInternet",
    initialState: {
        isOnline: true,
        error: null,
    },
    reducers: {
        setIsOnlineValue(state, action) {
            state.isOnline = action.payload
        },
    }
})

export const {setIsOnlineValue} = checkInternetSlice.actions
export const checkInternetReducer = checkInternetSlice.reducer

export const setInternetValue = (isOnlineValue) => {
    return (dispatch) => {
        console.log("isOnlineValue ", isOnlineValue)
        dispatch(setIsOnlineValue(isOnlineValue))
    }
}