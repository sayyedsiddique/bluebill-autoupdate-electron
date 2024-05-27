import axios from "axios";
import { t } from "i18next";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { addTax, updateTax } from "../../Redux/Tax/taxSlice";
import {
  SERVER_URL,
  STORE_Id,
  UPSERT_TAX,
  getUTCDate,
} from "../../Containts/Values";
import { getTaxList } from "../../Redux/Tax/taxSlice";
import { useTranslation } from "react-i18next";
import { Button, InputLabel, TextField } from "@mui/material";
import AlertpopUP from "../../utils/AlertPopUP";
import { apiFailureResponse, showPopupHandleClick } from "../../utils/constantFunctions";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import SubscriptionPlanModal from "../../Components/TrialInformationCard/SubscriptionPlanModal";
import RocketImage from "../../assets/images/RocketIcon.png"


let userToken = localStorage.getItem("userToken");

const TaxModal = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const taxApi = window.taxApi;
  const isOnline = useSelector((state) => state.checkInternet.isOnline);
  const [taxName, settaxName] = useState(props?.taxData?.taxName);
  const [taxValue, settaxValue] = useState(props?.taxData?.taxValue);
  const [taxId] = useState(props?.taxData?.taxId);
  const [error, setError] = useState({ taxName: '', taxValue: '' })
  const modalHeader = props.isEdit ? t("TaxDetails.editTax") : t("TaxDetails.addTax");
  const [isSync, setIsSync] = useState(
    props?.taxData?.isSync ? props?.taxData?.isSync : 0
  );
  const [isPopupOpen, setIsPopupOpen] = useState(false); // for popup
  const [modalOpen, setModalOpen] = useState(false);
  // const [apiError, setApiError] = useState("");
  const navigate = useNavigate();
  // console.log("apiError", apiError);

  // apiError state empty after 3 second
  // and user redirect to /tax page
  // useEffect(() => {
  //   if (apiError?.length > 0) {
  //     showPopupHandleClick(setIsPopupOpen, 3000, setApiError); //for popUp msg

  //   }
  // }, [apiError?.length > 0])

  // const handleClose = () => {
  //   setIsPopupOpen(false);
  // };

  const validation = () => {
    if (taxName === undefined || taxName === '') {
      setError({ ...error, taxName: "Please enter tax name" })
      return false;
    } else if (taxValue === undefined || taxValue === '') {
      setError({ ...error, taxValue: 'Please enter tax value' })
      return false;
    }
    return true;
  }

  //tax creation successfully popup
  // const taxCreationSuccess = () => {
  //   showPopupHandleClick(setIsPopupOpen, 3000, setApiError, navigate); //for popUp msg
  //   // console.log("tax deleted success");
  // };



  //for limit Exceeded and already name use PopUpMessegeHandler.....
  const PopUpMessegeHandler = (message) => {
    // for limit Exceeded popupMessege..
    if (message === "Tax Added failed ") {
      console.log("message", message);
      Swal.fire({
        title: "Limit Exceeded",
        html: "<span style='color: white'>Upgrade to unlock this feature</span>",
        iconHtml: `<img src="${RocketImage}" width="100" height="100">`,
        showCloseButton: true,
        closeButtonHtml: '<span style="color:#ffffffb5;">&times;</span>',
        customClass: {
          icon: 'no-border',
          confirmButton: 'custom-button-class',
          popup: 'custom-popup-class',
          title: 'title-color',
        },
        confirmButtonColor: "",
        confirmButtonText: "Upgrade Plan",
      }).then((result) => {
        if (result.isConfirmed) {
          handleUpgrade();
        }
      });
      // for alreday name use popupMessege
    } else if (message === "This name is already exists") {
      props?.setIsPopupOpen(true)
      props?.setApiError("This Tax name is already exists")
    }
  };


  // for add new tex
  const AddTax = () => {
    let val = validation();
    if (val) {
      // const postData = {
      //   taxName: taxName,
      //   taxValue: taxValue,
      //   taxId: taxId ? taxId : null,
      //   isDeleted: 0,
      //   lastUpdate: 0,
      //   productId: null,
      // };

      let taxIdValue = isOnline ? 0 : getUTCDate()
      const postData = {
        taxName: taxName,
        taxValue: taxValue,
        taxId: taxId ? taxId : taxIdValue,
        isDeleted: props?.taxData ? props?.taxData?.isDeleted : 0,
        lastUpdate: getUTCDate(),
        isSync: isSync ? isSync : 0,
        storeId: STORE_Id,
      };
      handlePopupClose()
      if (isOnline) {
        props?.taxData
          ? dispatch(updateTax(postData, props?.taxCreationSuccess, props?.setPopUpMessage))
          : dispatch(addTax(postData, props?.taxCreationSuccess, props?.setPopUpMessage, PopUpMessegeHandler));
      } else {
        // inserting data into sqlite database
        const result = props?.taxData
          ? taxApi?.taxDB?.updateTaxById(postData)
          : taxApi?.taxDB?.insertTax(postData);
        props?.setTaxPostRes(result)
        props?.setshow(false);
      }
    }

  };

  // to close popup modal
  const handlePopupClose = () => {
    props.setshow(false)
  }

  const handleName = (e) => {
    setError({ ...error, taxName: "" });
    let value = e.target.value.replace(/^[^a-zA-Z]+/, '');
    settaxName(value);
  };
  const handleValue = (e) => {
    setError({ ...error, taxValue: "" });
    const value = e.target.value.replace(/\D/g, "");
    settaxValue(value);
  };

  const handleUpgrade = () => {
    // setModalOpen(true);
    props.setPriceModalOpen(true)
  }



  return (
    <div>
      <Modal
        size="small"
        isOpen={props.isModelVisible}
        toggle={() => props.setshow(!props.isModelVisible)}
      >
        <ModalHeader toggle={() => props.setshow(!props.isModelVisible)} className="popup-modal">
          {modalHeader}
        </ModalHeader>
        <ModalBody className="popup-modal">
          <form action="">
            <div className="mb-4">
              <InputLabel className="requiredstar">{t("TaxDetails.taxName")}</InputLabel>
              <TextField
                type="text"
                size="small"
                name="taxName"
                placeholder={t("TaxDetails.taxName")}
                className="form-control"
                value={taxName}
                onChange={handleName}
                inputProps={{ maxLength: 50 }}
              />
              {error.taxName ? (
                <span className="text-danger">{error.taxName}</span>
              ) : null}
            </div>
            <div className="mb-4">
              <InputLabel className="requiredstar">
                {" "}
                {t("TaxDetails.taxValueInPercent")}
              </InputLabel>
              <TextField
                type="tel"
                size="small"
                maxLength={2}
                name="taxValue"
                placeholder={t("TaxDetails.enterTaxValue")}
                className="form-control"
                value={taxValue}
                onChange={handleValue}
                inputProps={{ maxLength: 7 }}
              />
              {error.taxValue ? (
                <span className="text-danger">{error.taxValue}</span>
              ) : null}
            </div>
          </form>

          <Button
            className="mt-2"
            variant="contained"
            style={{ backgroundColor: "var(--button-bg-color)", color: "var(--button-color)" }}
            onClick={() => AddTax()}
          >
            {t("TaxDetails.submit")}
          </Button>

          {/* <AlertpopUP
            open={isPopupOpen}
            message={apiError?.length > 0 ? apiError : "Tax added successfully!"}
            severity={apiError?.length > 0 ? "error" : "success"}
            onClose={handleClose}
          /> */}

        </ModalBody>
      </Modal>
    </div>
  );
};

export default TaxModal;
