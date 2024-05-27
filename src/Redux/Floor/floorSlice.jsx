import { createSlice } from "@reduxjs/toolkit";
import { apiConfig, getToken } from "../../utils/constantFunctions";
import { ADD_FLOOR, GET_FLOOR_LIST, GET_SINGLE_FLOOR_DETAILS, SERVER_URL, UPDATE_FLOOR_DETAILS } from "../../Containts/Values";
import axios from "axios";

const floorSlice = createSlice({
  name: "floor",
  initialState: {
    floorData: [],
    loading: false,
    error: null,
  },
  reducers: {
    floorLoading(state) {
      state.loading = true;
    },
    getFloors(state, action) {
      state.floorData = action.payload;
      state.loading = false;
    },
    getError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    stopFloorLoading(state) {
      state.loading = false;
    },
  },
});

export const { floorLoading, getFloors, getError, stopFloorLoading } =
  floorSlice.actions;
export const floorReducer = floorSlice.reducer;

export const getFloorList = () => {
  return (dispatch) => {
    dispatch(floorLoading());

    let config = apiConfig(`${SERVER_URL}${GET_FLOOR_LIST}`, "GET");

    axios(config)
      .then((response) => {
        console.log("FloorResponse... ", response);
        if (response?.status === 200) {
          dispatch(getFloors(response?.data))
        }
      })
      .catch((err) => {
        console.log("err", err);
        dispatch(getError(err))
      });
  };
};

export const addFloor = (floorPayload,floorCreationSuccess, setPopUpMessage) => {
  return (dispatch) => {
    dispatch(floorLoading());
    console.log("floorPayload", floorPayload);

    let config = apiConfig(`${SERVER_URL}${ADD_FLOOR}`, "POST", floorPayload);

    axios(config)
      .then((response) => {
        console.log("AddFloorResponse... ", response.data);
        if (response.status === 200) {
          setPopUpMessage("Floor created successfully")
          floorCreationSuccess()
          dispatch(stopFloorLoading());
          dispatch(getFloorList())
        }
      })
      .catch((err) => {
        console.log("err", err);
        dispatch(getError(err))
      });
  };
};



export const getSingleFloorDetailsById = (floorId) => {
  return (dispatch) => {
    dispatch(floorLoading());

    let config = apiConfig(`${SERVER_URL}${GET_SINGLE_FLOOR_DETAILS}?floorId=${floorId}`, "GET");

    axios(config)
      .then((response) => {
        console.log("DeleteFloorResponse... ", response.data);
        if (response.status === 200) {
          dispatch(stopFloorLoading());
        }
      })
      .catch((err) => {
        console.log("err", err);
        dispatch(getError(err))
      });

  }
}

export const updateFloorDetails = (floorPayload, floorCreationSuccess, setPopUpMessage) => {
  return (dispatch) => {
    dispatch(floorLoading());
    console.log("floorPayload", floorPayload);

    let config = apiConfig(`${SERVER_URL}${UPDATE_FLOOR_DETAILS}`, "POST", floorPayload);

    axios(config)
      .then((response) => {
        console.log("UpdateFloorResponse... ", response.data);
        if (response.status === 200) {
          setPopUpMessage("Floor updated successfully")
          floorCreationSuccess()
          dispatch(stopFloorLoading());
          dispatch(getFloorList())
        }
      })
      .catch((err) => {
        console.log("err", err);
        dispatch(getError(err))
      });
  }
}

export const deleteFloor = (floorPayload,floorCreationSuccess, setPopUpMessage) => {
  return (dispatch) => {
    dispatch(floorLoading());

    let config = apiConfig(`${SERVER_URL}${ADD_FLOOR}`, "POST", floorPayload);

    axios(config)
      .then((response) => {
        console.log("DeleteFloorResponse... ", response.data);
        if (response.status === 200) {
          setPopUpMessage("Floor deleted successfully")
          floorCreationSuccess()
          dispatch(stopFloorLoading());
          dispatch(getFloorList())
        }
      })
      .catch((err) => {
        console.log("err", err);
        dispatch(getError(err))
      });
  };
};



