import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {
  GET_SHOPKEEPER_ORDER,
  SERVER_URL,
  getUTCDate,
} from "../../Containts/Values";
import { apiConfig } from "../../utils/constantFunctions";
const initialState = {
  onlineOrderData: [],
  onlineOrderProduct: null,
  loading: false,
  error: null,
};

const onlineOrder = createSlice({
  name: "onlineOrder",
  initialState: initialState,
  reducers: {
    getOnlineOrderLoading(state, action) {
      state.loading = true;
    },
    getOnlineOrderProduct(state, action) {
      state.onlineOrderData = action.payload;
      state.loading = false;
    },
    getOnlineOrderError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    getSingleProduct(state, action) {
      state.onlineOrderProduct = action.payload;
      state.loading = false;
    },
    getSingleProductError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  getOnlineOrderProduct,
  getOnlineOrderLoading,
  getOnlineOrderError,
  getSingleProduct,
  getSingleProductError,
} = onlineOrder.actions;
export const onlineOrderReducer = onlineOrder.reducer;

export const getOnlineOrder = (allOrderStatus, pageNumber, pageSize) => {
  return async (dispatch) => {
    dispatch(getOnlineOrderLoading());
    const pendingOrderApiUrl =
      process.env.REACT_APP_SERVER_URL +
      process.env.REACT_APP_ONLINE_ORDER +
      "?status=" +
      allOrderStatus;
    console.log("pendingOrderApiUrl... ", pendingOrderApiUrl);

    let config = apiConfig(
      `${SERVER_URL}${GET_SHOPKEEPER_ORDER}?pageNumber=${
        pageNumber ? pageNumber : 0
      }&pageSize=${pageSize ? pageSize : 0}&status=${allOrderStatus}`,
      "GET"
    );

    try {
      const response = await axios(config);
      console.log("AllOrderResponse ", response);
      if (response.status === 200) {
        dispatch(getOnlineOrderProduct(response.data));
      }
    } catch (error) {
      console.log("error ", error);
      dispatch(getOnlineOrderError());
    }
  };
};

export const getOnlineOrderSingleProduct = (productId) => {
  return async (dispatch) => {
    console.log("productId", productId);
    dispatch(getOnlineOrderLoading());
    let config = apiConfig(
      `${process.env.REACT_APP_SERVER_URL}onlineOrder/getShopkeeperOrderDetails/${productId}`,
      "GET"
    );

    axios(config)
      .then((response) => {
        // console.log("response SingleProduct ", response);
        if (response.status === 200) {
          dispatch(getSingleProduct(response.data));
        }
      })
      .catch((error) => {
        console.log("error ", error);
        dispatch(getSingleProductError("someting went wrong"));
      });
  };
};

export const postOnlineOrderAccept = (
  orderDetails,
  orderStatus,
  orderStatusSuccess
) => {
  return async (dispatch) => {
    dispatch(getOnlineOrderLoading());
    console.log("orderDetails", orderDetails);

    let config = apiConfig(
      `${process.env.REACT_APP_SERVER_URL}onlineOrder/upsertCustomerOrder`,
      "POST",
      orderDetails
    );

    axios(config)
      .then((response) => {
        console.log("Post Order Status Response ", response);
        if (response.status === 200) {
          // dispatch(getSingleProduct(response.data))
          orderStatusSuccess(orderStatus);
          dispatch(getOnlineOrder(orderStatus));
        }
      })
      .catch((error) => {
        console.log("error ", error);
        dispatch(getSingleProductError("someting went wrong"));
      });
  };
};
