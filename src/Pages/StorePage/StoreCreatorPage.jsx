import axios from "axios";
import getSymbolFromCurrency from "currency-symbol-map";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";
import {
  INIT,
  retrieveObj,
  SERVER_URL,
  STORE_DEFAULT_IMG,
  STORE_Id,
  UPLOAD_PROD_IMG,
} from "../../Containts/Values";
import MainContentArea from "../MainContentArea/MainContentArea";
import { Button, InputLabel, Step, StepLabel, Stepper } from "@mui/material";
import { useTranslation } from "react-i18next";
import { apiConfigUserToken } from "../../utils/constantFunctions";
import { useDispatch, useSelector } from "react-redux";
import { getStoreInfo } from "../../Redux/authSlice/authSlice";
import { createStore } from "../../Redux/StoreCreatorSlice/storeCreatorSlice";
import { generateToken } from "../../Redux/LicenseSlice/licenseSlice";

const StoreCreatorSummery = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const { addObj, storeObj, getBack, storeImageFile, steps, activeStep } =
    props;
  const [customerInfo, setcustomerInfo] = useState([]);
  const isLoaded = useSelector((state) => state.storeCreator.loading);
  // console.log("addObj",addObj);
  console.log("storeObj", storeObj);

  useEffect(() => {
    retrieveObj("cognitoUserInfo").then((cogniInfo) => {
      if (cogniInfo != null) {
        setcustomerInfo(cogniInfo);
      }
    });
  }, []);

  const OnSubmit = () => {
    let customerObj = {
      customer: {
        name: storeObj.storeName.toLowerCase().replace(/[^A-Z0-9]+/gi, "_"),
        phone: customerInfo.attributes.phone_number
          ? customerInfo.attributes.phone_number
          : addObj.mobileNumber,
        email: customerInfo.attributes.email
          ? customerInfo.attributes.email
          : null,
        schemaName: storeObj.storeName
          .toLowerCase()
          .replace(/[^A-Z0-9]+/gi, "_"),
      },
      store: {
        storeName: storeObj.storeName.trim(),
        storeType: storeObj.storeType.cat_key,
        country: storeObj.countryName.countryCode, // TODO country code
        address: addObj.mapAddress.trim(),
        city: addObj.city.trim(),
        // latitude: addObj.lat ? addObj.lat : "",
        // longitude: addObj.lng ? addObj.lat : "",
        // TODO need to change
        latitude: 18.520430, // it's pune latitude
        longitude: 73.856743, // it's pune longitude
        pinCode: addObj.pinCode.trim(),
        // currencyName: storeObj?.countryName.currencySymbol,
        email: customerInfo.attributes.email
          ? customerInfo.attributes.email
          : null,
        mobileNumber: customerInfo.attributes.phone_number
          ? customerInfo.attributes.phone_number
          : addObj.mobileNumber,
      },
      device: {
        deviceName: "abcd",
      },
      user: {
        userName: customerInfo.username,
        enabled: 1,
        firstName: "",
        lastName: "",
        email: customerInfo.attributes.email
          ? customerInfo.attributes.email
          : null,
        deviceId: 12124,
        authorityId: "1",
      },
    };
    console.log("CustomerObj.........: ", customerObj);
    // callPostApi(customerObj);
    dispatch(createStore(customerObj, storeImageFile, checkStoreResponse));
  };

  // const callPostApi = async (PostData) => {

  //   let userToken = await localStorage.getItem("tmpuserToken");

  //   console.log(userToken);
  //   setIsLoaded(true);
  //   try {
  //     const config = {
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer " + userToken,
  //       },
  //     };
  //     axios
  //       .post(SERVER_URL + INIT, PostData, config)
  //       .then(({ data }) => {
  //         setIsLoaded(false); // set loading status to false
  //         if (data !== null && data !== undefined) {
  //           if (storeImageFile !== null) {
  //             handleUploadImg(data, userToken);
  //           } else {
  //             dispatch(
  //               getStoreInfo(userToken, data.storeId, handleResopnse, data)
  //             );
  //           }
  //           // checkStoreResponse(data, userToken);
  //         }
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //         setIsLoaded(false); // set loading status to false
  //       });
  //   } catch (error) {
  //     console.log(error);
  //     setIsLoaded(false); // set loading status to false
  //   }
  // };

  // const handleResopnse = (data, userToken) => {
  //   checkStoreResponse(data, userToken);
  // };

  // const callPostApi = async (PostData) => {
  //   let userToken = await localStorage.getItem("tmpuserToken");

  //   console.log(userToken);
  //   setIsLoaded(true);
  //   try {
  //     const config = {
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer " + userToken,
  //       },
  //     };
  //     axios
  //       .post(SERVER_URL + INIT, PostData, config)

  //       .then(({ data }) => {
  //         if (data !== null && data !== undefined) {
  //           var res = JSON.stringify(data);
  //           console.log("Response: " + res);
  //           handleUploadImg();
  //           checkStoreResponse(data, userToken);

  //         }
  //       });
  //   } catch (error) {
  //     console.log(error);
  //     setIsLoaded(false);
  //   }
  // };

  const checkStoreResponse = async (userInfo, userToken) => {
    console.log("userInfo.status ", userInfo.status);
    if (userInfo.status === "EXISTING_USER") {
      await localStorage.setItem("userToken", userToken);
      await localStorage.setItem("storeId", userInfo.storeId);
      await localStorage.removeItem("tmpuserToken");
      // generate token api called for generating license
      dispatch(generateToken(userInfo.storeId, "free"));
      navigate("/");
      // window.location.reload();
    } else {
      alert(
        "Error while creating store please try again if problem persist please contact us."
      );
    }
  };

  // for uploading store image
  // const handleUploadImg = async (storeInfo, userToken) => {
  //   let data = new FormData();

  //   let files = storeImageFile[0];
  //   console.log(files);
  //   console.log("storeInfo :", storeInfo)

  //   data.append("file", files, files.name);
  //   data.append("storeId", storeInfo.storeId);
  //   data.append("imageId", 0);
  //   data.append("productId", 0);
  //   data.append("storeName", storeInfo && storeInfo?.stores[0]?.storeName);
  //   data.append("isProductDefaultImage", 0);
  //   data.append("isStoreImage", 1);
  //   data.append("userName", storeInfo.userName);
  //   data.append("updateImageName", "");

  //   console.log("upload from phone" + JSON.stringify(data));
  //   uploadeImageTOServer(data, userToken, storeInfo);
  // };

  // const uploadeImageTOServer = async (postData, userToken, storeInfo) => {
  //   let config = apiConfigUserToken(
  //     `${SERVER_URL}${UPLOAD_PROD_IMG}`,
  //     "POST",
  //     postData,
  //     userToken
  //   );

  //   try {
  //     axios(config).then((response) => {
  //       console.log(response);
  //       dispatch(
  //         getStoreInfo(userToken, storeInfo.storeId, handleResopnse, storeInfo)
  //       );
  //     });
  //   } catch (error) {
  //     console.log("Error: ", error);
  //     alert("error", error.message);
  //     window.location.reload();
  //   }
  // };

  return (
    <div style={{ width: "100%", overflowY: "scroll", maxHeight: "38rem" }}>
      {isLoaded ? (
        <LoadingSpinner />
      ) : (
        // <div>
        <MainContentArea className="storeArea" scroll="auto">
          <div className="d-flex justify-content-between mx-5">
            <div className="store-stepper">
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps &&
                  steps?.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
              </Stepper>
            </div>
          </div>
          <div className=" mainStore-container cardBox overflow-auto row justify-content-around p-3 mb-1">
            <div className="w-50 store-section">
              <div
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  alignSelf: "center",
                }}
                className="main-heading"
              >
                {t("addStore.StoreSummary")}
              </div>

              <div className="text-center">{t("addStore.StoreNotes")}</div>

              <div className="storeImg-container">
                <InputLabel className="main-heading">
                  <div className="mt-4 storeImg">
                    <img
                      src={
                        storeImageFile && storeImageFile[0]
                          ? URL.createObjectURL(storeImageFile[0])
                          : STORE_DEFAULT_IMG
                      }
                      alt="store image"
                    />
                  </div>
                </InputLabel>
              </div>
            </div>

            <div className="w-50 store-section text-font px-4">
              <div className="d-flex justify-content-between ">
                <InputLabel>{t("addStore.StoreName")} :</InputLabel>
                <p className="">{storeObj?.storeName}</p>
              </div>

              <div className="d-flex justify-content-between">
                <InputLabel>{t("addStore.StoreCategory")} : </InputLabel>
                <p>{storeObj?.storeType.cat} </p>
              </div>

              <div className="d-flex justify-content-between">
                <InputLabel>{t("addStore.StoreCurrency")} : </InputLabel>
                <p>{storeObj?.countryName.currencySymbol} </p>
              </div>

              <div className="d-flex justify-content-between">
                <div>
                  <InputLabel>{t("addStore.StoreAddress")} : </InputLabel>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p>{addObj?.mapAddress} </p>
                </div>
              </div>

              <div className="d-flex justify-content-between">
                <InputLabel>{t("addStore.City")} : </InputLabel>
                <p>{addObj?.city} </p>
              </div>

              {addObj?.state && (
                <div className="d-flex justify-content-between">
                  <InputLabel>{t("addStore.State")} : </InputLabel>
                  <p>{addObj?.state} </p>
                </div>
              )}

              {addObj?.pinCode && (
                <div className="d-flex justify-content-between">
                  <InputLabel>{t("addStore.Pincode")} : </InputLabel>
                  <p>{addObj?.pinCode}</p>
                </div>
              )}

              {storeObj?.countryName && (
                <div className="d-flex justify-content-between">
                  <InputLabel>{t("addStore.Country")} : </InputLabel>
                  <p>{storeObj?.countryName.countryName}</p>
                </div>
              )}

              {addObj?.mobileNumber && (
                <div className="d-flex justify-content-between">
                  <InputLabel>{t("addStore.Mobile")} : </InputLabel>
                  <p>{addObj?.mobileNumber}</p>
                </div>
              )}

              <div className="row">
                <div className="saveStoreAddress-btn buttonContainer">
                  <div className="back-btn">
                    <Button
                      variant="contained"
                      style={{
                        backgroundColor: "var(--white-color)",
                        border: " 2px solid  var(--main-bg-color)",
                        color: "var(--main-bg-color)",
                      }}
                      onClick={getBack}
                    >
                      {t("addStore.Back")}
                    </Button>
                  </div>
                  <div className=" create-btn">
                    <Button
                      variant="contained"
                      style={{
                        backgroundColor: "var(--button-bg-color)",
                        border: " 2px solid  var(--main-bg-color)",
                        color: "var(--button-color)",
                      }}
                      onClick={OnSubmit}
                    >
                      {t("addStore.CREATESTORE")}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MainContentArea>
      )}
    </div>
  );
};

export default StoreCreatorSummery;
