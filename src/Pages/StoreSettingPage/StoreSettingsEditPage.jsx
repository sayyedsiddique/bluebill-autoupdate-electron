import React, { useEffect, useState } from "react";
import MainContentArea from "../MainContentArea/MainContentArea";
import TextField from "@mui/material/TextField";
import "./storeEditPage.css";
import { Button, Checkbox, InputLabel, TextareaAutosize } from "@mui/material";
import DragandDrop from "../../Components/DragandDrop/DragandDrop";
import { useLocation, useNavigate } from "react-router-dom";
import BasicSelect from "../../Components/Select/BasicSelect";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ChangeAddressPage from "./changeAddressPage";
import {
  ADDSTORE,
  getUTCDate,
  retrieveObj,
  SERVER_URL,
  STORE_Id,
  UPLOAD_PROD_IMG,
} from "../../Containts/Values";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";
import axios from "axios";
import Swal from "sweetalert2";
import { apiConfig } from "../../utils/constantFunctions";
import defaultImage from "../../assets/images/default-image.png";
import { useTranslation } from "react-i18next";
import { addStoreData } from "../../Redux/StoreSetting/storeSettingSlice";
import { useDispatch } from "react-redux";
import AlertpopUP from "../../utils/AlertPopUP";
import DragAndDropPureHtml from "../../Components/DragandDrop/DragAndDropPureHtml";
import { getStoreInfo } from "../../Redux/authSlice/authSlice";

let userToken = localStorage.getItem("userToken");
const weekDays = [
  { id: "1", value: "Monday" },
  { id: "2", value: "Tuesday" },
  { id: "3", value: "Wednesday" },
  { id: "4", value: "Thursday" },
  { id: "5", value: "Friday" },
  { id: "6", value: "Saturday" },
  { id: "7", value: "Sunday" },
];

const StoreSettingsEditPage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { editData } = location.state;
  console.log("editData... ", editData);
  const [imageFile, setImageFile] = useState([]);
  const [editProductImgs, setEditProductImgs] = useState([]);
  console.log("editProductImgs... ", editProductImgs);
  const [fields, setFields] = useState({
    storeName: editData ? editData?.storeName : "",
    currencyName: editData ? editData?.currencyName : "",
    gstNumber: editData ? editData?.gstNumber : "",
    minOrderLimit: editData ? editData?.miniOrderLimit : "",
    deliveryCharge: editData ? editData?.deliveryCharges : "",
    withInDistance: editData ? editData?.withInDistance : "",
    city: editData ? editData?.city : "",
    pinCode: editData ? editData?.pinCode : "",
    latitude: editData ? editData?.latitude : "",
    longitude: editData ? editData?.longitude : "",
    address: editData ? editData?.address : "",
  });
  console.log("fields... ", fields);

  const [homeDeliveryAvailabel, setHomeDeliveryAvailabel] = useState(
    editData?.homeDelivery
  );

  const [error, setError] = useState({ storeName: "", address: "", city: "" });

  let findCloseDay = weekDays.find((item) => {
    return item.value === editData?.shopCloseDay;
  });

  const [storeClose, setStoreClose] = useState(findCloseDay?.value);
  const [shopOpenTime, setShopOpenTime] = useState(
    new Date(parseInt(editData?.shopOpenTime)).getTime()
  );
  const [shopCloseTime, setShopCloseTime] = useState(
    new Date(parseInt(editData?.shopCloseTime)).getTime()
  );
  const [mapVisible, setMapVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [cognitoUserName, setCognitoUserName] = useState("");

  const [isPopupOpen, setIsPopupOpen] = useState(false); // for popup
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    retrieveObj("cognitoUserInfo").then((cognito) => {
      setCognitoUserName(cognito.username);
    });
  }, []);

  // setting store image in state
  useEffect(() => {
    editData?.imageUrl && setEditProductImgs(editData?.imageUrl);
  }, [editData]);

  // input field handler
  const inputHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    if (name === "storeName") {
      setFields({ ...fields, storeName: value });
      setError({ ...error, storeName: "" });
    } else if (name === "currency") {
      setFields({ ...fields, currencyName: value });
    } else if (name === "minOrderLimit") {
      setFields({ ...fields, minOrderLimit: value });
    } else if (name === "deliveryCharge") {
      setFields({ ...fields, deliveryCharge: value });
    } else if (name === "freeDelivery") {
      setFields({ ...fields, withInDistance: value });
    } else if (name === "gst") {
      setFields({ ...fields, gstNumber: value });
    } else if (name === "city") {
      setFields({ ...fields, city: value });
    } else if (name === "address") {
      setFields({ ...fields, address: value });
    } else if (name === "pinCode") {
      setIsLoaded(false);
      setFields({ ...fields, pinCode: value.slice(0, 6) }); //set limit 6 digits
    }
    // else if (name === "city") {
    //   setFields({ ...fields, city: value });
    // } else if (name === "pinCode") {
    //   setIsLoaded(false);
    //   setFields({ ...fields, address: value });
    // }
  };

  // change address handler
  const saveMapHandler = (addressObj, address) => {
    console.log("addressObj", addressObj);
    setFields({
      address: address,
      city: addressObj.city,
      latitude: addressObj.lat,
      longitude: addressObj.lng,
      pinCode: addressObj.pinCode,
    });
  };

  const validation = () => {
    if (fields.storeName === "") {
      setError({ ...error, storeName: "Please enter store name" });
      return false;
    } else if (fields.address === "") {
      setError({ ...error, address: "Please enter address" });
      return false;
    } else if (fields.city === "") {
      setError({ ...error, city: "Please enter city" });
      return false;
    }
    return true;
  };

  const handleCancel = () => {
    navigate("/storesetting");
  };

  // to set data into  api
  const handleSubmit = async () => {
    const val = validation();
    if (val) {
      // setIsLoaded(true)
      let postData = {
        storeId: STORE_Id,
        storeName: fields.storeName,
        gstNumber: fields.gstNumber,
        address: fields.address,
        city: fields.city,
        pinCode: fields.pinCode,
        latitude: fields.latitude,
        longitude: fields.longitude,
        mobileNumber: editData?.mobileNumber,
        email: editData?.email,
        customerId: editData?.customerId,
        currencyName: editData?.currencyName,
        homeDelivery: homeDeliveryAvailabel,
        miniOrderLimit: fields.minOrderLimit,
        deliveryCharges: fields.deliveryCharge,
        shopOpenTime: shopOpenTime,
        shopCloseTime: shopCloseTime,
        shopCloseDay: storeClose,
        withInDistance: fields.withInDistance,
        lastUpdate: getUTCDate(),
      };

      console.log("##Post  Data", postData);

      localStorage.setItem("updatedStoreInfo", JSON.stringify(postData));

      dispatch(addStoreData(postData, handleSuccess, apiFailureResponse));
    }
  };

  //for popUp
  const handleClick = () => {
    setIsPopupOpen(true);
    setTimeout(() => {
      setIsPopupOpen(false);
      navigate("/storesetting"); // Redirect to store setting page
    }, 3000); // Show popup for 3 seconds
  };

  const handleClose = () => {
    setIsPopupOpen(false);
  };

  const apiFailureResponse = (error) => {
    console.log("apiFailureResponse ", error);
    handleClick(); //for popUp show when api will be failure
    setApiError(`An error occurred: ${error}`);
  };

  // for Success PopUp
  const handleSuccess = () => {
    if (imageFile.length !== 0) {
      handleUploadImg();
    } else {
      dispatch(getStoreInfo(userToken, STORE_Id));
    }

    handleClick(); //for popUp msg

    // Swal.fire({
    //   icon: "success",
    //   title: "store saved successfully!",
    // }).then((res) => {
    //   if (res?.isConfirmed) {
    //     navigate("/storesetting");
    //   }
    // });
  };

  // for uploading store image
  const handleUploadImg = () => {
    let data = new FormData();

    let files = imageFile[0];
    console.log(files);

    data.append("file", files, files.name);
    data.append("storeId", STORE_Id);
    data.append("imageId", 0);
    data.append("productId", 0);
    data.append("storeName", fields.storeName);
    data.append("isProductDefaultImage", 0);
    data.append("isStoreImage", 1);
    data.append("userName", cognitoUserName);
    data.append("updateImageName", "");

    console.log("upload from phone" + JSON.stringify(data));
    uploadeImageTOServer(data);
  };

  const uploadeImageTOServer = async (postData) => {
    let config = apiConfig(`${SERVER_URL}${UPLOAD_PROD_IMG}`, "POST", postData);

    try {
      axios(config).then((response) => {
        console.log(response);
        dispatch(getStoreInfo(userToken, STORE_Id));
      });
    } catch (error) {
      console.log("Error: ", error);
      dispatch(getStoreInfo(userToken, STORE_Id));
      alert("error", error.message);
    }
  };

  return (
    <MainContentArea scroll={"auto"}>
      {isLoaded ? (
        <LoadingSpinner />
      ) : (
        <div className="storeSettingsEditPage overflow-auto">
          <div className="storeImageContainer w-40 m-4">
            <img
              src={
                imageFile && imageFile[0]
                  ? URL.createObjectURL(imageFile[0])
                  : editData?.imageUrl || defaultImage
              }
              alt="fashion-for-all"
            />
            <div className="img-upload" style={{ marginTop: "50px" }}>
              {/* <DragandDrop files={imageFile} setFiles={setImageFile} /> */}
              <DragAndDropPureHtml
                files={imageFile}
                setFiles={setImageFile}
                editProductImgs={editProductImgs}
                setEditProductImgs={setEditProductImgs}
              />
            </div>
          </div>
          <div className="storeDetailsContainer p-4 w-60">
            <div className="storeNameContainer">
              <h5>{t("StoreEdit.storeInformation")}</h5>
              <p>
                {t("StoreEdit.storeId")}: <span>{STORE_Id}</span>
              </p>
            </div>
            <div className="storeFormInputContainer">
              <div className="bottomMargin">
                <InputLabel className="requiredstar">{t("StoreEdit.storeName")}</InputLabel>
                <TextField
                  id="outlined-size-small"
                  defaultValue={fields && fields?.storeName}
                  size="small"
                  name="storeName"
                  onChange={inputHandler}
                />
                <br />
                {error.storeName ? (
                  <span className="text-danger">{error.storeName}</span>
                ) : null}
              </div>
              <div className="bottomMargin">
                <InputLabel>{t("StoreEdit.currency")}</InputLabel>
                <TextField
                  id="outlined-size-small"
                  defaultValue={fields && fields?.currencyName}
                  size="small"
                  name="currency"
                  onChange={inputHandler}
                  disabled={true}
                />
              </div>
              <div className="bottomMargin">
                <InputLabel>{t("StoreEdit.gst")}</InputLabel>
                <TextField
                  id="outlined-size-small"
                  defaultValue={fields && fields?.gstNumber}
                  size="small"
                  name="gst"
                  onChange={inputHandler}
                />
              </div>
            </div>

            <h6 className="bottomMargin">{t("StoreEdit.deliveryDetails")}</h6>
            <div className="storeFormInputContainer">
              <div className="bottomMargin">
                <InputLabel>{t("StoreEdit.minimumOrderLimit")}</InputLabel>
                <TextField
                  id="outlined-size-small"
                  defaultValue={fields && fields?.minOrderLimit}
                  size="small"
                  type="number"
                  name="minOrderLimit"
                  onChange={inputHandler}
                />
              </div>
              <div className="bottomMargin">
                <InputLabel>{t("StoreEdit.deliveryCharge")}</InputLabel>
                <TextField
                  id="outlined-size-small"
                  defaultValue={fields && fields?.deliveryCharge}
                  size="small"
                  name="deliveryCharge"
                  type="number"
                  onChange={inputHandler}
                />
              </div>
              <div className="bottomMargin">
                <InputLabel>{t("StoreEdit.freeDeliveryWithin")}</InputLabel>
                <TextField
                  id="outlined-size-small"
                  defaultValue={fields && fields?.withInDistance}
                  size="small"
                  name="freeDelivery"
                  onChange={inputHandler}
                />
              </div>
            </div>
            <div className="checked">
              <Checkbox
                type="checkbox"
                checked={homeDeliveryAvailabel}
                size="medium"
                onChange={(e) =>
                  setHomeDeliveryAvailabel(!homeDeliveryAvailabel)
                }
              />
              <label className="mt-2">
                {t("StoreEdit.homeDeliveryAvailable")}
              </label>
            </div>

            <h6 className="bottomMargin">{t("StoreEdit.storeTiming")}</h6>
            <div className="mb-4 storeFormInputContainer">
              <div
                className="bottomMargin timePicker-width"
                //  style={{ width: "45%", display: "grid" }}
              >
                <InputLabel>{t("StoreEdit.storeOpeningTime")}</InputLabel>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    className="time-picker"
                    value={shopOpenTime}
                    onChange={(newValue) => {
                      setShopOpenTime(new Date(newValue).getTime());
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </div>
              <div
                className="bottomMargin timePicker-width"
                // style={{ width: "45%", display: "grid" }}
              >
                <InputLabel>{t("StoreEdit.storeClosingTime")}</InputLabel>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    className="time-picker"
                    value={shopCloseTime}
                    onChange={(newValue) => {
                      setShopCloseTime(new Date(newValue).getTime());
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </div>
              <div className=" select-day">
                <InputLabel>{t("StoreEdit.storeCloseDay")}</InputLabel>
                <BasicSelect
                  defaultValue={"Select Day"}
                  selectValue={storeClose}
                  setSelectValue={setStoreClose}
                  selectArray={weekDays}
                />
              </div>
            </div>

            {/* <h6>{t("StoreEdit.address")}</h6>
            <div
              onClick={() => setMapVisible(!mapVisible)}
              style={{ width: "fit-content" }}
            >
              <label
                className="link"
                style={{
                  // color: "var(--light-blue-color)",
                  cursor: "pointer",
                  marginBottom: "0.5rem",
                  width: "fit-content",
                  color: "var(--light-blue-color)",
                }}
              >
                {t("StoreEdit.changeAddress")}
              </label>
            </div>

            {mapVisible ? (
              <div className="bottomMargin" style={{ width: "100%" }}>
                <ChangeAddressPage
                  lat={fields?.latitude}
                  lon={fields?.longitude}
                  add={fields?.address}
                  saveMapAddreObj={saveMapHandler}
                  setMapVisible={setMapVisible}
                  setFields={setFields}
                />
              </div>
            ) : null} */}

            <div className="mb-4">
              <InputLabel className="requiredstar">
                {t("addStore.Selectedaddressonmap")}
              </InputLabel>
              <TextField
                placeholder={"Address"}
                id="outlined-size-small"
                // defaultValue={fields?.mapAddress}
                value={fields?.address}
                size="small"
                name="address"
                // inputRef={mapAddressInputRef}
                onChange={inputHandler}
              />
              {/* {error?.mapAddress && (
                <span className="text-danger">{error?.mapAddress}</span>
              )} */}
              <br />
            </div>

            <div className="storeFormInputContainer">
              <div className="bottomMargin mt-3">
                <InputLabel className="requiredstar">{t("StoreEdit.city")}</InputLabel>
                <TextField
                  name="city"
                  id="outlined-size-small"
                  defaultValue={fields && fields?.city}
                  value={fields && fields?.city}
                  size="small"
                  onChange={inputHandler}
                />
                <br />
                {error.city ? (
                  <span className="text-danger">{error.city}</span>
                ) : null}
              </div>
              <div className="bottomMargin">
                <InputLabel>{t("StoreEdit.pincode")}</InputLabel>
                <TextField
                  id="outlined-size-small"
                  name="pinCode"
                  type="number"
                  defaultValue={fields && fields?.pinCode}
                  value={fields && fields?.pinCode}
                  size="small"
                  onChange={inputHandler}
                />
              </div>
              {/* latitude and longitude */}
              {/* <div className="bottomMargin">
                <InputLabel>{t("StoreEdit.latitude")}</InputLabel>
                <TextField
                  id="outlined-size-small"
                  defaultValue={fields.latitude}
                  value={fields.latitude}
                  size="small"
                  disabled={true}
                />
              </div>
              <div className="bottomMargin">
                <InputLabel>{t("StoreEdit.longitude")}</InputLabel>
                <TextField
                  id="outlined-size-small"
                  defaultValue={fields.longitude}
                  value={fields.longitude}
                  size="small"
                  disabled={true}
                />
              </div>
              <div className="w-100 address-text-area">
                <InputLabel className="requiredstar">
                  {t("StoreEdit.area")}
                </InputLabel>
                <TextareaAutosize
                  minRows={3}
                  name="address"
                  onChange={inputHandler}
                  placeholder="Minimum 3 rows"
                  defaultValue={fields && fields?.address}
                  value={fields && fields?.address}
                  style={{
                    width: "100%",
                    borderColor: "var(--border-color)",
                    borderRadius: "5px",
                    padding: "10px",
                  }}
                />
                <br />
                {error.address ? (
                  <span className="text-danger">{error.address}</span>
                ) : null}
              </div> */}
            </div>

            <div className="d-flex justify-content-between">
              <div
                className="mt-2 store-update-btn"
                style={{ textAlign: "right" }}
              >
                <Button
                  variant="contained"
                  style={{
                    background: "var(--white-color)",
                    color: " var(--main-bg-color)",
                    border: " 2px solid  var(--main-bg-color)",
                  }}
                  onClick={handleCancel}
                >
                  {t("StoreEdit.cancel")}
                  {/* {t("storeEdit.UpdateStore")} */}
                </Button>
              </div>

              <div
                className="mt-2 store-update-btn"
                style={{ textAlign: "right" }}
              >
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "var(--button-bg-color)",
                    color: "var(--button-color)",
                  }}
                  onClick={handleSubmit}
                >
                  {t("StoreEdit.updateStore")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <AlertpopUP
        open={isPopupOpen}
        message={apiError ? apiError : "Store saved successfully!"}
        severity={apiError ? "error" : "success"}
        // message="Store saved successfully!"
        // severity="success"
        onClose={handleClose}
      />
    </MainContentArea>
  );
};

export default StoreSettingsEditPage;
