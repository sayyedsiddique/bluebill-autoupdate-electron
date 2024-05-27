import { createSlice } from "@reduxjs/toolkit";
import { apiConfig } from "../../utils/constantFunctions";
import {
  ADD_TABLE,
  DELETE_TABLE_BY_ID,
  GET_FLOOR_MAPPED_TABLE_LIST,
  GET_FLOOR_PLAN_TABLE_LIST_BY_FLOOR_ID,
  GET_SINGLE_TABLE_DETAILS,
  GET_TABLE_LIST,
  SERVER_URL,
  UPDATE_TABLE_DETAILS,
} from "../../Containts/Values";
import axios from "axios";

const tableSlice = createSlice({
  name: "table",
  initialState: {
    tableData: [],
    floorMappedTableList: [],
    floorPlanList: [],
    loading: false,
    error: null,
  },
  reducers: {
    startTableLoading(state) {
      state.loading = true;
    },
    getTables(state, action) {
      state.tableData = action.payload;
      state.loading = false;
    },
    getFloorMappedTableListData(state, action){
      state.floorMappedTableList = action.payload
      state.loading = false;
    },
    getFloorPlanListData(state, action){
      state.floorPlanList = action.payload
      state.loading = false;
    },
    getTableError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    stopTableLoading(state) {
      state.loading = false;
    },
  },
});

export const { startTableLoading, getTables, getFloorMappedTableListData, getFloorPlanListData, getTableError, stopTableLoading } =
  tableSlice.actions;
export const tableReducer = tableSlice.reducer;

export const getTableList = () => {
  return (dispatch) => {
    dispatch(startTableLoading());

    let config = apiConfig(`${SERVER_URL}${GET_TABLE_LIST}`, "GET");

    axios(config)
      .then((response) => {
        console.log("TableResponse... ", response);
        if (response?.status === 200) {
          dispatch(getTables(response?.data));
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
};

export const addTable = (tablePayload, tableCreationSuccess, setPopUpMessage) => {
  return (dispatch) => {
    dispatch(startTableLoading());

    let config = apiConfig(`${SERVER_URL}${ADD_TABLE}`, "POST", tablePayload);

    axios(config)
      .then((response) => {
        console.log("AddTableResponse... ", response);
        if (response?.status === 200) {
          setPopUpMessage("Table created successfully")
          tableCreationSuccess()
          dispatch(stopTableLoading());
          dispatch(getTableList())
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
};

export const getSingleTableDetails = (tableId) => {
  return (dispatch) => {
    dispatch(startTableLoading());

    let config = apiConfig(
      `${SERVER_URL}${GET_SINGLE_TABLE_DETAILS}?tableId=${tableId}`,
      "GET"
    );

    axios(config)
      .then((response) => {
        console.log("AddTableResponse... ", response);
        if (response?.status === 200) {
          dispatch(stopTableLoading());
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
};

export const updateTable = (tablePayload, tableCreationSuccess, setPopUpMessage) => {
  return (dispatch) => {
    dispatch(startTableLoading());

    let config = apiConfig(`${SERVER_URL}${UPDATE_TABLE_DETAILS}`, "POST", tablePayload);

    axios(config)
      .then((response) => {
        console.log("UpdateTableResponse... ", response);
        if (response?.status === 200) {
          setPopUpMessage("Table updated successfully")
          tableCreationSuccess()
          dispatch(stopTableLoading());
          dispatch(getTableList())
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
};


export const deleteTableById = (tableId, tableCreationSuccess, setPopUpMessage) => {
  return (dispatch) => {
    dispatch(startTableLoading());

    let config = apiConfig(
      `${SERVER_URL}${DELETE_TABLE_BY_ID}?tableId=${tableId}`,
      "DELETE"
    );

    axios(config)
      .then((response) => {
        console.log("AddTableResponse... ", response);
        if (response?.status === 200) {
          setPopUpMessage("Table deleted successfully")
          tableCreationSuccess()
          dispatch(stopTableLoading());
          dispatch(getTableList())
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
};

export const getFloorMappedTableList = (floorId) => {
  return (dispatch) => {
    dispatch(startTableLoading());

    let config = apiConfig(
      `${SERVER_URL}${GET_FLOOR_MAPPED_TABLE_LIST}?floorId=${floorId}`,
      "GET"
    );

    axios(config)
      .then((response) => {
        console.log("getFloorMappedTableListResponse... ", response);
        if (response?.status === 200) {
          dispatch(getFloorMappedTableListData(response?.data))
          dispatch(stopTableLoading());
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
};


