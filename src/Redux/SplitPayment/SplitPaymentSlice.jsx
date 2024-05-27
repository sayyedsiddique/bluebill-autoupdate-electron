import { createSlice } from "@reduxjs/toolkit";
import { apiConfig } from "../../utils/constantFunctions";
import {
  ADD_SPLIT_PAYMENT,
  GET_SPLIT_PAYMENT_LIST,
  SERVER_URL,
  UPDATE_SPLIT_PAYMENT,
} from "../../Containts/Values";
import axios from "axios";

const splitPaymentSlice = createSlice({
  name: "splitPayment",
  initialState: {
    splitPaymentData: [],
    loading: false,
    error: null,
  },
  reducers: {
    startLoading(state) {
      state.loading = true;
    },
    getSplitPaymentData(state, action) {
      state.splitPaymentData = action.payload;
      state.loading = false;
    },
    getSplitPaymentError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    stopLoading(state, action) {
      state.loading = false;
    },
  },
});

export const {
  startLoading,
  getSplitPaymentData,
  getSplitPaymentError,
  stopLoading,
} = splitPaymentSlice.actions;
export const splitPaymentReducer = splitPaymentSlice.reducer;

export const getSplitPaymentList = () => {
  return (dispatch) => {
    dispatch(startLoading());

    let config = apiConfig(`${SERVER_URL}${GET_SPLIT_PAYMENT_LIST}`, "GET");

    axios(config)
      .then((response) => {
        console.log("GetSplitPaymentResponse... ", response);
        if (response?.status === 200) {
          dispatch(getSplitPaymentData(response?.data?.data));
        }
      })
      .catch((err) => {
        console.log("err", err);
        dispatch(getSplitPaymentError(err));
      });
  };
};

export const addSplitPayment = (payload) => {
  return (dispatch) => {
    dispatch(startLoading());

    let config = apiConfig(`${SERVER_URL}${ADD_SPLIT_PAYMENT}`, "POST", payload);

    axios(config)
      .then((response) => {
        console.log("AddSplitPaymentResponse... ", response);
        if (response?.status === 200) {
          dispatch(getSplitPaymentData(response?.data?.data));
        }
      })
      .catch((err) => {
        console.log("err", err);
        dispatch(getSplitPaymentError(err));
      });
  };
};

export const updateSplitPayment = () => {
  return (dispatch) => {
    dispatch(startLoading());

    let config = apiConfig(`${SERVER_URL}${UPDATE_SPLIT_PAYMENT}`, "GET");

    axios(config)
      .then((response) => {
        console.log("AddSplitPaymentResponse... ", response);
        if (response?.status === 200) {
          dispatch(getSplitPaymentData(response?.data?.data));
        }
      })
      .catch((err) => {
        console.log("err", err);
        dispatch(getSplitPaymentError(err));
      });
  };
}
