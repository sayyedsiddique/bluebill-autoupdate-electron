import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {
  GET_CATEGORY,
  GET_PRODUCT_DATA,
  GET_PRODUCT_EXCEL_SHEET,
  GET_TOP_SELLING_PRODUCT,
  PRODUCTS_CATEGORY_LIST,
  PRODUCT_LIST_BY_CATEGORY_ID,
  SERVER_URL,
  STORE_Id,
  UPDATE_DEFAULT_IMAGE,
  UPLOAD_PROD_IMG,
  UPSERT_PRODUCT,
  getUTCDate,
} from "../../Containts/Values";
import { retrieveObj } from "../../Containts/Values";
import { apiConfig } from "../../utils/constantFunctions";
import { addDiscountToMap } from "../Discount/discountSlice";
import { addTaxToMap } from "../Tax/taxSlice";
import {
  getCategoryList,
  getcategories,
  getcategoryError,
} from "../Category/categorySlice";
import { addInventoryProduct } from "../InventoryManage/InventoryManageSlice";

const initialProductState = {
  productData: [],
  singleProduct: [],
  topSellingProduct: [],
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState: initialProductState,
  reducers: {
    addProductLoading(state) {
      state.loading = true;
    },
    addProductSuccess(state) {
      state.loading = false;
    },
    addProductError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    getAllProductLoading(state, action) {
      state.loading = true;
    },
    getAllProduct(state, action) {
      state.productData = action.payload;
      state.loading = false;
    },
    getAllProductError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    getSingleProductLoading(state, action) {
      state.loading = true;
    },
    getSingleProduct(state, action) {
      state.singleProduct = action.payload;
      state.loading = false;
    },
    getSingleProductError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    deleteSingleProduct(state, action) {
      state.singleProduct = action.payload;
    },
    setProductDefaultImgLoading(state, action) {
      state.loading = true;
    },
    setProductDefaultImage(state, action) {
      state.loading = false;
    },
    setProductDefaultImgError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },

    getAllProductsCategoryList(state, action) {
      state.Productcategories = action.payload;
      state.loading = false;
    },
    topSellingProductData(state, action) {
      state.topSellingProduct = action.payload;
      state.loading = false;
    },
    productExcelSheetData(state, action) {
      state.productExcelSheet = action.payload;
      state.loading = false;
    },
    stopProductLoading(state) {
      state.loading = false;
    },
  },
});

export const {
  addProductLoading,
  addProductSuccess,
  addProductError,
  getAllProduct,
  getAllProductLoading,
  getAllProductError,
  getSingleProductLoading,
  getSingleProduct,
  getSingleProductError,
  deleteSingleProduct,
  setProductDefaultImgLoading,
  setProductDefaultImgError,
  setProductDefaultImage,
  getAllProductsCategoryList,
  topSellingProductData,
  productExcelSheetData,
  stopProductLoading,
} = productSlice.actions;
export const productReducer = productSlice.reducer;

// Add new product
export const addProduct = (
  data,
  discountvalue,
  taxValue,
  STORE_Id,
  // imageFileArray,
  // defaultImgIndex,
  // cognitoUserName,
  // storeName,
  productCreationSuccess,
  productUploadImageHandler,
  limitExceededPopup,
  // inventoryProductData
) => {
  return (dispatch) => {
    dispatch(addProductLoading());
    console.log("ProductPostData ", data);
    // console.log("newProduct", inventoryProductData);
    let config = apiConfig(`${SERVER_URL}${UPSERT_PRODUCT}`, "POST", data);

    axios(config)
      .then((response) => {
        console.log("addProductResponse ", response);

        if (response.status === 200) {
          console.log("under 200");
          // if (data.inventoryManage === "1") {
          //   let inventoryProductData = {
          //     inventoryId: 0,
          //     isDeleted: 0,
          //     lastUpdated: getUTCDate(),
          //     notes: data.notes,
          //     productId: response.data.data.productId,
          //     purchasingPrice: parseInt(data.purchasingPrice),
          //     quantity: Number(data.quantity),
          //     productName:data.productName
          //   };
          //   dispatch(addInventoryProduct(inventoryProductData))
          // }
          dispatch(stopProductLoading());
          productCreationSuccess();
          dispatch(addProductSuccess());
          dispatch(getProductList(1, 5, ""));

          taxValue &&
            dispatch(
              addTaxToMap(
                response?.data?.data?.productId,
                taxValue.taxId,
                STORE_Id
              )
            );

          console.log("discountvalue ", discountvalue);

          discountvalue &&
            dispatch(
              addDiscountToMap(
                response?.data?.data?.productId,
                discountvalue.discountId,
                STORE_Id
              )
            );

          productUploadImageHandler(response?.data?.data?.productId);

          // console.log("imageFileArray ", imageFileArray);
          //   dispatch(
          //   postProductImage(
          //     response?.data?.productId,
          //     imageFileArray,
          //     defaultImgIndex,
          //     cognitoUserName,
          //     storeName
          //   )
          // );
        }
      })
      .catch((err) => {
        console.log("err ", err);
        dispatch(stopProductLoading());
        // const errorMsg = err && apiFailureResponse(err?.message);
        // console.log("errorMsg ", errorMsg);
        // setApiError(errorMsg)

        dispatch(addProductError("someting went wrong"));

        console.log("err", err?.response?.data?.message);
        limitExceededPopup && limitExceededPopup(err?.response?.data?.message);
      });
  };
};

// // product image upload after product created
// export const postProductImage = (
//   prodId,
//   imageFileArray,
//   defaultImgIndex,
//   cognitoUserName,
//   storeName
// ) => {
//   return (dispatch) => {

//     // console.log("Image API Chala")
//     // console.log("Image prodId ", prodId)
//     // console.log("Image imageFileArray ", imageFileArray)

//       for (let i = 0; i <= imageFileArray.length; i++) {
//         let data = new FormData();
//         let imageFile = imageFileArray[i];
//         console.log("image api INDEX ", i);
//         console.log("defaultImgIndex ", defaultImgIndex);
//         console.log("images ", imageFile);
//         console.log("imageFile name ", imageFile?.name);
//         data.append("file", imageFile, imageFile?.name);
//         // data.append("file", files, files.name);
//         data.append("storeId", STORE_Id);
//         data.append("imageId", 0);
//         data.append("productId", prodId);
//         data.append("storeName", storeName);
//         defaultImgIndex === i
//           ? data.append("isProductDefaultImage", 1)
//           : data.append("isProductDefaultImage", 0);

//         data.append("isStoreImage", 0);
//         data.append("userName", cognitoUserName);
//         data.append("updateImageName", "");
//         let userToken = localStorage.getItem("userToken");
//         const config = {
//           timeout: 10000,
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: "Bearer " + userToken,
//           },
//         };

//         axios
//           .post(SERVER_URL + UPLOAD_PROD_IMG, data, config)
//           .then((response) => {
//             // var res = JSON.stringify(data);
//             if (i === imageFileArray.length - 1) {
//               console.log("Response Image : ", response);
//             }
//           })
//           .catch((err) => {
//             console.log("Error index: " + err);
//           });
//       }

//   };
// };

// Get product list
export const getProductList = (pageNumber, pageSize, searchQuery) => {
  return (dispatch) => {
    dispatch(getAllProductLoading());
    let config = apiConfig(
      `${SERVER_URL}${GET_PRODUCT_DATA}?lastUpdated=${0}&pageNumber=${pageNumber ? pageNumber : 0
      }&pageSize=${pageSize ? pageSize : 0
      }&search=${searchQuery}&storeId=${STORE_Id}`,
      "GET"
    );

    axios(config)
      .then((response) => {
        // console.log("response ", response);
        if (response.status === 200) {
          console.log("responseProduct ", response?.data);
          dispatch(stopProductLoading());
          dispatch(getAllProduct(response.data));
        }
      })
      .catch((err) => {
        dispatch(stopProductLoading());
        dispatch(getAllProductError("someting went wrong"));
      });
  };
};

// Delete product
export const deleteSignleProduct = (
  deleteData,
  deleteMappedTax,
  productDeleteSuccess,
  apiFailureResponse,
  setApiError
) => {
  return (dispatch) => {
    let config = apiConfig(
      `${SERVER_URL}product/upsertProduct`,
      "POST",
      deleteData
    );

    axios(config)
      .then((response) => {
        console.log("response ", response);
        if (response.status === 200) {
          deleteMappedTax();
          productDeleteSuccess();
          dispatch(getProductList(1, 5, ""));
        }
      })
      .catch((err) => {
        console.log("err ", err);
        const errorMsg = err && apiFailureResponse(err?.message);
        console.log("errorMsg ", errorMsg);
        setApiError(errorMsg);
        // dispatch(getAllProductError("someting went wrong"));
      });
  };
};

export const getSingleProductData = (prodId) => {
  return (dispatch) => {
    dispatch(getSingleProductLoading());
    console.log("prodId ", prodId);
    let config = apiConfig(
      `${SERVER_URL}product/getProductPage?productId=${prodId}`,
      "GET"
    );
    console.log("config ", config);

    axios(config)
      .then((response) => {
        console.log("response ", response);
        dispatch(getSingleProduct(response.data));
      })
      .catch((err) => {
        console.log("err ", err);
        dispatch(getSingleProductError("someting went wrong"));
      });
  };
};

export const setProductDefaultImg = (data, cognitoUserName) => {
  return (dispatch) => {
    dispatch(setProductDefaultImgLoading());

    let config = apiConfig(
      `${SERVER_URL}${UPDATE_DEFAULT_IMAGE}?imageId=${data?.imageId}&productId=${data?.productId}&userName=${cognitoUserName}`,
      "POST"
    );

    axios(config)
      .then((response) => {
        console.log("response default image ", response);
        if (response.status === 200) {
          // window.location.reload()
          dispatch(setProductDefaultImage());
        }
      })
      .catch((err) => {
        console.log("err default image ", err);
        dispatch(setProductDefaultImgLoading());
      });
  };
};

export const editProduct = (prodId) => {
  return (dispatch) => {
    dispatch(getSingleProductLoading());
    console.log("prodId ", prodId);
    let config = apiConfig(
      `${SERVER_URL}product/getProductPage?productId=${prodId}`,
      "GET"
    );
    console.log("config ", config);

    axios(config)
      .then((response) => {
        console.log("response ", response);
        dispatch(getSingleProduct(response.data));
      })
      .catch((err) => {
        console.log("err ", err);
        dispatch(getSingleProductError("someting went wrong"));
      });
  };
};

export const getProductListOnlyUsingAxios = async () => {
  try {
    let config = apiConfig(`${SERVER_URL}${GET_PRODUCT_DATA}`, "GET");

    const response = await axios(config);
    if (response?.status === 200) {
      return response?.data;
    }
  } catch (error) {
    console.log("error ", error);
  }
};

export const getProuductByCategoryId = (
  categoryId,
  isAscending,
  pageNumber,
  pageSize,
  searchQuery
) => {
  return (dispatch) => {
    console.log("categoryId.. ", categoryId);
    dispatch(addProductLoading());
    let config = apiConfig(
      `${SERVER_URL}${PRODUCT_LIST_BY_CATEGORY_ID}categoryId=${categoryId}&isAscending=${isAscending}&pageNumber=${pageNumber}&pageSize=${pageSize}&search=${searchQuery}&&storeId=${STORE_Id}`,
      "GET"
    );

    axios(config)
      .then((responese) => {
        console.log("responeseProductsByCategoryId ", responese?.data?.data);
        if (responese.status === 200) {
          dispatch(stopProductLoading());
          dispatch(getAllProduct(responese?.data?.data));
        }
      })
      .catch((err) => {
        console.log(err);
        dispatch(stopProductLoading());
        dispatch(getAllProductError("someting went wrong"));
      });
  };
};

export const getTopSellingProduct = () => {
  return (dispatch) => {
    dispatch(addProductLoading());
    let config = apiConfig(`${SERVER_URL}${GET_TOP_SELLING_PRODUCT}`, "GET");

    axios(config)
      .then((responese) => {
        console.log("responeseTopSellingProduct ", responese);
        if (responese.status === 200) {
          dispatch(stopProductLoading());
          dispatch(topSellingProductData(responese?.data));
        }
      })
      .catch((err) => {
        console.log(err);
        dispatch(stopProductLoading());
        dispatch(getAllProductError("someting went wrong"));
      });
  };
};

export const getProductExcelSheet = () => {
  return (dispatch) => {
    dispatch(addProductLoading());
    let config = apiConfig(`${SERVER_URL}${GET_PRODUCT_EXCEL_SHEET}?storeId=${STORE_Id}`, "GET");

    axios(config)
      .then((responese) => {
        console.log("responseProductExcelSheet ", responese);
        if (responese.status === 200) {
          dispatch(productExcelSheetData(responese?.data))
          dispatch(stopProductLoading());

        }
      })
      .catch((err) => {
        console.log(err);
        dispatch(stopProductLoading());
        dispatch(getAllProductError("someting went wrong"));
      });
  };
};




