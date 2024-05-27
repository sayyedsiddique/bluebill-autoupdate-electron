import { createSlice } from "@reduxjs/toolkit";
import { apiFailureResponse } from "../../utils/constantFunctions";
import axios from "axios";

const initialBulkState = {
  loading: false,
  error: null,
};

export const bulkUploadSlice = createSlice({
  name: "bulkUpload",
  initialState: initialBulkState,
  reducers: {
    getBulkUploadLoading(state, action) {
      state.loading = action.payload;
    },
    getBulkUploadError(state, action) {
      state.error = action;
      state.loading = false;
    },
  },
});

export const { getBulkUploadLoading, getBulkUploadError } =
  bulkUploadSlice.actions;

export const bulkUploadReducer = bulkUploadSlice.reducer;

export const bulkUploadData = (file, user, setApiError, handleSuccess) => {
  return (dispatch) => {
    dispatch(getBulkUploadLoading(true));
    const url =
      "http://ezygen-technology-bluebill-prod-env.ap-south-1.elasticbeanstalk.com/ezygentechnology/pos/upload";
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    const formData = new FormData();
    formData.append("COGNITO_USER_NAME", user.username);
    formData.append("file", file[0]);

    axios
      .post(url, formData, config)
      .then((response) => {
        if (response.status === 200) {
          dispatch(getBulkUploadLoading(false));
          console.log(response);
          handleSuccess();
        }
      })
      .catch((err) => {
        console.log("err ", err);
        dispatch(getBulkUploadLoading(false));
        const errorMsg = err && apiFailureResponse(err?.message);
        console.log("errorMsg ", errorMsg);
        err && setApiError(errorMsg);
      });
  };
};
