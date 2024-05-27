import {createSlice} from '@reduxjs/toolkit'
import axios from 'axios'
import { ADDSTORE, SERVER_URL, STOREDETAILS } from '../../Containts/Values'
import { apiConfig, getToken } from '../../utils/constantFunctions'

const storeSettingSlice = createSlice({
    name: 'storeSetting',
    initialState: {
        storeData: [],
        storeDataLoading: false,
        error: null,
    },
    reducers: {
        storeDataLoading(state, action){
            state.storeDataLoading = true
        },
        getStorData(state, action){
            state.storeData = action.payload
            state.storeDataLoading = false
        },
        storeSettingError(state, action){
            state.error = action.payload
            state.storeDataLoading = false
        },
    }
})

export const {getStorData, storeDataLoading, storeSettingError} = storeSettingSlice.actions
export const storeSettingReducer = storeSettingSlice.reducer

export const getstoreData = () => {
    return (dispatch) => {
        dispatch(storeDataLoading())
        const config=apiConfig(`${SERVER_URL}${STOREDETAILS}`,"GET")
        
        axios(config).then((response) => {
            if(response.status === 200){
                console.log("getStoreData response ", response.data)
                dispatch(getStorData(response.data))
            }
        }).catch((error) => {
            console.log("getStoreData error ", error)
            dispatch(storeSettingError())
        })
    }
}

export const addStoreData=(postData,handleSuccess, apiFailureResponse)=>{
    return (dispatch) => {
        const config=apiConfig(`${SERVER_URL}${ADDSTORE}`,"POST",postData)

        axios(config)
        .then((response)=>{
          if(response.status === 200){
            console.log("hello")
            handleSuccess()
          }
        }).catch((error) => {
            console.log("getStoreData error ", error)
            error && apiFailureResponse(error?.message)
            dispatch(storeSettingError())
        })
    }
}