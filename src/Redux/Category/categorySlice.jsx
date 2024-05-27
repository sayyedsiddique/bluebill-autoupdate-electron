import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import {
  CATEGORY_IMAGE_UPLOAD,
  GET_CATEGORY,
  GET_UNIT,
  SERVER_URL,
  STORE_Id,
  UPSERT_CATEGORY,
} from "../../Containts/Values";
import { apiConfig } from "../../utils/constantFunctions";
import Swal from "sweetalert2";

const initialUnitState = {
  categoriesData: [],
  loading: false,
  error: null,
};

export const categorySlice = createSlice({
  name: "category",
  initialState: initialUnitState,
  reducers: {
    getcategoryLoading(state) {
      state.loading = true;
    },
    getcategories(state, action) {
      state.categoriesData = action.payload;
      state.loading = false;
    },
    getcategoryError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    categoryLoadingStop(state) {
      state.loading = false;
    },
  },
});

export const {
  getcategoryLoading,
  getcategories,
  getcategoryError,
  categoryLoadingStop,
} = categorySlice.actions;
export const categoryReducer = categorySlice.reducer;

export const getCategoryList = (pageNumber, pageSize, searchQuery) => {
  return (dispatch) => {
    dispatch(getcategoryLoading());
    let config = apiConfig(
      `${SERVER_URL}${GET_CATEGORY}?lastUpdated=${0}&pageNumber=${pageNumber ? pageNumber : 0}&pageSize=${pageSize ? pageSize : 0}&search=${searchQuery}&storeId=${STORE_Id}`,
      "GET"
    );

    axios(config)
      .then((responese) => {
        console.log("responeseCategory ", responese);
        if (responese.status === 200) {
          dispatch(getcategories(responese?.data));
        }
      })
      .catch((err) => {
        console.log(err);
        dispatch(getcategoryError("someting went wrong"));
      });
  };
};

// export const addCategory=(postData,handlePopupClose)=>{
//   return(dispatch)=>{
//     let config = apiConfig(`${SERVER_URL}${UPSERT_CATEGORY}`, "POST",postData);
//     axios(config)
//     .then(({ data }) => {
//       console.log(data);
//       dispatch(getCategoryList())
//       handlePopupClose()
//     });
//   }
// }
export const getCategoryListOnlyUsingAxios = async () => {
  try {
    let config = apiConfig(`${SERVER_URL}${GET_CATEGORY}`, "GET");
    let response = await axios(config);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.log(error);
    throw error; // Re-throw the error to be handled elsewhere if needed
  }
};

export const addCategory = (
  postData,
  categoryCreationSuccess,
  setPopUpMessage,
  PopUpMessegeHandler
) => {
  return (dispatch) => {
    dispatch(getcategoryLoading());

    let config = apiConfig(`${SERVER_URL}${UPSERT_CATEGORY}`, "POST", postData);

    axios(config)
      .then((response) => {
        dispatch(categoryLoadingStop());
        console.log("AddCategoryResponse... ", response?.data);
        if (response?.status === 200) {
          dispatch(getCategoryList(1, 5, ""));
          setPopUpMessage("Category added successfully");
          categoryCreationSuccess();

        }
      })
      .catch((err) => {
        dispatch(categoryLoadingStop());
        console.log("err", err?.response);
        if (err?.response?.status === 417) {
          PopUpMessegeHandler("This name is already exists")
        }
        PopUpMessegeHandler(err?.response?.data?.message);

      });
  };
};

export const updatedCategory = (
  postData,
  categoryCreationSuccess,
  setPopUpMessage
) => {
  return (dispatch) => {
    let config = apiConfig(`${SERVER_URL}${UPSERT_CATEGORY}`, "POST", postData);

    axios(config)
      .then((response) => {
        console.log("AddDiscountResponse... ", response);
        if (response?.status === 200) {
          setPopUpMessage("Category updated successfully");
          categoryCreationSuccess();
          dispatch(getCategoryList(1, 5, ""));
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
};

export const deleteCategory = (
  postData,
  categoryCreationSuccess,
  setPopUpMessage
) => {
  return (dispatch) => {
    let config = apiConfig(`${SERVER_URL}${UPSERT_CATEGORY}`, "POST", postData);

    axios(config)
      .then((response) => {
        console.log("DeleteDiscountResponse... ", response);
        if (response?.status === 200) {
          setPopUpMessage("Category deleted successfully");
          categoryCreationSuccess();
          dispatch(getCategoryList(1, 5, ""));
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
};

export const categoryImageUploadHandler = () => {
  return (dispatch) => {
    let config = apiConfig(`${SERVER_URL}${CATEGORY_IMAGE_UPLOAD}`, "GET");

    axios(config)
      .then((response) => {
        console.log("Response... ", response);
        if (response?.status === 200) {
          dispatch(getCategoryList());
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  };
};
