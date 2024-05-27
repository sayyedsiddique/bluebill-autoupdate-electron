import { createSlice } from "@reduxjs/toolkit";
import { apiConfig } from "../../utils/constantFunctions";
import axios from "axios";
import { ADD_TABLE_ORDER_TRANS, GET_TABLE_ORDER_TRANS_LIST, SERVER_URL, UPDATE_TABLE_ORDER_TRANS } from "../../Containts/Values";

const tableOrderSlice = createSlice({
  name: "TableOrder",
  initialState: {
    tableOrderData: [],
    loading: false,
    error: null,
  },
  reducers: {
    startLoading(state) {
      state.loading = true;
    },
    getTableOrderData(state, action){
        state.tableOrderData = action.payload
        state.loading = false
    },
    getTableOrderError(state, action){
        state.error = action.payload
        state.loading = false
    },
    stopLoading(state, action){
        state.loading = false
    }
  },
});

export const {startLoading, getTableOrderData, getTableOrderError, stopLoading} = tableOrderSlice.actions
export const tableOrderReducer = tableOrderSlice.reducer;

export const getTableOrderTransaction = () => {
    return (dispatch) => {
        dispatch(startLoading())

        let config = apiConfig(`${SERVER_URL}${GET_TABLE_ORDER_TRANS_LIST}`, "GET");

        axios(config)
          .then((response) => {
            console.log("TableOrderTransResponse... ", response?.data?.data);
            if (response?.status === 200) {
              dispatch(getTableOrderData(response?.data?.data));
            }
          })
          .catch((err) => {
            console.log("err", err);
            dispatch(getTableOrderError(err))
            dispatch(stopLoading())
          });

    }
}

export const addTableOrderTrans = (payload, tableOrderSuccessRes) => {
    return (dispatch) => {
        dispatch(startLoading())

        let config = apiConfig(`${SERVER_URL}${ADD_TABLE_ORDER_TRANS}`, "POST", payload);
        console.log("payload... ", payload)

        axios(config)
          .then((response) => {
            console.log("AddTableOrderTransResponse... ", response?.data?.data?.tableOrderId);
            if (response?.status === 200) {
              dispatch(getTableOrderData(response?.data));
              tableOrderSuccessRes(response?.data?.data?.tableOrderId)
            }
          })
          .catch((err) => {
            console.log("err", err);
            dispatch(getTableOrderError(err))
            dispatch(stopLoading())
          });
    }
}

export const updateTableOrderTrans = (payload, tableOrderSuccessRes) => {
  return (dispatch) => {
    dispatch(startLoading())

    let config = apiConfig(`${SERVER_URL}${UPDATE_TABLE_ORDER_TRANS}`, "POST", payload);

    axios(config)
      .then((response) => {
        console.log("UpdateTableOrderTransResponse... ", response?.data?.data?.tableOrderId);
        if (response?.status === 200) {
          dispatch(getTableOrderData(response?.data));
          tableOrderSuccessRes()
        }
      })
      .catch((err) => {
        console.log("err", err);
        dispatch(getTableOrderError(err))
        dispatch(stopLoading())
      });
}
}
