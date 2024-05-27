import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import {
  SERVER_URL,
  STORE_Id,
  UPLOAD_IMAGE,
  getUTCDate,
} from "../../Containts/Values";
import {
  addCategory,
  getCategoryList,
  updatedCategory,
} from "../../Redux/Category/categorySlice";
import { useTranslation } from "react-i18next";
import { Button, InputLabel, TextField } from "@mui/material";
import DragAndDropPureHtml from "../../Components/DragandDrop/DragAndDropPureHtml";
import DragandDrop from "../../Components/DragandDrop/DragandDrop";
import { getToken } from "../../utils/constantFunctions";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";
import Swal from "sweetalert2";
import SubscriptionPlanModal from "../../Components/TrialInformationCard/SubscriptionPlanModal";
import RocketImage from "../../assets/images/RocketIcon.png";

let userToken = localStorage.getItem("userToken");

const CategoryModal = (props) => {
  console.log("props... ", props?.categoryData);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const modalHeader = props.isEdit
    ? t("CategoryDetails.editCategory")
    : t("CategoryDetails.addCategory");

  const categoryApi = window.categoryApi;
  const {
    isModelVisible,
    isEdit,
    categoryData,
    setshow,
    Open,
    setCategoryPostRes,
    categoryCreationSuccess,
    setPopUpMessage,
    priceModalOpen,
    setPriceModalOpen
  } = props;
  const isOnline = useSelector((state) => state.checkInternet.isOnline);
  const [categoryName, setcategoryName] = useState(
    props?.categoryData?.categoryName
  );
  const [categoryId] = useState(props?.categoryData?.categoryId);
  const isLoading = useSelector((state) => state.category.loading);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState([]);
  console.log("imageFile... ", imageFile);
  const [imgUploadLoader, setImgUploadLoader] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  console.log("modalOpen... ", modalOpen);

  // useEffect(() => {}, [modalOpen]);

  useEffect(() => {
    console.log("props.categoryData?.imageUrl", props.categoryData?.imageUrl);
    if (props?.categoryData?.imageUrl !== null &&
      props?.categoryData?.imageUrl !== "" &&
      props?.categoryData?.imageUrl !== undefined) {
      setImageFile([{ preview: props?.categoryData?.imageUrl ? props.categoryData?.imageUrl : "" }])
    }

  }, [props?.categoryData?.imageUrl])


  const validate = () => {
    if (categoryName === undefined || categoryName === "") {
      setError("Please enter category name");
      return false;
    }
    return true;
  };

  // to close popup modal
  const handlePopupClose = () => {
    props.setshow(false);
  };

  // to get data from input field
  const handleInput = (e) => {
    let value = e.target.value.replace(/^[^a-zA-Z]+/, "");
    setcategoryName(value);
    setError("");
  };

  // category image upload
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
      setImageFile([])
      return (
        response?.data?.imagesResponse[0] &&
        response?.data?.imagesResponse[0]?.imageUrl
      );
    } catch (error) {
      // console.log("Category image upload failed", error);
      error && setImgUploadLoader(false); // loading disabled
      // throw error; // Optionally, you can rethrow the error or handle it as needed
    }
  };

  // for limit Exceeded and already name use PopUpMessegeHandler..
  const PopUpMessegeHandler = (message) => {
    // for limit Exceeded popupMessege..
    if (message === "Category Added failed ") {
      Swal.fire({
        title: "Limit Exceeded",
        html: "<span style='color: white'>Upgrade to unlock this feature</span>",
        iconHtml: `<img src="${RocketImage}" width="100" height="100">`,
        showCloseButton: true,
        closeButtonHtml: '<span style="color:#ffffffb5;">&times;</span>',
        customClass: {
          icon: "no-border",
          confirmButton: "custom-button-class",
          popup: "custom-popup-class",
          title: "title-color",
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
      props?.setIsPopupOpen(true);
      props?.setApiError("This Category name is already exists");
    }
  };

  // for add new category
  const AddCategory = async () => {
    let val = validate();
    if (val) {
      console.log("AddCategory...", imageFile?.name !== undefined, imageFile);
      let imageUrl = ""
      if (imageFile && imageFile[0]?.name !== "" && imageFile[0]?.name !== undefined) {
        console.log("imageFile?.name", imageFile?.name);
        imageUrl = await categoryUploadImageHandler();
      }
      //  imageUrl = await categoryUploadImageHandler();
      console.log("imageUrl... ", imageUrl);

      // console.log("imageFile.preview ", imageFile.preview);
      const postSqliteData = {
        categoryName: categoryName,
        categoryId: categoryId ? categoryId : isOnline ? 0 : getUTCDate(),
        imageUrl: imageUrl === "" ? imageFile[0]?.preview : imageUrl,
        // imageUrl: imageUrl,
        storeId: STORE_Id,
        isDeleted: props?.categoryData ? props?.categoryData?.isDeleted : 0,
        lastUpdate: getUTCDate(),
        isSync: props?.categoryData ? props?.categoryData?.isSync : 0,
      };
      handlePopupClose();
      if (isOnline) {
        props?.categoryData
          ? dispatch(updatedCategory(postSqliteData, categoryCreationSuccess, setPopUpMessage))
          : dispatch(addCategory(postSqliteData, categoryCreationSuccess, setPopUpMessage, PopUpMessegeHandler));
        // axios
        //   .post(`${SERVER_URL}category/upsertCategory`, postSqliteData, {
        //     headers: { Authorization: `Bearer ${userToken} ` },
        //   })
        //   .then(({ data }) => {
        //     dispatch(getCategoryList());
        //     props.setshow(false);
        //     props?.setOpen(true);
        //   });
      } else {
        const result = props?.categoryData
          ? categoryApi?.categoryDB?.updateCategoryById(postSqliteData)
          : categoryApi?.categoryDB?.insertCategory(postSqliteData);

        console.log("result... ", result);
        setCategoryPostRes && setCategoryPostRes(result);
        result?.changes === 1 && props.setshow(false);
      }
    }

  };

  // for open plan subscription modal
  const handleUpgrade = () => {
    console.log("handleUpgradeCHALA");
    // setModalOpen(true);
    setPriceModalOpen(true)
  };

  return imgUploadLoader || isLoading ? (
    <LoadingSpinner />
  ) : (
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
            <InputLabel className="requiredstar">
              {t("CategoryDetails.category")}
            </InputLabel>
            <TextField
              type="text"
              size="small"
              name="categoryFieldName"
              placeholder={t("CategoryDetails.inputText")}
              className="form-control"
              value={categoryName}
              onChange={handleInput}
              inputProps={{ maxLength: 50 }}
            />
            {error ? <span className="text-danger">{error}</span> : null}
          </form>
          <br />

          <div className="mb-3">
            <DragandDrop
              files={imageFile}
              setFiles={setImageFile}
            />
            {/* {props.categoryData?.imageUrl && (
              <img
                src={props.categoryData.imageUrl}
                alt="Category"
                style={{ maxWidth: "100%", height: "auto", marginTop: "10px" }}
              />
            )} */}
          </div>

          <Button
            className="mt-4"
            variant="contained"
            style={{
              backgroundColor: "var(--button-bg-color)",
              color: "var(--button-color)",
            }}
            onClick={() => AddCategory()}
          >
            {t("CategoryDetails.submit")}
          </Button>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default CategoryModal;
