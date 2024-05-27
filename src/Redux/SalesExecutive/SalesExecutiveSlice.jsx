import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {
  DELETE_SALESEXECUTIVE,
  GET_SALESEXECUTIVE,
  SERVER_URL,
  UPSERT_SALESEXECUTIVE,

} from "../../Containts/Values";
import { apiConfig } from "../../utils/constantFunctions";

const initialUnitState = {
  SalesExecutiveData: [],
  loading: false,
  error: null,
};

export const SalesExecutiveSlice = createSlice({
  name: "salesExecutive",
  initialState: initialUnitState,
  reducers: {
    getSalesExecutiveLoading(state, action) {
      state.loading = true;
    },
    getSalesExecutive(state, action) {
      state.SalesExecutiveData = action.payload;
      state.loading = false;
    },
    getSalesExecutiveError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },

  },
});

export const {
  getSalesExecutiveLoading,
  getSalesExecutive,
  getSalesExecutiveError,
} = SalesExecutiveSlice.actions;
export const salesExecutiveReducer = SalesExecutiveSlice.reducer;


export const getSalesExecutiveList = () => {
  return (dispatch) => {
    dispatch(getSalesExecutiveLoading());

    let config = apiConfig(`${SERVER_URL}${GET_SALESEXECUTIVE}`, "GET");

    axios(config)
      .then((responese) => {
        // console.log("responese Tax ", responese);
        if (responese.status === 200) {
          dispatch(getSalesExecutive(responese?.data));
        }
      })
      .catch((err) => {
        console.log(err);
        dispatch(getSalesExecutiveError("someting went wrong"));
      });
  };
};

// export const AddSalesExecutive=(postData,handlePopupClose)=>{
//   return(dispatch)=>{
//     let config = apiConfig(`${SERVER_URL}${UPSERT_SALESEXECUTIVE}`, "POST",postData);
//     axios(config)
//     .then(({ data }) => {
//       console.log(data);
//       dispatch(getSalesExecutiveList())
//       handlePopupClose()
//     });
//   }
// }




export const addSalesExecutive = (postData, salesExecutiveCreationSuccess, setPopUpMessage,) => {
  return (dispatch) => {


    let config = apiConfig(`${SERVER_URL}${UPSERT_SALESEXECUTIVE}`, "POST", postData);

    axios(config)
      .then((response) => {
        console.log("AddDiscountResponse... ", response);
        if (response?.status === 200) {
          setPopUpMessage("SalesExecutive added successfully")
          salesExecutiveCreationSuccess()
          dispatch(getSalesExecutiveList())
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
};



export const updateSalesExecutive = (postData, salesExecutiveCreationSuccess, setPopUpMessage,) => {
  return (dispatch) => {


    let config = apiConfig(`${SERVER_URL}${UPSERT_SALESEXECUTIVE}`, "POST", postData);

    axios(config)
      .then((response) => {
        console.log("AddDiscountResponse... ", response);
        if (response?.status === 200) {
          setPopUpMessage("SalesExecutive updated successfully")
          salesExecutiveCreationSuccess()
          dispatch(getSalesExecutiveList())
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
};



export const deleteSalesExecutive = (postData, salesExecutiveCreationSuccess, setPopUpMessage,) => {
  return (dispatch) => {


    let config = apiConfig(`${SERVER_URL}${DELETE_SALESEXECUTIVE}`, "POST", postData);

    axios(config)
      .then((response) => {
        console.log("Delete_Sales_Executive_Res... ", response);
        if (response?.status === 200) {
          setPopUpMessage("SalesExecutive deleted successfully")
          salesExecutiveCreationSuccess()
          dispatch(getSalesExecutiveList())
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
};
