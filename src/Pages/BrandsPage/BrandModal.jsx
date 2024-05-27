import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import {
  SERVER_URL,
  STORE_Id,
  UPLOAD_IMAGE,
  UPSERT_BRAND,
  getUTCDate,
} from "../../Containts/Values";
import { addBrand, getBrandList, updateBrand } from "../../Redux/Brand/brandSlice";
import { useTranslation } from "react-i18next";
import AlertpopUP from "../../utils/AlertPopUP";
import { apiFailureResponse, getToken, showPopupHandleClick } from "../../utils/constantFunctions";
import { useNavigate } from "react-router-dom";
import { InputLabel, TextField, Button } from "@mui/material";
import Swal from "sweetalert2";
import SubscriptionPlanModal from "../../Components/TrialInformationCard/SubscriptionPlanModal";
import RocketImage from "../../assets/images/RocketIcon.png"
import DragandDrop from "../../Components/DragandDrop/DragandDrop";

let userToken = localStorage.getItem("userToken");

const BrandModal = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const brandApi = window.brandApi;
  const isOnline = useSelector((state) => state.checkInternet.isOnline);
  const [brandName, setbrandName] = useState(props?.brandData?.brandName);
  const [brandId] = useState(props?.brandData?.brandId);
  console.log("brandId... ", brandId)
  const [erro, setError] = useState('')
  const modalHeader = props.isEdit
    ? t("BrandDetails.editBrands")
    : t("BrandDetails.addBrands");
  const [isSync, setIsSync] = useState(
    props?.brandData?.isSync ? props?.brandData?.isSync : 0
  );
  const [isPopupOpen, setIsPopupOpen] = useState(false); // for popup
  const [modalOpen, setModalOpen] = useState(false);
  const [imageFile, setImageFile] = useState([]);
  const [imgUploadLoader, setImgUploadLoader] = useState(false);
  console.log("imageFile...brand ", imageFile);

  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();
  console.log("apiError", apiError);

  // apiError state empty after 3 second
  // and user redirect to /brand page
  useEffect(() => {
    if (apiError?.length > 0) {
      showPopupHandleClick(setIsPopupOpen, 3000, setApiError); //for popUp msg

    }

  }, [apiError?.length > 0])

  const handleClose = () => {
    setIsPopupOpen(false);
  };


  useEffect(() => {
    console.log("props.brandData?.imageUrl", props.brandData?.imageUrl);
    if (props?.brandData?.imageUrl !== null &&
      props.brandData?.imageUrl !== "" &&
      props.brandData?.imageUrl !== undefined) {
      setImageFile([{ preview: props.brandData?.imageUrl ? props.brandData?.imageUrl : "" }])
    }

  }, [props?.brandData?.imageUrl])


  const validate = () => {
    if (brandName === undefined || brandName === '') {
      setError("Please enter brand name")
      return false;
    }
    return true
  }

  //brand creation successfully popup
  const brandCreationSuccess = () => {
    showPopupHandleClick(setIsPopupOpen, 3000, setApiError, navigate);
    console.log("added sucess");//for popUp msg
  };



  //for limit Exceeded and already name use PopUpMessegeHandler.....
  const PopUpMessegeHandler = (message) => {
    // for limit Exceeded popupMessege..
    if (message === "Brand Added failed ") {
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
      props?.setApiError("This brand name is already exists")
      props?.setIsPopupOpen(true)
    }
  };




  // brand image upload
  const categoryUploadImageHandler = async () => {
    try {
      setImgUploadLoader(true); // loading enabled
      let data = new FormData();

      data.append("file", imageFile[0]);

      const config = {
        timeout: 10000,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + getToken(),
        },
      };

      const response = await axios.post(
        SERVER_URL + UPLOAD_IMAGE,
        data,
        config
      );

      console.log("response... ", response?.data?.imagesResponse[0]?.imageUrl);
      response?.data?.imagesResponse[0]?.imageUrl && setImgUploadLoader(false); // loading disabled
      return (
        response?.data?.imagesResponse[0] &&
        response?.data?.imagesResponse[0]?.imageUrl
      );
    } catch (error) {
      // console.log("Category image upload failed", error);
      // error && setImgUploadLoader(false); // loading disabled
      // throw error; // Optionally, you can rethrow the error or handle it as needed
    }
  };


  // for add new brand
  const AddBrand = async () => {
    let val = validate();
    if (val) {
      // const imageUrl = await categoryUploadImageHandler();
      // console.log("imageUrl... ", imageUrl);

      let imageUrl = ""
      if (imageFile && imageFile[0]?.name !== "" && imageFile[0]?.name !== undefined) {
        console.log("imageFile?.name", imageFile?.name);
        imageUrl = await categoryUploadImageHandler();
      }

      const postData = {
        brandName: brandName,
        brandId: brandId ? brandId : 0,
        imageUrl: imageUrl === "" ? imageFile[0]?.preview : imageUrl,
        // imageUrl: imageUrl,
        storeId: STORE_Id,
        isDeleted: props?.brandData ? props?.brandData?.isDeleted : 0,
        lastUpdate: getUTCDate(),
        isSync: isSync,
      };
      handlePopupClose();

      // const schemaForSqlite = {
      //   brandName: brandName,
      //   brandId: brandId ? brandId : getUTCDate(),
      //   storeId: STORE_Id,
      //   isDeleted: 0,
      //   lastUpdate: getUTCDate(),
      //   isSync: 0,
      // };

      if (isOnline) {
        props?.brandData
          ? dispatch(updateBrand(postData, props?.brandCreationSuccess, props?.setPopUpMessage))
          : dispatch(addBrand(postData, props?.brandCreationSuccess, props?.setPopUpMessage, PopUpMessegeHandler));
      } else {
        console.log("props... ", props?.brandData)
        // // it's for sqlite
        const result = props?.brandData
          ? brandApi && brandApi?.brandDB?.updateBrandById(postData)
          : brandApi && brandApi?.brandDB?.insertBrand(postData);
        props?.setBrandPostRes(result)
        props.setshow(false);
      }
    }

  };

  // to close popup modal
  const handlePopupClose = () => {
    props.setshow(false)
  }

  const handleInput = (e) => {
    let value = e.target.value.replace(/^[^a-zA-Z]+/, '');
    setbrandName(value);
    setError("");
  };

  // for open subscription modal
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
          {/* {t("BrandDetails.addBrands")} */}
          {modalHeader}
        </ModalHeader>
        <ModalBody className="popup-modal">
          <form action="">
            <InputLabel className="requiredstar">
              {t("BrandDetails.brandName")}
            </InputLabel >
            <TextField
              type="text"
              size="small"
              name="brandFieldName"
              placeholder={t("BrandDetails.brandPlaceholder")}
              className="form-control"
              value={brandName}
              onChange={handleInput}
              inputProps={{ maxLength: 50 }}
            />
            {erro ? <span className="text-danger">{erro}</span> : null}
          </form>
          <br />

          <div className="mb-3">
            <DragandDrop
              files={imageFile}
              setFiles={setImageFile}
            // uploadImageHandler={uploadImageHandler}
            />
          </div>
          <Button
            className="btn btn-primary mt-4"
            variant="contained"
            style={{
              backgroundColor: "var(--button-bg-color)",
              color: "var(--button-color)",
            }}
            onClick={() => AddBrand()}
          >
            {t("BrandDetails.submit")}
          </Button>

          {/* <AlertpopUP
            open={isPopupOpen}
            message={apiError?.length > 0 ? apiError : "Brand added successfully!"}
            severity={apiError?.length > 0 ? "error" : "success"}
            onClose={handleClose}
          /> */}

        </ModalBody>
      </Modal>

    </div>
  );
};

export default BrandModal;
