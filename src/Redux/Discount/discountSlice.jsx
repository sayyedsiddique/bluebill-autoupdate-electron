import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {
  ADDDISCOUNT_MAPPING,
  GET_DISCOUNT,
  GET_DISCOUNT_MAPPED_PRODUCTS_BY_CATEGORY_ID,
  GET_MAPPED_DISCOUNT_LIST,
  SERVER_URL,
  STORE_Id,
  UPSERT_DISCOUNT,
} from "../../Containts/Values";
import { apiConfig } from "../../utils/constantFunctions";

const initialUnitState = {
  discountData: [],
  mappedDiscountData: [],
  loading: false,
  error: null,
  getSingleDiscount: [],
  productList: [],
};

export const discountSlice = createSlice({
  name: "discount",
  initialState: initialUnitState,
  reducers: {
    getDiscountLoading(state, action) {
      state.loading = action.payload;
    },
    getDiscount(state, action) {
      state.discountData = action.payload;
      state.loading = false;
    },
    getDiscountError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    getSingleProductDiscount(state, action) {
      state.getSingleDiscount = action.payload;
      state.loading = false;
    },
    getMappedDiscountData(state, action) {
      state.mappedDiscountData = action.payload;
      state.loading = false;
    },
    getProductListData(state, action) {
      state.productList = action.payload;
      state.loading = false;
    },
  },
});

export const {
  getDiscountLoading,
  getDiscount,
  getDiscountError,
  getSingleProductDiscount,
  getMappedDiscountData,
  getProductListData,
} = discountSlice.actions;
export const discountReducer = discountSlice.reducer;

export const getDiscountlist = (pageNumber, pageSize, searchQuery, isValid) => {
  return (dispatch) => {
    dispatch(getDiscountLoading(true));

    let config = apiConfig(
      `${SERVER_URL}${GET_DISCOUNT}?isValid=${isValid}&pageNumber=${pageNumber ? pageNumber : 0
      }&pageSize=${pageSize ? pageSize : 0
      }&search=${searchQuery}&storeId=${STORE_Id}`,
      "GET"
    );
    axios(config)
      .then((responese) => {
        console.log("responese Discount ", responese);
        if (responese.status === 200) {
          dispatch(getDiscount(responese?.data));
          dispatch(getDiscountLoading(false));
        }
      })
      .catch((err) => {
        console.log(err);
        dispatch(getDiscountError("someting went wrong"));
        dispatch(getDiscountLoading(false));
      });
  };
};

export const addDiscountToMap = (productId, discountId, STORE_Id) => {
  return (dispatch) => {
    let discountPayload = [
      {
        discountId: discountId, //id
        isDeleted: 0,
        lastUpdate: 0,
        productId: productId,
        storeId: STORE_Id,
      },
    ];

    let config = apiConfig(
      `${SERVER_URL}${ADDDISCOUNT_MAPPING}`,
      "POST",
      discountPayload
    );

    axios(config)
      .then((response) => {
        console.log("response discount ", response);
      })
      .catch((err) => {
        console.log("err discount ", err);
      });
  };
};

export const getMappedDiscountByProdutId = (productId) => {
  return (dispatch) => {
    let config = apiConfig(
      `${SERVER_URL}discountmapping/getDiscountMapping?lastUpdated=0&productId=${productId}`,
      "GET"
    );

    axios(config)
      .then((responese) => {
        if (responese.status === 200) {
          dispatch(getSingleProductDiscount(responese?.data));
        }
        console.log("response discount mapped product ", responese);
      })
      .catch((error) => {
        console.log("error discount mapped product ", error);
      });
  };
};

export const getMappedDiscountListByStoreId = () => {
  return (dispatch) => {
    let config = apiConfig(`${SERVER_URL}${GET_MAPPED_DISCOUNT_LIST}`, "GET");

    axios(config)
      .then((responese) => {
        console.log("response discount mapped list ", responese);
        if (responese.status === 200) {
          dispatch(getMappedDiscountData(responese?.data));
        }
      })
      .catch((error) => {
        console.log("error discount mapped list ", error);
      });
  };
};

export const addDisOnMultiplePro = (
  discountArr,
  discountAddOnProductSuccess,
  apiFailureResponse
) => {
  return (dispatch) => {
    let disPayload = [];

    console.log("discountArr ", discountArr);

    for (let i = 0; i <= discountArr.length; i++) {
      console.log("discountArr[i].isCheck ", discountArr[i]?.isCheck);
      if (discountArr[i]?.isCheck === true) {
        let payload = {
          discountId: discountArr[i]?.discountId, //id
          isDeleted: 0,
          lastUpdate: 0,
          productId: discountArr[i]?.productId,
          storeId: discountArr[i]?.storeId,
        };
        disPayload.push(payload);
      }

      if (i === discountArr.length - 1) {
        let config = apiConfig(
          `${SERVER_URL}${ADDDISCOUNT_MAPPING}`,
          "POST",
          disPayload
        );

        axios(config)
          .then((response) => {
            console.log("ResponseApplyDiscountOnProduct  ", response);
            if (response.status === 200) {
              discountAddOnProductSuccess(
                `Discount mapped successfully on ${discountArr?.length > 1 ? "products" : "product"
                }`
              );
              dispatch(getDiscountlist(0, 0, "", ""));
            }
          })
          .catch((err) => {
            console.log("err Dicsount ", err);
            apiFailureResponse && apiFailureResponse(err?.message);
          });
      }
    }

    // let discountPayload = [
    //   {
    //     discountId: discountId, //id
    //     isDeleted: 0,
    //     lastUpdate: 0,
    //     productId: productId,
    //     storeId: STORE_Id,
    //   },
    // ];

    // let config = apiConfig(
    //   `${SERVER_URL}${ADDDISCOUNT_MAPPING}`,
    //   "POST",
    //   discountPayload
    // );

    // axios(config)
    //   .then((response) => {
    //     console.log("response discount ", response);
    //   })
    //   .catch((err) => {
    //     console.log("err discount ", err);
    //   });
  };
};

export const getDiscountMappedProductsByCatId = (
  categoryId,
  discountId,
  isMapped,
  pageNumber,
  pageSize,
  search
) => {
  return (dispatch) => {
    let config = apiConfig(
      `${SERVER_URL}${GET_DISCOUNT_MAPPED_PRODUCTS_BY_CATEGORY_ID}?categoryId=${categoryId}&discountId=${discountId}&isDiscountMapped=${isMapped}&pageNumber=${pageNumber}&pageSize=${pageSize}&search=${search}`,
      "GET"
    );

    axios(config)
      .then((response) => {
        console.log(
          "GET_DISCOUNT_MAPPED_PRODUCTS_BY_CATEGORY_ID ",
          response?.data?.data
        );
        if (response.status === 200) {
          // discountAddOnProductSuccess();
          dispatch(getProductListData(response?.data?.data));
        }
      })
      .catch((err) => {
        console.log("errDicsount ", err);
        // apiFailureResponse && apiFailureResponse(err?.message);
      });
  };
};

export const removeDisOnMultiplePro = (
  discountArr,
  discountAddOnProductSuccess,
  apiFailureResponse
) => {
  return (dispatch) => {
    let disPayload = [];

    console.log("discountArr ", discountArr);

    for (let i = 0; i <= discountArr.length; i++) {
      console.log("discountArr[i].isCheck ", discountArr[i]?.isCheck);
      if (discountArr[i]?.isCheck === false) {
        let payload = {
          discountId: discountArr[i]?.discountId, //id
          isDeleted: 1,
          lastUpdate: 0,
          productId: discountArr[i]?.productId,
          storeId: discountArr[i]?.storeId,
        };
        disPayload.push(payload);
      }

      if (i === discountArr.length - 1) {
        let config = apiConfig(
          `${SERVER_URL}${ADDDISCOUNT_MAPPING}`,
          "POST",
          disPayload
        );

        axios(config)
          .then((response) => {
            console.log("responseRemoveDiscountOnProduct ", response);
            if (response.status === 200) {
              discountAddOnProductSuccess(
                `Discount unmapped successfully on ${discountArr?.length > 1 ? "products" : "product"
                }`
              );
              dispatch(getDiscountlist(0, 0, "", ""));
            }
          })
          .catch((err) => {
            console.log("err Dicsount ", err);
            apiFailureResponse && apiFailureResponse(err?.message);
          });
      }
    }

    //   {
    //     discountId: discountId, //id
    //     isDeleted: 0,
    //     lastUpdate: 0,
    //     productId: productId,
    //     storeId: STORE_Id,
    //   },
    // ];

    // let config = apiConfig(
    //   `${SERVER_URL}${ADDDISCOUNT_MAPPING}`,
    //   "POST",
    //   discountPayload
    // );

    // axios(config)
    //   .then((response) => {
    //     console.log("response discount ", response);
    //   })
    //   .catch((err) => {
    //     console.log("err discount ", err);
    //   });
  };
};

// export const addDiscount=(postData, discountCreationSuccess, setApiError)=>{
//   return(dispatch)=>{
//     let config = apiConfig(`${SERVER_URL}${UPSERT_DISCOUNT}`, "POST",postData);
//     axios(config)
//     .then((response) => {
//       if (response.status === 200) {
//         console.log(response);
//       discountCreationSuccess()
//       dispatch(getDiscountlist())
//       }
//     })
//     .catch((err) => {
//       console.log("err ", err)
//       const errorMsg = err && apiFailureResponse(err?.message);
//       console.log("errorMsg ", errorMsg);
//       err && setApiError(errorMsg)
//       // dispatch(getAllProductError("someting went wrong"));
//     });
//   }
// }

export const getDiscountlistOnlyUsingAxios = async () => {
  try {
    let config = apiConfig(`${SERVER_URL}${GET_DISCOUNT}`, "GET");
    const response = await axios(config);
    if (response?.status === 200) {
      return response?.data;
    }
  } catch (error) {
    console.log("error ", error);
  }
};

// export const getMappedDiscountByProdutIdOnlyUsingAxios = async (productId) => {
//   try {
//     let config = apiConfig(`${SERVER_URL}discountmapping/getDiscountMapping?lastUpdated=0&productId=${productId}`, "GET");
//     const response = await axios(config);
//     if (response?.status === 200) {
//       return response?.data;
//     }
//   } catch (error) {
//     console.log("error ", error);
//   }
// };

export const addDiscount = (
  postData,
  discountCreationSuccess,
  setPopUpMessage,
  PopUpMessegeHandler
) => {
  return (dispatch) => {
    let config = apiConfig(`${SERVER_URL}${UPSERT_DISCOUNT}`, "POST", postData);

    axios(config)
      .then((response) => {
        console.log("AddDiscountResponse... ", response);
        if (response?.status === 200) {
          dispatch(getDiscountlist(1, 5, "", ""));
          setPopUpMessage("Discount added successfully");
          discountCreationSuccess();
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

export const updateDiscount = (
  postData,
  discountCreationSuccess,
  setPopUpMessage
) => {
  return (dispatch) => {
    let config = apiConfig(`${SERVER_URL}${UPSERT_DISCOUNT}`, "POST", postData);

    axios(config)
      .then((response) => {
        console.log("UpdateTableResponse... ", response);
        if (response?.status === 200) {
          setPopUpMessage("Discount updated successfully");
          discountCreationSuccess();
          dispatch(getDiscountlist(1, 5, "", ""));
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
};

export const deleteDiscount = (
  postData,
  discountCreationSuccess,
  setPopUpMessage
) => {
  return (dispatch) => {
    let config = apiConfig(`${SERVER_URL}${UPSERT_DISCOUNT}`, "POST", postData);

    axios(config)
      .then((response) => {
        console.log("UpdateTableResponse... ", response);
        if (response?.status === 200) {
          setPopUpMessage("Discount deleted successfully");
          discountCreationSuccess();
          dispatch(getDiscountlist(1, 5, "", ""));
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
};
