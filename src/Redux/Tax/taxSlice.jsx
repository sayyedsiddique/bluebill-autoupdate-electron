import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {
  ADDTAXES_MAPPING,
  GET_TAX,
  GET_TAX_MAPPED_PRODUCTS_BY_CATEGORY_ID,
  GET_TAX_MAPPING,
  SERVER_URL,
  STORE_Id,
  UPSERT_TAX,
} from "../../Containts/Values";
import { apiConfig, getToken } from "../../utils/constantFunctions";

const initialUnitState = {
  loading: false,
  taxData: [],
  totalTaxCount: null,
  error: null,
  mappedTaxListLoading: false,
  mappedTaxList: [],
  productList: [],
};

export const taxSlice = createSlice({
  name: "tax",
  initialState: initialUnitState,
  reducers: {
    getTaxLoading(state, action) {
      state.loading = true;
    },
    getTaxs(state, action) {
      state.taxData = action.payload;
      state.loading = false;
    },
    getTotalTaxCount(state, action) {
      state.totalTaxCount = action.payload;
      state.brandLoading = false;
    },
    getTaxError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    getMappedTaxListLoading(state, action) {
      state.mappedTaxListLoading = true;
    },
    getMappedTaxList(state, action) {
      state.mappedTaxList = action.payload;
      state.mappedTaxListLoading = false;
    },
    getProductListData(state, action) {
      state.productList = action.payload;
      state.mappedTaxListLoading = false;
    },
  },
});

export const {
  getTaxLoading,
  getTaxs,
  getTotalTaxCount,
  getTaxError,
  getMappedTaxListLoading,
  getMappedTaxList,
  getProductListData,
} = taxSlice.actions;
export const taxReducer = taxSlice.reducer;

export const getTaxList = (pageNumber, pageSize, searchQuery) => {
  return (dispatch) => {
    dispatch(getTaxLoading());

    let config = apiConfig(
      `${SERVER_URL}${GET_TAX}?lastUpdated=${0}&pageNumber=${
        pageNumber ? pageNumber : 0
      }&pageSize=${
        pageSize ? pageSize : 0
      }&search=${searchQuery}&storeId=${STORE_Id}`,
      "GET"
    );

    axios(config)
      .then((responese) => {
        console.log("responeseTax ", responese);
        if (responese.status === 200) {
          dispatch(getTaxs(responese?.data));
          dispatch(getTotalTaxCount(responese?.data?.totalTax));
        }
      })
      .catch((err) => {
        console.log(err);
        dispatch(getTaxError("someting went wrong"));
      });
  };
};

export const addTaxToMap = (productId, taxId, storeId) => {
  return (dispatch) => {
    let taxPayload = [
      {
        taxId: taxId,
        isDeleted: 0,
        lastUpdate: 0,
        productId: productId,
        storeId: storeId,
      },
    ];

    console.log("taxPayload ", taxPayload);

    let config = apiConfig(
      `${SERVER_URL}${ADDTAXES_MAPPING}`,
      "POST",
      taxPayload
    );

    axios(config)
      .then((response) => {
        console.log("response tax ", response);
      })
      .catch((err) => {
        console.log("err tax ", err);
      });
  };
};

export const getTaxMappedProductsByCatId = (
  taxId,
  categoryId,
  isMapped,
  pageNumber,
  pageSize,
  search
) => {
  return (dispatch) => {
    let config = apiConfig(
      `${SERVER_URL}${GET_TAX_MAPPED_PRODUCTS_BY_CATEGORY_ID}?categoryId=${categoryId}&taxId=${taxId}&isTaxMapped=${isMapped}&pageNumber=${pageNumber}&pageSize=${pageSize}&search=${search}`,
      "GET"
    );

    axios(config)
      .then((response) => {
        console.log(
          "GET_TAX_MAPPED_PRODUCTS_BY_CATEGORY_ID ",
          response?.data?.data
        );
        if (response.status === 200) {
          dispatch(getProductListData(response?.data?.data));
        }
      })
      .catch((err) => {
        console.log("errDicsount ", err);
        // apiFailureResponse && apiFailureResponse(err?.message);
      });
  };
};

export const addTaxOnMultiProduct = (
  taxArr,
  taxAddOnProductSuccess,
  apiFailureResponse
) => {
  return (dispatch) => {
    let taxPayload = [];
    console.log("taxArrApply... ", taxArr)

    for (let i = 0; i <= taxArr?.length; i++) {
      if (taxArr[i]?.isCheck === true) {
        let payload = {
          taxId: taxArr[i]?.taxId,
          isDeleted: 0,
          lastUpdate: 0,
          productId: taxArr[i]?.productId,
          storeId: taxArr[i]?.storeId,
        };
        taxPayload.push(payload);
      }

      if (i === taxArr?.length - 1) {
        console.log("CHALA");
        console.log("taxPayload Mutli ", taxPayload);
        let config = apiConfig(
          `${SERVER_URL}${ADDTAXES_MAPPING}`,
          "POST",
          taxPayload
        );

        axios(config)
          .then((response) => {
            console.log("response applyTaxOnProduct tax ", response);
            if (response.status === 200) {
              taxAddOnProductSuccess(
                `Tax mapped successfully on ${
                  taxArr?.length > 1 ? "products" : "product"
                }`
              );
              dispatch(getTaxMappedList());
            }
          })
          .catch((err) => {
            console.log("err tax ", err);
            err && apiFailureResponse(err?.message);
          });
      }
    }
  };
};

export const removeTaxOnProduct = (
  taxArr,
  taxRemovedOnProductSuccess,
  apiFailureResponse
) => {
  return (dispatch) => {
    let taxPayload = [];
    console.log("taxArr... ", taxArr)

    for (let i = 0; i <= taxArr?.length; i++) {
      if (taxArr[i]?.isCheck === false) {
        let payload = {
          taxId: taxArr[i]?.taxId,
          isDeleted: 1,
          lastUpdate: 0,
          productId: taxArr[i]?.productId,
          storeId: taxArr[i]?.storeId,
        };
        taxPayload.push(payload);
      }

      // API call end of the loop when whole array will build
      if (i === taxArr?.length - 1) {
        let config = apiConfig(
          `${SERVER_URL}${ADDTAXES_MAPPING}`,
          "POST",
          taxPayload
        );

        axios(config)
          .then((response) => {
            console.log("response applyTaxOnProduct tax ", response);
            if (response.status === 200) {
              taxRemovedOnProductSuccess(
                `Tax removed from ${taxArr?.length > 1 ? "products" : "product"} successfully`
              );
              dispatch(getTaxMappedList());
            }
          })
          .catch((err) => {
            console.log("err tax ", err);
            err && apiFailureResponse(err?.message);
          });
      }
    }
  };
};

export const removeTaxOnDashProduct = (taxArr, productDeleteSuccess, taxRemovedOnProductSuccess) => {
  return (dispatch) => {
    let config = apiConfig(`${SERVER_URL}${ADDTAXES_MAPPING}`, "POST", taxArr);

    axios(config)
      .then((response) => {
        console.log("response Remove tax dash product ", response);
        if (response.status === 200) {
          // taxRemovedOnProductSuccess();
          productDeleteSuccess()
        }
      })
      .catch((err) => {
        console.log("err tax ", err);
      });
  };
};

export const getTaxMappedList = () => {
  return (dispatch) => {
    dispatch(getMappedTaxListLoading());

    let config = apiConfig(`${SERVER_URL}${GET_TAX_MAPPING}`, "GET");

    axios(config)
      .then((responese) => {
        console.log("responese GET_TAX_MAPPING ", responese);
        if (responese.status === 200) {
          dispatch(getMappedTaxList(responese?.data));
        }
      })
      .catch((err) => {
        console.log(err);
        dispatch(getTaxError("someting went wrong"));
      });
  };
};

// export const addTax=(postData,handlePopupClose, taxCreationSuccess, taxDeleteSuccess, apiFailureResponse, setApiError)=>{
//   return(dispatch)=>{
//     let config = apiConfig(`${SERVER_URL}${UPSERT_TAX}`, "POST",postData);
//     axios(config)
//     .then(({ data }) => {
//       console.log(data);
//       taxCreationSuccess()
//       taxDeleteSuccess()
//       dispatch(getTaxList())
//       handlePopupClose()
//     })
//     .catch((err) => {
//       console.log("err ", err)
//       const errorMsg = err && apiFailureResponse(err?.message);
//       console.log("errorMsg ", errorMsg);
//       setApiError(errorMsg);
//       // dispatch(getAllProductError("someting went wrong"));
//     });
//   }
// }

export const getTaxListOnlyUsingAxios = async () => {
  try {
    let config = apiConfig(`${SERVER_URL}${GET_TAX}`, "GET");
    const response = await axios(config);
    if (response?.status === 200) {
      return response?.data;
    }
  } catch (error) {
    console.log(error);
  }
};

export const addTax = (
  postData,
  taxCreationSuccess,
  setPopUpMessage,
  PopUpMessegeHandler
) => {
  return (dispatch) => {
    let config = apiConfig(`${SERVER_URL}${UPSERT_TAX}`, "POST", postData);

    axios(config)
      .then((response) => {
        console.log("AddTaxResponse... ", response);
        if (response?.status === 200) {
          dispatch(getTaxList(1, 5, ""));
          setPopUpMessage("Tax added successfully");
          taxCreationSuccess();
        }
      })
      .catch((err) => {
        console.log("err", err?.response);
        if (err?.response.status === 417) {
          PopUpMessegeHandler("This name is already exists");
        }
        PopUpMessegeHandler(err?.response?.data?.message);
      });
  };
};

export const updateTax = (postData, taxCreationSuccess, setPopUpMessage) => {
  return (dispatch) => {
    let config = apiConfig(`${SERVER_URL}${UPSERT_TAX}`, "POST", postData);

    axios(config)
      .then((response) => {
        console.log("UpdateTableResponse... ", response);
        if (response?.status === 200) {
          setPopUpMessage("Tax updated successfully");
          taxCreationSuccess();
          dispatch(getTaxList(1, 5, ""));
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
};

export const deleteTax = (postData, taxCreationSuccess, setPopUpMessage) => {
  return (dispatch) => {
    let config = apiConfig(`${SERVER_URL}${UPSERT_TAX}`, "POST", postData);

    axios(config)
      .then((response) => {
        console.log("UpdateTableResponse... ", response);
        if (response?.status === 200) {
          setPopUpMessage("Tax deleted successfully");
          taxCreationSuccess();
          dispatch(getTaxList(1, 5, ""));
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
};
