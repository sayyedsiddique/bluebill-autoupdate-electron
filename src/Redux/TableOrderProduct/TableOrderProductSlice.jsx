import { createSlice } from "@reduxjs/toolkit";
import { apiConfig } from "../../utils/constantFunctions";
import axios from "axios";
import { ADD_TABLE_ORDER_TRANS_PRODUCT, GET_TABLE_ORDER_TRANS_PRODUCT_LIST, SERVER_URL, UPDATE_TABLE_ORDER_TRANS_PRODUCT } from "../../Containts/Values";

const tableOrderProductSlice = createSlice({
  name: "TableOrder",
  initialState: {
    tableOrderProductData: [],
    loading: false,
    error: null,
  },
  reducers: {
    startLoading(state) {
      state.loading = true;
    },
    getTableOrderProductData(state, action) {
      state.tableOrderData = action.payload;
      state.loading = false;
    },
    getTableOrderProductError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    stopLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const {
  startLoading,
  getTableOrderProductData,
  getTableOrderProductError,
  stopLoading,
} = tableOrderProductSlice.actions;
export const tableOrderProductReducer = tableOrderProductSlice.reducer;

export const getTableOrderTransProductsList = (tableOrderId, gettingTableOrderProdRes) => {
  return (dispatch) => {
      dispatch(startLoading())

      let config = apiConfig(`${SERVER_URL}${GET_TABLE_ORDER_TRANS_PRODUCT_LIST}?tableOrderId=${tableOrderId}`, "GET");

      axios(config)
        .then((response) => {
          console.log("TableOrderTransProductResponse... ", response);
          if (response?.status === 200) {
            dispatch(getTableOrderProductData(response?.data));
            gettingTableOrderProdRes(response?.data?.data)
          }
        })
        .catch((err) => {
          console.log("err", err);
          dispatch(getTableOrderProductError(err))
          dispatch(stopLoading(false))
        });

  }
}

export const addTableOrderTransProduct = (payload, showTableOrderSucceessPopUp) => {
  return (dispatch) => {
      dispatch(startLoading())

      let config = apiConfig(`${SERVER_URL}${ADD_TABLE_ORDER_TRANS_PRODUCT}`, "POST", payload);

      axios(config)
        .then((response) => {
          console.log("AddTableOrderTransProductsResponse... ", response);
          if (response?.status === 200) {
            showTableOrderSucceessPopUp("Table order placed successfully")
            dispatch(getTableOrderProductData(response?.data));
          }
        })
        .catch((err) => {
          console.log("err", err);
          dispatch(getTableOrderProductError(err))
          dispatch(stopLoading())
        });
  }
}


export const UpdateTableOrderTransProduct = (payload) => {
  return (dispatch) => {
      dispatch(startLoading())

      let config = apiConfig(`${SERVER_URL}${UPDATE_TABLE_ORDER_TRANS_PRODUCT}`, "POST", payload);

      axios(config)
        .then((response) => {
          console.log("UpdateTableOrderTransProductsResponse... ", response);
          if (response?.status === 200) {
            dispatch(getTableOrderProductData(response?.data));
          }
        })
        .catch((err) => {
          console.log("err", err);
          dispatch(getTableOrderProductError(err))
          dispatch(stopLoading())
        });
  }
}