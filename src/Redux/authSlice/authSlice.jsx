import { createSlice } from "@reduxjs/toolkit";
import { SERVER_URL, storeObjInLocalStrg } from "../../Containts/Values";
import axios from "axios";
import { Auth } from "aws-amplify";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    error: null,
  },
  reducers: {
    authLoading(state, action) {
      state.loading = action.payload;
    },

    authError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { authLoading, authError } = authSlice.actions;
export const authReducer = authSlice.reducer;

// for aws user login
export const signInAuth = (
  userName,
  password,
  handleSetErr,
  handleNavigate,
  handleResopnse
) => {
  return (dispatch) => {
    dispatch(authLoading(true));
    const user = Auth.signIn(userName, password);
    user
      .then((user) => {
        if (user !== null && user !== undefined) {
          console.log("user", user);
          storeObjInLocalStrg("cognitoUserInfo", user);
          localStorage.setItem("loggedIn", true);
          dispatch(getUserInfo(user, handleNavigate, handleResopnse));
        }
      })
      .catch((error) => {
        if (error.message) {
          console.log("error.message", error.message);
          handleSetErr(error.message);
          dispatch(authLoading(false));
          return;
        } else if (error.code === "NotAuthorizedException") {
          handleSetErr("Incorrect username or password.");
          dispatch(authLoading(false));
          return;
        }
      });
  };
};

// for call user info api to find user exist or new
export const getUserInfo = (userData, handleNavigate, handleResopnse) => {
  return (dispatch) => {
    dispatch(authLoading(true));
    const userToken = userData.signInUserSession.idToken.jwtToken;
    const config = {
      timeout: 10000,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
      },
    };

    axios
      .get(`${SERVER_URL}info/123`, config)
      .then((response) => {
        if (response.status === 200) {
          storeObjInLocalStrg("storeUserInfo", response.data);
          dispatch(
            checkUser(response.data, userData, handleNavigate, handleResopnse)
          );
        }
      })
      .catch((error) => {
        console.log("login error ", error);
        dispatch(authLoading(false));
        dispatch(authError());
        window.location.reload();
      });
  };
};

// for check user exist or new
export const checkUser = (
  customerInfo,
  cognitoUserInfo,
  handleNavigate,
  handleResopnse
) => {
  return (dispatch) => {
    if (customerInfo.status === "NEW_USER") {
      console.log("New user hai!");
      localStorage.setItem(
        "tmpuserToken",
        cognitoUserInfo.signInUserSession.idToken.jwtToken
      );
      handleNavigate("/storecreation");
      window.location.reload();
      dispatch(authLoading(false));
    } else if (customerInfo.status === "EXISTING_USER") {
      console.log("User Exist hai!");
      let token = cognitoUserInfo.signInUserSession.idToken.jwtToken;
      let storeId = customerInfo.stores[0]?.storeId;

      localStorage.setItem("userToken", token);
      localStorage.setItem("storeId", storeId);

      dispatch(getStoreInfo(token, storeId, handleResopnse));
    } else {
      window.location.reload();
      alert("Error from checkUser");
    }
  };
};

// for save store data to local storeage
export const getStoreInfo = (token, storeId, handleResopnse, data) => {
  return (dispatch) => {
    const storeDetailsApi = window.storeDetailsApi;

    dispatch(authLoading(true));
    const config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    axios
      .get(`${SERVER_URL}store/getStore?storeId=${storeId}`, config)
      .then((response) => {
        if (response.status === 200) {
          console.log("storeInfoResponse ", response);

          let storeDetails = response.data[0];

          // for sqlite database
          const payload = {
            storeId: storeDetails?.storeId,
            storeName: storeDetails?.storeName,
            storeCategory: storeDetails?.storeCategory,
            mobileNumber: storeDetails?.mobileNumber,
            email: storeDetails?.email,
            city: storeDetails?.city,
            pinCode: storeDetails?.pinCode,
            address: storeDetails?.address,
            latitude: storeDetails?.latitude,
            longitude: storeDetails?.longitude,
            gstNumber: storeDetails?.gstNumber,
            currencyName: storeDetails?.currencyName,
            customerId: storeDetails?.customerId,
            deliveryCharges: storeDetails?.deliveryCharges,
            homeDelivery: storeDetails?.homeDelivery === false ? 1 : 0,
            imageUrl: storeDetails?.imageUrl,
            miniOrderLimit: storeDetails?.miniOrderLimit,
            shopCloseDay: storeDetails?.shopCloseDay,
            shopCloseTime: storeDetails?.shopCloseTime,
            shopOpenTime: storeDetails?.shopOpenTime,
            withInDistance: storeDetails?.withInDistance,
            lastUpdate: storeDetails?.lastUpdate, 
          };

          const sqliteStoreDetails =  storeDetailsApi?.storeDetailsDB?.getStoreDetails(storeDetails?.storeId);
          // console.log("sqliteStoreDetails... ", sqliteStoreDetails)
          // store details storing in sqlite database here
          if(!sqliteStoreDetails){
            storeDetails &&
            storeDetailsApi?.storeDetailsDB?.insertStoreDetails(payload);
          }

          storeObjInLocalStrg("storeInfo", response.data);
          localStorage.setItem("StoreCurrency", response.data[0].country?.currencySymbol);
          dispatch(authLoading(false));
          handleResopnse && handleResopnse(data, token);
        }
      })
      .catch((error) => {
        console.log("login error ", error);
        dispatch(authError());
      });
  };
};

// for aws user Registration

export const SignUpAuth = (
  UserName,
  password,
  isEmail,
  handleSetErr,
  handleSuccess
) => {
  return (dispatch) => {
    dispatch(authLoading(true));

    const signUpResponse = Auth.signUp({
      username: UserName,
      password,
      attributes: {
        email: isEmail ? UserName : "",
        phone_number: isEmail ? "" : UserName,
      },
    });

    signUpResponse
      .then((response) => {
        if (response != null) {
          dispatch(authLoading(false));
          handleSuccess(response.user.username);
        }
      })
      .catch((error) => {
        dispatch(authLoading(false));
        handleSetErr(error.message);
      });
  };
};

// for AWS user forget password
export const ForgotPassAuth = (userName, handleErr, handleSuccess) => {
  return (dispatch) => {
    dispatch(authLoading(true));
    const forgotresponse = Auth.forgotPassword(userName);
    forgotresponse
      .then((response) => {
        dispatch(authLoading(false));
        if (response !== null) {
          handleSuccess(userName);
        }
      })
      .catch((error) => {
        dispatch(authLoading(false));
        handleErr(error.message);
      });
  };
};

// for AWS user to set new password
export const SetNewPasswordAuth = (
  userName,
  verificationCode,
  password,
  handleErr,
  handleSuccess
) => {
  return (dispatch) => {
    dispatch(authLoading(true));
    const newPassResponse = Auth.forgotPasswordSubmit(
      userName,
      verificationCode,
      password
    );
    newPassResponse
      .then((response) => {
        dispatch(authLoading(false));
        if (response !== null) {
          handleSuccess();
        }
      })
      .catch((error) => {
        dispatch(authLoading(false));
        handleErr(error.message);
      });
  };
};

// for AWS new user to resend new otp
export const ReSendOtpAuth = (userName, handleErr, handleSuccess) => {
  return (dispatch) => {
    console.log("userName", userName);
    dispatch(authLoading(true));
    const newPassResponse = Auth.resendSignUp(userName);
    newPassResponse
      .then((response) => {
        dispatch(authLoading(false));
        if (response !== null) {
          handleSuccess(userName);
        }
      })
      .catch((error) => {
        dispatch(authLoading(false));
        handleErr(error.message);
      });
  };
};

// for AWS new user verification
export const ConfirmSignUpAuth = (userName, Otp, handleErr, handleSuccess) => {
  return (dispatch) => {
    dispatch(authLoading(true));
    const newPassResponse = Auth.confirmSignUp(userName, Otp, {
      forceAliasCreation: true,
    });
    // Auth.confirmSignUp(Location?.state && Location?.state?.signUpResponse, Otp, {
    //   forceAliasCreation: true,
    // });
    newPassResponse
      .then((response) => {
        dispatch(authLoading(false));
        if (response !== null) {
          handleSuccess();
        }
      })
      .catch((error) => {
        dispatch(authLoading(false));
        handleErr(error.message);
      });
  };
};
