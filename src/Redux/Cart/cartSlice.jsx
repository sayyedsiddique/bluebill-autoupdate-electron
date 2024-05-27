import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { ADD_SALES_DETAILS, ADD_TRANSACTION_PAYMENT, ADD_TRANSACTION_PAYMENT_N_SALES_DETAILS, SERVER_URL } from "../../Containts/Values";
import { apiConfig, apiFailureResponse } from "../../utils/constantFunctions";
import { getProuductByCategoryId } from "../Product/productSlice";

const initialCartState = {
  cartData: [],
  loading: false,
  error: null,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState: initialCartState,
  reducers: {
    getCartLoading(state, action) {
      state.loading = true;
    },
    getCartData(state, action) {
      state.cartData = action.payload;
    },
    getCartError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { getCartLoading, getCartData, getCartError } = cartSlice.actions;

export const cartReducer = cartSlice.reducer;

export const addTransaction = (payload, transactionSuccessRes, ) => {
  return (dispatch) => {
    let config = apiConfig(
      `${SERVER_URL}${ADD_TRANSACTION_PAYMENT}`,
      "POST",
      payload
    );

    axios(config)
      .then((response) => {
        if (response.status === 200) {
          transactionSuccessRes(response?.data)
        }
      })
      .catch((err) => {
        console.log("err billing ", err);
      });
  };
};

export const addTransactionNSalesDetails = (payload, transactionSuccessRes, ) => {
  return (dispatch) => {
    let config = apiConfig(
      `${SERVER_URL}${ADD_TRANSACTION_PAYMENT_N_SALES_DETAILS}`,
      "POST",
      payload
    );

    axios(config)
      .then((response) => {
        if (response.status === 200) {
          transactionSuccessRes(response?.data)
          dispatch(getProuductByCategoryId("", true, 0, 0, ""));
        }
      })
      .catch((err) => {
        console.log("err billing ", err);
      });
  };
};

export const addSalesDetails = (payload,TransactionDetails, handleSuccess, setApiError) => {
  return (dispatch) => {
    for (let index = 0; index < payload.length; index++) {
      let config = apiConfig(
        `${SERVER_URL}${ADD_SALES_DETAILS}`,
        "POST",
        payload[index]
      );
  
      axios(config)
        .then((response) => {
          if(response.status === 200) {
            if((payload.length-1)===index){
              handleSuccess(TransactionDetails)
            }
          }
        })
        .catch((err) => {
          console.log("err billing ", err);
          const errorMsg = err && apiFailureResponse(err?.message);
          console.log("errorMsg ", errorMsg);
          setApiError(errorMsg)
        });
    }
  };
};
