import React, { useEffect, useState } from "react";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";
import MainContentArea from "../MainContentArea/MainContentArea";
import "./StoreSetting.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useDispatch, useSelector } from "react-redux";
import {
  getUTCDate,
  retrieveObj,
  STORE_Id,
  TimeConveter,
} from "../../Containts/Values";
import { getstoreData } from "../../Redux/StoreSetting/storeSettingSlice";
import { useNavigate } from "react-router";
import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import defaultImage from "../../assets/images/default-image.png";
import moment from "moment";

const StoreSettingsPage = () => {
  const { t } = useTranslation();
  const navigete = useNavigate();
  const dispatch = useDispatch();
  const storeDetailsApi = window.storeDetailsApi;
  const storeData = useSelector((state) => state.storeSetting.storeData);
  const loading = useSelector((state) => state.storeSetting.storeDataLoading);
  const isOnline = useSelector((state) => state.checkInternet.isOnline);
  const licenseDetailsApi = window.licenseDetailsApi;
  const [licenseData, setLicensedata] = useState();
  console.log("licenseData...", licenseData);
  console.log("storeData... ", storeData);

  const [isLoading, setIsLoading] = useState(false);
  const [expanded, setExpanded] = React.useState("panel1");
  const [cognitoUserName, setCognitoUserName] = useState("");
  const [storeDetails, setStoreDetails] = useState({});
  const [remainingDays, setRemainingDays] = useState();

  // getting license expiray date remaining days
  const gettingExipryRemainingDate = (licenseDetails) => {
    // current date
    const currentDate = new Date();
    console.log("currentDate... ", currentDate);

    // expiry date
    const expiryDate = new Date(licenseDetails?.expiry);
    // Calculate the difference in milliseconds between the two dates
    const differenceInMs = expiryDate - currentDate;
    console.log("differenceInMs... ", differenceInMs);

    // Convert milliseconds to days
    const millisecondsInADay = 1000 * 60 * 60 * 24; // Number of milliseconds in a day
    console.log("millisecondsInADay... ", millisecondsInADay);
    const remainDays = Math.ceil(differenceInMs / millisecondsInADay);
    console.log("remainDays... ", remainDays);
    remainDays && setRemainingDays(remainDays);
    const lastValidatedDate = new Date(licenseDetails?.lastValidated);
    const formattedvalidatedDate = lastValidatedDate.toDateString();
  };

  // store details storing in state here
  useEffect(() => {
    storeData && storeData[0] && setStoreDetails(storeData[0]);
  }, [storeData]);

  // here we calling initial apis
  useEffect(() => {
    // fetchApi();
    if (isOnline) {
      setIsLoading(true);
      retrieveObj("cognitoUserInfo").then((cognito) => {
        setCognitoUserName(cognito.username);
        console.log(cognito);
      });

      dispatch(getstoreData());
      setIsLoading(false);
    } else {
      const licenseDataList =
        licenseDetailsApi?.licenseDetailsDB?.getLicenseDetails();
      console.log("licenseDataList... ", licenseDataList);

      licenseDataList?.length > 0 && setLicensedata(licenseDataList[0]);
      licenseDataList?.length > 0 &&
        gettingExipryRemainingDate(licenseDataList[0]);

      const storeDetails = storeDetailsApi?.storeDetailsDB?.getStoreDetails(
        Number(STORE_Id)
      );
      storeDetails && setStoreDetails(storeDetails);
    }
  }, []);

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  // for open edit page
  const editHandler = () => {
    navigete("/storeedit", {
      state: { editData: storeDetails },
    });
  };

  return (
    <MainContentArea scroll={"auto"}>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="storeSettingsPage overflow-auto">
          <div className="storeImageContainer">
            <img
              src={storeDetails?.imageUrl ?? defaultImage}
              alt="fashion-for-all"
            />
          </div>

          <div className="storeDetailsContainer p-4">
            <Accordion
              expanded={expanded === "panel1"}
              onChange={handleChange("panel1")}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                className="text-Color"
              >
                <Typography style={{ fontWeight: "600" }}>
                  {t("StoreSetting.storeDetails")}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div
                  className="storeDetails-item d-flex justify-content-between align-items-center"
                >
                  <h5 className="" style={{ fontWeight: "600" }}>
                    {t("StoreSetting.storeName")}
                  </h5>
                  <h5 className="font-weight-normal">
                    {storeDetails && storeDetails?.storeName}
                  </h5>
                </div>
                <div className="storeDetails-item d-flex justify-content-between align-items-center">
                  <h5 className="" style={{ fontWeight: "600" }}>
                    {t("StoreSetting.storeId")}
                  </h5>
                  <h5 className="font-weight-normal">
                    {storeDetails && storeDetails?.storeId}
                  </h5>
                </div>
                <div className="storeDetails-item d-flex justify-content-between align-items-center">
                  <h5 className="" style={{ fontWeight: "600" }}>
                    {t("StoreSetting.currency")}
                  </h5>
                  <h5 className="font-weight-normal">
                    {storeDetails && storeDetails?.currencyName}
                  </h5>
                </div>
                {storeDetails && storeDetails?.gstNumber && (
                  <div className="storeDetails-item d-flex justify-content-between align-items-center">
                    <h5 className="" style={{ fontWeight: "600" }}>
                      {t("StoreSetting.gst")}
                    </h5>
                    <h5 className="font-weight-normal">
                      {storeDetails && storeDetails?.gstNumber}
                    </h5>
                  </div>
                )}
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography style={{ fontWeight: "600" }}>
                  {t("StoreSetting.deliveryDetails")}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className="storeDetails-item d-flex justify-content-between align-items-center">
                  <h5 className="" style={{ fontWeight: "600" }}>
                    {t("StoreSetting.homeDelivery")}
                  </h5>
                  <h5 className="font-weight-normal">
                    {" "}
                    {storeDetails && storeDetails.homeDelivery === true
                      ? "Available"
                      : "Not available"}
                  </h5>
                </div>
                <div className="storeDetails-item d-flex justify-content-between align-items-center">
                  <h5 className="" style={{ fontWeight: "600" }}>
                    {t("StoreSetting.minimumOrderLimit")}
                  </h5>
                  <h5 className="font-weight-normal">
                    {storeDetails && storeDetails?.currencyName}
                    {storeDetails && storeDetails?.miniOrderLimit}
                  </h5>
                </div>
                <div className="storeDetails-item d-flex justify-content-between align-items-center">
                  <h5 className="" style={{ fontWeight: "600" }}>
                    {t("StoreSetting.freeDeliveryWithin")}
                  </h5>
                  <h5 className="font-weight-normal">
                    {storeDetails && storeDetails.withInDistance
                      ? storeDetails.withInDistance
                      : "Not Set"}
                  </h5>
                </div>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography style={{ fontWeight: "600" }}>
                  {t("StoreSetting.storeTiming")}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className="storeDetails-item d-flex justify-content-between align-items-center">
                  <h5 className="" style={{ fontWeight: "600" }}>
                    {t("StoreSetting.storeOpeningTime")}
                  </h5>
                  <h5 className="font-weight-normal">
                    {storeDetails && TimeConveter(storeDetails?.shopOpenTime)}
                  </h5>
                </div>
                <div className="storeDetails-item d-flex justify-content-between align-items-center">
                  <h5 className="" style={{ fontWeight: "600" }}>
                    {t("StoreSetting.storeClosingTime")}
                  </h5>
                  <h5 className="font-weight-normal">
                    {storeDetails && TimeConveter(storeDetails?.shopCloseTime)}
                  </h5>
                </div>
                <div className="storeDetails-item d-flex justify-content-between align-items-center">
                  <h5 className="" style={{ fontWeight: "600" }}>
                    {t("StoreSetting.storeCloseDay")}
                  </h5>
                  <h5 className="font-weight-normal">
                    {storeDetails && storeDetails.shopCloseDay
                      ? storeDetails.shopCloseDay
                      : "Not Set"}
                  </h5>
                </div>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography style={{ fontWeight: "600" }}>
                  {t("StoreSetting.address")}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div
                  className="storeDetails-item d-flex justify-content-between align-items-center"
                  style={{ gap: "45%" }}
                >
                  <h5 className="" style={{ fontWeight: "600" }}>
                    {t("StoreSetting.area")}
                  </h5>
                  <h5 className="font-weight-normal">
                    {storeDetails && storeDetails.address !== null
                      ? storeDetails.address
                      : "Not Set"}
                  </h5>
                </div>
                <div className="storeDetails-item d-flex justify-content-between align-items-center">
                  <h5 className="" style={{ fontWeight: "600" }}>
                    {t("StoreSetting.city")}
                  </h5>
                  <h5 className="font-weight-normal">
                    {storeDetails && storeDetails.city !== null
                      ? storeDetails.city
                      : "Not Set"}
                  </h5>
                </div>
                <div className="storeDetails-item d-flex justify-content-between align-items-center">
                  <h5 className="" style={{ fontWeight: "600" }}>
                    {t("StoreSetting.pincode")}
                  </h5>
                  <h5 className="font-weight-normal">
                    {" "}
                    {storeDetails && storeDetails.pinCode !== null
                      ? storeDetails.pinCode
                      : "Not Set"}
                  </h5>
                </div>
                <div className="storeDetails-item d-flex justify-content-between align-items-center">
                  <h5 className="" style={{ fontWeight: "600" }}>
                    {t("StoreSetting.latitude")}
                  </h5>
                  <h5 className="font-weight-normal">
                    {storeDetails && storeDetails.latitude !== null
                      ? storeDetails.latitude
                      : "Not Set"}
                  </h5>
                </div>
                <div className="storeDetails-item d-flex justify-content-between align-items-center">
                  <h5 className="" style={{ fontWeight: "600" }}>
                    {t("StoreSetting.longitude")}
                  </h5>
                  <h5 className="font-weight-normal">
                    {" "}
                    {storeDetails && storeDetails?.longitude !== null
                      ? storeDetails.longitude
                      : 0}
                  </h5>
                </div>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography style={{ fontWeight: "600" }}>
                  {t("StoreSetting.contact")}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className="storeDetails-item d-flex justify-content-between align-items-center">
                  <h5 className="" style={{ fontWeight: "600" }}>
                    {t("StoreSetting.mobile")}
                  </h5>
                  <h5 className="font-weight-normal">
                    {storeDetails && storeDetails.mobileNumber !== null
                      ? storeDetails.mobileNumber
                      : "Not Set"}
                  </h5>
                </div>
                <div className="storeDetails-item d-flex justify-content-between align-items-center">
                  <h5 className="" style={{ fontWeight: "600" }}>
                    {t("StoreSetting.emailId")}
                  </h5>
                  <h5 className="font-weight-normal">
                    {storeDetails && storeDetails.email !== null
                      ? storeDetails.email
                      : "Not Set"}
                  </h5>
                </div>
                <div className="storeDetails-item d-flex justify-content-between align-items-center">
                  <h5 className="" style={{ fontWeight: "600" }}>
                    {t("StoreSetting.customerID")}
                  </h5>
                  <h5 className="font-weight-normal">
                    {storeDetails && storeDetails.customerId !== null
                      ? storeDetails.customerId
                      : "Not Set"}
                  </h5>
                </div>
              </AccordionDetails>
            </Accordion>

            {licenseData && (
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography style={{ fontWeight: "600" }}>
                    {t("StoreSetting.licenseDetails")}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div
                    className="storeDetails-item d-flex justify-content-between align-items-center"
                    style={{ gap: "13%" }}
                  >
                    <h5 className="" style={{ fontWeight: "600" }}>
                      {t("StoreSetting.licenseKey")}
                    </h5>
                    <h5 className="font-weight-normal">{licenseData?.key}</h5>
                  </div>

                  <div className="storeDetails-item d-flex justify-content-between align-items-center">
                    <h5 className="" style={{ fontWeight: "600" }}>
                      {t("StoreSetting.status")}
                    </h5>
                    <h5
                      className={
                        licenseData?.status === "EXPIRING" ||
                        licenseData?.status === "EXPIRED"
                          ? "license-validDate"
                          : "license-status"
                      }
                    >
                      {licenseData?.status}
                    </h5>
                  </div>

                  <div className="storeDetails-item d-flex justify-content-between align-items-center">
                    <h5 className="" style={{ fontWeight: "600" }}>
                      {t("StoreSetting.expiryDate")}
                    </h5>
                    {/* {console.log(" licenseData", licenseData?.expiry?.toDateString())} */}
                    <h5>
                      {licenseData &&
                        new Date(licenseData?.expiry).toDateString()}
                    </h5>
                  </div>

                  <div className="storeDetails-item d-flex justify-content-between align-items-center">
                    <h5 className="" style={{ fontWeight: "600" }}>
                      {t("StoreSetting.remainigDate")}
                    </h5>
                    <h5 className=" license-validDate font-weight-normal">
                      {remainingDays} Days
                    </h5>
                  </div>
                </AccordionDetails>
              </Accordion>
            )}

            <div className="mt-2 ">
              <Button
                variant="contained"
                style={{
                  backgroundColor: "var(--button-bg-color)",
                  color: "var(--button-color)",
                }}
                onClick={editHandler}
              >
                {t("StoreSetting.editStore")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </MainContentArea>
  );
};

export default StoreSettingsPage;
