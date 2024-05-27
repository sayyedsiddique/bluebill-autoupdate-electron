import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import {
  getUTCDate,
  SERVER_URL,
  STORE_Id,
  UPSERT_UNIT,
} from "../../Containts/Values";
import { addUnit, getUnitList, updateUnit } from "../../Redux/Unit/unitSlice";
import { useTranslation } from "react-i18next";
import { Button, Checkbox, InputLabel, TextField } from "@mui/material";
import AlertpopUP from "../../utils/AlertPopUP";
import {
  apiFailureResponse,
  showPopupHandleClick,
} from "../../utils/constantFunctions";
import { useNavigate } from "react-router-dom";
import { getStoreIdFromLocalStorage } from "../../utils/constantFunctions";
import Swal from "sweetalert2";
import SubscriptionPlanModal from "../../Components/TrialInformationCard/SubscriptionPlanModal";
import RocketImage from "../../assets/images/RocketIcon.png"

let userToken = localStorage.getItem("userToken");

const UnitModal = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  // const [show, setshow] = useState(props.isModelVisible);
  const isOnline = useSelector((state) => state.checkInternet.isOnline);
  console.log("isOnline ", isOnline);
  const unitApi = window.unitApi;
  const [UnitName, setUnitName] = useState(props?.unitData?.unitName);
  const [UnitMeasurable, setUnitMeasurable] = useState(
    props?.unitData?.isMeasurable
  );
  const [unitId] = useState(props?.unitData?.unitId);
  const [error, setError] = useState("");
  const modalHeader = props.isEdit
    ? t("UnitDetails.editUnit")
    : t("UnitDetails.addUnit");
  console.log("props: " + JSON.stringify(props));
  const [storeId, setStoreId] = useState(-1);
  const [isSync, setIsSync] = useState(
    props?.unitData?.isSync ? props?.unitData?.isSync : 0
  );
  console.log("storeId ", storeId);

  const [isPopupOpen, setIsPopupOpen] = useState(false); // for popup
  const [modalOpen, setModalOpen] = useState(false);
  // const [apiError, setApiError] = useState("");
  const navigate = useNavigate();
  // console.log("apiError", apiError);

  // apiError state empty after 3 second
  // and user redirect to /unit page
  // useEffect(() => {
  //   if (apiError?.length > 0) {
  //     showPopupHandleClick(setIsPopupOpen, 3000, setApiError); //for popUp msg
  //   }
  // }, [apiError?.length > 0]);

  const handleClose = () => {
    setIsPopupOpen(false);
  };

  const validation = () => {
    if (UnitName === "" || UnitName === undefined) {
      setError("Please enter unit name");
      return false;
    }
    return true;
  };

  //unit creation successfully popup
  // const unitCreationSuccess = () => {
  //   showPopupHandleClick(setIsPopupOpen, 3000, setApiError, navigate); //for popUp msg
  //   // console.log("unit deleted success");
  // };



  //for limit Exceeded and already name use PopUpMessegeHandler.....
  const PopUpMessegeHandler = (message) => {
    //for  limit Exceeded popupMessege
    if (message === "Unit Added failed ") {
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
      props?.setApiError("This Unit name is already exists")
    }
  }


  // for add new unit
  const AddUnit = async () => {
    let val = validation();
    let Measurable = UnitMeasurable === true ? 1 : 0;

    if (val) {
      const postData = {
        unitName: UnitName,
        isMeasurable: Measurable,
        lastUpdate: getUTCDate(),
        unitId: unitId ? unitId : 0,
        isDeleted: props?.unitData?.isDeleted ? props?.unitData?.isDeleted : 0,
        isSync: isSync ? isSync : 0,
        storeId: STORE_Id,
      };
      handlePopupClose();
      if (isOnline) {
        console.log("online R CHali");
        props.unitData
          ? dispatch(updateUnit(postData, props?.unitCreationSuccess, props?.setPopUpMessage))
          : dispatch(addUnit(postData, props?.unitCreationSuccess, props?.setPopUpMessage, PopUpMessegeHandler));
        // axios 
        //   .post(`${SERVER_URL}${UPSERT_UNIT}`, postData, {
        //     headers: { Authorization: `Bearer ${userToken} ` },
        //   })
        //   .then(({ data }) => {
        //     dispatch(getUnitList());
        //     props.setshow(false);
        //   });
      } else {
        console.log("Offline R CHali");
        if (props?.unitData) {
          const result = unitApi?.unitDB?.updateUnitById(postData);
          console.log("resultupdate... ", result);
          props?.setUnitPostRes(result);
          result?.changes === 1 && props.setshow(false);
        } else {
          const result =
            unitApi &&
            unitApi?.unitDB?.insertUnit(
              parseInt(getUTCDate()),
              UnitName,
              0,
              parseInt(getUTCDate()),
              0,
              0,
              parseInt(storeId)
            );
          console.log("result ", result);
          props?.setUnitPostRes(result);
          result?.changes === 1 && props.setshow(false);
        }
      }
    }

  };

  // to close popup modal
  const handlePopupClose = () => {
    props.setshow(false);
  };

  // for change check box value
  const onChangeHandelMeasurable = () => {
    setUnitMeasurable(!UnitMeasurable);
  };

  const handleInput = (e) => {
    let value = e.target.value.replace(/^[^a-zA-Z]+/, '');
    setError("");
    setUnitName(value);
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
        <ModalHeader
          toggle={() => props.setshow(!props.isModelVisible)}
          className="popup-modal"
        >
          {modalHeader}
        </ModalHeader>
        <ModalBody className="popup-modal">
          <form action="">
            <InputLabel className="requiredstar">{t("UnitDetails.unitName")}</InputLabel>
            <TextField
              type="text"
              size="small"
              name="unitFieldName"
              placeholder={t("UnitDetails.unitPlaceholder")}
              className="form-control"
              value={UnitName}
              onChange={handleInput}
              inputProps={{ maxLength: 50 }}
            />
            {error ? (
              <span className="text-danger">
                {error} <br />
              </span>
            ) : null}

            {/* <input
              type="checkbox"
              name="isMeasurableFieldValue"
              checked={UnitMeasurable}
              onChange={onChangeHandelMeasurable}
              className="m-1"
            /> */}
            <Checkbox
              className="p-0"
              type="checkbox"
              checked={UnitMeasurable}
              size="medium"
              onChange={onChangeHandelMeasurable}
              style={{ padding: 3 }}
            />
            <label> {t("UnitDetails.isMeasurable")}</label>
          </form>

          <Button
            className="mt-4"
            variant="contained"
            style={{
              backgroundColor: "var(--button-bg-color)",
              color: "var(--button-color)",
            }}
            onClick={() => AddUnit()}
          >
            {t("UnitDetails.submit")}
          </Button>

          {/* <AlertpopUP
            open={isPopupOpen}
            message={
              apiError?.length > 0 ? apiError : "Unit added successfully!"
            }
            severity={apiError?.length > 0 ? "error" : "success"}
            onClose={handleClose}
          /> */}


        </ModalBody>
      </Modal>
    </div>
  );
};

export default UnitModal;
