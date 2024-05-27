import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {
  SINGLE_TRANSACTION_DETAILS,
  GET_TRANSACTION,
  SERVER_URL,
  STORE_Id,
  GET_TRANSACTION_BY_PERIOD,
  GET_TRANSACTION_AMOUNT_BY_PERIOD,
  GET_TOTAL_TRANSCATION_BY_MONTH,
  GET_TRANSACTION_LIST_BY_DATE,
} from "../../Containts/Values";
import { apiConfig } from "../../utils/constantFunctions";

const initialCartState = {
  transactionData: [],
  singleTransactionData: [],
  transactionAmountByPeriod: null,
  loading: false,
  error: null,
};

export const cartSlice = createSlice({
  name: "transaction",
  initialState: initialCartState,
  reducers: {
    getTransactionLoading(state, action) {
      state.loading = true;
    },
    getTransactionData(state, action) {
      state.transactionData = action.payload;
      state.loading = false;
    },
    getTransactionError(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    singleTransactionData(state, action) {
      state.singleTransactionData = action.payload;
      state.loading = false;
    },
    getTransactionAmountByPeriodData(state, action) {
      state.transactionAmountByPeriod = action.payload;
      state.loading = false;
    },
    getTotalTransactionByMonthData(state, action) {
      state.getTotalTransactionByMonth = action.payload;
      state.loading = false;
    },
    getTransactionListByDayData(state, action) {
      state.getTransactionListByDay = action.payload;
      state.loading = false;
    },
  },
});

export const {
  getTransactionLoading,
  getTransactionData,
  getTransactionError,
  singleTransactionData,
  getTransactionAmountByPeriodData,
  getTotalTransactionByMonthData,
  getTransactionListByDayData,
} = cartSlice.actions;

export const transactionReducer = cartSlice.reducer;

export const getTransactionByMonth = (
  date,
  endDate,
  pageNumber,
  pageSize,
  salesExeId
) => {
  return (dispatch) => {
    console.log("endDate... ", endDate, " = ", " startDate ", date)
    dispatch(getTransactionLoading());
    let config = apiConfig(
      // `${SERVER_URL}${GET_TRANSACTION}?&startDate=${date}&endDate=${endDate}&storeId=${STORE_Id}&paymentId=0&customerName=`,
      `${SERVER_URL}${GET_TRANSACTION}?customerName=${""}&endDate=${endDate}&pageNumber=${
        pageNumber ? pageNumber : 0
      }&pageSize=${
        pageSize ? pageSize : 0
      }&paymentId=${0}&startDate=${date}&salesExecutive=${
        salesExeId ? salesExeId : 0
      }&storeId=${STORE_Id}`,
      "GET"
    );

    axios(config)
      .then((response) => {
        if (response.status === 200) {
          console.log("responseTransction ", response?.data);
          dispatch(getTransactionData(response?.data));
        }
      })
      .catch((err) => {
        console.log("errorTransction ", err);
        dispatch(getTransactionError(err.message));
      });
  };
};

export const getTransactionByDate = (startDate, endDate) => {
  return (dispatch) => {
    dispatch(getTransactionLoading());
    console.log("hello from transaction", startDate, endDate);
    let config = apiConfig(
      // `${SERVER_URL}${GET_TRANSACTION}&startDate=01/03/2022&endDate=14/03/2023&storeId=${STORE_Id}&paymentId=0&customerName=`,
      `${SERVER_URL}${GET_TRANSACTION}&startDate=${startDate}&endDate=${endDate}&storeId=${STORE_Id}&paymentId=0&customerName=`,
      "GET"
    );

    axios(config)
      .then((response) => {
        if (response.status === 200) {
          dispatch(getTransactionData(response?.data));
        }
      })
      .catch((err) => {
        dispatch(getTransactionError(err.message));
        console.log("err billing ", err);
      });
  };
};

export const singleTransaction = (paymentId) => {
  return (dispatch) => {
    let config = apiConfig(
      `${SERVER_URL}${SINGLE_TRANSACTION_DETAILS}paymentId=${paymentId}`,
      "GET"
    );
    axios(config)
      .then((response) => {
        if (response.status === 200) {
          dispatch(singleTransactionData(response?.data));
          console.log("singleTransaction", response?.data);
        }
      })
      .catch((err) => {
        dispatch(getTransactionError(err.message));
        console.log("err billing ", err);
      });
  };
};

export const getTransactionAmountByPeriod = (startDate, endDate, storeId) => {
  return (dispatch) => {
    console.log("getTransactionAmountByPeriod ", startDate, endDate);
    let config = apiConfig(
      // `${SERVER_URL}${GET_TRANSACTION}&startDate=01/03/2022&endDate=14/03/2023&storeId=${STORE_Id}&paymentId=0&customerName=`,
      `${SERVER_URL}${GET_TRANSACTION_AMOUNT_BY_PERIOD}?endDate=${endDate}&startDate=${startDate}&storeId=${storeId}`,
      "GET"
    );

    axios(config)
      .then((response) => {
        console.log("responseGetTransactionAmountByPeriod ", response);
        if (response.status === 200) {
          dispatch(getTransactionAmountByPeriodData(response?.data));
        }
      })
      .catch((err) => {
        dispatch(getTransactionError(err.message));
        console.log("err TransactionAmountByPeriod ", err);
      });
  };
};

export const getTotalTransactionByMonth = (startDate, endDate) => {
  return (dispatch) => {
    dispatch(getTransactionLoading());
    console.log("hello from transaction", startDate, endDate);
    let config = apiConfig(
      `${SERVER_URL}${GET_TOTAL_TRANSCATION_BY_MONTH}&startDate=${startDate}&endDate=${endDate}&storeId=${STORE_Id}`,
      "GET"
    );

    axios(config)
      .then((response) => {
        if (response.status === 200) {
          dispatch(getTotalTransactionByMonthData(response?.data));
        }
      })
      .catch((err) => {
        dispatch(getTransactionError(err.message));
        console.log("err billing ", err);
      });
  };
};

export const getTransactionListByDay = (date, pageNumber, pageSize) => {
  return (dispatch) => {
    dispatch(getTransactionLoading());
    let config = apiConfig(
      `${SERVER_URL}${GET_TRANSACTION_LIST_BY_DATE}&date=${date}&pageNumber=${
        pageNumber ? pageNumber : 0
      }&pageSize=${
        pageSize ? pageSize : 0
      }&customerName=${""}&paymentId=${0}&storeId=${STORE_Id}`,
      "GET"
    );

    axios(config)
      .then((response) => {
        if (response.status === 200) {
          console.log("getTransactionListByDayData ", response?.data);
          dispatch(getTransactionListByDayData(response?.data));
        }
      })
      .catch((err) => {
        console.log("errorTransction ", err);
        dispatch(getTransactionError(err.message));
      });
  };
};
