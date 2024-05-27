import React, { useEffect, useState } from "react";
import MainContentArea from "../MainContentArea/MainContentArea";
import TextField from "@mui/material/TextField";
import { InputLabel, Button, Stepper, Step, StepLabel } from "@mui/material";
import { useRef } from "react";
import "./Storepage.css";
import { useTranslation } from "react-i18next";
import { STORE_DEFAULT_IMG, retrieveObj } from "../../Containts/Values";

const SaveStoreAddress = (props) => {
  const {
    address,
    addressObj,
    HandleSaveStoreAdd,
    getBack,
    storeImageFile,
    steps,
    activeStep,
    countryName
  } = props;
  // console.log("countryNameobj",countryName);
  const { t } = useTranslation();
  const mapAddressInputRef = useRef(null);
  const cityInputRef = useRef(null);
  const mobileInputRef = useRef(null);

  const [fields, setFields] = useState({
    shopNo: "",
    mapAddress: address ? address : "",
    city: addressObj.city ? addressObj.city : "",
    state: addressObj.state ? addressObj.state : "",
    pinCode: addressObj.pinCode ? addressObj.pinCode : "",
    country: addressObj.country ? addressObj.country : "",
    mobileNumber: addressObj.mobileNumber ? addressObj.mobileNumber : "",
  });

  const [error, setError] = useState({
    mapAddress: "",
    city: "",
    mobileNumber: "",
  });

  const [mobileFields, setMobileFields] = useState(false);

  useEffect(() => {
    retrieveObj("cognitoUserInfo").then((cogniInfo) => {
      if (cogniInfo != null) {
        // setcustomerInfo(cogniInfo);
        if (cogniInfo?.attributes?.phone_number !== undefined) {
          console.log(
            "helllooooooooooooo",
            cogniInfo?.attributes?.phone_number
          );
          setMobileFields(true);
          setFields({
            ...fields,
            mobileNumber: cogniInfo?.attributes?.phone_number,
          });
        }
      }
    });
  }, []);
  const handleInputs = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setError({ ...error, [name]: "" });

    if (name === "mobileNumber" || name === "pinCode") {
      value = e.target.value.replace(/\D/g, "");
      setFields({ ...fields, [name]: value });
    } else if (
      name === "city" ||
      name === "country" ||
      name === "state"
    ) {
      let validate = value.replace(/[^A-Za-z ]/g, '')
      setFields({ ...fields, [name]: validate });
    } else {
      setFields({ ...fields, [name]: value });
    }
  };


  const validateForm = () => {
    if (fields.mapAddress === "") {
      setError({ ...error, mapAddress: "Please enter store Address" });
      if (mapAddressInputRef.current) {
        mapAddressInputRef.current.focus();
      }
      return false;
    } else if (fields.city === "") {
      setError({ ...error, city: "Please enter city name" });
      if (cityInputRef.current) {
        cityInputRef.current.focus();
      }
      return false;
    } else if (fields.mobileNumber === "") {
      setError({ ...error, mobileNumber: "Please enter mobile number" });
      if (mobileInputRef.current) {
        mobileInputRef.current.focus();
      }
      return false;
    }
    return true;
  };

  const handleNext = () => {
    let val = validateForm();
    if (val) {
      const postData = {
        shopNo: fields?.shopNo,
        mapAddress: fields?.mapAddress,
        city: fields?.city,
        state: fields?.state,
        pinCode: fields?.pinCode,
        country: fields?.country,
        mobileNumber: fields?.mobileNumber,
        lat: addressObj.lat,
        lng: addressObj.lng,
      };
      HandleSaveStoreAdd(postData);
    }
  };

  return (
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
            style={{ fontSize: 20, fontWeight: "bold", alignSelf: "center" }}
            className="main-heading"
          >
            {t("addStore.AddressConfirmation")}
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
        <div className="w-50 store-section">
          <div className="mb-4">
            <InputLabel>{t("addStore.ShopNo")}</InputLabel>
            <TextField
              placeholder={"Shop No, Lane No, Building No etc."}
              id="outlined-size-small"
              defaultValue={fields?.shopNo}
              size="small"
              name="shopNo"
              onChange={handleInputs}
              inputProps={{ maxLength: 250 }}
            />
            <br />
          </div>
          <div className="mb-4">
            <InputLabel className="requiredstar">
              {t("addStore.Selectedaddressonmap")}
            </InputLabel>
            <TextField
              placeholder={"Address"}
              id="outlined-size-small"
              defaultValue={fields?.mapAddress}
              size="small"
              name="mapAddress"
              inputRef={mapAddressInputRef}
              onChange={handleInputs}
            />
            {error?.mapAddress && (
              <span className="text-danger">{error?.mapAddress}</span>
            )}
            <br />
          </div>
          <div className="mb-4">
            <InputLabel className="requiredstar">
              {t("addStore.City")}
            </InputLabel>
            <TextField
              placeholder={"City"}
              id="outlined-size-small"
              defaultValue={fields?.city}
              value={fields?.city}
              size="small"
              name="city"
              inputRef={cityInputRef}
              onChange={handleInputs}
              inputProps={{ maxLength: 50 }}
            />
            {error.city && <span className="text-danger">{error?.city}</span>}
            <br />
          </div>
          <div className="mb-4">
            <InputLabel>{t("addStore.State")}</InputLabel>
            <TextField
              placeholder={"State"}
              id="outlined-size-small"
              defaultValue={fields?.state}
              value={fields?.state}
              size="small"
              name="state"
              onChange={handleInputs}
              inputProps={{ maxLength: 50 }}
            />
            <br />
          </div>
          <div className="mb-4">
            <InputLabel>{t("addStore.Pincode")}</InputLabel>
            <TextField
              placeholder={"Pincode"}
              id="outlined-size-small"
              defaultValue={fields?.pinCode}
              value={fields?.pinCode}
              type="tel"
              size="small"
              name="pinCode"
              inputProps={{ maxLength: 6 }}
              onChange={handleInputs}
            />
            <br />
          </div>
          <div className="mb-4">
            <InputLabel>{t("addStore.Country")}</InputLabel>
            <TextField
              placeholder={"Country"}
              id="outlined-size-small"
              defaultValue={fields?.country}
              // value={fields?.country}
              value={countryName?.countryName}
              size="small"
              name="country"
              onChange={handleInputs}
              inputProps={{ maxLength: 50 }}
            />
            <br />
          </div>
          <div className="mb-4">
            <InputLabel className="requiredstar"
            >{t("addStore.Mobile")}</InputLabel>
            <TextField
              placeholder={t("addStore.mobileplaceholder")}
              id="outlined-size-small"
              defaultValue={fields?.mobileNumber}
              value={fields?.mobileNumber}
              size="small"
              name="mobileNumber"
              inputRef={mobileInputRef}
              disabled={mobileFields}
              onChange={handleInputs}
              inputProps={{ maxLength: 13 }}
            />
            {error.mobileNumber && (
              <span className="text-danger">{error?.mobileNumber}</span>
            )}
            <br />
          </div>
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

            <div className="back-btn">
              <Button
                variant="contained"
                style={{
                  backgroundColor: "var(--button-bg-color)",
                  border: " 2px solid  var(--main-bg-color)",
                  color: "var(--button-color)",
                }}
                onClick={handleNext}
              >
                {t("addStore.NEXT")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainContentArea>
  );
};

export default SaveStoreAddress;
