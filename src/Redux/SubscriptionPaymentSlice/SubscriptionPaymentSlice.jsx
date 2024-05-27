import { createSlice } from "@reduxjs/toolkit";
import { apiConfig } from "../../utils/constantFunctions";
import { ADD_PAYMENT, CREATE_ORDER, GET_PAYMENT, SERVER_URL } from "../../Containts/Values";
import axios from "axios";

const subscriptionPaymentSlice = createSlice({
  name: "table",
  initialState: {
    paymentOrderData: [],
    paymentDetails: null,
    loading: false,
    error: null,
  },
  reducers: {
    startLoading(state) {
      state.loading = true;
    },
    addPaymentLoading(state){
      state.loading = true;
    },
    getPaymentOrderDetails(state, action) {
      state.loading = false;
      state.paymentOrderData = action.payload;
    },
    getPaymentDetailsData(state, action) {
      state.loading = false;
      state.paymentDetails = action.payload;
    },
    stopLoading(state) {
      state.loading = false;
    },
  },
});

export const {
  startLoading,
  addPaymentLoading,
  getPaymentOrderDetails,
  getPaymentDetailsData,
  stopLoading,
} = subscriptionPaymentSlice.actions;
export const subscriptionPaymentReducer = subscriptionPaymentSlice.reducer;

export const createPaymentOrder = (payload) => {
    return (dispatch) => {
      dispatch(startLoading())
        let config = apiConfig(`${SERVER_URL}${CREATE_ORDER}`, "POST", payload);

        axios(config)
        .then((response) => {
          console.log("PaymentOrderResponse... ", response);
          if (response?.status === 200) {
            dispatch(getPaymentOrderDetails())
          }
        })
        .catch((err) => {
          dispatch(stopLoading())
          console.log("err", err);
        });
    }
}

export const addPaymentDetails = (payload, razorpaySuccessResHandler) => {
  return (dispatch) => {
    dispatch(addPaymentLoading())
      let config = apiConfig(`${SERVER_URL}${ADD_PAYMENT}`, "POST", payload);

      axios(config)
      .then((response) => {
        console.log("PaymentPaymentResponse... ", response);
        if (response?.status === 200) {
          razorpaySuccessResHandler(payload?.planName)
          dispatch(getPaymentDetailsData())
        }
      })
      .catch((err) => {
        dispatch(stopLoading())
        console.log("err", err);
      });
  }
}

export const getPaymentDetails = (userId) => {
  return (dispatch) => {
    dispatch(getPaymentOrderDetails())
      let config = apiConfig(`${SERVER_URL}${GET_PAYMENT}?userId=${userId}`, "GET");

      axios(config)
      .then((response) => {
        console.log("GetPaymentResponse... ", response);
        if (response?.status === 200) {
          // razorpaySuccessResHandler()
          dispatch(getPaymentDetailsData())
        }
      })
      .catch((err) => {
        dispatch(stopLoading())
        console.log("err", err);
      });
  }
}

