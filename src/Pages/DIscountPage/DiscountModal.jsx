import axios from "axios";
import React, { useEffect, useState } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import moment from "moment";
import {
  SERVER_URL,
  STORE_CURRENCY,
  STORE_Id,
  UPSERT_DISCOUNT,
  getUTCDate,
} from "../../Containts/Values";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import { addDiscount, getDiscountlist, updateDiscount } from "../../Redux/Discount/discountSlice";
import { useTranslation } from "react-i18next";
import { Button, InputLabel, TextField } from "@mui/material";
import AlertpopUP from "../../utils/AlertPopUP";
import { apiFailureResponse, showPopupHandleClick } from "../../utils/constantFunctions";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import SubscriptionPlanModal from "../../Components/TrialInformationCard/SubscriptionPlanModal";
import RocketImage from "../../assets/images/RocketIcon.png"


let userToken = localStorage.getItem("userToken");

const DiscountModal = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  console.log("props?.discountData ", props?.discountData)
  const discountApi = window.discountApi;
  const isOnline = useSelector((state) => state.checkInternet.isOnline);
  const [discountId] = useState(props?.discountData?.discountId);
  const [discountName, setDiscountName] = useState(
    props?.discountData?.discountName
  );
  const [discountValue, setDiscountValue] = useState(
    props?.discountData?.discountVal
  );
  const [sDate, setsDate] = useState(
    props.discountData
      ? new Date(moment(props?.discountData?.startDate).format("L"))
      : new Date()
  );

  const [endDate, setEndDate] = useState(
    props.discountData
      ? new Date(moment(props?.discountData?.endDate).format("L"))
      : new Date()
  );

  // seeting expiry time
  useEffect(() => {
    let hours = 23;
    endDate.setHours(hours);
    let minutes = 59;
    endDate.setMinutes(minutes);
    let second = 59;
    endDate.setSeconds(second);
    console.log(endDate);
    console.log("endDate ", moment(endDate).format("LTS"));
  }, [endDate]);

  const [isPercent, setPercent] = useState(props?.discountData?.isPercent);
  const [error, setError] = useState({ discountName: "", discountValue: "" });
  const [infoBackground, setInfoBackground] = useState("var(--main-bg-color)");
  const modalHeader = props.isEdit ? t("DiscountDetails.editDiscount") : t("DiscountDetails.addDiscount");

  const [disableBackground, setDisableBackground] = useState("var(--white-color)");
  const [maxLength, setMaxLength] = useState();
  const [isSync, setIsSync] = useState(
    props?.discountData?.isSync ? props?.discountData?.isSync : 0
  );


  const [isPopupOpen, setIsPopupOpen] = useState(false); // for popup
  const [modalOpen, setModalOpen] = useState(false);
  console.log("modalOpen..discount", modalOpen);
  // const [apiError, setApiError] = useState("");
  const navigate = useNavigate();
  // console.log("apiError", apiError)

  // apiError state empty after 3 second
  // and user redirect to /discount page
  // useEffect(() => {
  //   if (apiError?.length > 0) {
  //     showPopupHandleClick(setIsPopupOpen, 3000, setApiError); //for popUp msg

  //   }
  // }, [apiError?.length > 0])

  const handleClose = () => {
    setIsPopupOpen(false);
  };


  useEffect(() => {
    if (isPercent) {
      setInfoBackground("var(--main-bg-color)");
      setDisableBackground("var(--white-color)");
      setMaxLength(2);
    } else {
      setInfoBackground("var(--white-color)");
      setDisableBackground("var(--main-bg-color)");
      setMaxLength(5);
    }
  }, []);

  // validation handler for input fields
  const validation = () => {
    if (discountName === undefined || discountName === "") {
      setError({ ...error, discountName: "Please enter discount name" });
      return false;
    } else if (discountValue === undefined || discountValue === "") {
      setError({ ...error, discountValue: "Please enter discount value" });
      return false;
    }
    return true;
  };

  // start date handler
  const startDatePickerHandler = (date) => {
    console.log("START date ", date);
    setsDate(date);
    setEndDate(date);
  };

  // end date handler
  const endDatePickerHandler = (date) => {
    setEndDate(date);
  };

  // for success popup after product save
  // const discountCreationSuccess = () => {
  //   props.setshow(false) // for close add discount modal
  //   showPopupHandleClick(setIsPopupOpen, 3000, setApiError, navigate); //for popUp msg
  //   console.log("discount createion success")

  // };

  // for open plan subscription modal
  const handleUpgrade = () => {
    props.setPriceModalOpen(true)
    // setModalOpen(true);
  }


  // for limit Exceeded and already name use PopUpMessegeHandler..
  const PopUpMessegeHandler = (message) => {
    // for limit Exceeded popupMessege..
    if (message === "Discount Added failed ") {
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
      props?.setApiError("This Discount name is already exists")
    }
  };



  // handle for add new discount
  const AddDiscount = () => {
    let val = validation();
    if (val) {
      const postData = {
        discountName: discountName,
        discountVal: parseInt(discountValue),
        startDate: new Date(moment(sDate, "llll")).valueOf(),
        isPercent: isPercent,
        percent: isPercent,
        endDate: new Date(moment(endDate, "llll")).valueOf(),
        storeId: STORE_Id ? STORE_Id : null,
        discountId: discountId ? discountId : 0,
      };

      // it is a sqlite discount schema
      const sqlitePostData = {
        discountName: discountName,
        discountVal: parseInt(discountValue),
        startDate: new Date(moment(sDate, "llll")).valueOf(),
        isPercent: isPercent ? 1 : 0,
        isDeleted: props?.discountData?.isDeleted ? props?.discountData?.isDeleted : 0,
        endDate: new Date(moment(endDate, "llll")).valueOf(),
        lastUpdate: getUTCDate(),
        isSync: isSync,
        storeId: STORE_Id,
        discountId: discountId ? discountId : getUTCDate(), // if we update sqlite discount we need to pass sqlite discount id TODO
      };
      props.setshow(false);
      if (isOnline) {
        props.discountData
          ? dispatch(updateDiscount(postData, props?.discountCreationSuccess, props?.setPopUpMessage))
          : dispatch(addDiscount(postData, props?.discountCreationSuccess, props?.setPopUpMessage, PopUpMessegeHandler));
        // axios
        //   .post(`${SERVER_URL}${UPSERT_DISCOUNT}`, postData, {
        //     headers: { Authorization: `Bearer ${userToken} ` },
        //   })
        //   .then(({ data }) => {
        //     data && dispatch(getDiscountlist());
        //     props.setshow(false);
        //   });
      } else {
        console.log("offlineChala")
        // inserting discount into sqlite databse if user not updatnig it
        const result = props?.discountData
          ? discountApi?.discountDB?.updateDiscountById(sqlitePostData)
          : discountApi?.discountDB?.insertDiscount(sqlitePostData);
        props?.setDiscountPostRes(result)
        props.setshow(false);
      }

    }

  };


  // to get data from input field
  const handleName = (e) => {
    setError({ ...error, discountName: "" });
    let value = e.target.value.replace(/^[^a-zA-Z]+/, '');
    setDiscountName(value);
  };
  const handleValue = (e) => {
    setError({ ...error, discountValue: "" });
    const value = e.target.value.replace(/\D/g, "");
    setDiscountValue(value)
  };

  // to set percent value
  const handlePercentButton = () => {
    setDiscountValue("");
    setInfoBackground("var(--main-bg-color)");
    setDisableBackground("var(--white-color)");
    setPercent(true);
    setMaxLength(2);

  };

  // to set currency value
  const handleRupeeButton = () => {
    setDiscountValue("");
    setInfoBackground("var(--white-color)");
    setDisableBackground("var(--main-bg-color)");
    setPercent(false);
    setMaxLength(5);
  };



  return (
    <>
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
              <InputLabel className="requiredstar">
                {t("DiscountDetails.discountName")}
              </InputLabel>
              <TextField
                type="text"
                size="small"
                name="fieldName"
                placeholder={t("DiscountDetails.enterDiscountName")}
                className="form-control"
                value={discountName}
                onChange={handleName}
                inputProps={{ maxLength: 50 }}
              />
              {error.discountName ? (
                <span className="text-danger">{error.discountName}</span>
              ) : null}
            </div>
            <div className="mb-2">
              <InputLabel className="requiredstar">
                {" "}
                {t("DiscountDetails.discountValue")}
              </InputLabel>
              <TextField
                maxLength={maxLength}
                type="tel"
                size="small"
                name="fieldValue"
                placeholder={t("DiscountDetails.enterDiscountValue")}
                className="form-control"
                value={discountValue}
                onChange={handleValue}
                inputProps={{ maxLength: 7 }}
              />
              {error.discountValue ? (
                <span className="text-danger">{error.discountValue}</span>
              ) : null}
            </div>
            {/* <div className="mt-2 row box">
              <div
                style={{
                  textAlign: "center",
                  backgroundColor: infoBackground,
                  height: 40,
                  width: 50,
                  paddingTop: 6,
                }}
                onClick={handlePercentButton}
              >
                <span
                  style={{
                    marginTop: 5,
                    alignItems: "center",
                    fontWeight: "bold",
                    fontSize: 17,
                    color: disableBackground,
                  }}
                >
                  %{" "}
                </span>
              </div>
              <div
                style={{
                  textAlign: "center",
                  backgroundColor: disableBackground,
                  height: 40,
                  width: 50,
                  paddingTop: 6,
                }}
                onClick={handleRupeeButton}
              >
                <span
                  style={{
                    fontWeight: "bold",
                    fontSize: 17,
                    color: infoBackground,
                  }}
                >
                  {STORE_CURRENCY}
                </span>
              </div>
            </div> */}
            <div className="discountBtnClass">
              <Button
                variant="contained"
                onClick={handlePercentButton}
                style={{
                  backgroundColor: infoBackground,
                  color: disableBackground,
                  borderRadius: "5px 0px 0px 5px"
                }}
              >
                %
              </Button>
              <Button
                variant="contained"
                onClick={handleRupeeButton}
                style={{
                  color: infoBackground,
                  backgroundColor: disableBackground,
                  borderRadius: "0px 5px 5px 0px"
                }}
              >
                {STORE_CURRENCY}
              </Button>
            </div>
            <br />
            <div className="mt-2 mb-4">
              <InputLabel> {t("DiscountDetails.startDate")}</InputLabel>
              <DatePicker
                minDate={sDate}
                className="form-control"
                selected={sDate}
                dateFormat="d/MM/yyyy"
                onChange={(date) => {
                  startDatePickerHandler(date);
                }}
              />
            </div>
            <div className="mb-4">
              <InputLabel> {t("DiscountDetails.endDate")}</InputLabel>
              <DatePicker
                minDate={sDate}
                className="form-control"
                selected={endDate}
                dateFormat="d/MM/yyyy"
                onChange={(date) => endDatePickerHandler(date)}
              />
              <br />
            </div>
          </form>

          <Button
            className="mt-3"
            variant="contained"
            style={{
              backgroundColor: "var(--button-bg-color)",
              color: "var(--button-color)"
            }}
            onClick={() => AddDiscount()}
          >
            {t("DiscountDetails.submit")}
          </Button>

          {/* <AlertpopUP
          open={isPopupOpen}
          message={apiError !== "" ? apiError : "Discount added successfully!"}
          severity={apiError !== "" ? "error" : "success"}
          onClose={handleClose}
        /> */}

        </ModalBody>
      </Modal>
      
    </ >
  );
};

export default DiscountModal;
