import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {
  GET_UNIT,
  SERVER_URL,
  STORE_Id,
  UPSERT_UNIT,
} from "../../Containts/Values";
import { apiConfig, getToken } from "../../utils/constantFunctions";
import Swal from "sweetalert2";

const initialUnitState = {
  unitData: [],
  totalUnitCount: null,
  loading: false,
  error: null,
};

const unitSlice = createSlice({
  name: "unit",
  initialState: initialUnitState,
  reducers: {
    getLoading(state) {
      state.loading = true;
    },
    getUnits(state, action) {
      state.unitData = action.payload;
      state.loading = false;
    },
    getTotalUnitCount(state, action) {
      state.totalUnitCount = action.payload;
      state.brandLoading = false;
    },
    getLoading(state, action) {
      state.loading = action.payload;
      state.loading = true;
    },
    getError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { getLoading, getUnits, getError } = unitSlice.actions;
export const unitReducer = unitSlice.reducer;

export const getUnitList = (pageNumber, pageSize, searchQuery) => {
  return (dispatch) => {
    dispatch(getLoading());
    let config = apiConfig(
      `${SERVER_URL}${GET_UNIT}?pageNumber=${pageNumber ? pageNumber : 0}&pageSize=${pageSize ? pageSize : 0}&search=${searchQuery}&storeId=${STORE_Id}`,
      // "http://ezygen-technology-bluebill-prod-env.ap-south-1.elasticbeanstalk.com/ezygentechnology/unit/getUnit?pageNumber=2&pageSize=5&storeid=1599301415859525",
      "GET"
    );

    axios(config)
      .then((response) => {
        console.log("response Unit ", response?.data);
        if (response.status === 200) {
          dispatch(getUnits(response?.data));
        }
      })
      .catch((err) => {
        console.log(err);
        dispatch(getError("someting went wrong"));
      });
  };
};

// export const addUnit=(postData, handlePopupClose, unitCreationSuccess, unitDeleteSuccess, apiFailureResponse, setApiError)=>{
//   return(dispatch)=>{
//     let config = apiConfig(`${SERVER_URL}${UPSERT_UNIT}`, "POST",postData);
//     axios(config)
//     .then(({ data }) => {
//       console.log(data);
//       unitCreationSuccess()
//       unitDeleteSuccess()
//       dispatch(getUnitList())
//       handlePopupClose()
//     })
//     .catch((err) => {
//       console.log("err ", err)
//       const errorMsg = err && apiFailureResponse(err?.message);
//       console.log("errorMsg ", errorMsg);
//       setApiError(errorMsg);
//     });
//   }
// }

export const addUnit = (postData, unitCreationSuccess, setPopUpMessage, PopUpMessegeHandler) => {
  return (dispatch) => {
    let config = apiConfig(`${SERVER_URL}${UPSERT_UNIT}`, "POST", postData);

    axios(config)
      .then((response) => {
        console.log("AddDiscountResponse... ", response);
        if (response?.status === 200) {
          dispatch(getUnitList(1, 5, ""));
          setPopUpMessage("Unit added successfully");
          unitCreationSuccess();

        }
      })
      .catch((err) => {
        console.log("err", err?.response);
        if (err?.response.status === 417) {
          PopUpMessegeHandler("This name is already exists")
        }
        PopUpMessegeHandler(err?.response?.data?.message);
      });
  };
};

export const updateUnit = (postData, unitCreationSuccess, setPopUpMessage) => {
  return (dispatch) => {
    let config = apiConfig(`${SERVER_URL}${UPSERT_UNIT}`, "POST", postData);

    axios(config)
      .then((response) => {
        console.log("UpdateTableResponse... ", response);
        if (response?.status === 200) {
          setPopUpMessage("Unit updated successfully");
          unitCreationSuccess();
          dispatch(getUnitList(1, 5, ""));
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
};

export const deleteUnit = (postData, unitCreationSuccess, setPopUpMessage) => {
  return (dispatch) => {
    let config = apiConfig(`${SERVER_URL}${UPSERT_UNIT}`, "POST", postData);

    axios(config)
      .then((response) => {
        console.log("UpdateTableResponse... ", response);
        if (response?.status === 200) {
          setPopUpMessage("Unit deleted successfully");
          unitCreationSuccess();
          dispatch(getUnitList(1, 5, ""));
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
};
