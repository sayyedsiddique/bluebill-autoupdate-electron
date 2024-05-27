import { createSlice } from "@reduxjs/toolkit";
import { apiConfig, apiConfigUserToken } from "../../utils/constantFunctions";
import {
  GENERATE_LICENSE,
  GENERATE_TOKEN,
  GET_ALL_COUNTRIES,
  INIT,
  SERVER_URL,
  UPLOAD_PROD_IMG,
} from "../../Containts/Values";
import { getStoreInfo } from "../authSlice/authSlice";
import axios from "axios";
import { generateLicense, generateToken } from "../LicenseSlice/licenseSlice";

const initialStoreState = {
  loading: false,
  error: "",
  countires: [],
};

const storeCreatorSlice = createSlice({
  name: "storeCreator",
  initialState: initialStoreState,
  reducers: {
    getStoreLoading(state, action) {
      state.loading = action.payload;
    },
    getError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    getCountriesData(state, action) {
      state.countires = action.payload;
      state.loading = false;
    },
  },
});

export const { getStoreLoading, getError, getCountriesData } =
  storeCreatorSlice.actions;
export const storeCreatorReducer = storeCreatorSlice.reducer;

export const createStore = (PostData, storeImageFile, handleResopnse) => {
  return (dispatch) => {
    let userToken = localStorage.getItem("tmpuserToken");
    console.log("userToken",);
    dispatch(getStoreLoading(true));
    let config = apiConfigUserToken(`${SERVER_URL}${INIT}`, "POST", PostData,userToken);
    // try {
    //   dispatch(getStoreLoading(true));
    //   let config = apiConfigUserToken(
    //     `${SERVER_URL}${INIT}`,
    //     "POST",
    //     PostData,
    //     userToken
    //   );

    //   const storeResponse = await axios(config);
    //   console.log("StoreResponse ", storeResponse?.data?.storeId);

    //   if (storeResponse?.data?.storeId) {
    //     // Wait for the generateToken action to complete and get its response
    //     // const tokenResponse = await dispatch(generateToken());
    //     let config = apiConfig(`${SERVER_URL}${GENERATE_TOKEN}`, "GET");

    //     const tokenResponse = await axios(config);
    //     console.log("Token Response:", tokenResponse);
    //     // This if consdition for calling genarate license for store
    //     if (tokenResponse?.status === 200) {
    //       console.log("WeGotTheTokenForLicense");
    //       const licensePayload = {
    //         account: "e0076663-81d8-4800-80c6-9f41a3364162",
    //         policyId: "1809a24a-061d-42c1-b94d-5deb3d67aa52",
    //         token: `${tokenResponse?.data?.attributes?.token}`,
    //         userId: "fba062e1-5192-439e-8e5d-b740eda57bf2",
    //       };
    //       // const licenseResponse = await dispatch(
    //       //   generateLicense(licensePayload)
    //       // );
    //       let config = apiConfig(
    //         `${SERVER_URL}${GENERATE_LICENSE}`,
    //         "POST",
    //         licensePayload
    //       );

    //       const licenseResponse = await axios(config);

    //       console.log("licenseResponse... ", licenseResponse);
    //       if (licenseResponse) {
    //       }
    //     }

    //     // This if consdition for calling store image api
    //     if (storeResponse?.data !== null && storeResponse?.data !== undefined) {
    //       if (storeImageFile.length !== 0) {
    //         console.log("response  ", storeImageFile.length);
    //         let data = new FormData();
    //         let files = storeImageFile[0];

    //         data.append("file", files);
    //         data.append("storeId", storeResponse?.data.storeId);
    //         data.append("imageId", 0);
    //         data.append("productId", 0);
    //         data.append(
    //           "storeName",
    //           storeResponse?.data && storeResponse?.data?.stores[0]?.storeName
    //         );
    //         data.append("isProductDefaultImage", 0);
    //         data.append("isStoreImage", 1);
    //         data.append("userName", storeResponse?.data.userName);
    //         data.append("updateImageName", "");

    //         dispatch(
    //           uploadeImageTOServer(
    //             data,
    //             userToken,
    //             storeResponse?.data,
    //             handleResopnse
    //           )
    //         );
    //       } else {
    //         dispatch(getStoreLoading(false));
    //         dispatch(
    //           getStoreInfo(
    //             userToken,
    //             storeResponse.data.storeId,
    //             handleResopnse,
    //             storeResponse.data
    //           )
    //         );
    //       }
    //     }
    //   }
    // } catch (error) {
    //   console.log(error);
    //   dispatch(getStoreLoading(false));
    // }

    // Old way for creating store
    axios(config)
      .then((response) => {
        console.log("StoreResponse ", response?.data);
        // dispatch(generateToken());
        if (response.data?.storeId) {
          // Generating token for license
          console.log("StoreCreated");
          console.log("storeImageFile... ", storeImageFile)

          if (response?.data !== null && response?.data !== undefined) {
            if (storeImageFile.length !== 0) {
              console.log("StoreImageIfChala  ", storeImageFile.length);
              let data = new FormData();
              let files = storeImageFile[0];

              data.append("file", files);
              data.append("storeId", response?.data.storeId);
              data.append("imageId", 0);
              data.append("productId", 0);
              data.append(
                "storeName",
                response?.data && response?.data?.stores[0]?.storeName
              );
              data.append("isProductDefaultImage", 0);
              data.append("isStoreImage", 1);
              data.append("userName", response?.data.userName);
              data.append("updateImageName", "");

              dispatch(
                uploadeImageTOServer(
                  data,
                  userToken,
                  response?.data,
                  handleResopnse
                )
              );
            } else {
              console.log("StoreImageElseChala  ", storeImageFile.length);
              dispatch(getStoreLoading(false));
              dispatch(
                getStoreInfo(
                  userToken,
                  response.data.storeId,
                  handleResopnse,
                  response.data
                )
              );
            }
          }
        }
      })
      .catch((err) => {
        console.log(err);
        dispatch(getStoreLoading(false));
      });
  };
};

export const uploadeImageTOServer = (
  data,
  userToken,
  initResponse,
  handleResopnse
) => {
  return (dispatch) => {
    let config = apiConfigUserToken(
      `${SERVER_URL}${UPLOAD_PROD_IMG}`,
      "POST",
      data,
      userToken
    );
    axios(config)
      .then((response) => {
        if (response.status === 200) {
          dispatch(getStoreLoading(false));
          dispatch(
            getStoreInfo(
              userToken,
              initResponse?.storeId,
              handleResopnse,
              initResponse
            )
          );
        }
      })
      .catch((error) => {
        console.log("Error: ", error);
        dispatch(getStoreLoading(false));
        alert("error", error.message);
      });
  };
};

export const getAllCountries = () => {
  return (dispatch) => {

    axios.get("http://ezygen-technology-bluebill-prod-env.ap-south-1.elasticbeanstalk.com/ezygentechnology/countries/getAllCountries")
      .then((response) => {
        console.log("CountryResponse... ", response?.data);
        if (response.status === 200) {
          dispatch(getStoreLoading(false));
          dispatch(getCountriesData(response?.data?.data));
        }
      })
      .catch((error) => {
        console.log("Error: ", error);
        dispatch(getStoreLoading(false));
        alert("error", error.message);
      });
  };
};

//   const handleUploadImg = async (response?.data, userToken,storeImageFile,handleResopnse) => {
//     dispatch(getStoreLoading(true))
//     let data = new FormData();

//     let files = storeImageFile[0];
//     console.log(files);
//     console.log("response?.data :", response?.data)

//     data.append("file", files, files.name);
//     data.append("storeId", response?.data.storeId);
//     data.append("imageId", 0);
//     data.append("productId", 0);
//     data.append("storeName", response?.data && response?.data?.stores[0]?.storeName);
//     data.append("isProductDefaultImage", 0);
//     data.append("isStoreImage", 1);
//     data.append("userName", response?.data.userName);
//     data.append("updateImageName", "");

//     console.log("upload from phone" + JSON.stringify(data));
//     uploadeImageTOServer(data, userToken, response?.data);
//   };

//   const uploadeImageTOServer = async (postData, userToken, response?.data) => {
//     let config = apiConfigUserToken(
//       `${SERVER_URL}${UPLOAD_PROD_IMG}`,
//       "POST",
//       postData,
//       userToken
//     );

//       axios(config).then((response) => {
//         console.log(response);
//         dispatch(
//           getStoreInfo(userToken, response?.data.storeId, handleResopnse, response?.data)
//         );
//       })
//     .catch ((error) =>{
//       console.log("Error: ", error);
//       alert("error", error.message);
//     })
//   };

//   const callPostApi = async (PostData) => {
//     let userToken = await localStorage.getItem("tmpuserToken");

//     console.log(userToken);
//     setIsLoaded(true);
//     try {
//       const config = {
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//           Authorization: "Bearer " + userToken,
//         },
//       };
//       axios
//         .post(SERVER_URL + INIT, PostData, config)
//         .then(({ data }) => {
//           setIsLoaded(false); // set loading status to false
//           if (data !== null && data !== undefined) {
//             if (storeImageFile !== null) {
//               handleUploadImg(data, userToken);
//             } else {
//               dispatch(
//                 getStoreInfo(userToken, data.storeId, handleResopnse, data)
//               );
//             }
//             // checkStoreResponse(data, userToken);
//           }
//         })
//         .catch((error) => {
//           console.log(error);
//           setIsLoaded(false); // set loading status to false
//         });
//     } catch (error) {
//       console.log(error);
//       setIsLoaded(false); // set loading status to false
//     }
//   };
