import { Button, InputLabel, TextareaAutosize, TextField } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import DragandDrop from "../../Components/DragandDrop/DragandDrop";
import MainContentArea from "../MainContentArea/MainContentArea";
import Select from "react-select";
import { CUSTOM_DROPDOWN_STYLE } from "../../utils/CustomeStyles";
import "./AddProduct.css";
import Switch from "@mui/material/Switch";
import defaultImage from "../../assets/images/default-image.png";
import { getUnitList } from "../../Redux/Unit/unitSlice";
import { getBrandList } from "../../Redux/Brand/brandSlice";
import { getCategoryList } from "../../Redux/Category/categorySlice";
import {
  getDiscountlist,
  getMappedDiscountByProdutId,
} from "../../Redux/Discount/discountSlice";
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
  editProduct,
  getSingleProductData,
  setProductDefaultImg,
} from "../../Redux/Product/productSlice";
import Swal from "sweetalert2";
import axios from "axios";
import UnitModal from "../UnitsPage/UnitModal";
import BrandModal from "../BrandsPage/BrandModal";
import CategoryModal from "../CategoryPages/CategoryModal";
import TaxModal from "../TaxesDetailsPage/TaxModel";
import DiscountModal from "../DIscountPage/DiscountModal";
import EditPrevCartSlider from "../../Components/ImageSlider/EditPrevCartSlider";
import AlertpopUP from "../../utils/AlertPopUP";
import {
  apiFailureResponse,
  showPopupHandleClick,
} from "../../utils/constantFunctions";
import DragAndDropPureHtml from "../../Components/DragandDrop/DragAndDropPureHtml";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";

const label = { inputProps: { "aria-label": "Switch demo" } };
let userToken = localStorage.getItem("userToken");

const EditProductPage = () => {
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
  const isOnline = useSelector((state) => state.checkInternet.isOnline);

  const prodNameInputRef = useRef(null);
  const sellingPriceInputRef = useRef(null);
  const unitInputRef = useRef(null);
  const categoryInputRef = useRef(null)
  const prodDescInputRef = useRef(null);
  const purchasingPriceInputRef = useRef(null);
  const quantityInputRef = useState(null);
  const [searchParams] = useSearchParams();
  const unitData = useSelector((state) => state.unit.unitData);
  const categoriesData = useSelector((state) => state.category.categoriesData);
  const brandData = useSelector((state) => state.brand.brandData);
  const taxData = useSelector((state) => state.tax.taxData);
  console.log("unitData... ", unitData?.unit)
  const discountData = useSelector((state) => state.discount.discountData);
  const singleProductData = useSelector((state) => state.product.singleProduct);

  // mapping lists
  const mappedTaxList = useSelector((state) => state.tax.mappedTaxList);
  const discountMap = useSelector((state) => state.discount.getSingleDiscount);
  const [prodId] = useState(parseInt(searchParams.get("productId")));
  const prodLoading = useSelector((state) => state.product.loading);
  console.log("prodLoading... ", prodLoading)

  // const prodId = searchParams.get("productId");
  console.log("prodId", prodId);
  const [productDetails, setProductDetails] = useState({});
  console.log("productDetails... ", productDetails)

  const [fields, setFields] = useState({
    productName: "",
    sellingPrice: "",
    productDesc: "",
    purchasingPrice: "",
    mrp: "",
    barCode: "",
    quantity: "",
    stockLevelAlert: "",
  });
  const [error, setError] = useState({
    productName: "",
    sellingPrice: "",
    productDesc: "",
    unitValue: "",
    categoryValue: "",
    purchasingPrice: "",
    quantity: ""
  });
  const [unitValue, setUnitValue] = useState("");

  const [categoryValue, setCategoryValue] = useState("");
  const [brandValue, setBrandValue] = useState("");
  const [taxValue, setTaxValue] = useState("");
  const [discountvalue, setDiscountValue] = useState("");
  console.log("discountvalue... ", discountvalue)

  const [expireDate, setExpireDate] = useState(new Date());
  const [moreOption, setMoreOption] = useState(false);
  const [showInventoryManage, setShowInventoryManage] = useState(false);
  const [taxInclude, setTaxInclude] = useState(false);
  const [cognitoUserName, setCognitoUserName] = useState("");
  const [storeName, setStoreName] = useState("");

  const [imageFile, setImageFile] = useState([]);
  console.log("imageFile... ", imageFile);
  const [editProductImgs, setEditProductImgs] = useState([]);
  console.log("editProductImgs... ", editProductImgs);
  const [defaultImgIndex, setDefaultImgIndex] = useState(0);
  const [defaultImageObj, setDefaultImageObj] = useState({});

  const [showUnitModal, setshowUnitModal] = useState(false);
  const [showBrandModal, setshowBrandModal] = useState(false);
  const [showCategoryModal, setshowCategoryModal] = useState(false);
  const [showTaxModal, setshowTaxModal] = useState(false);
  const [showDiscountModal, setshowDiscountModal] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // for popup
  const [apiError, setApiError] = useState("");

  // helper api's data store in these state
  const [unitListData, setUnitListData] = useState([]);
  const [categoryListData, setCategoryListData] = useState([]);
  console.log("categoryListData... ", categoryListData)
  const [brandListData, setBrandListData] = useState([]);
  console.log("brandListData... ", brandListData)
  const [taxListData, setTaxListData] = useState([]);
  const [discountListData, setDiscountListData] = useState([]);
  const [mappedTaxDataList, setMappedTaxDataList] = useState([]);

  const [discountMappedListData, setDiscountMappedListData] = useState([]);

  // useEffect(() => {
  //   // imageFile &&
  //   //   imageFile.map((item) => {
  //   //     console.log("Image URL ", URL.createObjectURL(item));
  //   //   });
  //   console.log("imageFile ", imageFile);
  // }, [imageFile]);

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
    // mappedTaxList && setMappedTaxDataList(mappedTaxList);
    discountMap && setDiscountMappedListData(discountMap);
  }, [
    unitData?.unit,
    categoriesData?.category,
    brandData?.brand,
    taxData?.tax,
    discountData?.discount,
    // mappedTaxList,
    discountMap,
  ]);

  // initial APIs Call
  useEffect(() => {
    if (isOnline) {
      dispatch(getUnitList(0, 0, ""));
      dispatch(getBrandList(0, 0, ""));
      dispatch(getCategoryList(0, 0, ""));
      dispatch(getDiscountlist(0, 0, "", validDiscount));
      dispatch(getTaxList(0, 0, ""));
      // dispatch(getTaxMappedList());
    } else {
      const unitsData = unitApi?.unitDB?.getUnits();
      const categoriesListData = categoryApi?.categoryDB?.getAllCategories();
      const brandList = brandApi?.brandDB?.getBrands();
      const taxList = taxApi?.taxDB?.getAllTaxes();
      const discountList = discountApi?.discountDB?.getAllDiscounts();
      // const mappedTaxData = mappedTaxApi?.mappedTaxDB?.getMappedTaxList();

      setUnitListData(unitsData);
      setCategoryListData(categoriesListData);
      setBrandListData(brandList);
      setTaxListData(taxList);
      setDiscountListData(discountList);
      // setMappedTaxDataList(mappedTaxData);
    }
  }, []);

  // product details store in state
  useEffect(() => {
    singleProductData && setProductDetails(singleProductData);
  }, [singleProductData]);

  useEffect(() => {
    if (isOnline) {
      dispatch(editProduct(prodId));
      // dispatch(getMappedDiscountByProdutId(prodId));
    } else {
      const productDetails = productApi?.productDB?.getProductDetailsById(
        parseInt(prodId)
      );
      setProductDetails(productDetails);
      // const mappedDiscountDetails =
      //   discountMappingApi?.discountMappingDB?.getDiscountMappingDetails(
      //     parseInt(prodId)
      //   );
      // mappedDiscountDetails && setDiscountMappedListData(mappedDiscountDetails);
    }
  }, [prodId]);

  // useEffect(() => {
  //   // if (isOnline) {
  //     // discountListData?.map((item) => {
  //     //   if (item.discountId === productDetails?.discountId) {
  //     //     setDiscountValue(item);
  //     //   }
  //     // });
  //   // } 
  //   // else {
  //   //   discountListData?.map((item) => {

  //   //     if (item.discountId === discountMappedListData?.discountId) {
  //   //       setDiscountValue(item);
  //   //     }
  //   //   });
  //   // }
  // }, [discountListData, discountMappedListData, isOnline, productDetails]);

  // to find unit object
  const findUnitObj = (id) => {
    unitListData?.map((item) => {
      if (id === item.unitId) {
        setUnitValue(item);
      }
      // console.log("item", unitListData);
    });
  };

  // to find brand object
  const findBrandObj = (id) => {
    brandListData && brandListData?.map((item) => {
      if (id === item.brandId) {
        setBrandValue(item);
      }
    });
  };

  // to find category Object
  const findCategoryObj = (id) => {
    categoryListData?.map((item) => {
      if (id === item.categoryId) {
        setCategoryValue(item);
      }
    });
  };

  //   const setAllProductEdit = () => {
  //     setProductName();
  //     setEditProductImgs(singleProductData?.imagesList);
  //     setProductNotes();
  //     setProductQuantity();
  //     setProductPrice();
  //     setProductPurchasingPrice();
  //     setProductBarcode();
  //     setProductMRP();
  //     singleProductData && findUnitObj(singleProductData.unitId);
  //     //setSelProductUnit(singleProductData.unitId);
  //     singleProductData && findBrandObj(singleProductData.brandId);
  //     //setSelProductBrand(singleProductData.brandId);
  //     singleProductData && findCategoryObj(singleProductData.categoryId);

  //     //setSelProductCategory(singleProductData.categoryId);
  //     setSelProductExpDate(
  //       new Date(moment(singleProductData.expiryDate).format("L"))
  //     );
  //     setStockLevelAlert();
  //     setProductId();
  //     // setPostDiscount(singleProductData.discountId);
  //     // setPostTax(singleProductData.taxId);
  //     setTaxDisable(true);
  //     setTaxInclude();
  //     setDiscountDisable(true);
  //   };

  useEffect(() => {
    let filterTaxObj = {};

    // filter which product is tax map
    // if (prodId) {
    //   mappedTaxDataList &&
    //     mappedTaxDataList?.map((mapItem) => {
    //       if (prodId === mapItem.productId) {
    //         filterTaxObj = mapItem;
    //       }
    //     });
    // }

    // filter that taxt in the tax array and get the name of tax
    taxListData &&
      taxListData?.map((item) => {
        if (item?.taxId === productDetails?.taxId) {
          console.log("TxItem... ", item)
          // taxname = item?.taxName;
          //   setPostTax(item);
          setTaxValue(item);
        }
      });

    discountListData?.map((item) => {
      if (item.discountId === productDetails?.discountId) {
        setDiscountValue(item);
      }
    });


  }, [prodId, taxListData, discountListData, productDetails]);

  // initial product value set in fields state so we can display them into input fields
  useEffect(() => {
    productDetails &&
      setFields({
        productName: productDetails?.productName,
        sellingPrice: productDetails?.sellingPrice,
        productDesc: productDetails?.notes,
        purchasingPrice: productDetails?.purchasingPrice,
        mrp: productDetails?.maxRetailPrice,
        barCode: productDetails?.barCode,
        quantity: productDetails?.quantity,
        stockLevelAlert: productDetails?.stockLevelAlert,
      });
    setShowInventoryManage(productDetails?.inventoryManage)
    if (isOnline) {
      productDetails && findUnitObj(productDetails?.unitId);
      productDetails && findBrandObj(productDetails?.brandId);
      productDetails && findCategoryObj(productDetails?.categoryId);
    } else {
      const selectedUnit =
        unitApi && unitApi?.unitDB?.getUnitById(productDetails?.unitId);
      selectedUnit && setUnitValue(selectedUnit);
      const selectedCategory = categoryApi?.categoryDB?.getCategoryDetailsById(
        productDetails?.categoryId
      );
      selectedCategory && setCategoryValue(selectedCategory);
      const selectedBrand = brandApi?.brandDB?.getBrandDetailsById(
        productDetails?.brandId
      );
      selectedBrand && setBrandValue(selectedBrand);
    }

    setExpireDate(new Date(moment(productDetails?.expiryDate).format("L")));
    setTaxInclude(productDetails?.priceIncludeTax === "0" ? false : true);
    productDetails?.imageUrl && setEditProductImgs(productDetails?.imageUrl);
  }, [productDetails]);

  // to get input data from field
  const productInputHanlder = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setError({ ...error, [name]: "" });
    if (
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

  // seeting expiry time
  useEffect(() => {
    let hours = 23;
    expireDate && expireDate.setHours(hours);
    let minutes = 59;
    expireDate && expireDate.setMinutes(minutes);
    let second = 59;
    expireDate && expireDate.setSeconds(second);
  }, [expireDate]);

  // unit select handler
  const unitSelectHandler = (e) => {
    setError({ ...error, unitValue: "" });
    setUnitValue(e);
  };

  // category select handler
  const categorySelectHandler = (e) => {
    setError({ ...error, categoryValue: "" });
    setCategoryValue(e);
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
    const newImgArray =
      editProductImgs && editProductImgs.filter((item, i) => i === index);
    // console.log("newImgArray Default ", newImgArray);

    let imgObj = {
      imageId: newImgArray && newImgArray[0]?.imageId,
      productId: newImgArray && newImgArray[0]?.productId,
    };

    if (!prodId) {
      setDefaultImgIndex(index);
    } else {
      setDefaultImgIndex(index);
      dispatch(setProductDefaultImg(imgObj, cognitoUserName));
    }
  };

  // handle validation for check imp field
  const validation = () => {
    if (fields.productName === "") {
      setError({ ...error, productName: "Please enter product name" });
      if (prodNameInputRef.current) {
        prodNameInputRef.current.focus();
      }
      return false;
    } else if (fields.sellingPrice === "") {
      setError({ ...error, sellingPrice: "Please enter selling price" });
      if (sellingPriceInputRef.current) {
        sellingPriceInputRef.current.focus();
      }
      return false;
    } else if (categoryValue === "") {
      setError({ ...error, categoryValue: "Please select a category" });
      if (categoryInputRef.current) {
        categoryInputRef.current.focus();
      }
      return false;
    } else if (unitValue === "") {
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
    } else if (showInventoryManage && fields.purchasingPrice === "") {
      setError({ ...error, purchasingPrice: "Please enter purchasing price" });
      if (purchasingPriceInputRef.current) {
        purchasingPriceInputRef.current.focus();
      }
      return false;
    } else if (showInventoryManage && fields.quantity === "") {
      setError({ ...error, quantity: "Please enter quantity" });
      if (quantityInputRef.current) {
        quantityInputRef.current.focus();
      }
      return false;
    };
    return true;
  }

  // apiError state empty after 3 second
  // and user redirect to /products page
  useEffect(() => {
    if (apiError?.length > 0) {
      showPopupHandleClick(setIsPopupOpen, 3000, setApiError); //for popUp msg
    }
  }, [apiError?.length > 0]);

  const handleClose = () => {
    setIsPopupOpen(false);
  };

  // for success popup after product save
  const productCreationSuccess = () => {
    showPopupHandleClick(
      setIsPopupOpen,
      2000,
      setApiError,
      navigate,
      "/products"
    ); //for popUp msg

    // setIsPopupOpen(prodLoading);
    // navigate("/products")
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

  // to add product in api
  const submitHandler = () => {
    const val = validation();

    if (val) {
      let postData = {
        purchasingPrice: fields && parseInt(fields.purchasingPrice),
        currencyId: 0,
        lastUpdate: 0,
        categoryId: categoryValue && categoryValue?.categoryId,
        inventoryManage: showInventoryManage ? 1 : 0,
        maxRetailPrice: fields && parseInt(fields.mrp),
        stockLevelAlert: fields && fields.stockLevelAlert,
        brandId: brandValue && brandValue?.brandId,
        updatedBy: null,
        productId: prodId,
        subCategoryId: 0,
        sellingPrice: fields && parseInt(fields.sellingPrice),
        active: 0,
        barCode: fields && fields.barCode,
        quantity: fields && fields.quantity,
        priceIncludeTax: taxInclude ? 1 : 0,
        notes: fields && fields.productDesc,
        storeId: parseInt(STORE_Id),
        productName: fields && fields.productName,
        unitId: unitValue && unitValue?.unitId,
        addedBy: null,
        isDeleted: 0,
        // discountName: selProductDiscount && selProductDiscount,
        // taxName:  selProductTax && selProductTax,
        expiryDate: new Date(moment(expireDate, "llll")).valueOf(),
      };

      // console.log("postData ", postData);

      let postDataForSqlite = {
        productId: prodId,
        productName: fields && fields.productName,
        sellingPrice: fields && fields.sellingPrice,
        unitId: unitValue && unitValue?.unitId,
        notes: fields && fields.productDesc,
        imageUrl: "",
        imageId: 0,
        image: "",
        imagesList: isOnline ? [] : "",
        purchasingPrice: fields && fields.purchasingPrice,
        maxRetailPrice: fields && fields.mrp,
        categoryId:
          categoryValue && categoryValue?.categoryId
            ? categoryValue?.categoryId
            : 0,
        brandId: brandValue && brandValue?.brandId ? brandValue?.brandId : 0,
        barCode: fields && fields.barCode,
        quantity: fields && fields.quantity,
        stockLevelAlert: fields && fields.stockLevelAlert,
        expiryDate: new Date(moment(expireDate, "llll")).valueOf(),
        lastUpdate: getUTCDate(),
        taxName: isOnline ? [] : "",
        discountName: isOnline ? [] : "",
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
        unitName: unitValue?.unitName,
        categoryName: categoryValue?.categoryName,
        taxId: taxValue?.taxId ? taxValue?.taxId : 0,
        taxValue: taxValue?.taxValue ? taxValue?.taxValue : "",
        discountId: discountvalue?.discountId ? discountvalue?.discountId : 0,
        discountVal: discountvalue?.discountVal ? discountvalue?.discountVal : "",
        percent: discountvalue?.isPercent ? discountvalue?.isPercent : 0
      };

      if (val) {
        if (isOnline) {
          dispatch(
            addProduct(
              postData,
              discountvalue,
              taxValue,
              STORE_Id,
              // imageFile,
              // defaultImgIndex,
              // cognitoUserName,
              // storeName,
              productCreationSuccess,
              productUploadImageHandler
            )
          );

        } else {
          // console.log("postDataForSqlite... ", postDataForSqlite);
          const result =
            postDataForSqlite &&
            productApi?.productDB?.updateProduct(postDataForSqlite);
          console.log("UpdateProductresult... ", result)
          // if product update sucessfully then run it
          if (result?.changes === 1) {
            prodId && sqliteImageUploadHandler(prodId);
            productCreationSuccess();
          }
        }
      }
    }
  };

  // upload product image on sqlite database
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
          productImageApi?.productImageDB?.updateProductImagesByProductId(
            productImagePayload
          );
      }
    }
  };

  // product image upload
  const productUploadImageHandler = (prodId) => {
    console.log("imageFile.length", imageFile.length);
    if (imageFile && imageFile.length > 0) {
      for (let i = 0; i < imageFile.length; i++) {
        let data = new FormData();
        let singleImageFile = imageFile[i];

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

  // useEffect(() => {
  //   if (singleProductData.length===0) {
  //     navigate("/products");
  //     // dispatch(getSingleProductData(prodId));
  //   }
  // }, [singleProductData]);


  const handleNavigate = (prodId) => {
    navigate("/InventoryProductsDetails", { state: { prodId } });
  };

  return prodLoading ? <LoadingSpinner /> : (
    <MainContentArea scroll={"auto"}>
      <div className="productMainContainer w-100">
        <div className="cardBox productFromContainer overflow-auto d-flex flex-column">
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
            {t("AddNewProduct.productEdit")}
          </h1>
          <div className="mb-3">
            {/* <DragandDrop files={imageFile} setFiles={setImageFile} /> */}
            <DragAndDropPureHtml
              files={imageFile}
              setFiles={setImageFile}
              editProductImgs={editProductImgs}
              setEditProductImgs={setEditProductImgs}
              uploadImageHandler={() => { }}
            />
          </div>

          {/* productName and SellingPrice  */}
          <div className="productFormInputContainer d-flex justify-content-between flex-wrap mt-2">
            <div className="productItems mb-3">
              <InputLabel style={{ color: "var(--product-text-color)" }}>
                {t("AddNewProduct.productName")}
                <span className="text-danger">*</span>
              </InputLabel>
              <TextField
                style={{ backgroundColor: "var(--white-color)" }}
                id="outlined-size-small"
                value={fields && fields.productName}
                size="small"
                name="productName"
                inputRef={prodNameInputRef}
                onChange={productInputHanlder}
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
                style={{ backgroundColor: "var(--white-color)" }}
                id="outlined-size-small"
                type="tel"
                value={fields && fields?.sellingPrice}
                size="small"
                name="sellingPrice"
                inputRef={sellingPriceInputRef}
                onChange={productInputHanlder}
                inputProps={{ maxLength: 7 }}
              />
              {error && error?.sellingPrice && (
                <span className="text-danger">{error?.sellingPrice}</span>
              )}
            </div>
          </div>

          {/* category and unit*/}
          <div className="productFormInputContainer d-flex justify-content-between flex-wrap mt-2">
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
                value={categoryValue && categoryValue}
                onChange={categorySelectHandler}
                isClearable
              />
              {error && error?.categoryValue && (
                <span className="text-danger">{error?.categoryValue}</span>
              )}
              <div className="form-link mt-1">
                <Link
                  className="card-link fs-6 m-2"
                  onClick={() => setshowCategoryModal(true)}
                >
                  {t("AddNewProduct.addCategory")}
                </Link>
              </div>
              {showCategoryModal && (
                <CategoryModal
                  isModelVisible={showCategoryModal}
                  setshow={setshowCategoryModal}
                />
              )}
            </div>
            <div className="productItems mb-3">
              <InputLabel style={{ color: "var(--product-text-color)" }}>
                {t("AddNewProduct.unit")}
                <span className="text-danger">*</span>
              </InputLabel>
              <div style={{ marginBottom: 5 }}>
                <Select
                  placeholder={t("AddNewProduct.selectUnit")}
                  getOptionLabel={(unitListData) => unitListData?.unitName}
                  options={unitListData}
                  styles={CUSTOM_DROPDOWN_STYLE}
                  value={unitValue}
                  style={{ marginBottom: 5 }}
                  name="unitValue"
                  ref={unitInputRef}
                  onChange={unitSelectHandler}
                  isClearable
                />
                {error && error?.unitValue && (
                  <span className="text-danger">{error?.unitValue}</span>
                )}
              </div>
              <Link
                className="fs-6 m-2  pt-2 "
                onClick={() => setshowUnitModal(true)}
              >
                {t("AddNewProduct.addUnit")}
              </Link>

              {showUnitModal && (
                <UnitModal
                  isModelVisible={showUnitModal}
                  setshow={setshowUnitModal}
                />
              )}
            </div>
          </div>

          <div className="productFormInputContainer d-flex justify-content-between">
            <div className="mb-3" style={{ width: "100%" }}>
              <InputLabel style={{ color: "var(--product-text-color)" }}>
                {t("AddNewProduct.productDescription")}
                {/* Product Description */}
                <span className="text-danger">*</span>
              </InputLabel>
              {/* <TextareaAutosize
                minRows={3}
                placeholder="Minimum 3 rows"
                value={fields && fields?.productDesc}
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
                value={fields && fields?.productDesc}
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

              {/* More Option */}
              {moreOption === true ? t("AddNewProduct.hideOption") : t("AddNewProduct.moreOption")}
              {moreOption === true ? <TiArrowSortedUp /> : <TiArrowSortedDown />}

            </label>
          </div>
          {moreOption && (
            <>
              <div className="productFormInputContainer d-flex justify-content-between flex-wrap mt-3">
                <div className="productItems mb-3">
                  <InputLabel style={{ color: "var(--product-text-color)" }}>
                    {t("AddNewProduct.purchasingPrice")}
                    {showInventoryManage && <span className="text-danger">*</span>}
                  </InputLabel>
                  <TextField
                    style={{ backgroundColor: "var(--white-color)" }}
                    id="outlined-size-small"
                    value={fields && fields?.purchasingPrice}
                    size="small"
                    name="purchasingPrice"
                    inputRef={purchasingPriceInputRef}
                    onChange={productInputHanlder}
                    inputProps={{ maxLength: 7 }}
                    disabled={showInventoryManage}
                    InputProps={{
                      style: {
                        backgroundColor: showInventoryManage?
                          'rgb(227, 226, 226)' :
                          'var(--white-color)'
                      }
                    }}

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
                    style={{ backgroundColor: "var(--white-color)" }}
                    id="outlined-size-small"
                    value={fields && fields?.mrp}
                    size="small"
                    name="mrp"
                    onChange={productInputHanlder}
                    inputProps={{ maxLength: 7 }}
                  />
                </div>
              </div>

              {/* Brand and barcode */}
              <div className="productFormInputContainer d-flex justify-content-between flex-wrap">

                <div className="productItems mb-3">
                  <InputLabel style={{ color: "var(--product-text-color)" }}>
                    {t("AddNewProduct.brand")}
                    {/* Brand */}
                  </InputLabel>
                  <Select
                    placeholder={t("AddNewProduct.selectBrand")}
                    getOptionLabel={(brandListData) => brandListData?.brandName}
                    options={brandListData}
                    styles={CUSTOM_DROPDOWN_STYLE}
                    value={brandValue && brandValue}
                    onChange={brandSelectHandler}
                    isClearable
                  />
                  <div className="form-link mt-1">
                    <Link
                      className="card-link fs-6 m-2"
                      onClick={() => setshowBrandModal(true)}
                    >
                      {t("AddNewProduct.addBrand")}
                    </Link>
                  </div>
                  {showBrandModal && (
                    <BrandModal
                      isModelVisible={showBrandModal}
                      setshow={setshowBrandModal}
                    />
                  )}
                </div>
                <div className="productItems mb-3">
                  <InputLabel style={{ color: "var(--product-text-color)" }}>
                    {t("AddNewProduct.barcode")}
                  </InputLabel>
                  <TextField
                    style={{ backgroundColor: "var(--white-color)" }}
                    id="outlined-size-small"
                    value={fields && fields?.barCode}
                    size="small"
                    name="barCode"
                    onChange={productInputHanlder}
                  />
                </div>
              </div>
              {/* Purchaing price */}

              {/* Inventoru Manage */}
              <div className="productFormInputContainer d-flex justify-content-between flex-wrap">
                <div className="productItems mb-3 d-flex justify-content-start align-items-center">
                  <InputLabel style={{ color: "var(--product-text-color)" }}>
                    {t("AddNewProduct.inventoryManage")}
                  </InputLabel>
                  <Switch
                    {...label}
                    checked={showInventoryManage}
                    onChange={() =>
                      setShowInventoryManage(!showInventoryManage)
                    }
                  />
                </div>
                {showInventoryManage &&
                  <div>
                    <button
                      className="btn"
                      style={{ color: "#0d6efd" }}
                      onClick={() =>
                        handleNavigate(prodId)
                      }
                    >
                      {t("AddNewProduct.editInventory")}
                    </button>
                  </div>
                }
              </div>

              {/* Quantity */}
              {showInventoryManage && (
                <div className="productFormInputContainer d-flex justify-content-between flex-wrap">
                  <div className="productItems mb-3">
                    <InputLabel style={{ color: "var(--product-text-color)" }}>
                      {t("AddNewProduct.quantity")}
                      {showInventoryManage && <span className="text-danger">*</span>}
                    </InputLabel>
                    <TextField
                      type="tel"
                      style={{ backgroundColor: "var(--white-color)" }}
                      id="outlined-size-small"
                      value={fields && fields?.quantity}
                      size="small"
                      name="quantity"
                      inputRef={quantityInputRef}
                      onChange={productInputHanlder}
                      inputProps={{ maxLength: 4 }}
                      disabled={showInventoryManage}
                      InputProps={{
                        style: {
                          backgroundColor: showInventoryManage ?
                            'rgb(227, 226, 226)' :
                            'var(--white-color)'
                        }
                      }}
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
                      id="outlined-size-small"
                      value={fields && fields?.stockLevelAlert}
                      size="small"
                      name="stockLevelAlert"
                      onChange={productInputHanlder}
                      inputProps={{ maxLength: 4 }}
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
                      className="card-link fs-6 m-2"
                      onClick={() => setshowTaxModal(true)}
                    >
                      {t("AddNewProduct.addTax")}
                    </Link>
                  </div>
                  {showTaxModal && (
                    <TaxModal
                      isModelVisible={showTaxModal}
                      setshow={setshowTaxModal}
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
                    getOptionLabel={(discountListData) =>
                      discountListData?.discountName
                    }
                    options={discountListData}
                    styles={CUSTOM_DROPDOWN_STYLE}
                    value={discountvalue}
                    onChange={discountSelectHandler}
                    isClearable
                  />
                  <div className="form-link mt-1">
                    <Link
                      className="card-link fs-6 m-2"
                      onClick={() => setshowDiscountModal(true)}
                    >
                      {t("AddNewProduct.addDiscount")}
                    </Link>
                  </div>

                  {showDiscountModal && (
                    <DiscountModal
                      isModelVisible={showDiscountModal}
                      setshow={setshowDiscountModal}
                    />
                  )}
                </div>
                <div className="productItems d-flex justify-content-end align-items-center">
                  <Switch
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
              {t("AddNewProduct.update")}
            </Button>
          </div>
        </div>

        <div className="cardBox productPrevContainer overflow-auto">
          <h1 style={{ fontSize: "1.5rem", padding: "20px" }}>
            {t("AddNewProduct.preview")}
          </h1>
          {/* 
          {imageFile.length !== 0 && (
            <div>
              <EditPrevCartSlider
                productActiveImage={editProductImgs}
                productImagesArray={null}
                editProductImagesArray={
                  Array.isArray(editProductImgs) && editProductImgs
                }
                defualtProduct={defaultImage}
                defaultImgIndex={defaultImgIndex}
                defualtImgHandler={setDefaultHandler}
                isOnline={isOnline}
              />
            </div>
          )} */}

          {imageFile && imageFile?.length > 0 ? (
            <div>
              <EditPrevCartSlider
                productActiveImage={
                  imageFile && imageFile[0] && URL.createObjectURL(imageFile[0])
                }
                productImagesArray={imageFile && imageFile}
                editProductImagesArray={null}
                defualtProduct={defaultImage}
                defaultImgIndex={defaultImgIndex}
                defualtImgHandler={setDefaultHandler}
              />
            </div>
          ) : (
            <div>
              <EditPrevCartSlider
                productActiveImage={editProductImgs}
                productImagesArray={null}
                editProductImagesArray={
                  Array.isArray(editProductImgs) && editProductImgs
                }
                defualtProduct={defaultImage}
                defaultImgIndex={defaultImgIndex}
                defualtImgHandler={setDefaultHandler}
                isOnline={isOnline}
              />
            </div>
          )}
        </div>

        <AlertpopUP
          open={isPopupOpen}
          message={
            apiError?.length > 0 ? apiError : "Product update successfully"
          }
          severity={apiError?.length > 0 ? "error" : "success"}
          onClose={handleClose}
        />
      </div>
    </MainContentArea>
  );
};

export default EditProductPage;
