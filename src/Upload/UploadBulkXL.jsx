import axios from "axios";
import React, { useEffect, useState } from "react";
import "./UploadBulkXL.css";
import LoadingSpinner from "../Components/LoadingSpinner/LoadingSpinner";
import { retrieveObj } from "../Containts/Values";
import MainContentArea from "../Pages/MainContentArea/MainContentArea";
import AlertpopUP from "../utils/AlertPopUP";
import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import DragandDropFile from "./DragandDropFile";
import DragandDropExcel from "../Components/DragandDrop/DragandDropExcel";
import { FiDownload } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { showPopupHandleClick } from "../utils/constantFunctions";
import { bulkUploadData } from "../Redux/bulkUploadSlice/bulkUploadSlice";
import { useNavigate } from "react-router-dom";

const UploadBulk = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isLoaded = useSelector((state) => state.bulkUpload.loading);
  const [file, setfile] = useState([]);
  const [user, setUser] = useState("");
  const [fileErr, setfileErr] = useState("")

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [apiError, setApiError] = useState("");
  const msg = "Please select file first";

  console.log("isLoaded", isLoaded, isPopupOpen);

  const validation = () => {
    if (file.length === 0 || file === "") {
      setfileErr("Please select file first");
      return false;
    }
    return true;

  };
  useEffect(() => {
    if (apiError?.length > 0) {
      showPopupHandleClick(setIsPopupOpen, 3000, setApiError); //for popUp msg
    }
  }, [apiError?.length > 0]);

  const onSubmit = () => {
    let val = validation();

    if (val) {
      console.log("val", val)
      dispatch(bulkUploadData(file, user, setApiError, handleSuccess));
    }
  };

  useEffect(() => {
    retrieveObj("cognitoUserInfo").then((cognito) => {
      if (cognito !== null) {
        setUser(cognito);
      }
      console.log("cognitoUsername :", cognito.username);
    });
  }, []);

  const handleSuccess = () => {
    showPopupHandleClick(setIsPopupOpen, 3000);
  };

  const onDownload = () => {
    const link = document.createElement("a");
    link.download = `download.xlsx`;
    link.href =
      "https://ezygen-web-content-prod.s3.ap-south-1.amazonaws.com/bluebill-ezygen-data-upload-sample.xlsx";
    link.click();
  };

  const handleClose = () => {
    setIsPopupOpen(false);
  };

  return (
    <MainContentArea>
      {isLoaded ? (
        <LoadingSpinner />
      ) : (
        <div className="uploadbulk-main-container cardBox">
          <div className="productDeatils-back-btn mb-2" style={{ textAlign: "right" }}>
            <Button
              variant="contained"
              style={{ background: "#e3e2e2", color: "dimgray" }}
              onClick={() => navigate(-1)}
            >
              {t("AllProduct.Back")}
            </Button>
          </div>
          <div className="uploadbulk-container">
            <div className=" frame-container">
              <iframe
                className="container"
                width="560"
                height="315"
                src="https://www.youtube.com/embed/oOHE1TvjxxE"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              // allowfullscreen
              ></iframe>
            </div>
            <div className=" file-container">
              <div style={{ paddingLeft: 15, paddingRight: "15px" }}>
                <h4 style={{ marginTop: "1rem" }}>File Upload</h4>
                <ul className="info-container text-justify">
                  <li>
                    {t("AllProduct.lineOne")}
                    <br />
                    {t("AllProduct.lineTwo")}
                    <br />
                    {t("AllProduct.lineThree")}
                    <br />
                  </li>
                  <li>
                    {t("AllProduct.lineFour")} <br />
                    {t("AllProduct.lineFive")} <br />
                    {t("AllProduct.lineSix")}
                  </li>
                </ul>

                <div className="d-flex justify-content-end align-items-center">
                  <p className="mb-0 me-2" style={{ fontWeight: "600" }}>
                    Download sample file
                  </p>
                  <Button
                    variant="contained"
                    style={{
                      backgroundColor: "var(--button-bg-color)",
                      color: "var(--button-color)",
                    }}
                    startIcon={<FiDownload />}
                    onClick={onDownload}
                  >
                    Download
                  </Button>
                </div>
                <div>
                  <div className="input-container mb-4 mt-4 DropDown">
                    <DragandDropExcel
                      className="DropDown"
                      files={file}
                      setFiles={setfile}
                      setfileErr={setfileErr}
                    />
                    {fileErr ? <span className="text-danger">{fileErr}</span> : null}
                  </div>
                  <div
                    className="upbtn-container"
                    style={{ width: "100%", marginBottom: "1rem" }}
                  >
                    <Button
                      variant="contained"
                      style={{
                        backgroundColor: "var(--button-bg-color)",
                        color: "var(--button-color)",
                        width: "100%",
                      }}
                      onClick={onSubmit}
                    >
                      {t("AllProduct.upload")}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className=" alert-popup d-flex flex-wrap justify-content-center ">
              {isPopupOpen ? (
                <AlertpopUP
                  open={isPopupOpen}
                  message={apiError !== "" ? apiError : "File added successfully"}
                  severity={apiError !== "" ? "error" : "success"}
                  onClose={handleClose}
                />
              ) : null}
            </div>
          </div>
        </div>
      )}
    </MainContentArea>
  );
};

export default UploadBulk;
