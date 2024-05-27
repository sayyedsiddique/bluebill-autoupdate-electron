import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { apiConfig, getToken } from "../../utils/constantFunctions";
import { SERVER_URL, STORE_Id, SYNC } from "../../Containts/Values";
import {
  getCategoryList,
  getCategoryListOnlyUsingAxios,
} from "../Category/categorySlice";
import { getBrandListOnlyUsingAxios } from "../Brand/brandSlice";
import { getDiscountlistOnlyUsingAxios } from "../Discount/discountSlice";
import { getTaxListOnlyUsingAxios } from "../Tax/taxSlice";

const syncSlice = createSlice({
  name: "sync",
  initialState: {
    error: null,
    isLoading: false,
    syncData: [],
    syncUpdateData: [],
  },
  reducers: {
    syncLoading(state, action) {
      state.isLoading = action.payload;
    },
    syncData(state, action) {
      state.syncData = action.payload;
    },
    syncError(state, action) {
      state.error = action.payload;
    },
    afterSyncUpdate(state, action) {
      state.syncUpdateData = action.payload;
    },
  },
});

export const { syncLoading, syncData, syncError, afterSyncUpdate } =
  syncSlice.actions;
export const syncReducer = syncSlice.reducer;

export const syncAllTogether = (postData) => {
  return (dispatch) => {
    dispatch(syncLoading(true));
    console.log("postData... ", postData);

    const lastUpdate = JSON.parse(localStorage.getItem("lastUpdate"));
    const brandSyncPostSchema = postData?.brandNotSyncList;

    console.log("brandSyncPostSchema... ", brandSyncPostSchema);

    // here we are removing isSync value
    const mappedTaxModifiedList = [];
    postData?.mappedTaxNotSyncList &&
      postData?.mappedTaxNotSyncList?.map((item) => {
        const mappedtaxObj = {
          productId: item?.productId,
          storeId: item?.storeId,
          lastUpdate: item?.lastUpdate,
          isDeleted: item?.isDeleted,
          taxId: item?.taxId,
        };
        mappedTaxModifiedList?.push(mappedtaxObj);
      });

    // here we are removing isSync value
    const discountMappingModifiedList = [];
    postData?.discountMappingNotSyncList &&
      postData?.discountMappingNotSyncList?.map((item) => {
        const discountObj = {
          discountId: item?.discountId,
          storeId: item?.storeId,
          lastUpdate: item?.lastUpdate,
          isDeleted: item?.isDeleted,
          productId: item?.productId,
        };
        discountMappingModifiedList?.push(discountObj);
      });

      const productNewArrary = []
      postData?.productNotSyncList && postData?.productNotSyncList?.map((item) => {
        const prodObj = {
          ...item,
          imagesList: [],
          discountName: [],
          taxName: [],
          addedBy: "",
          dateAdded: "",
          slug: ""
        }
        productNewArrary.push(prodObj)
      })

      console.log("productNewArrary... ", productNewArrary)

    const syncPayload = {
      brands: brandSyncPostSchema,
      categories: postData?.categoryNotSyncList,
      comment: "",
      currencies: [],
      customers: postData?.customerNotSyncList,
      deviceId: "",
      deviceUniqueAddress: "",
      discountMappings: [], // discountMappingModifiedList api not working for this
      discounts: postData?.discountNotSyncList,
      lastUpdate: Number(lastUpdate),
      paymentTransactions: [], // transactionPaymentNotSyncList api working for this
      products: [], //productNewArrary
      saleCredits: [],
      salesDetails: [], //postData?.salesDetailsNotSyncList api not working for this
      salesReturns: [],
      salesexecutive: postData?.salesExecutiveNotSyncList,
      storeId: String(STORE_Id), // STORE_Id
      subCategories: [],
      taxMappings: [], //mappedTaxModifiedList
      taxes: postData?.taxNotSyncList,
      transactionDiscounts: [],
      transactionTaxes: [],
      units: postData?.unitNotSyncList,
    };

    console.log("syncPayload... ", syncPayload);

    let config = apiConfig(`${SERVER_URL}${SYNC}`, "POST", syncPayload);

    axios(config)
      .then(({ data }) => {
        // var res = JSON.stringify(data);
        console.log("Response: ", data);
        // storeObj("selectedCur", data);
        if (data != null && data != undefined) {
          //     var syncServiceResponseHandler = new SyncServiceResponseHandler();
          //   syncServiceResponseHandler.updateSyncResponse(data);
          dispatch(syncUpdateResponse(data));
          dispatch(syncLoading(false));
          //   alert(translate("syncCompletedAlert"));
          console.log("syncCompletedAlert");
          //   this.props.navigation.navigate("AuthLoading");
        } else {
          dispatch(syncLoading(false));
        }
        //return false;
      })
      .catch((err) => {
        dispatch(syncLoading(false));
        console.log("Error: " + err);
        if (err == "Error: Request failed with status code 401") {
          //   this.handleSessionExpired();
        }

        // alert("Session Expired, Please login again to do sync");
      });
  };
};

export const syncUpdateResponse = (res) => {
  return (dispatch) => {
    // dispatch(syncLoading(true))
    const brandApi = window.brandApi;
    const unitApi = window.unitApi;
    const categoryApi = window.categoryApi;
    const salesExecutiveApi = window.salesExecutiveApi;
    const customerApi = window.customerApi;
    const taxApi = window.taxApi;
    const mappedTaxApi = window.mappedTaxApi;
    const discountApi = window.discountApi;
    const discountMappingApi = window.discountMappingApi;
    const transactionPaymentApi = window.transactionPaymentApi;
    const salesDetailsApi = window.salesDetailsApi;
    const productApi = window.productApi;

    console.log("syncUpdateResponse... ", res);
    if (res != undefined) {
      //this.setState({response: res});
      var storeId = res.storeId;
      var lastUpdate = res.lastUpdate;
      localStorage.setItem("lastUpdate", lastUpdate);

      var salesExecutives = res["salesexecutive"];
      if (
        salesExecutives != null &&
        salesExecutives != undefined &&
        salesExecutives.length > 0
      ) {
        // this.updateSalesExecutives(salesExecutives, storeId);
        const updatedSyncSalesExecutiveList =
          salesExecutiveApi?.salesExecutiveDB?.updateSyncSalesExecutive(
            salesExecutives,
            STORE_Id
          );
        console.log(
          "updatedSyncSalesExecutiveList... ",
          updatedSyncSalesExecutiveList
        );
      } else {
        // SalesExecutiveService.doHardDelete(storeId);
      }

      var customers = res["customers"];
      if (customers != null && customers != undefined && customers.length > 0) {
        // this.updateCustomers(customers);
        const customerNotSyncList = customerApi?.customerDB?.updateSyncCustomer(
          customers,
          STORE_Id
        );
        console.log("customerNotSyncList... ", customerNotSyncList);
      } else {
        // CustomerService.doHardDelete();
      }

      // var categories = res["categories"];
      // let categories
      getCategoryListOnlyUsingAxios()
        .then((categories) => {
          console.log("getCategoryList... ", categories);
          // categories = categories

          if (
            categories != null &&
            categories != undefined &&
            categories.length > 0
          ) {
            // this.updateCategories(categories, storeId);
            const updatedSyncCategoryList =
              categoryApi?.categoryDB?.updateSyncCategory(categories);
            // console.log("updatedSyncCategoryList... ", updatedSyncCategoryList)
          } else {
            // CategoryService.doHardDelete(storeId);
          }
        })
        .catch((error) => {
          console.error(error);
        });

      var subCategories = res["subCategories"];
      if (
        subCategories != null &&
        subCategories != undefined &&
        subCategories.length > 0
      ) {
        // this.updateSubCategories(subCategories, storeId);
      } else {
        // SubCategoryService.doHardDelete(storeId);
      }

      // var brands = res["brands"];

      getBrandListOnlyUsingAxios()
        .then((brands) => {
          if (brands != null && brands != undefined && brands.length > 0) {
            // this.updateBrands(brands, storeId);
            const updateSyncBrandList =
              brandApi?.brandDB?.updateSyncBrand(brands);
            // console.log("updateSyncBrandList ", updateSyncBrandList);
          } else {
            // BrandService.doHardDelete(storeId);
          }
        })
        .catch((err) => console.log("err ", err));

      // var discounts = res["discounts"];

      getDiscountlistOnlyUsingAxios()
        .then((discounts) => {
          if (
            discounts != null &&
            discounts != undefined &&
            discounts.length > 0
          ) {
            // this.updateDiscounts(discounts);
            console.log("discounts... ", discounts)
            const updatedDiscountSyncList =
              discountApi?.discountDB?.updateSyncDiscount(discounts, STORE_Id);
          } else {
            // DiscountService.doHardDelete();
          }
        })
        .catch((err) => console.log("err ", err));

      // var taxes = res["taxes"];

      getTaxListOnlyUsingAxios()
        .then((taxes) => {
          if (taxes != null && taxes != undefined && taxes.length > 0) {
            // this.updateTaxes(taxes);
            const updateTaxSyncList = taxApi?.taxDB?.updateSyncTax(
              taxes,
              STORE_Id
            );
            console.log("updateTaxSyncList... ", updateTaxSyncList);
          } else {
            // TaxSchemaService.doHardDelete();
          }
        })
        .catch((err) => console.log("err ", err));

      var currencies = res["currencies"];
      if (
        currencies != null &&
        currencies != undefined &&
        currencies.length > 0
      ) {
        // this.updateCurrencies(currencies);
      } else {
        // CurrencyService.doHardDelete();
      }

      var units = res["units"];
      if (units != null && units != undefined && units.length > 0) {
        const unitsData =
          unitApi && unitApi?.unitDB?.updateSyncUnit(units, STORE_Id);
      } else {
        // UnitsService.doHardDelete(storeId);
      }

      /*var stores = res.stores;
            if(stores != null && stores != undefined){
                this.updateStores(stores);
            }*/

      var products = res["products"];
      if (products != null && products != undefined && products.length > 0) {
        // this.updateProducts(products, storeId);
        const updateSyncProuductList =
          productApi?.productDB?.updateSyncProuduct(products);
      } else {
        console.log("updateProducts StoreId= " + storeId);
        // ProductService.doHardDelete(storeId);
      }

      var taxMappings = res["taxMappings"];
      if (
        taxMappings != null &&
        taxMappings != undefined &&
        taxMappings.length > 0
      ) {
        // this.updateTaxMappings(taxMappings);
        const updatedMappedtaxList =
          mappedTaxApi?.mappedTaxDB?.updateSyncMappedTax(taxMappings);
      }

      var discountMappings = res["discountMappings"];
      if (
        discountMappings != null &&
        discountMappings != undefined &&
        discountMappings.length > 0
      ) {
        // this.updateDiscountMappings(discountMappings, storeId);
        const updateSyncDiscountMapping =
          discountMappingApi?.discountMappingDB?.updateSyncDiscountMapping(
            discountMappings
          );
      }

      var paymentTransactions = res["paymentTransactions"];
      if (
        paymentTransactions != null &&
        paymentTransactions != undefined &&
        paymentTransactions.length > 0
      ) {
        // this.updatePaymentTransactions(paymentTransactions, storeId);
        const updateSyncTransantionPaymentList =
          transactionPaymentApi?.transactionPaymentDB?.updateSyncTransantionPayment(
            paymentTransactions
          );
      }

      var saleDetails = res["salesDetails"];
      if (
        saleDetails != null &&
        saleDetails != undefined &&
        saleDetails.length > 0
      ) {
        // this.updateSaleDetails(saleDetails);
        const updateSyncSalesDetailsList =
          salesDetailsApi?.salesDetailsDB?.updateSyncSalesDetails(saleDetails);
      }

      var transactionTaxes = res["transactionTaxes"];
      if (
        transactionTaxes != null &&
        transactionTaxes != undefined &&
        transactionTaxes.length > 0
      ) {
        // this.updateTransactionTaxes(transactionTaxes);
      }

      var transactionDiscounts = res["transactionDiscounts"];
      if (
        transactionDiscounts != null &&
        transactionDiscounts != undefined &&
        transactionDiscounts.length > 0
      ) {
        // this.updateTransactionDiscounts(transactionDiscounts);
      }
    } else {
      alert("Backup Error, please try after some time.");
    }
  };
};
