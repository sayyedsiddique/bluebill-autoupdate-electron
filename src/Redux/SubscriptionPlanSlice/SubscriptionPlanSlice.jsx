import { createSlice } from "@reduxjs/toolkit";
import { apiConfig } from "../../utils/constantFunctions";
import {
  GET_SUBSCRIPTION_PLANS,
  SERVER_URL,
  UPDATE_SUBSCRIPTION_DETAILS,
} from "../../Containts/Values";
import axios from "axios";

const subscriptionPlanSlice = createSlice({
  name: "subscriptionPlan",
  initialState: {
    subscriptionPlanDetails: [],
    loading: false,
    error: null,
  },
  reducers: {
    startLoading(state, action) {
      state.loading = true;
    },
    getSubscriptionPlanDetailsData(state, action) {
      state.loading = false;
      state.subscriptionPlanDetails = action.payload;
    },
    stopLoading(state, action) {
      state.loading = false;
    },
  },
});

export const { startLoading, getSubscriptionPlanDetailsData, stopLoading } =
  subscriptionPlanSlice.actions;
export const subscriptionPlanReducer = subscriptionPlanSlice.reducer;

export const getSubscriptionPlanDetailsList = () => {
  return (dispatch) => {
    dispatch(startLoading());
    let config = apiConfig(`${SERVER_URL}${GET_SUBSCRIPTION_PLANS}`, "GET");

    axios(config)
      .then((response) => {
        console.log(
          "SubscriptionPlanDetailsResponse... ",
          response?.data?.data
        );
        if (response?.status === 200) {
          dispatch(getSubscriptionPlanDetailsData(response?.data?.data));
        }
      })
      .catch((err) => {
        dispatch(stopLoading());
        console.log("err", err);
      });
  };
};

export const updateSubscriptionPlanDetails = (payloadValue, setProcessingModalOpen) => {
  return (dispatch) => {
    dispatch(startLoading());

    let payload = {
      afterDiscountPrice: 0,
      afterDiscountPriceMonthly: 0,
      beforeDiscountPrice: 0,
      beforeDiscountPriceMonthly: 0,
      disabled: payloadValue?.disabled,
      planId: payloadValue?.planId,
      planName: "",
    };
    let config = apiConfig(
      `${SERVER_URL}${UPDATE_SUBSCRIPTION_DETAILS}`,
      "POST",
      payload
    );

    axios(config)
      .then((response) => {
        console.log(
          "UpdateSubscriptionPlanDetailsResponse... ",
          response?.data?.data
        );
        if (response?.status === 200) {
          // dispatch(getSubscriptionPlanDetailsData(response?.data?.data))
          setProcessingModalOpen && setProcessingModalOpen(false)
        }
      })
      .catch((err) => {
        dispatch(stopLoading());
        console.log("err", err);
      });
  };
};
