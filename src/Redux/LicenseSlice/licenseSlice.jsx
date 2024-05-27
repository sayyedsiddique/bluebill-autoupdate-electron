import { createSlice } from "@reduxjs/toolkit";
import { apiConfig } from "../../utils/constantFunctions";
import {
  ADD_LICENSE,
  CREATE_MACHINE,
  CURRENT_UTC_TIME,
  GENERATE_LICENSE,
  GENERATE_TOKEN,
  GET_LICENSE_DETAILS,
  GET_MACHINE_DETAILS,
  KeyGenAccountId,
  KeyGenPolicyIdForTrial,
  KeyGenUserId,
  SERVER_URL,
  STORE_Id,
  VALIDATE_LICENSE_KEY,
  policyTypeFree,
  policyTypeLifeTime,
} from "../../Containts/Values";
import axios from "axios";
import { updateSubscriptionPlanDetails } from "../SubscriptionPlanSlice/SubscriptionPlanSlice";

const licenseSlice = createSlice({
  name: "license",
  initialState: {
    licenseDetails: null,
    tokenDetails: null,
    currentTime: null,
    validateLicenseDetails: null,
    machineDetails: null,
    loading: false,
    generateLicenseLoading: false,
    machineCreationLaoding: false,
    storingLicenseDetailsLoading: false,
    error: null,
  },
  reducers: {
    startLoading(state) {
      state.loading = true;
    },
    startGenerateLicenseLoading(state){
      state.generateLicenseLoading = true;
    },
    startMachineCreationLoading(state){
      state.machineCreationLaoding = true;
    },
    startStoringLicenseDetailsLoading(state){
      state.storingLicenseDetailsLoading = true;
    },
    getLicenseDetailsData(state, action) {
      state.loading = false;
      state.licenseDetails = action.payload;
    },
    getTokenDetailsData(state, action) {
      state.loading = false;
      state.tokenDetails = action.payload;
    },
    getCurrentTimeData(state, action) {
      state.loading = false;
      state.currentTime = action.payload;
    },
    getValidateLicenseDetails(state, action) {
      state.loading = false;
      state.validateLicenseDetails = action.payload;
    },
    getMachineDetailsData(state, action) {
      state.loading = false;
      state.machineDetails = action.payload;
    },
    getLicenseError(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    stopLoading(state) {
      state.loading = false;
    },
    stopGenerateLicenseLoading(state){
      state.generateLicenseLoading = false;
    },
    stopMachineCreationLoading(state){
      state.machineCreationLaoding = false;
    },
    stopStoringLicenseDetailsLoading(state){
      state.storingLicenseDetailsLoading = false;
    },
  },
});

export const {
  startLoading,
  startGenerateLicenseLoading,
  startMachineCreationLoading,
  startStoringLicenseDetailsLoading,
  getLicenseDetailsData,
  getTokenDetailsData,
  getCurrentTimeData,
  getValidateLicenseDetails,
  getMachineDetailsData,
  getLicenseError,
  stopLoading,
  stopGenerateLicenseLoading,
  stopMachineCreationLoading,
  stopStoringLicenseDetailsLoading
} = licenseSlice.actions;
export const licenseReducer = licenseSlice.reducer;

// Generate Token Api Method
export const generateToken = (storeId, planName, fingerPrinter, setProcessingModalOpen) => {
  return (dispatch) => {
    dispatch(startLoading());

    let config = apiConfig(`${SERVER_URL}${GENERATE_TOKEN}`, "GET");

    axios(config)
      .then((response) => {
        console.log(
          "TokenResponse... ",
          response?.data?.data?.attributes?.token
        );
        if (response?.status === 200) {
          response?.data && dispatch(getTokenDetailsData(response?.data));
          response?.data?.data?.attributes?.token &&
            dispatch(
              generateLicense(
                response?.data?.data?.attributes?.token,
                storeId,
                planName,
                fingerPrinter,
                setProcessingModalOpen
              )
            );
          // Return the token or other relevant information
          dispatch(stopLoading());
          // return response?.data;
        }
      })
      .catch((error) => {
        console.log("error", error);
        dispatch(getLicenseError(error));
      });
  };
};

// Generate toekn without calling any other api
export const generateTokenOnly = () => {
  return (dispatch) => {
    dispatch(startLoading());

    let config = apiConfig(`${SERVER_URL}${GENERATE_TOKEN}`, "GET");

    axios(config)
      .then((response) => {
        console.log("TokenResponse... ", response?.data);
        if (response?.status === 200) {
          response?.data && dispatch(getTokenDetailsData(response?.data));
          response?.data?.data?.attributes?.token &&
            localStorage.setItem(
              "keyGenToken",
              response?.data?.data?.attributes?.token
            );
          dispatch(stopLoading());
          // return response?.data;
        }
      })
      .catch((error) => {
        console.log("error", error);
        dispatch(getLicenseError(error));
      });
  };
};

// Generate License Api Method
export const generateLicense = (token, storeId, planName, fingerPrinter, setProcessingModalOpen) => {
  return (dispatch) => {
    const deviceFingerPrint = window.getDeviceFingerPrint;
    dispatch(startGenerateLicenseLoading());
    console.log("planName... ", planName);

    const licensePayload = {
      // account: KeyGenAccountId,
      policyType: planName,
      token: `${token}`,
      userId: KeyGenUserId,
    };

    let config = apiConfig(
      `${SERVER_URL}${GENERATE_LICENSE}`,
      "POST",
      licensePayload
    );

    axios(config)
      .then((response) => {
        console.log("LicenseResponse... ", response);
        dispatch(stopGenerateLicenseLoading())
        if (response?.status === 200) {
          // Add license on our server api call

          const createMachinePayload = {
            fingerprint: fingerPrinter?.fingerPrint,
            // fingerprint: "210b04a673a4fb70a6b03a147661cc568c7813229cc2c065eb28f761aa6f2ee2",
            licenseId: response?.data?.data?.id,
            licenseType: "licenses",
            name: fingerPrinter?.name,
            // name: "mac",
            platform: fingerPrinter?.platform,
            // platform: "mac",
            token: `${token}`,
          };
          if (planName === "free") {
            dispatch(
              addLicensesOnOurServer(
                response?.data?.data?.attributes,
                storeId,
                response?.data?.data?.id,
                "",
                setProcessingModalOpen
              )
            );
          } else {
            // Creating machine for license
            dispatch(
              postCreateMachine(
                createMachinePayload,
                response?.data?.data?.attributes,
                storeId,
                setProcessingModalOpen
              )
            );
          }
          dispatch(getLicenseDetailsData(response?.data?.data));
          // return response?.data;
        }
      })
      .catch((error) => {
        console.log("error", error);
        dispatch(getLicenseError(error));
        dispatch(stopGenerateLicenseLoading())
      });
  };
};

// Create machine on keygen website
export const postCreateMachine = (payload, addLicensePayload, storeId, setProcessingModalOpen) => {
  return (dispatch) => {
    dispatch(startMachineCreationLoading());

    let config = apiConfig(`${SERVER_URL}${CREATE_MACHINE}`, "POST", payload);

    axios(config)
      .then((response) => {
        console.log("createMachine... ", response?.data?.data?.id);
        if (response?.status === 200) {
          dispatch(
            addLicensesOnOurServer(
              addLicensePayload,
              storeId,
              payload?.licenseId,
              response?.data?.data?.id,
              setProcessingModalOpen
            )
          );
          dispatch(stopMachineCreationLoading());
        }
      })
      .catch((err) => {
        console.log("err", err);
        dispatch(getLicenseError(err));
        dispatch(stopMachineCreationLoading());
      });
  };
};

// add license on our server
export const addLicensesOnOurServer = (
  payload,
  storeId,
  licenseId,
  machineId,
  setProcessingModalOpen
) => {
  console.log("AddLicensepayload ", payload);
  return (dispatch) => {
    dispatch(startStoringLicenseDetailsLoading());

    // console.log("storeId... ", storeId)

    const addLicensePayload = {
      created: payload?.created,
      expiry: payload?.expiry ? payload?.expiry : "",
      lastValidated: payload?.lastValidated ? payload?.lastValidated : "",
      licenseId: licenseId,
      licenseName: payload?.name ? payload?.name : "",
      licensekey: payload?.key,
      maxMachines: payload?.maxMachines,
      machineId: machineId,
      isOfflineOnly: payload?.name === "lifeTime" ? 1 : 0,
      status: payload?.status,
      storeId: Number(storeId),
      suspended: payload?.suspended === false ? 0 : 1,
      updated: payload?.updated,
      uses: payload?.uses,
    };

    let config = apiConfig(
      `${SERVER_URL}${ADD_LICENSE}`,
      "POST",
      addLicensePayload
    );

    axios(config)
      .then((response) => {
        console.log("AddLicenseResponse... ", response);

        if (response?.status === 200) {
          dispatch(getLicenseDetailsData(response?.data));
          dispatch(
            updateSubscriptionPlanDetails({
              planId: payload?.name === "free" ? 1 : 2,
              disabled: true,
            },setProcessingModalOpen)
          );
          dispatch(stopStoringLicenseDetailsLoading());
          window.location.reload()
          return response?.data;
        }
      })
      .catch((error) => {
        console.log("error", error);
        dispatch(getLicenseError(error));
        dispatch(stopStoringLicenseDetailsLoading());
      });
  };
};

// Validating License Key
export const validateLicenseKey = (payload) => {
  return async (dispatch) => {
    console.log("validateLicenseKeyPayload... ", payload);
    try {
      dispatch(startLoading());

      let config = apiConfig(
        `${SERVER_URL}${VALIDATE_LICENSE_KEY}`,
        "POST",
        payload
      );

      const response = await axios(config);
      console.log(
        "validateLicenseResponse... ",
        response?.data?.data?.attributes
      );
      if (response?.status === 200) {
        response?.data?.data?.attributes &&
          dispatch(getValidateLicenseDetails(response?.data?.data?.attributes));
        dispatch(stopLoading());
        return response;
      }
    } catch (error) {
      console.log("error", error);
      dispatch(getLicenseError(error));
    }
  };
};

// Get license details
export const getLicenseDetails = (storeId) => {
  return async (dispatch) => {
    try {
      dispatch(startLoading());

      let config = apiConfig(
        `${SERVER_URL}${GET_LICENSE_DETAILS}?storeId=${storeId}`,
        "GET"
      );

      const response = await axios(config);
      console.log("GetLicenseResponse... ", response?.data?.data);
      if (response?.status === 200) {
        dispatch(getLicenseDetailsData(response?.data?.data));
        dispatch(stopLoading());
      }
    } catch (error) {
      console.log("error", error);
      dispatch(getLicenseError(error));
    }
  };
};

export const getCurrenUTCTime = () => {
  return (dispatch) => {
    dispatch(startLoading());

    let config = apiConfig(`${SERVER_URL}${CURRENT_UTC_TIME}`, "GET");

    axios(config)
      .then((response) => {
        console.log("GetTimeResponse... ", response?.data);
        if (response?.status === 200) {
          dispatch(getCurrentTimeData(response?.data));
          dispatch(stopLoading());
        }
      })
      .catch((err) => {
        console.log("err", err);
        dispatch(getLicenseError(err));
      });
  };
};

// Get license details
export const getMachineDetails = (machineId) => {
  return async (dispatch) => {
    try {
      dispatch(startLoading());

      let config = apiConfig(
        `${SERVER_URL}${GET_MACHINE_DETAILS}?id=${machineId}`,
        "GET"
      );

      const response = await axios(config);
      // console.log("GetMachineResponse... ", response?.data?.data);
      if (response?.status === 200) {
        dispatch(getMachineDetailsData(response?.data?.data));
        dispatch(stopLoading());
      }
    } catch (error) {
      console.log("error", error);
      dispatch(getLicenseError(error));
    }
  };
};
