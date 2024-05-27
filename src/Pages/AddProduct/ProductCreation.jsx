import {
  Alert,
  Button,
  InputLabel,
  Snackbar,
  TextareaAutosize,
  TextField,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import DragandDrop from "../../Components/DragandDrop/DragandDrop";
import MainContentArea from "../MainContentArea/MainContentArea";
import Select from "react-select";
import { CUSTOM_DROPDOWN_STYLE, switchStyles } from "../../utils/CustomeStyles";
import "./AddProduct.css";
import Switch from "@mui/material/Switch";
import ImageSliderFroPre from "../../Components/ImageSlider/ImageSliderFroPre";
import PrevCardProductSlider from "../../Components/ImageSlider/PrevCardProductSlider";
import defaultImage from "../../assets/images/default-image.png";
import { getUnitList } from "../../Redux/Unit/unitSlice";
import { getBrandList } from "../../Redux/Brand/brandSlice";
import { getCategoryList } from "../../Redux/Category/categorySlice";
import { getDiscountlist } from "../../Redux/Discount/discountSlice";
import { getTaxList, getTaxMappedList } from "../../Redux/Tax/taxSlice";
import {
  COGNITO_USER_INFO,
  getUTCDate,
  retrieveObj,
  SERVER_URL,
  STORE_Id,
  UPLOAD_PROD_IMG,
  validDiscount,
} from "../../Containts/Values";
import moment from "moment";
import DatePicker from "react-datepicker";
import {
  addProduct,
  setProductDefaultImg,
} from "../../Redux/Product/productSlice";
import Swal from "sweetalert2";
import axios from "axios";
import UnitModal from "../UnitsPage/UnitModal";
import CategoryModal from "../CategoryPages/CategoryModal";
import BrandModal from "../BrandsPage/BrandModal";
import TaxModal from "../TaxesDetailsPage/TaxModel";
import DiscountModal from "../DIscountPage/DiscountModal";
import AlertpopUP from "../../utils/AlertPopUP";
import {
  apiFailureResponse,
  showPopupHandleClick,
  validateFields,
} from "../../utils/constantFunctions";
import { blobToBuffer } from "../../utils/constantFunctions";
import DragAndDropPureHtml from "../../Components/DragandDrop/DragAndDropPureHtml";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";
import RocketImage from "../../assets/images/RocketIcon.png";
import SubscriptionPlanModal from "../../Components/TrialInformationCard/SubscriptionPlanModal";
import { addInventoryProduct } from "../../Redux/InventoryManage/InventoryManageSlice";

const label = { inputProps: { "aria-label": "Switch demo" } };
let userToken = localStorage.getItem("userToken");

const ProductCreation = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const productApi = window.productApi;
  const unitApi = window.unitApi;
  const categoryApi = window.categoryApi;
  const brandApi = window.brandApi;
  const taxApi = window.taxApi;
  const discountApi = window.discountApi;
  const mappedTaxApi = window.mappedTaxApi;
  const discountMappingApi = window.discountMappingApi;
  const productImageApi = window.productImageApi;

  const prodNameInputRef = useRef(null);
  const sellingPriceInputRef = useRef(null);
  const purchasingPriceInputRef = useRef(null);
  const quantityInputRef = useState(null);
  const unitInputRef = useRef(null);
  const categoryInputRef = useRef(null);
  const prodDescInputRef = useRef(null);
  const [searchParams] = useSearchParams();
  const unitData = useSelector((state) => state.unit.unitData);
  const categoriesData = useSelector((state) => state.category.categoriesData);
  const brandData = useSelector((state) => state.brand.brandData);
  const taxData = useSelector((state) => state.tax.taxData);
  const discountData = useSelector((state) => state.discount.discountData);
  console.log("taxData ", taxData);
  console.log("discountData ", discountData);
  const isOnline = useSelector((state) => state.checkInternet.isOnline);
  // mapping lists
  const mappedTaxList = useSelector((state) => state.tax.mappedTaxList);
  const discountMap = useSelector((state) => state.discount.getSingleDiscount);
  const prodLoading = useSelector((state) => state.product.loading);
  console.log("prodLoading... ", prodLoading);
  const prodId = searchParams.get("productId");
  const [fields, setFields] = useState({
    productName: "",
    sellingPrice: "",
    unitValue: "",
    categoryValue: "",
    productDesc: "",
    purchasingPrice: "",
    mrp: "",
    barCode: "",
    quantity: "",
    stockLevelAlert: "",
  });
  console.log("fields ", fields);
  const [error, setError] = useState({
    productName: "",
    sellingPrice: "",
    unitValue: "",
    productDesc: "",
    categoryValue: "",
    purchasingPrice: "",
    quantity: "",

  });
  const [unitValue, setUnitValue] = useState("");
  console.log("unitValue ", unitValue);
  const [categoryValue, setCategoryValue] = useState("");
  const [brandValue, setBrandValue] = useState("");
  const [taxValue, setTaxValue] = useState("");
  console.log("taxValue... ", taxValue);
  const [discountvalue, setDiscountValue] = useState("");
  const [expireDate, setExpireDate] = useState(new Date());
  console.log("discountvalue... ", discountvalue);
  const [moreOption, setMoreOption] = useState(false);
  const [showInventoryManage, setShowInventoryManage] = useState(false);
  console.log("showInventoryManage007", showInventoryManage);
  const [taxInclude, setTaxInclude] = useState(false);
  const [cognitoUserName, setCognitoUserName] = useState("");
  const [storeName, setStoreName] = useState("");

  const [imageFile, setImageFile] = useState([]);
  console.log("imageFile... ", imageFile);
  const [editProductImgs, setEditProductImgs] = useState([]);
  const [defaultImgIndex, setDefaultImgIndex] = useState(0);
  const [defaultImageObj, setDefaultImageObj] = useState({});

  const [showUnitModal, setshowUnitModal] = useState(false);
  const [showBrandModal, setshowBrandModal] = useState(false);
  const [showCategoryModal, setshowCategoryModal] = useState(false);
  const [showTaxModal, setshowTaxModal] = useState(false);
  const [showDiscountModal, setshowDiscountModal] = useState(false);

  const [isPopupOpen, setIsPopupOpen] = useState(false); // for popup
  const [popUpMessage, setPopUpMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  console.log("popUpMessage..product", popUpMessage);
  const [apiError, setApiError] = useState("");
  console.log("apiError", apiError);

  // apiError state empty after 3 second
  // and user redirect to /products page
  useEffect(() => {
    if (apiError?.length > 0) {
      console.log("error useEffect");
      showPopupHandleClick(setIsPopupOpen, 3000, setApiError); //for popUp msg
    }
  }, [apiError?.length > 0]);

  // after unit created from offline mode response store in this state
  const [unitPostRes, setUnitPostRes] = useState(false);
  const [categoryPostRes, setCategoryPostRes] = useState(false);
  const [brandPostRes, setBrandPostRes] = useState(false);
  const [taxPostRes, setTaxPostRes] = useState(false);
  const [discountPostRes, setDiscountPostRes] = useState(false);

  // helper api's data store in these state
  const [unitListData, setUnitListData] = useState([]);
  const [categoryListData, setCategoryListData] = useState([]);
  const [brandListData, setBrandListData] = useState([]);
  const [taxListData, setTaxListData] = useState([]);
  const [discountListData, setDiscountListData] = useState([]);

  // console.log("unitListData ", unitListData);
  // console.log("categoryListData ", categoryListData);
  // console.log("brandListData ", brandListData);
  // console.log("taxListData ", taxListData);
  console.log("discountListData ", discountListData);

  useEffect(() => {
    // imageFile &&
    //   imageFile.map((item) => {
    //     console.log("Image URL ", URL.createObjectURL(item));
    //   });
    // console.log("imageFile ", imageFile);
  }, []);

  useEffect(() => {
    retrieveObj("cognitoUserInfo").then((cognito) => {
      setCognitoUserName(cognito.username);
    });

    retrieveObj("storeInfo").then((storeInfo) => {
      setStoreName(storeInfo && storeInfo[0]?.storeName);
    });
  }, []);

  // here we storing helper api's data in state here
  useEffect(() => {
    unitData?.unit && setUnitListData(unitData?.unit);
    categoriesData?.category && setCategoryListData(categoriesData?.category);
    brandData?.brand && setBrandListData(brandData?.brand);
    taxData?.tax && setTaxListData(taxData?.tax);
    discountData?.discount && setDiscountListData(discountData?.discount);
  }, [
    unitData?.unit,
    categoriesData?.category,
    brandData?.brand,
    taxData?.tax,
    discountData?.discount,
  ]);

  // initial APIs Call
  useEffect(() => {
    if (isOnline) {
      dispatch(getUnitList(0, 0, ""));
      dispatch(getBrandList(0, 0, ""));
      dispatch(getCategoryList(0, 0, ""));
      dispatch(getDiscountlist(0, 0, "", validDiscount));
      dispatch(getTaxList(0, 0, ""));
      dispatch(getTaxMappedList());
    } else {
      const unitsData = unitApi?.unitDB?.getUnits();
      const categoriesListData = categoryApi?.categoryDB?.getAllCategories();
      const brandList = brandApi?.brandDB?.getBrands();
      const taxList = taxApi?.taxDB?.getAllTaxes();
      const discountList = discountApi?.discountDB?.getAllDiscounts();
      setUnitListData(unitsData);
      setCategoryListData(categoriesListData);
      setBrandListData(brandList);
      setTaxListData(taxList);
      setDiscountListData(discountList);
    }
  }, [unitPostRes, categoryPostRes, brandPostRes, taxPostRes, discountPostRes]);

  console.log("fields", fields);

  const productInputHanlder = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setError({ ...error, [name]: "" });

    if (name === "productName") {
      let Value = value.replace(/^[^a-zA-Z]*/, "");
      setFields({ ...fields, [name]: Value });
    } else if (
      name === "sellingPrice" ||
      name === "quantity" ||
      name === "stockLevelAlert" ||
      name === "purchasingPrice" ||
      name === "mrp"
    ) {
      let validate = value.match(/^(\d*\.{0,1}\d{0,2}$)/);
      if (validate) {
        setFields({ ...fields, [name]: value });
      }
    } else {
      setFields({ ...fields, [name]: value });
    }
  };

  // setting expiry time
  useEffect(() => {
    let hours = 23;
    expireDate && expireDate.setHours(hours);
    let minutes = 59;
    expireDate && expireDate.setMinutes(minutes);
    let second = 59;
    expireDate && expireDate.setSeconds(second);
  }, [expireDate]);

  // unit select handler
  const unitSelectHandler = (e, name) => {
    setError({ ...error, unitValue: "" });
    console.log(e, name);
    setFields({ ...fields, [name]: e });
    // setUnitValue(e);
  };

  // category select handler
  const categorySelectHandler = (e, name) => {
    // setCategoryValue(e);
    setError({ ...error, categoryValue: "" });
    console.log(e, name);
    setFields({ ...fields, [name]: e });
  };

  // brand select handler
  const brandSelectHandler = (e) => {
    setBrandValue(e);
  };

  // expireDate select handler
  const expireDateSelectHandler = (e) => {
    setExpireDate(e);
  };

  // tax select handler
  const taxSelectHandler = (e) => {
    setTaxValue(e);
  };

  // discount select handler
  const discountSelectHandler = (e) => {
    setDiscountValue(e);
  };

  // Set product default image
  const setDefaultHandler = (index) => {
    // console.log("index ", index);
    const newImgArray = imageFile && imageFile.filter((item, i) => i === index);
    // console.log("newImgArray Default ", newImgArray);

    setDefaultImgIndex(index);
  };

  // handle validation for check imp field
  const validation = () => {
    if (fields.productName === "") {
      setError({ ...error, productName: "Please enter product name" });
      if (prodNameInputRef.current) {
        prodNameInputRef.current.focus();
      }
      return false;
    } else if (fields.sellingPrice === "" || fields.sellingPrice <= 0) {
      setError({ ...error, sellingPrice: "Please enter selling price" });
      if (sellingPriceInputRef.current) {
        sellingPriceInputRef.current.focus();
      }
      return false;
    } else if (fields.categoryValue === "") {
      setError({ ...error, categoryValue: "Please select a category" });
      if (categoryInputRef.current) {
        categoryInputRef.current.focus();
      }
      return false;
    } else if (fields.unitValue === "") {
      setError({ ...error, unitValue: "Please select a unit" });
      if (unitInputRef.current) {
        unitInputRef.current.focus();
      }
      return false;
    } else if (fields.productDesc === "") {
      setError({ ...error, productDesc: "Please enter description" });
      if (prodDescInputRef.current) {
        prodDescInputRef.current.focus();
      }
      return false;
    } else if (showInventoryManage && (fields.purchasingPrice === "" || fields.purchasingPrice <= 0)) {
      setError({ ...error, purchasingPrice: "Please enter valid purchasing price" });
      if (purchasingPriceInputRef.current) {
        purchasingPriceInputRef.current.focus();
      }
      return false;
    } else if (showInventoryManage && (fields.quantity === "" || fields.quantity <= 0)) {
      setError({ ...error, quantity: "Please enter valid quantity" });
      if (quantityInputRef.current) {
        quantityInputRef.current.focus();
      }
      return false;
    }

    return true;
  };




  // const apiFailureResponse = (error) => {
  //   // console.log("apiFailureResponse ", error);
  //   // handleClick(); //for popUp show when api will be failure
  //   // setApiError(`An error occurred: ${error}`);

  //   return error

  // };

  const handleClose = () => {
    setIsPopupOpen(false);
  };

  // for success popup after product save
  const productCreationSuccess = () => {
    showPopupHandleClick(
      setIsPopupOpen,
      3000,
      setApiError,
      navigate,
      "/products"
    ); //for popUp msg
    console.log("product createion success");
    // Swal.fire({
    //   icon: "success",
    //   title: "Product created successfully.",
    // }).then((res) => {
    //   if (res?.isConfirmed) {
    //     window.location.reload();
    //     navigate(-1);
    //   }
    // });
  };

  const uploadImageHandler = (e) => {
    console.log("uploadImageHandlerChala....");
    const file = e.target.files;
    console.log("file... ", file);
  };

  console.log("isOnline...", isOnline);

  // limit Exceeded popupMessege..
  const limitExceededPopup = (message) => {
    if (message === "Product Added failed ") {
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
    }
  };

  const handleUpgrade = () => {
    setModalOpen(true);
  };

  // to add product in api
  const submitHandler = () => {
    const val = validation();
    // const val =  validateFields(fields, error, setError, {
    //   productName: prodNameInputRef,
    //   sellingPrice: sellingPriceInputRef,
    //   unitInputRef: unitInputRef,
    //   productDesc: prodDescInputRef,
    //   unitValue: unitInputRef,
    // });
    // console.log("val... ", val)

    // image upload functionality
    // if (imageFile) {
    //   console.log("chala");
    //   const cognitoUserName = COGNITO_USER_INFO;

    //   const productImagePayload = {
    //     imageId: getUTCDate(),
    //     fileData: imageFile && imageFile[0], // TODO
    //     filePreview: imageFile && imageFile[0]?.preview,
    //     productId: 0,
    //     storeId: STORE_Id,
    //     isProductDefaultImage: 0,
    //     userName: cognitoUserName?.userName,
    //     isSync: 0,
    //   };
    //   console.log("productImagePayload... ", productImagePayload);

    //   productImageApi?.productImageDB?.insertProductsImage(productImagePayload);
    // }

    // product creation api call commented for offline image stor testing
    if (val) {
      let postData = {
        purchasingPrice: fields && parseInt(fields.purchasingPrice),
        currencyId: 0,
        lastUpdate: 0,
        categoryId: fields && fields?.categoryValue?.categoryId,
        inventoryManage: showInventoryManage ? 1 : 0,
        maxRetailPrice: fields && parseInt(fields.mrp),
        stockLevelAlert: fields && fields.stockLevelAlert,
        brandId: brandValue && brandValue?.brandId,
        updatedBy: null,
        productId: 0,
        subCategoryId: 0,
        sellingPrice: fields && parseInt(fields.sellingPrice),
        active: 0,
        barCode: fields && fields.barCode,
        quantity: fields && fields.quantity,
        priceIncludeTax: taxInclude ? 1 : 0,
        notes: fields && fields.productDesc,
        storeId: parseInt(STORE_Id),
        productName: fields && fields.productName,
        unitId: fields && fields?.unitValue?.unitId,
        addedBy: null,
        isDeleted: 0,
        // discountName: selProductDiscount && selProductDiscount,
        // taxName:  selProductTax && selProductTax,
        expiryDate: new Date(moment(expireDate, "llll")).valueOf(),
      };

      let postDataForSqlite = {
        productId: getUTCDate(),
        productName: fields && fields.productName,
        sellingPrice: fields && parseInt(fields.sellingPrice),
        unitId: fields?.unitValue?.unitId,
        notes: fields && fields.productDesc,
        imageUrl: "",
        imageId: 0,
        image: "",
        imagesList: isOnline ? [] : "",
        purchasingPrice: fields && parseInt(fields.purchasingPrice),
        maxRetailPrice: fields && parseInt(fields.mrp),
        categoryId: fields?.categoryValue?.categoryId,
        // categoryValue && categoryValue?.categoryId
        //   ? categoryValue?.categoryId
        //   : 0,
        brandId: brandValue && brandValue?.brandId ? brandValue?.brandId : 0,
        barCode: fields && fields.barCode,
        quantity: fields && fields.quantity,
        stockLevelAlert: fields && fields.stockLevelAlert,
        expiryDate: getUTCDate(),
        lastUpdate: getUTCDate(),
        taxName: isOnline ? [] : taxValue?.taxName,
        discountName: isOnline ? [] : discountvalue?.discountName,
        active: 0,
        addedBy: isOnline ? 0 : "",
        currencyId: 0,
        dateAdded: isOnline ? 0 : "",
        inventoryManage: showInventoryManage ? 1 : 0,
        isDeleted: 0,
        priceIncludeTax: taxInclude ? 1 : 0,
        slug: 0,
        subCategoryId: 0,
        updatedBy: "",
        storeId: STORE_Id,
        isSync: 0,
        unitName: fields?.unitValue?.unitName,
        categoryName: fields?.categoryValue.categoryName,
        taxId: taxValue?.taxId,
        taxValue: taxValue?.taxValue,
        discountId: discountvalue?.discountId,
        discountVal: discountvalue?.discountVal,
        percent: discountvalue?.isPercent,
      };

      if (isOnline) {
        dispatch(
          addProduct(
            postData,
            discountvalue,
            taxValue,
            STORE_Id,
            // imageFileArray,
            // defaultImgIndex,
            // cognitoUserName,
            // storeName,
            productCreationSuccess,
            productUploadImageHandler,
            limitExceededPopup,
            // inventoryProductData
          )
        );
      } else {
        const resultProduct =
          productApi?.productDB?.insertProduct(postDataForSqlite);
        console.log("resultProduct... ", resultProduct);

        const taxPayload = {
          taxId: taxValue?.taxId,
          productId: resultProduct && resultProduct?.lastInsertRowid,
          storeId: STORE_Id,
          lastUpdate: getUTCDate(),
          isSync: 0,
          isDeleted: 0,
        };

        const discountPayload = {
          discountId: discountvalue?.discountId,
          productId: resultProduct && resultProduct?.lastInsertRowid,
          lastUpdate: getUTCDate(),
          storeId: STORE_Id,
          isSync: 0,
          isDeleted: 0,
        };

        // mapping tax to this product
        if (resultProduct?.changes === 1) {
          console.log("lastInsertRowid... ", resultProduct?.lastInsertRowid);
          resultProduct?.lastInsertRowid &&
            sqliteImageUploadHandler(resultProduct?.lastInsertRowid);
          productCreationSuccess();
          const result =
            taxValue?.taxId &&
            mappedTaxApi?.mappedTaxDB?.insertMappedTax(taxPayload);
          const resultDiscountMapping =
            discountvalue?.discountId &&
            discountMappingApi?.discountMappingDB?.insertDiscountMapping(
              discountPayload
            );
        }
      }
    }
  };

  const sqliteImageUploadHandler = (prodId) => {
    const cognitoUserName = COGNITO_USER_INFO;
    console.log("cognitoUserName... ", cognitoUserName);
    if (imageFile && imageFile.length) {
      console.log("sqliteImageUploadHandler... ", prodId);
      for (let i = 0; i <= imageFile.length; i++) {
        let singleImageFile = imageFile[i];
        console.log("singleImageFile... ", singleImageFile);

        const productImagePayload = {
          imageId: getUTCDate(),
          imgPath: imageFile[i] && imageFile[i]?.path,
          productId: prodId,
          storeId: STORE_Id,
          isProductDefaultImage: 0,
          userName: cognitoUserName?.userName,
          isSync: 0,
        };

        console.log("productImagePayload... ", productImagePayload);
        prodId &&
          productImageApi?.productImageDB?.insertProductsImage(
            productImagePayload,
            imageFile[i]
          );
      }
    }
  };

  // product image upload
  const productUploadImageHandler = (prodId) => {
    if (imageFile && imageFile.length > 0) {
      console.log("prodId ", prodId);

      for (let i = 0; i <= imageFile.length; i++) {
        let data = new FormData();
        let singleImageFile = imageFile[i];


        if (!singleImageFile) {
          console.log("No image file found for index:", i);
          continue; // Skip to the next iteration if no image file is found
        }

        data.append("file", singleImageFile);
        // data.append("file", files, files.name);
        data.append("storeId", STORE_Id);
        data.append("imageId", 0);
        data.append("productId", prodId);
        data.append("storeName", storeName);
        // defaultImgIndex === i
        //   ? data.append("isProductDefaultImage", 1)
        //   : data.append("isProductDefaultImage", 0);

        // if editProduct Image array is empty then we send 0 value
        //  it means on edit age new images not set default
        // if we have defaultImgIndex value on new product creation time
        //  then user able to set default image
        editProductImgs.length > 0
          ? data.append("isProductDefaultImage", 0)
          : defaultImgIndex === i
            ? data.append("isProductDefaultImage", 1)
            : data.append("isProductDefaultImage", 0);

        data.append("isStoreImage", 0);
        data.append("userName", cognitoUserName);
        data.append("updateImageName", "");

        const config = {
          timeout: 10000,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + userToken,
          },
        };

        axios
          .post(SERVER_URL + UPLOAD_PROD_IMG, data, config)
          .then((response) => {
            // var res = JSON.stringify(data);
            // console.log("Response Image : ", response);
            if (i === imageFile.length - 1) {
              // response.status === 200 &&
              // setImageResponse(response?.data?.imagesResponse);
            }
          })
          .catch((err) => {
            console.log("Error index: " + err);
          });
      }

      // data.append("file", files, files.name);
      // data.append("storeId", STORE_Id);
      // data.append("imageId", 0);
      // data.append("productId", prodId);
      // data.append("storeName", storeName);
      // data.append("isProductDefaultImage", 1);
      // data.append("isStoreImage", 0);
      // data.append("userName", cognitoUserName);
      // data.append("updateImageName", "");

      // uploadeImageTOServer(data);
    } else {
      console.log("Image is not selected");
    }
  };



  return prodLoading ? (
    <LoadingSpinner />
  ) : (
    <MainContentArea scroll={"auto"}>
      <div className="productMainContainer w-100">
        <div className="cardBox productFromContainer overflow-auto d-flex flex-column ">
          <div className="mb-2" style={{ textAlign: "right" }}>
            <Button
              variant="contained"
              style={{ background: "#e3e2e2", color: "dimgray" }}
              onClick={() => navigate(-1)}
            >
              {t("AddNewProduct.Back")}
            </Button>
          </div>
          <h1 style={{ fontSize: "1.5rem" }} className="text-Color">
            {t("AddNewProduct.productCreation")}
          </h1>
          <div className="mb-3">
            {/* <DragandDrop files={imageFile} setFiles={setImageFile} uploadImageHandler={uploadImageHandler} /> */}
            <DragAndDropPureHtml
              files={imageFile}
              setFiles={setImageFile}
              setEditProductImgs={setEditProductImgs}
              uploadImageHandler={
                isOnline
                  ? uploadImageHandler
                  : productImageApi?.productImageDB?.insertProductsImage
              }
            />
            {/* <input
              type="file"
              id="upload"
              onChange={(e) =>
                productImageApi?.productImageDB?.insertProductsImage(e)
              }
            /> */}
          </div>
          {/* product name and sellingprice input fields */}
          <div className="productFormInputContainer d-flex justify-content-between flex-wrap mt-2">
            <div className="productItems mb-3">
              <InputLabel style={{ color: "var(--product-text-color)" }}>
                {t("AddNewProduct.productName")}
                <span className="text-danger">*</span>
              </InputLabel>
              <TextField
                style={{ backgroundColor: "var( --light-gray-color)" }}
                placeholder={t("AddNewProduct.productName")}
                id="outlined-size-small"
                size="small"
                name="productName"
                value={fields && fields?.productName}
                inputRef={prodNameInputRef}
                onChange={productInputHanlder}
                inputProps={{ maxLength: 150 }}
              />
              {error && error?.productName && (
                <span className="text-danger">{error?.productName}</span>
              )}
            </div>

            <div className="productItems mb-3">
              <InputLabel style={{ color: "var(--product-text-color)" }}>
                {t("AddNewProduct.sellingPrice")}

                <span className="text-danger">*</span>
              </InputLabel>
              <TextField
                // label="Size"
                style={{ backgroundColor: "var( --light-gray-color)" }}
                placeholder={t("AddNewProduct.productSellingPrice")}
                id="outlined-size-small"
                type="tel"
                size="small"
                name="sellingPrice"
                value={fields && fields?.sellingPrice}
                inputRef={sellingPriceInputRef}
                onChange={productInputHanlder}
                inputProps={{ maxLength: 7 }}
              />
              {error && error?.sellingPrice && (
                <span className="text-danger">{error?.sellingPrice}</span>
              )}
            </div>
          </div>

          {/* category and units selector */}
          <div className="productFormInputContainer d-flex justify-content-between  flex-wrap mt-2">
            <div className="productItems mb-3">
              <InputLabel style={{ color: "var(--product-text-color)" }}>
                {t("AddNewProduct.category")}
                <span className="text-danger">*</span>
              </InputLabel>
              <Select
                placeholder={t("AddNewProduct.selectCategory")}
                getOptionLabel={(categoryListData) =>
                  categoryListData?.categoryName
                }
                options={categoryListData}
                styles={CUSTOM_DROPDOWN_STYLE}
                value={fields?.categoryValue}
                name="categoryValue"
                ref={categoryInputRef}
                onChange={(e) => categorySelectHandler(e, "categoryValue")}
                isClearable
              />
              {error && error?.categoryValue && (
                <span className="text-danger">{error?.categoryValue}</span>
              )}
              <div className="form-link mt-1">
                <Link
                  className="card-link m-2 fs-6"
                  onClick={() => setshowCategoryModal(true)}
                >
                  {t("AddNewProduct.addCategory")}
                </Link>
              </div>
              {showCategoryModal && (
                <CategoryModal
                  isModelVisible={showCategoryModal}
                  setshow={setshowCategoryModal}
                  setCategoryPostRes={setCategoryPostRes}
                />
              )}
            </div>
            <div className=" productItems mb-3">
              <InputLabel style={{ color: "var(--product-text-color)" }}>
                {t("AddNewProduct.unit")}

                <span className="text-danger">*</span>
              </InputLabel>
              <div className="mb-1">
                <Select
                  placeholder={t("AddNewProduct.selectUnit")}
                  getOptionLabel={(unitListData) => unitListData?.unitName}
                  options={unitListData}
                  styles={CUSTOM_DROPDOWN_STYLE}
                  value={fields?.unitValue}
                  name="unitValue"
                  ref={unitInputRef}
                  onChange={(e) => unitSelectHandler(e, "unitValue")}
                  isClearable
                />
                {error && error?.unitValue && (
                  <span className="text-danger">{error?.unitValue}</span>
                )}
              </div>
              <Link
                className="card-link fs-6 m-2 pt-2 "
                onClick={() => setshowUnitModal(true)}
              >
                {t("AddNewProduct.addUnit")}
              </Link>

              {showUnitModal && (
                <UnitModal
                  // fetchApi={fetchUnitApi}
                  isModelVisible={showUnitModal}
                  setshow={setshowUnitModal}
                  setUnitPostRes={setUnitPostRes}
                />
              )}
            </div>
          </div>

          {/* product Discriptopn textarea... */}
          <div className="productFormInputContainer d-flex justify-content-between">
            <div className="mb-3" style={{ width: "100%" }}>
              <InputLabel style={{ color: "var(--product-text-color)" }}>
                {t("AddNewProduct.productDescription")}

                <span className="text-danger">*</span>
              </InputLabel>
              {/* <TextareaAutosize
                minRows={3}
                placeholder={t("AddNewProduct.minimumThreeRows")}
                name="productDesc"
                ref={prodDescInputRef}
                onChange={productInputHanlder}
                style={{
                  width: "100%",
                  borderColor: "var(--border-color)",
                  borderRadius: "5px",
                  padding: "10px",
                }}
              /> */}
              <textarea
                placeholder={t("AddNewProduct.minimumThreeRows")}
                name="productDesc"
                ref={prodDescInputRef}
                id=""
                cols="30"
                rows="4"
                style={{
                  width: "100%",
                  borderColor: "var(--border-color)",
                  borderRadius: "5px",
                  padding: "10px",
                }}
                onChange={productInputHanlder}
                maxlength="250"
              />
              {error && error?.productDesc && (
                <span className="text-danger">{error?.productDesc}</span>
              )}
            </div>
          </div>

          <div>
            <label
              onClick={() => setMoreOption(!moreOption)}
              style={{
                color: "var(--light-blue-color)",
                cursor: "pointer",
                width: "fit-content",
                fontSize: "large",
              }}
            >
              {moreOption === true
                ? t("AddNewProduct.hideOption")
                : t("AddNewProduct.moreOption")}
              {moreOption === true ? (
                <TiArrowSortedUp />
              ) : (
                <TiArrowSortedDown />
              )}
            </label>
          </div>
          {moreOption && (
            <>
              {/* purchasing price nad MRP inputs fileds */}
              <div className="productFormInputContainer d-flex justify-content-between flex-wrap mt-3">
                <div className="productItems mb-3">
                  <InputLabel style={{ color: "var(--product-text-color)" }}>
                    {t("AddNewProduct.purchasingPrice")}
                    {showInventoryManage && <span className="text-danger">*</span>}
                  </InputLabel>
                  <TextField
                    type="tel"
                    style={{ backgroundColor: "var(--white-color)" }}
                    placeholder={t("AddNewProduct.purchasingPriceOfProduct")}
                    id="outlined-size-small"
                    size="small"
                    name="purchasingPrice"
                    onChange={productInputHanlder}
                    inputRef={purchasingPriceInputRef}
                    inputProps={{ maxLength: 7 }}
                    value={fields && fields?.purchasingPrice}
                  />
                  {showInventoryManage && error && error?.purchasingPrice && (
                    <span className="text-danger">{error?.purchasingPrice}</span>
                  )}
                </div>

                <div className="productItems mb-3">
                  <InputLabel style={{ color: "var(--product-text-color)" }}>
                    {t("AddNewProduct.mrp")}
                  </InputLabel>
                  <TextField
                    type="tel"
                    style={{ backgroundColor: "var(--white-color)" }}
                    placeholder={t("AddNewProduct.productMRP")}
                    id="outlined-size-small"
                    size="small"
                    value={fields && fields?.mrp}
                    name="mrp"
                    onChange={productInputHanlder}
                    inputProps={{ maxLength: 7 }}
                  />
                </div>
              </div>

              {/* Brand and Barcode */}
              <div className="productFormInputContainer d-flex justify-content-between flex-wrap">
                <div className="mb-3 productItems">
                  <InputLabel>{t("AddNewProduct.brand")}</InputLabel>
                  <Select
                    placeholder={t("AddNewProduct.selectBrand")}
                    getOptionLabel={(brandListData) => brandListData?.brandName}
                    options={brandListData}
                    styles={CUSTOM_DROPDOWN_STYLE}
                    value={brandValue}
                    onChange={brandSelectHandler}
                    isClearable
                  />
                  <div className="form-link mt-1">
                    <Link
                      className="card-link m-2 fs-6"
                      onClick={() => setshowBrandModal(true)}
                    >
                      {t("AddNewProduct.addBrand")}
                    </Link>
                  </div>
                  {showBrandModal && (
                    <BrandModal
                      // fetchApi={fetchBrandApi}
                      isModelVisible={showBrandModal}
                      setshow={setshowBrandModal}
                      setBrandPostRes={setBrandPostRes}
                    />
                  )}
                </div>
                <div className="productItems mb-3">
                  <InputLabel style={{ color: "var(--product-text-color)" }}>
                    {t("AddNewProduct.barcode")}
                  </InputLabel>
                  <TextField
                    style={{ backgroundColor: "var(--white-color)" }}
                    placeholder={t("AddNewProduct.productBarcode")}
                    id="outlined-size-small"
                    size="small"
                    name="barCode"
                    onChange={productInputHanlder}
                    inputProps={{ maxLength: 50 }}
                  />
                </div>
              </div>

              {/* Purchaing price */}
              <div className="productFormInputContainer d-flex justify-content-between flex-wrap">

              </div>
              {/* Inventoru Manage */}
              <div className="productFormInputContainer d-flex justify-content-between flex-wrap">
                <div className="productItems mb-3 d-flex justify-content-start align-items-center">
                  <InputLabel style={{ color: "var(--product-text-color)" }}>
                    {t("AddNewProduct.inventoryManage")}
                  </InputLabel>
                  <Switch
                    sx={{ ...switchStyles }}
                    {...label}
                    checked={showInventoryManage}
                    onChange={() =>
                      setShowInventoryManage(!showInventoryManage)
                    }
                  />
                </div>
              </div>

              {/* Quantity */}
              {showInventoryManage && (
                <div className="productFormInputContainer d-flex justify-content-between flex-wrap">
                  <div className="productItems mb-3">
                    <InputLabel style={{ color: "var(--product-text-color)" }}>
                      {t("AddNewProduct.quantity")}
                      <span className="text-danger">*</span>
                    </InputLabel>
                    <TextField
                      style={{ backgroundColor: "var(--white-color)" }}
                      placeholder={t("AddNewProduct.quantity")}
                      id="outlined-size-small"
                      size="small"
                      name="quantity"
                      inputProps={{ maxLength: 4 }}
                      value={fields && fields?.quantity}
                      inputRef={quantityInputRef}
                      onChange={productInputHanlder}
                    />
                    {showInventoryManage && error && error?.quantity && (
                      <span className="text-danger">{error?.quantity}</span>
                    )}
                  </div>
                  <div className="productItems mb-3">
                    <InputLabel style={{ color: "var(--product-text-color)" }}>
                      {t("AddNewProduct.stockLevelAlert")}
                    </InputLabel>
                    <TextField
                      style={{ backgroundColor: "var(--white-color)" }}
                      // label="Size"
                      placeholder={t("AddNewProduct.stockLevelAlert")}
                      id="outlined-size-small"
                      size="small"
                      name="stockLevelAlert"
                      value={fields && fields?.stockLevelAlert}
                      inputProps={{ maxLength: 4 }}
                      onChange={productInputHanlder}
                    />
                  </div>
                </div>
              )}

              {/* expire date and tax */}
              <div className="productFormInputContainer d-flex justify-content-between flex-wrap">
                <div className="productItems mb-3">
                  <InputLabel style={{ color: "var(--product-text-color)" }}>
                    {t("AddNewProduct.expiryDate")}
                  </InputLabel>
                  <DatePicker
                    minDate={new Date()}
                    className="form-control"
                    selected={expireDate}
                    dateFormat="d/MM/yyyy"
                    onChange={(date) => {
                      expireDateSelectHandler(date);
                    }}
                  />
                </div>
                <div className="productItems mb-3">
                  <InputLabel style={{ color: "var(--product-text-color)" }}>
                    {t("AddNewProduct.applyTax")}
                  </InputLabel>
                  <Select
                    placeholder={t("AddNewProduct.selectTax")}
                    getOptionLabel={(taxListData) => taxListData?.taxName}
                    options={taxListData}
                    styles={CUSTOM_DROPDOWN_STYLE}
                    value={taxValue}
                    onChange={taxSelectHandler}
                    isClearable
                  />
                  <div className="form-link mt-1">
                    <Link
                      className="card-link m-2 fs-6"
                      onClick={() => setshowTaxModal(true)}
                    >
                      {t("AddNewProduct.addTax")}
                    </Link>
                  </div>
                  {showTaxModal && (
                    <TaxModal
                      isModelVisible={showTaxModal}
                      setshow={setshowTaxModal}
                      setTaxPostRes={setTaxPostRes}
                    />
                  )}
                </div>
              </div>

              {/* discount */}
              <div className="productFormInputContainer d-flex justify-content-between flex-wrap">
                <div className="productItems mb-3">
                  <InputLabel style={{ color: "var(--product-text-color)" }}>
                    {t("AddNewProduct.applyDiscount")}
                  </InputLabel>
                  <Select
                    placeholder={t("AddNewProduct.selectDiscount")}
                    getOptionLabel={(discountData) =>
                      discountData?.discountName
                    }
                    options={discountListData}
                    styles={CUSTOM_DROPDOWN_STYLE}
                    value={discountvalue}
                    onChange={discountSelectHandler}
                    isClearable
                  />
                  <div className="form-link mt-1">
                    <Link
                      className="card-link m-2 fs-6"
                      onClick={() => setshowDiscountModal(true)}
                    >
                      {t("AddNewProduct.addDiscount")}
                    </Link>
                  </div>

                  {showDiscountModal && (
                    <DiscountModal
                      isModelVisible={showDiscountModal}
                      setshow={setshowDiscountModal}
                      setDiscountPostRes={setDiscountPostRes}
                    />
                  )}
                </div>
                <div className="productItems d-flex justify-content-end align-items-center">
                  <Switch
                    sx={{ ...switchStyles }}
                    {...label}
                    checked={taxInclude}
                    onChange={() => setTaxInclude(!taxInclude)}
                  />
                  <InputLabel style={{ color: "var(--product-text-color)" }}>
                    {t("AddNewProduct.taxInclude")}
                  </InputLabel>
                </div>
              </div>
            </>
          )}

          <div className="mt-2" style={{ textAlign: "right" }}>
            <Button
              variant="contained"
              style={{
                backgroundColor: "var(--button-bg-color)",
                color: "var(--button-color)",
              }}
              onClick={submitHandler}
            >
              {t("AddNewProduct.submit")}
            </Button>
          </div>
        </div>

        <div className="cardBox productPrevContainer overflow-auto">
          <h1
            style={{ fontSize: "1.5rem", padding: "20px" }}
            className="text-Color"
          >
            {t("AddNewProduct.preview")}
          </h1>

          <div>
            <PrevCardProductSlider
              productActiveImage={
                imageFile && imageFile[0] && URL.createObjectURL(imageFile[0])
              }
              productImagesArray={imageFile && imageFile}
              // editProductImagesArray={null}
              defualtProduct={defaultImage}
              defaultImgIndex={defaultImgIndex}
              defualtImgHandler={setDefaultHandler}
            />
          </div>
        </div>
      </div>

      <AlertpopUP
        open={isPopupOpen}
        message={
          apiError?.length > 0 ? apiError : "Product created successfully"
        }
        severity={apiError?.length > 0 ? "error" : "success"}
        onClose={handleClose}
      />

      <SubscriptionPlanModal
        isModelVisible={modalOpen}
        setShow={setModalOpen}
      />
    </MainContentArea>
  );
};

export default ProductCreation;
