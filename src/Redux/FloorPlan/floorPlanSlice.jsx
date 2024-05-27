import {createSlice} from "@reduxjs/toolkit"
import { apiConfig } from "../../utils/constantFunctions"
import { ADD_FLOOR_PLAN, DELETE_FLOOR_PLAN, GET_FLOOR_PLAN_LIST, GET_FLOOR_PLAN_TABLE_LIST_BY_FLOOR_ID, SERVER_URL, UPDATE_FLOOR_PLAN } from "../../Containts/Values"
import axios from "axios"

const floorPlanSlice = createSlice({
    name: "floorPlan",
    initialState: {
        floorPlanData: [],
        loading: false,
        error: null
    },
    reducers: {
        startLoading(state){
            state.loading = true
        },
        getFloorPlanData(state, action){
            state.floorPlanData = action.payload
            state.loading = false
        },
        getFloorPlanError(state, action){
            state.error = action.payload
            state.loading = false
        },
        stopLoading(state){
            state.loading = false
        }
    }
})

export const {startLoading, getFloorPlanData, getFloorPlanError, stopLoading} = floorPlanSlice.actions
export const floorPlanReducer = floorPlanSlice.reducer

export const getFloorPlanListByFloorId = (floorId) => {
  return (dispatch) => {
    dispatch(startLoading());

    let config = apiConfig(
      `${SERVER_URL}${GET_FLOOR_PLAN_TABLE_LIST_BY_FLOOR_ID}?floorId=${floorId}`,
      "GET"
    );

    axios(config)
      .then((response) => {
        console.log("getFloorPlanListByFloorIdResponse... ", response);
        if (response?.status === 200) {
          dispatch(getFloorPlanData(response?.data))
          dispatch(stopLoading());
        }
      })
      .catch((err) => {
        console.log("err", err);
        dispatch(getFloorPlanError(err))
      });
  };
};

export const getFloorPlanList = () => {
    return (dispatch) => {

        dispatch(startLoading());

        let config = apiConfig(`${SERVER_URL}${GET_FLOOR_PLAN_LIST}`, "GET");
    
        axios(config)
          .then((response) => {
            console.log("FloorPlanResponse... ", response);
            if (response?.status === 200) {
              dispatch(getFloorPlanData(response?.data))
            }
          })
          .catch((err) => {
            console.log("err", err);
            dispatch(getFloorPlanError(err))
          });

    }
}

export const addFloorPlan = (floorPlanPayload) => {
    return (dispatch) => {
        dispatch(startLoading());
        console.log("floorPlanPayload", floorPlanPayload);
    
        let config = apiConfig(`${SERVER_URL}${ADD_FLOOR_PLAN}`, "POST", floorPlanPayload);
    
        axios(config)
          .then((response) => {
            console.log("AddFloorResponse... ", response.data);
            if (response.status === 200) {
            //   setPopUpMessage("Floor created successfully")
            //   floorCreationSuccess()
              dispatch(stopLoading());
              dispatch(getFloorPlanListByFloorId(floorPlanPayload?.floorId))
            }
          })
          .catch((err) => {
            console.log("err", err);
            dispatch(getFloorPlanError(err))
          });
    }
}

export const updateFloorPlanByTableId = (floorPlanPayload) => {
    return (dispatch) => {
        dispatch(startLoading());
        console.log("floorPlanPayload", floorPlanPayload);
    
        let config = apiConfig(`${SERVER_URL}${UPDATE_FLOOR_PLAN}`, "POST", floorPlanPayload);
    
        axios(config)
          .then((response) => {
            console.log("UpdateFloorResponse... ", response.data);
            if (response.status === 200) {
            //   setPopUpMessage("Floor created successfully")
            //   floorCreationSuccess()
              dispatch(stopLoading());
              dispatch(getFloorPlanListByFloorId(floorPlanPayload?.floorId))
            }
          })
          .catch((err) => {
            console.log("err", err);
            dispatch(getFloorPlanError(err))
          });
    }
}

export const deleteFloorPlanTableById = (floorPlanId) => {
    return (dispatch) => {
        dispatch(startLoading());
        console.log("floorPlanId", floorPlanId);
    
        let config = apiConfig(`${SERVER_URL}${DELETE_FLOOR_PLAN}?floorPlanId=${floorPlanId}`, "DELETE");
    
        axios(config)
          .then((response) => {
            console.log("UpdateFloorResponse... ", response.data);
            if (response.status === 200) {
            //   setPopUpMessage("Floor created successfully")
            //   floorCreationSuccess()
              dispatch(stopLoading());
              dispatch(getFloorPlanListByFloorId(floorPlanId))
            }
          })
          .catch((err) => {
            console.log("err", err);
            dispatch(getFloorPlanError(err))
          });
    }
}
