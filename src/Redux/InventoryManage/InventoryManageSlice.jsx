import { createSlice } from "@reduxjs/toolkit";
import { apiConfig } from "../../utils/constantFunctions";
import {
  ADD_INVENTORY_PRODUCT,
  DELETE_INVENTORY_BY_PRODUCT_ID,
  GET_INVENTORTY_ALL_PRODUCTS,
  GET_INVENTORT_ALLPRODUCTS,
  GET_INVENTORY_BY_PRODUCT_ID,
  SERVER_URL,
} from "../../Containts/Values";
import axios from "axios";
import { getProductList } from "../Product/productSlice";


const initialInventoryState = {
  inventoryData: [],
  loading: false,
  error: null,
};




const InventoryManageSlice = createSlice({
  name: "InventoryManage",
  initialState: initialInventoryState,
  reducers: {
    // getLoading(state) {
    //   state.loading = true;
    // },
    getInventoryAllProduct(state, action) {
      state.inventoryData = action.payload;
      state.loading = false;
    },

    // getLoading(state, action) {
    //   state.loading = action.payload;
    //   state.loading = true;
    // },
    getError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});


export const { getLoading, getInventoryAllProduct, getError } = InventoryManageSlice.actions;
export const InventoryManageReducer = InventoryManageSlice.reducer


export const getInventoryAllProductList = () => {
  return (dispatch) => {
    // dispatch(setLoading());
    let config = apiConfig(
      `${SERVER_URL}${GET_INVENTORTY_ALL_PRODUCTS}`,
      "GET"
    );

    axios(config)
      .then((response) => {
        console.log("response getInventory ", response?.data);
        if (response.status === 200) {
          dispatch(getInventoryAllProduct(response?.data));
        }
      })
      .catch((err) => {
        console.log("err", err);

      });
  };
};


export const addInventoryProduct = (inventoryProductData, isEdit, handleUpdateSuccess) => {
  console.log("productId", inventoryProductData);
  return (dispatch) => {
    // dispatch(setLoading());
    let config = apiConfig(`${SERVER_URL}${ADD_INVENTORY_PRODUCT}`, "POST", inventoryProductData);

    axios(config)
      .then((response) => {
        console.log("response addInventory ", response?.data);
        if (response.status === 200) {
          if (isEdit) {
            dispatch(getInventoryByProductId(inventoryProductData.productId));
            handleUpdateSuccess()
          } else {
            dispatch(getInventoryAllProductList(response?.data));
            dispatch(getProductList(1, 5, ""));
          }

        }
      })
      .catch((err) => {
        console.log("err", err);

      });
  };
};





export const getInventoryByProductId = (productId) => {
  console.log("productId007", productId);

  return (dispatch) => {
    // dispatch(setLoading());
    let config = apiConfig(`${SERVER_URL}${GET_INVENTORY_BY_PRODUCT_ID}productId=${productId}`, "GET");

    axios(config)
      .then((response) => {
        console.log("response getInventoryByProductId ", response?.data);
        if (response.status === 200) {
          dispatch(getInventoryAllProduct(response?.data));
        }
      })
      .catch((err) => {
        console.log("err", err);

      });
  };
};



export const deleteInventoryByProductId = (
  postData,
  productDeleteSuccess,
  productId

) => {
  console.log("postData", postData);
  return (dispatch) => {
    let config = apiConfig(`${SERVER_URL}${DELETE_INVENTORY_BY_PRODUCT_ID}productId=${productId}`, "POST", postData);

    axios(config)
      .then((response) => {
        console.log("response addInventory ", response?.data);
        if (response.status === 200) {
          productDeleteSuccess();
          dispatch(getInventoryAllProductList(response?.data));
        }
      })
      .catch((err) => {
        console.log("err", err);

      });
  };
};







// export const updatedInventoryProduct = (
//   postData,
//   productDeleteSuccess,
//   setPopUpMessage

// ) => {
//   console.log("postData", postData);
//   return (dispatch) => {
//     let config = apiConfig(`${SERVER_URL}${ADD_INVENTORY_PRODUCT}`, "POST", postData);

//     axios(config)
//       .then((response) => {
//         console.log("response addInventory ", response?.data);
//         if (response.status === 200) {
//           setPopUpMessage("Updated sucess")
//           productDeleteSuccess();
//           dispatch(getInventoryAllProductList(response?.data));
//         }
//       })
//       .catch((err) => {
//         console.log("err", err);

//       });
//   };
// };