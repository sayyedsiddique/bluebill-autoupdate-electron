import axios from "axios";
import { createSlice } from "@reduxjs/toolkit";
import { apiConfig } from "../../utils/constantFunctions";
import {
  GET_CUSTOMER,
  GET_TOP_BUYERS,
  SERVER_URL,
  STORE_Id,
  UPSERT_CUSTOMER,
} from "../../Containts/Values";

const initialCustomerState = {
  customerData: [],
  topBuyersData: [],
  loading: false,
  error: null,
};

export const customerSlice = createSlice({
  name: "customer",
  initialState: initialCustomerState,
  reducers: {
    getcustomerLoading(state, action) {
      state.loading = true;
    },
    getcustomerData(state, action) {
      state.customerData = action.payload;
      state.loading = false;
    },
    getTopBuyersData(state, action) {
      state.topBuyersData = action.payload;
      state.loading = false;
    },
    getcustomerError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { getcustomerLoading, getcustomerData, getTopBuyersData, getcustomerError } =
  customerSlice.actions;

export const customerReducer = customerSlice.reducer;

export const getCustomerList = (pageNumber, pageSize, searchQuery) => {
  return (dispatch) => {
    dispatch(getcustomerLoading());
    let config = apiConfig(
      `${SERVER_URL}${GET_CUSTOMER}?pageNumber=${pageNumber ? pageNumber : 0}&pageSize=${pageSize ? pageSize : 0}&search=${searchQuery}&storeId=${STORE_Id}`,

      "GET"
    );

    axios(config)
      .then((response) => {
        console.log("response Customer", response);
        if (response.status === 200) {
          dispatch(getcustomerData(response?.data));
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch(getcustomerError("something went wrong"));
      });
  };
};

// export const addCustomer=(postData,handlePopupClose)=>{
//   return(dispatch)=>{
//     let config = apiConfig(`${SERVER_URL}${UPSERT_CUSTOMER}`, "POST",postData);
//     axios(config)
//     .then(({ data }) => {
//       console.log(data);
//       dispatch(getCustomerList())
//       handlePopupClose()
//     })
//     .catch((error) => {
//       console.log(error);
//     });
//   }
// }

export const addCustomer = (
  postData,
  customerCreationSuccess,
  setPopUpMessage
) => {
  return (dispatch) => {
    let config = apiConfig(`${SERVER_URL}${UPSERT_CUSTOMER}`, "POST", postData);

    axios(config)
      .then((response) => {
        console.log("AddDiscountResponse... ", response);
        if (response?.status === 200) {
          setPopUpMessage("Customer added successfully");
          customerCreationSuccess();
          dispatch(getCustomerList(1, 5, ""));
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
};

export const updateCustomer = (
  postData,
  customerCreationSuccess,
  setPopUpMessage
) => {
  return (dispatch) => {
    let config = apiConfig(`${SERVER_URL}${UPSERT_CUSTOMER}`, "POST", postData);

    axios(config)
      .then((response) => {
        console.log("UpdateTableResponse... ", response);
        if (response?.status === 200) {
          setPopUpMessage("Customer updated successfully");
          customerCreationSuccess();
          dispatch(getCustomerList(1, 5, ""));
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
};

export const deleteCustomer = (
  postData,
  customerCreationSuccess,
  setPopUpMessage
) => {
  return (dispatch) => {
    let config = apiConfig(`${SERVER_URL}${UPSERT_CUSTOMER}`, "POST", postData);

    axios(config)
      .then((response) => {
        console.log("UpdateTableResponse... ", response);
        if (response?.status === 200) {
          setPopUpMessage("Customer deleted successfully");
          customerCreationSuccess();
          dispatch(getCustomerList(1, 5, ""));
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
};

export const getTopBuyers = (start, end) => {
  return (dispatch) => {
    let config = apiConfig(
      `${SERVER_URL}${GET_TOP_BUYERS}?endDate=${start}&startDate=${end}`,
      "GET"
    );

    axios(config)
      .then((response) => {
        console.log("GetTopBuyersResponse... ", response);
        if (response?.status === 200) {
          dispatch(getTopBuyersData(response?.data))
          // setPopUpMessage("Customer deleted successfully")
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
};
