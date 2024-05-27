import { createSlice } from "@reduxjs/toolkit";

const initialUnitState = {
    language: localStorage.getItem("defaultLang") ? JSON.parse(localStorage.getItem("defaultLang")) : {},
    loading: false,
    error: null,
  };

export const languageSlice = createSlice({
    name: "language",
    initialState: initialUnitState,
    reducers: {
        getLanguageLoading(state) {
            state.loading = true;
        },
        getLanguageData(state, action) {
            state.language = action.payload;
            state.loading = false;
        },
        getLanguageError(state, action) {
            state.error = action.payload;
            state.loading = false;
        },
    }
})

export const {getLanguageLoading, getLanguageData, getLanguageError} = languageSlice.actions
export const languageReducer = languageSlice.reducer

export const getLanguage = (data) => {
    return(dispatch) => {
        dispatch(getLanguageData(data))
    }
}