import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {
  GET_BRAND,
  SERVER_URL,
  STORE_Id,
  SYNC,
  UPSERT_BRAND,
  getUTCDate,
} from "../../Containts/Values";
import { apiConfig, getToken } from "../../utils/constantFunctions";

const brandSlice = createSlice({
  name: "brand",
  initialState: {
    brandData: [],
    totalBrandCount: null,
    brandLoading: false,
    error: null,
    syncBrandData: [],
  },
  reducers: {
    getBrand(state, action) {
      state.brandData = action.payload;
      state.brandLoading = false;
    },
    getTotalBrandCount(state, action) {
      state.totalBrandCount = action.payload;
      state.brandLoading = false;
    },
    brandLoading(state, action) {
      state.brandLoading = action.payload;
      state.brandLoading = true;
    },
    brandError(state, action) {
      state.error = action.payload;
      state.brandLoading = false;
    },
    saveSyncBrandData(state, action) {
      state.syncBrandData = action.payload;
      state.brandLoading = false;
    },
  },
});

export const { getBrand, getTotalBrandCount, brandLoading, brandError } = brandSlice.actions;
export const brandReducer = brandSlice.reducer;

export const getBrandList = (pageNumber, pageSize, searchQuery) => {
  return (dispatch) => {
    dispatch(brandLoading());

    const config = {
      method: "GET",
      url: `${SERVER_URL}${GET_BRAND}?lastUpdated=${0}&pageNumber=${pageNumber ? pageNumber : 0}&pageSize=${pageSize ? pageSize : 0}&search=${searchQuery}&storeId=${STORE_Id}`,
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    };

    axios(config)
      .then((response) => {
        if (response.status === 200) {
          console.log("getBrandResponse ", response);
          dispatch(getBrand(response?.data));
          dispatch(getTotalBrandCount(response?.data?.totalBrand))
        }
      })
      .catch((error) => {
        console.log("getBrand error ", error);
        dispatch(brandError());
      });
  };
};

export const syncBrandData = (postData) => {
  return (dispatch) => {
    // dispatch(brandLoading(true));

    const brandSyncPostSchema = [
      {
        brandId: postData[1]?.brandId,
        brandName: postData[1]?.brandName,
        isDeleted: postData[1]?.isDeleted,
        lastUpdate: 0,
        storeId: postData[1]?.storeId,
      },
    ];

    console.log("brandSyncPostSchema... ", brandSyncPostSchema);

    const syncPayload = {
      brands: brandSyncPostSchema,
      categories: [
        {
          categoryId: 0,
          categoryName: "",
          isDeleted: 0,
          lastUpdate: 0,
          storeId: 0,
        },
      ],
      comment: "",
      currencies: [
        {
          countryName: "",
          currencyName: "",
          id: 0,
          isDeleted: 0,
          lastUpdate: 0,
        },
      ],
      customers: [
        {
          addedBy: "",
          address: "",
          city: "",
          country: "",
          customerId: 0,
          customerName: "",
          email: "",
          isDeleted: 0,
          lastUpdate: 0,
          mobileNumber: "",
          notes: "",
          schemaName: "",
          updatedBy: "",
        },
      ],
      deviceId: "",
      deviceUniqueAddress: "",
      discountMappings: [
        {
          discountId: 0,
          isDeleted: 0,
          lastUpdate: 0,
          productId: 0,
          storeId: 0,
        },
      ],
      discounts: [
        {
          discountId: 0,
          discountName: "",
          discountVal: 0,
          endDate: 0,
          isDeleted: 0,
          isPercent: true,
          lastUpdate: 0,
          percent: true,
          productId: "",
          startDate: 0,
        },
      ],
      lastUpdate: 0,
      paymentTransactions: [
        {
          addedBy: "",
          changeAmtReturn: 0,
          clientLastUpdated: 0,
          currencyName: "",
          customerId: "",
          customerName: "",
          dateAdded: "",
          dateUpdated: "",
          discount: 0,
          finaltotalAmount: 0,
          modeOfPayment: "",
          notes: "",
          orderType: "",
          paymentId: 0,
          receivedAmount: 0,
          salesExecutiveName: "",
          sales_executiveId: 0,
          storeId: 0,
          totalAmount: 0,
          totalBalance: 0,
          totalPayment: 0,
          transaction_typeName: "",
          updatedBy: "",
          userName: "",
        },
      ],
      products: [
        {
          active: 0,
          addedBy: "",
          barCode: "",
          brandId: 0,
          categoryId: 0,
          currencyId: 0,
          dateAdded: "",
          discountName: [""],
          expiryDate: 0,
          image: "",
          imageId: 0,
          imageUrl: "",
          imagesList: [
            {
              customerId: 0,
              imageId: 0,
              imageName: "",
              imageUrl: "",
              orderId: 0,
              productDefaultImage: true,
              productId: 0,
              returCode: "",
              storeId: 0,
              storeImage: true,
            },
          ],
          inventoryManage: "",
          isDeleted: 0,
          lastUpdate: 0,
          maxRetailPrice: 0,
          notes: "",
          priceIncludeTax: "",
          productId: 0,
          productName: "",
          purchasingPrice: 0,
          quantity: 0,
          sellingPrice: 0,
          slug: "",
          stockLevelAlert: "",
          storeId: 0,
          subCategoryId: 0,
          taxName: [""],
          unitId: 0,
          updatedBy: "",
        },
      ],
      saleCredits: [
        {
          amount: 0,
          balAmount: 0,
          clientLastUpdated: "",
          currencyName: "",
          id: 0,
          lastUpdate: 0,
          paymentId: 0,
          paymentType: "",
          updatedBy: "",
        },
      ],
      salesDetails: [
        {
          clientLastUpdated: 0,
          currencyId: 0,
          currencyName: "",
          discountValue: 0,
          isMeasurable: true,
          lastUpdate: 0,
          modeOfPayment: "",
          paymentId: 0,
          productId: 0,
          productName: "",
          productSize: "",
          purchasingPrice: 0,
          salesDetailsId: 0,
          salesPrice: 0,
          salesQuantity: 0,
          salestotalAmount: 0,
          taxValue: 0,
          totalDiscount: 0,
          totalTax: 0,
          transactionRefId: "",
          unitId: 0,
          unitName: "",
        },
      ],
      salesReturns: [
        {
          clientLastUpdated: "",
          comment: "",
          currencyName: "",
          id: "",
          lastUpdate: 0,
          modeofpayment: "",
          paymentId: 0,
          productId: 0,
          purchasingPrice: 0,
          salesPrice: 0,
          salesQuantity: 0,
          salestotalAmount: 0,
          taxValue: 0,
        },
      ],
      salesexecutive: [
        {
          activated: "",
          id: 0,
          name: "",
        },
      ],
      storeId: "", // STORE_Id
      subCategories: [
        {
          categoryId: 0,
          isDeleted: 0,
          lastUpdate: 0,
          subCategoryId: 0,
          subCategoryName: "",
        },
      ],
      taxMappings: [
        {
          isDeleted: 0,
          lastUpdate: 0,
          productId: 0,
          storeId: 0,
          taxId: 0,
        },
      ],
      taxes: [
        {
          isDeleted: 0,
          lastUpdate: 0,
          productId: "",
          taxId: 0,
          taxName: "",
          taxValue: 0,
        },
      ],
      transactionDiscounts: [
        {
          discountName: "",
          discountVal: 0,
          id: 0,
          isPercent: true,
          transactionDiscountId: 0,
        },
      ],
      transactionTaxes: [
        {
          id: 0,
          taxName: "",
          taxValue: 0,
          transactionTaxId: 0,
        },
      ],
      units: [
        {
          isDeleted: 0,
          isMeasurable: true,
          lastUpdate: 0,
          unitId: 0,
          unitName: "",
        },
      ],
    };

    // const config = {
    //     method: "POST",
    //     url: `${SERVER_URL}${SYNC}`,
    //   timeout: 10000,
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    //     Authorization: "Bearer " + getToken(),
    //   },
    // };

    let config = apiConfig(`${SERVER_URL}${SYNC}`, "POST", syncPayload);

    axios(config)
      .then(({ data }) => {
        // var res = JSON.stringify(data);
        console.log("Response: " + data);
        // storeObj("selectedCur", data);
        if (data != null && data != undefined) {
          //     var syncServiceResponseHandler = new SyncServiceResponseHandler();
          //   syncServiceResponseHandler.updateSyncResponse(data);
          dispatch(brandLoading(false));
          //   alert(translate("syncCompletedAlert"));
          console.log("syncCompletedAlert");
          //   this.props.navigation.navigate("AuthLoading");
        } else {
          dispatch(brandLoading(false));
        }
        //return false;
      })
      .catch((err) => {
        dispatch(brandLoading(false));
        console.log("Error: " + err);
        if (err == "Error: Request failed with status code 401") {
          //   this.handleSessionExpired();
        }

        // alert("Session Expired, Please login again to do sync");
      });
  };
};

export const getBrandListOnlyUsingAxios = async () => {
  try {
    let config = apiConfig(`${SERVER_URL}${GET_BRAND}`, "GET");
    let response = await axios(config);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// export const addBrand = (
//   postData,
//   handlePopupClose,
//   brandCreationSuccess,
//   brandDeleteSuccess,
//   apiFailureResponse,
//   setApiError
// ) => {
//   return (dispatch) => {
//     let config = apiConfig(`${SERVER_URL}${UPSERT_BRAND}`, "POST", postData);
//     axios(config)
//       .then(({ data }) => {
//         console.log(data);
//         brandCreationSuccess();
//         brandDeleteSuccess();
//         dispatch(getBrandList());
//         handlePopupClose();
//       })
//       .catch((err) => {
//         console.log("err ", err);
//         const errorMsg = err && apiFailureResponse(err?.message);
//         console.log("errorMsg ", errorMsg);
//         setApiError(errorMsg);
//       });
//   };
// };

export const addBrand = (postData, brandCreationSuccess, setPopUpMessage, PopUpMessegeHandler) => {
  return (dispatch) => {
    let config = apiConfig(`${SERVER_URL}${UPSERT_BRAND}`, "POST", postData);

    axios(config)
      .then((response) => {
        console.log("AddBrandResponse... ", response);
        if (response?.status === 200) {
          dispatch(getBrandList(1, 5, ""));
          setPopUpMessage("Brand added successfully");
          brandCreationSuccess();

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

export const updateBrand = (
  postData,
  brandCreationSuccess,
  setPopUpMessage
) => {
  return (dispatch) => {
    let config = apiConfig(`${SERVER_URL}${UPSERT_BRAND}`, "POST", postData);

    axios(config)
      .then((response) => {
        console.log("UpdateTableResponse... ", response);
        if (response?.status === 200) {
          setPopUpMessage("Brand updated successfully");
          brandCreationSuccess();
          dispatch(getBrandList(1, 5, ""));
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
};

export const deleteBrand = (
  postData,
  brandCreationSuccess,
  setPopUpMessage
) => {
  return (dispatch) => {
    let config = apiConfig(`${SERVER_URL}${UPSERT_BRAND}`, "POST", postData);

    axios(config)
      .then((response) => {
        console.log("UpdateTableResponse... ", response);
        if (response?.status === 200) {
          setPopUpMessage("Brand deleted successfully");
          brandCreationSuccess();
          dispatch(getBrandList(1, 5, ""));
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
};
