import { getAllISOCodes } from "iso-country-currency";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { STORE_DEFAULT_IMG, STORE_TYPE } from "../../Containts/Values";
import MainContentArea from "../MainContentArea/MainContentArea";
import "./Storepage.css";
import { CUSTOM_DROPDOWN_STYLE } from "../../utils/CustomeStyles";
import Select from "react-select";
import TextField from "@mui/material/TextField";
import { InputLabel, Button, Stepper, Step, StepLabel } from "@mui/material";
import StoreAddresPage from "./StoreAddressPage";
import { useTranslation } from "react-i18next";
import DragandDrop from "../../Components/DragandDrop/DragandDrop";
import { getAllCountries } from "../../Redux/StoreCreatorSlice/storeCreatorSlice";
import { useDispatch, useSelector } from "react-redux";

const StorePage = (props) => {
  const { steps, activeStep, HandleStorPageData } = props;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const storeNameInputRef = useRef(null);
  const countryNameInputRef = useRef(null);
  const storeTypeInputRef = useRef(null);
  const storeAddObjInputRef = useRef(null);
  const countires = useSelector((state) => state.storeCreator.countires);
  console.log("countires... ", countires);

  const [countryData] = useState(getAllISOCodes());

  const [showMap, setShowMap] = useState(false);

  const [storeImageFile, setStoreImageFile] = useState(
    props?.storeImageFile ? props?.storeImageFile : ""
  );
  const [countryName, setcountryName] = useState(
    props?.fields?.countryName ? props?.fields?.countryName : ""
  );
  console.log("countryName... ", countryName)
  const [storeType, setstoreType] = useState(
    props?.fields?.storeType ? props?.fields?.storeType : ""
  );

  const [fields, setFields] = useState({
    storeName: props?.fields?.storeName ? props?.fields?.storeName : "",
    addressObj: props?.fields?.addressObj ? props?.fields?.addressObj : "",
    address: props?.fields?.address ? props?.fields?.address : "",
  });

  const [error, setError] = useState({
    storeName: "",
    countryName: "",
    storeType: "",
    address: "",
    addressObj: "",
    showMap: "",
  });
  const [countryList, setCountry] = useState([]);
  console.log("countryList... ", countryList)

  // set all countries in state
  useEffect(() => {
    countires && setCountry(countires);
  }, [countires]);

  // get all countries
  useEffect(() => {
    dispatch(getAllCountries());
  }, []);

  const handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setError({ ...error, [name]: "" });
    setFields({ ...fields, [name]: value });
  };

  const handleSetMapAddress = (addressObj, address) => {
    setFields({ ...fields, addressObj: addressObj, address: address });
  };

  const handleSelectCountry = (e) => {
    setcountryName(e);
    setError({ ...error, countryName: "" });
    console.log("countryName :", e);
  };

  const handleSeletStore = (e) => {
    setError({ ...error, storeType: "" });
    setstoreType(e);
  };

  const validateForm = () => {
    if (fields?.storeName === "") {
      setError({ ...error, storeName: "Please enter store name" });
      if (storeNameInputRef.current) {
        storeNameInputRef.current.focus();
      }
      return false;
    } else if (countryName === "") {
      setError({ ...error, countryName: "Please select country name" });
      if (countryNameInputRef.current) {
        countryNameInputRef.current.focus();
      }
      return false;
    } else if (storeType === "") {
      setError({ ...error, storeType: "Please select store type" });
      if (storeTypeInputRef.current) {
        storeTypeInputRef.current.focus();
      }
      return false;
    } 
    // else if (fields?.addressObj === "") {
    //   setError({ ...error, showMap: "Please select address using Map" });
    //   if (storeAddObjInputRef.current) {
    //     storeAddObjInputRef.current.focus();
    //   }
    //   return false;
    // }

    return true;
  };

  const handleNext = () => {
    let val = validateForm();
    if (val) {
      let data = {
        storeName: fields.storeName,
        countryName: countryName,
        storeType: storeType,
        addressObj: fields.addressObj,
        address: fields.address,
        img: storeImageFile,
      };
      HandleStorPageData(data);
    }
  };

  return (
    <MainContentArea scroll="auto" className="storeArea">
      <div className="d-flex justify-content-between">
        <div className="store-stepper">
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps?.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </div>
      </div>
      <div
        className=" mainStore-container cardBox overflow-auto row justify-content-around p-3 mb-1"
        style={{ overflowY: "scroll" }}
      >
        <div className="w-50 store-section">
          <div
            style={{ fontSize: 20, fontWeight: "bold", alignSelf: "center" }}
            className="main-heading"
          >
            {t("addStore.WelcomeNotes")} {"\n"}
          </div>
          <div className="text-center">{t("addStore.StoreNotes")}</div>
          <div className="storeImg-container ">
            <InputLabel className="main-heading">
              {/* <div className="">{t("addStore.StoreNotes")}</div> */}

              <div className="mt-4 storeImg">
                {/* <img src={STORE_DEFAULT_IMG}
                alt="store-Image" /> */}

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
          <div className="col-12 mb-4">
            <InputLabel className="requiredstar">
              {t("addStore.StoreName")}
            </InputLabel>
            <TextField
              // label="Size"
              placeholder={t("addStore.EnterStoreName")}
              id="outlined-size-small"
              defaultValue={fields?.storeName}
              size="small"
              name="storeName"
              onChange={handleInput}
              inputRef={storeNameInputRef}
              inputProps={{ maxLength: 50 }}
            />
            {error.storeName && error.storeName ? (
              <span className="text-danger">{error?.storeName}</span>
            ) : null}
          </div>

          <div className="col-12 mb-4">
            <InputLabel className="requiredstar">
              {t("addStore.SelectCountry")}
            </InputLabel>

            <Select
              placeholder={t("addStore.SelectCountry")}
              getOptionLabel={(countryList) => countryList?.countryName}
              options={countryList}
              styles={CUSTOM_DROPDOWN_STYLE}
              value={countryName}
              onChange={handleSelectCountry}
              inputRef={countryNameInputRef}
              isClearable
            />
            {error && error?.countryName && (
              <span className="text-danger">{error?.countryName}</span>
            )}
          </div>

          <div className="col-12 mb-4">
            <InputLabel className="requiredstar">
              {t("addStore.SelectStoreType")}
            </InputLabel>

            <Select
              placeholder={t("addStore.SelectStoreType")}
              getOptionLabel={(STORE_TYPE) => STORE_TYPE?.cat}
              options={STORE_TYPE}
              styles={CUSTOM_DROPDOWN_STYLE}
              value={storeType}
              onChange={handleSeletStore}
              isClearable
              inputRef={storeTypeInputRef}
            />
            {error && error?.storeType && (
              <span className="text-danger">{error?.storeType}</span>
            )}
          </div>

          <div className="img-upload" style={{ marginTop: "2rem" }}>
            <DragandDrop files={storeImageFile} setFiles={setStoreImageFile} />
          </div>

          {/* <label
            onClick={() => setShowMap(!showMap)}
            className="link requiredstar"
            style={{
              color: "var(--light-blue-color)",
              cursor: "pointer",
              marginTop: "1rem",
              marginBottom: "0.5rem",
            }}
          >
            {" "}
            {t("addStore.ChooseAddressUsingMap")}
          </label>
          <div>
            {error && !showMap && (
              <span className="text-danger">{error?.showMap}</span>
            )}

            {showMap ? (
              <div inputRef={storeAddObjInputRef}>
                <StoreAddresPage handleSetMapAddress={handleSetMapAddress} />
              </div>
            ) : null}
          </div> */}

          <div className="mt-3 next">
            <Button
              variant="contained"
              style={{
                backgroundColor: "var(--button-bg-color)",
                color: "var(--button-color)",
                float: "right",
              }}
              onClick={handleNext}
            >
              {t("addStore.NEXT")}
            </Button>
          </div>
        </div>
      </div>
    </MainContentArea>
  );
};

export default StorePage;
