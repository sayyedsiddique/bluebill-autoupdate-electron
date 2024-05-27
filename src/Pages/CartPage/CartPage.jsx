import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { RiDeleteBin5Line } from "react-icons/ri";
import { BsFillGridFill, BsFillPrinterFill, BsList } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import NoOnlineOrderItem from "../../Components/OnlineOrders/NoOnlineOrderItem/NoOnlineOrderItem";
import {
  ADD_TRANSACTION_PAYMENT,
  getUTCDate,
  GET_CUSTOMER,
  GET_SALESEXECUTIVE,
  retrieveObj,
  SERVER_URL,
  STORE_CURRENCY,
  STORE_Id,
  DateFormateForTransaction,
  storeObjInLocalStrg,
  COGNITO_USER_INFO,
} from "../../Containts/Values";
import {
  getProductList,
  getProuductByCategoryId,
} from "../../Redux/Product/productSlice";
import { getTaxList, getTaxMappedList } from "../../Redux/Tax/taxSlice";
import {
  PopUp,
  SelectedPaymentMode,
  apiConfig,
  getSortArrow,
  handleTrim,
  showPopupHandleClick,
  sortTableDataHandler,
} from "../../utils/constantFunctions";
import MainContentArea from "../MainContentArea/MainContentArea";
import "./CartPage.css";
import {
  getDiscountlist,
  getMappedDiscountByProdutId,
} from "../../Redux/Discount/discountSlice";
import Swal from "sweetalert2";
import moment from "moment";
import ApplyDiscountModal from "./ApplyDiscountModal";
import {
  addSalesDetails,
  addTransaction,
  addTransactionNSalesDetails,
} from "../../Redux/Cart/cartSlice";
import { color } from "@mui/system";
// import BasicSelect from "../../Components/Select/BasicSelect";
import { Button, Card, CardContent, Typography } from "@mui/material";
import { CUSTOM_DROPDOWN_STYLE } from "../../utils/CustomeStyles";

import { useTranslation } from "react-i18next";
import { getUnitList } from "../../Redux/Unit/unitSlice";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";
import { CiImageOff, CiImageOn } from "react-icons/ci";
import CustomerModal from "../CustomersDetailsPage/CustomerModal";
import MeasurableUnitModal from "./MeasurableUnitModal";
import { useLocation, useNavigate } from "react-router-dom";
import AlertpopUP from "../../utils/AlertPopUP";
import { BiCheck, BiSearch } from "react-icons/bi";
import ReactToPrint from "react-to-print";
import { MdPictureAsPdf, MdShoppingCart } from "react-icons/md";
import Select from "react-select";
import ThermalSmallInvoice from "../../Components/Invoice/ThermalSmallInvoice";
import { getCategoryList } from "../../Redux/Category/categorySlice";
import CartProductItem from "./CartProductItem";
import KotCancellationModal from "../../Components/Modals/KotCancellationModal";
import {
  addTableOrderTrans,
  updateTableOrderTrans,
} from "../../Redux/TableOrder/TableOrderSlice";
import {
  UpdateTableOrderTransProduct,
  addTableOrderTransProduct,
} from "../../Redux/TableOrderProduct/TableOrderProductSlice";
import BillingThermalSmallInvoice from "../../Components/Invoice/BillingThermalSmallInvoice";
import jsPDF from "jspdf";
import EmptyCategoryCart from "./EmptyCategoryMsg/EmptyProductsCategoryMessege";
import EmptyCategoryMessege from "./EmptyCategoryMsg/EmptyProductsCategoryMessege";
import EmptyProductsCategoryMessege from "./EmptyCategoryMsg/EmptyProductsCategoryMessege";
import CategoryList from "./CategoryList/CategoryList";
import defaultImage from "../../assets/images/default-image.png";

const CartPage = () => {
  let DefaultCustomer = { customerName: "Guest", customerId: 0 };
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  console.log("location... ", location?.state?.selectedProductList);
  const componentRef = useRef();
  const componentRef1 = useRef();
  const productApi = window.productApi;
  const taxApi = window.taxApi;
  const mappedTaxApi = window.mappedTaxApi;
  const discountApi = window.discountApi;
  const discountMappingApi = window.discountMappingApi;
  const salesExecutiveApi = window.salesExecutiveApi;
  const customerApi = window.customerApi;
  const transactionPaymentApi = window.transactionPaymentApi;
  const salesDetailsApi = window.salesDetailsApi;
  const unitApi = window.unitApi;
  const tableOrderApi = window.tableOrderApi;
  const tableOrderTransProductsApi = window.tableOrderTransProductsApi;
  const categoryApi = window.categoryApi;

  const categoriesData = useSelector((state) => state.category.categoriesData);
  const isOnline = useSelector((state) => state.checkInternet.isOnline);
  const productData = useSelector((state) => state.product.productData);
  const isLoading = useSelector((state) => state.product.loading);
  const taxMapList = useSelector((state) => state.tax.mappedTaxList);
  const taxList = useSelector((state) => state.tax.taxData);
  const getDiscountData = useSelector((state) => state.discount.discountData);

  const UnitData = useSelector((state) => state.unit.unitData);
  const getSingleDiscount = useSelector(
    (state) => state.discount.getSingleDiscount
  );

  // for measurable Unit
  const [measurableUnitModal, setMeasurableUnitModal] = useState(false);
  const [measurableQuentity, setMeasurableQuentity] = useState();
  const [measyrableProduct, setMeasurableProduct] = useState([]);
  // console.log("measyrableProduct... ", measyrableProduct);
  const [measurableUnitName, setMeasurableUnitName] = useState("");
  const [productName, setProductName] = useState("");

  const [unitData, setUnitData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [salesExeData, setSalesExeData] = useState([]);
  const [searchProduct, setSearchProduct] = useState("");
  console.log("searchProduct", searchProduct);
  const [addCart, setAddCart] = useState([]);
  console.log("addCart ", addCart);
  const [infoBackground, setInfoBackground] = useState("var(--main-bg-color)");
  const [disableBackground, setDisableBackground] =
    useState("var(--white-color)");
  const [total, setTotal] = useState(0);
  console.log("total... ", total);
  const [totalTax, setTotalTax] = useState(0);
  console.log("totalTax", totalTax);
  const [sortOrder, setSortOrder] = useState("descending");
  console.log("sortOrder ", sortOrder);

  const [totalDiscount, setTotalDiscount] = useState(0);
  console.log("totalDiscount... ", totalDiscount);
  const [changeOperator, setChangeOperator] = useState(true);
  const [flatDiscount, setFlatDiscount] = useState(0);
  console.log("changeOperator... ", changeOperator);
  const [maxlength, setmaxlength] = useState(2);
  const [isModelVisible, setModalVisible] = useState(false);
  const [customerSearch, setCustomerSearch] = useState("");
  const [customer, setCustomer] = useState(DefaultCustomer);
  const [modalForExe, setModalForExe] = useState(false);
  const [salesExeSearch, setSalesExeSearch] = useState("");
  let salesMan = JSON.parse(localStorage.getItem("Sales"));

  const [salesExe, setSalesExe] = useState(salesMan ? salesMan : "");
  const [grid, setgrid] = useState(true);
  const [selectedProdPrice, setSelectedProdPrice] = useState(0);
  const [selectedDiscount, setSelectedDiscount] = useState(0);

  const [gridChangeBackGround, setGridChangeBackGround] =
    useState("var(--white-color)");
  const [gridActive, setGridActive] = useState(false);
  const [gridDisableBackGround, setGridDisableBackGround] = useState(
    "var(--main-bg-color)"
  );
  const [discountTypeActive, setDiscountTypeActive] = useState(false);
  const [additionalDiscount, setAdditionalDiscount] = useState("");
  const [expireProduct, setExpireProduct] = useState([]);
  const [expiringProduct, setexpiringProduct] = useState([]);
  const [expireModal, setExpireModal] = useState(false);
  const [expiringModal, setExpiringModal] = useState(false);
  const [discountModal, setDiscountModal] = useState(false);
  const [singleProduct, setSingleProduct] = useState([]);
  // const [gridBackGround,setGridBackGround]=useState()
  const [expiredProdSearch, setExpiredProdSearch] = useState("");
  const [UserName, setUserName] = useState("");
  const [modeOfPay, setModeOfPay] = useState(SelectedPaymentMode[0]);

  const [buttonDisable, setButtonDisable] = useState(false);
  const [product, setProduct] = useState([]);
  console.log("product0007", product);
  const [taxDataList, setTaxDataList] = useState([]);
  const [mappedTaxDataList, setMappedTaxDataList] = useState([]);

  const [discountDataList, setDiscountDataList] = useState([]);
  console.log("discountDataList... ", discountDataList);

  const [discountMappedDetails, setDiscountMappedDetails] = useState();

  const [saveTransDetails, setSaveTransDetails] = useState();
  // for adding new customer
  const [newCustomerModal, setNewCustomerModal] = useState(false);
  // show hide image
  const [showHideImg, setShowHideImg] = useState(false);
  const [error, setError] = useState(false);
  const [parkData1, setParkData1] = useState([]);
  const [apiError, setApiError] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false); // for popup
  const [popUpMsg, setPopUpMsg] = useState("");

  const [invoiceSizes, setInvoiceSizes] = useState({});
  // console.log("invoiceSizes", invoiceSizes);
  const [selectedTable, setSelectedTable] = useState(null);
  console.log("selectedTable... ", selectedTable);
  const [openKotCancellation, setOpenKotCancellation] = useState(false);
  const [kotCancelReason, setKotCancelReason] = useState("");
  const [deletingProductIndex, setDeletingProductIndex] = useState(null);
  const [tableOrderId, setTableOrderId] = useState("");
  const defaultLang = useSelector((state) => state.language.language);
  const [defaultLanguage, setDefaultLanguage] = useState(defaultLang?.name);
  const [productCategorydata, setproductCategorydata] = useState([]);
  const [newCartlist, setnewCartlist] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const CurrencySymbol = localStorage.getItem("StoreCurrency");
  const [tableOrderTransPostRes, setTableOrderTransPostRes] = useState(null);
  console.log("tableOrderTransPostRes... ", tableOrderTransPostRes);
  console.log("saveTransDetails", saveTransDetails);
  // It's only for restaurent store
  // when user edit order from table we redict user to this page
  // with table order product list if we have product list
  // we can store it in cart state to displayed again in the cart
  useEffect(() => {
    let productList = location?.state?.selectedProductList;
    productList && setAddCart(productList);
    if (location?.state?.totalPriceDetails) {
      setTotal(
        location?.state?.totalPriceDetails?.subTotalValue +
        location?.state?.totalPriceDetails?.totalTaxValue
      );
      setTotalTax(location?.state?.totalPriceDetails?.totalTaxValue);
      //   calculating total price,quantity,subTotal value
      let discountObj = {
        productDiscount: 0,
      };

      let prodDiscount = productList?.reduce(
        (acc, item) => {
          acc.productDiscount += item?.productDiscount * item?.prQuantity;
          return acc;
        },
        { ...discountObj }
      );
      console.log("prodDiscount ", prodDiscount?.productDiscount);
      prodDiscount?.productDiscount &&
        setTotalDiscount(Number(prodDiscount?.productDiscount));

      console.log("prodDiscount... , ", prodDiscount);
      location?.state?.tableOrderId &&
        setTableOrderId(location?.state?.tableOrderId);
      // setTotalDiscount
    }
  }, [location?.state?.selectedProductList]);

  // Getting local storage values
  useEffect(() => {
    const storedInvoiceSizes = localStorage.getItem("InvoiceSizes");
    const tableSelectedDetails = localStorage.getItem("selectedTable");
    tableSelectedDetails && setSelectedTable(JSON.parse(tableSelectedDetails));
    // console.log(39, storedInvoiceSizes);
    storedInvoiceSizes && setInvoiceSizes(JSON.parse(storedInvoiceSizes));
  }, []);

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

  const productPlacedSuccess = () => {
    showPopupHandleClick(setIsPopupOpen, 3000, setApiError, navigate, "/cart"); //for popUp msg
  };

  // store park data in local storage
  const parkFunction = () => {
    retrieveObj("parkData1").then((data) => {
      setParkData1(data);
    });
  };

  useEffect(() => {
    parkFunction();
    let value = JSON.parse(localStorage.getItem("ShowHideGridImg"));
    value === true ? setShowHideImg(true) : setShowHideImg(false);
  }, []);

  // getting local storage default language
  useEffect(() => {
    defaultLang && setDefaultLanguage(defaultLang?.name);
  }, [defaultLang?.name]);

  // after apis response got we store that res in state
  useEffect(() => {
    productData?.product?.length > 0 && setProduct(productData?.product);
    taxList?.tax?.length > 0 && setTaxDataList(taxList?.tax);
    taxMapList?.length > 0 && setMappedTaxDataList(taxMapList);
    getDiscountData?.discount?.length > 0 &&
      setDiscountDataList(getDiscountData?.discount);
    getSingleDiscount && setDiscountMappedDetails(getSingleDiscount[0]);
    UnitData?.unit?.length > 0 && setUnitData(UnitData?.unit);
    categoriesData?.category?.length > 0 &&
      setproductCategorydata(categoriesData?.category);
  }, [
    productData?.product,
    taxList?.tax,
    taxMapList,
    getDiscountData?.discount,
    getSingleDiscount,
    UnitData?.unit,
    categoriesData?.category,
  ]);

  // initially apis called here
  useEffect(() => {
    if (isOnline) {
      fetchCustomer();
      fetchSelesExe();
      // dispatch(getProductList(0, 0, ""));
      dispatch(getProuductByCategoryId("", true, 0, 0, ""));
      dispatch(getTaxList(0, 0, ""));
      dispatch(getTaxMappedList());
      dispatch(getDiscountlist(0, 0, "", ""));
      retrieveObj("cognitoUserInfo").then((cognito) => {
        setUserName(cognito.username);
      });
      dispatch(getUnitList(0, 0, ""));
      dispatch(getCategoryList(0, 0, ""));
    } else {
      const productList = productApi?.productDB?.getProductsList();
      productList && setProduct(productList);
      const taxListArr = taxApi?.taxDB?.getAllTaxes();
      taxListArr && setTaxDataList(taxListArr);
      const mappedTaxData = mappedTaxApi?.mappedTaxDB?.getMappedTaxList();
      mappedTaxData && setMappedTaxDataList(mappedTaxData);
      const discountList = discountApi?.discountDB?.getAllDiscounts();
      discountList && setDiscountDataList(discountList);
      const salesExList =
        salesExecutiveApi?.salesExecutiveDB?.getAllSalesExecutive();
      salesExList && setSalesExeData(salesExList);
      const customerList = customerApi?.customerDB?.getAllCustomers();
      customerList && setCustomerData(customerList);
      const unitsData = unitApi && unitApi?.unitDB?.getUnits();
      setUnitData(unitsData);
      const categories = categoryApi?.categoryDB?.getAllCategories();
      setproductCategorydata(categories);
    }
  }, []);

  useEffect(() => {
    let expiredDay = JSON.parse(localStorage.getItem("ExpireProduct"));
    let day = expiredDay?.id * expiredDay?.value;
    let expProduct = [];
    let expiringProd = [];
    product?.map((item) => {
      let date = getUTCDate();
      let finalDate = item.expiryDate - day;
      //to remove expired product
      let removeExpire = date - day;
      if (finalDate <= date && removeExpire <= finalDate) {
        expiringProd.push(item);
      }
      if (item.expiryDate <= date) {
        expProduct.push(item);
      }
    });
    let test = [...expProduct, ...expiringProd];

    setExpireProduct(expProduct);
    setexpiringProduct(expiringProd);
  }, [product]);

  const fetchCustomer = () => {
    let config = apiConfig(`${SERVER_URL}${GET_CUSTOMER}`, "GET");
    axios(config)
      .then((responce) => {
        if (responce.status === 200) {
          setCustomerData(responce.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchSelesExe = () => {
    let config = apiConfig(`${SERVER_URL}${GET_SALESEXECUTIVE}`, "GET");
    axios(config)
      .then((responce) => {
        if (responce.status === 200) {
          setSalesExeData(responce.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // const handleTrim = (name) => {
  //   const Productname = name;
  //   let val = Productname.slice(0, 20);
  //   return val;
  // };

  const handlePercentButton = () => {
    // setInfoBackground("#004A66");
    // setDisableBackground("var(--white-color)");

    // setInfoBackground("var(--main-bg-color)");
    // setDisableBackground("var(--white-color)");
    setChangeOperator(true);
    setmaxlength(2);
    setFlatDiscount("");
    setAdditionalDiscount("");
  };

  const handleRupeeButton = () => {
    // setInfoBackground("var(--white-color)");
    // setDisableBackground("var(--main-bg-color)");
    setChangeOperator(false);
    setmaxlength(5);
    setFlatDiscount("");
    setAdditionalDiscount("");
  };

  const handleGridButton = () => {
    setGridChangeBackGround("var(--main-bg-color)");
    setGridDisableBackGround("var(--white-color)");
    setgrid(false);
  };

  const handleListButton = () => {
    setGridChangeBackGround("var(--white-color)");
    setGridDisableBackGround("var(--main-bg-color)");
    setgrid(true);
  };

  const handleFindTax = (product) => {
    let findTax = mappedTaxDataList.find((tax) => {
      return tax?.productId === product?.productId;
    });
    let taxValue = taxDataList.find((tax) => {
      return findTax?.taxId === tax?.taxId;
    });
    return taxValue;
  };

  const handleProductDiscount = async (sellingPrice, mappedDiscountDetails) => {
    let discountprice = 0;
    // console.log("sellingPrice... ", sellingPrice);
    // console.log("mappedDiscountDetails... ", mappedDiscountDetails);
    // console.log("discountDataList... ", discountDataList);

    mappedDiscountDetails &&
      discountDataList?.map((item) => {
        if (mappedDiscountDetails?.discountId === item?.discountId) {
          // console.log("idsMatch");
          if (item.isPercent === false || item.isPercent === 0) {
            discountprice = discountprice + item.discountVal; // it is a flat discount
            // console.log("discountpriceFlat", discountprice);
            return discountprice;
          } else if (item.isPercent === true || item.isPercent === 1) {
            discountprice =
              discountprice + (sellingPrice * item.discountVal) / 100; // it is a percent discount
            // console.log("discountpricePercent ", discountprice);
            return discountprice;
          }
        }
      });
    // console.log("discountprice... ", discountprice)
    return discountprice;
  };

  const ProdDiscountCalculation = async (productDetails) => {
    console.log("productDetails... ", productDetails);
    let discountprice = 0;

    const filteredDiscount = discountDataList?.find(
      (item) => item?.discountId === productDetails?.discountId
    );
    console.log("filteredDiscount... ", filteredDiscount);
    const now = new Date();
    const expiry = new Date(filteredDiscount?.endDate);

    if (expiry <= now) {
      console.log("discountExpired")
      return 0;
    } else {
      console.log("discountExpiredNot")
      // it is a flat discount
      if (productDetails?.percent === false || productDetails?.percent === 0) {
        discountprice = discountprice + Number(productDetails?.discountVal);
        // console.log("discountpriceFlat", discountprice);
        return discountprice;

        // it is a percent discount
      } else if (
        productDetails?.percent === true ||
        productDetails?.percent === 1
      ) {
        discountprice =
          discountprice +
          (productDetails?.sellingPrice * Number(productDetails?.discountVal)) /
          100;
        // console.log("discountpricePercent ", discountprice);
        return discountprice;
      }
    }
  };

  // for find unite measurable or Not
  const handleCheckUnit = (unitId) => {
    let check = null;
    check = unitData.find((item) => {
      return (
        (item.unitId === unitId && item.isMeasurable === true) ||
        (item.unitId === unitId && item.isMeasurable === 1)
      );
    });

    return check;
  };

  // const handleAddCartbefore = async (prodData) => {
  //   console.log("handleAddCartbeforeChala");
  //   // let CheckUnit = handleCheckUnit(prodData.unitId);

  //   // if (CheckUnit === null) {
  //   // let config = apiConfig(
  //   //   `${SERVER_URL}discountmapping/getDiscountMapping?lastUpdated=0&productId=${prodData.productId}`,
  //   //   "GET"
  //   // );

  //   // let productDiscount = 0;
  //   let selectedProductDiscount = 0;
  //   if (isOnline) {
  //     const calculatedDiscount = ProdDiscountCalculation(prodData)
  //     handleAddCart(prodData, prodData?.discountVal);
  //     // const discountResponse = await axios(config);
  //     // console.log("discountResponse... ", discountResponse);
  //     // if (discountResponse?.status === 200) {
  //     //   productDiscount =
  //     //     discountResponse.data &&
  //     //     handleProductDiscount(
  //     //       prodData?.sellingPrice,
  //     //       discountResponse.data[0]
  //     //     );
  //     //   productDiscount.then((data) => {
  //     //     handleAddCart(prodData, data);
  //     //   });
  //     // } else {
  //     //   handleAddCart(prodData, productDiscount);
  //     // }

  //     // axios(config)
  //     //   .then((responese) => {
  //     //     if (responese.status === 200) {
  //     //       if (responese?.data?.length > 0) {
  //     //         console.log("DISresponese?.data... ", responese?.data);
  //     //         productDiscount =
  //     //           responese.data &&
  //     //           handleProductDiscount(
  //     //             prodData?.sellingPrice,
  //     //             responese.data[0]
  //     //           );
  //     //         productDiscount.then((data) => {
  //     //           handleAddCart(prodData, data);
  //     //         });
  //     //       } else {
  //     //         console.log("ELSECHALA... ", responese?.data);
  //     //         handleAddCart(prodData, productDiscount);
  //     //       }
  //     //     }
  //     //     console.log("response dicount mapped list ", responese);
  //     //   })
  //     //   .catch((error) => {
  //     //     console.log("error dicount mapped list ", error);
  //     //     handleAddCart(prodData, productDiscount);
  //     //   });
  //     // handleAddCart(prodData, productDiscount);
  //   } else {
  //     let mappedDiscountDetails =
  //       discountMappingApi?.discountMappingDB?.getDiscountMappingDetails(
  //         prodData.productId
  //       );
  //     mappedDiscountDetails && setDiscountMappedDetails(mappedDiscountDetails);

  //     selectedProductDiscount = handleProductDiscount(
  //       prodData?.sellingPrice,
  //       mappedDiscountDetails
  //     );
  //     if (selectedProductDiscount) {
  //       selectedProductDiscount.then((data) => {
  //         handleAddCart(prodData, data);
  //       });
  //       // handleAddCart(prodData,productDiscount)
  //     }
  //   }
  //   // }
  //   // else {
  //   //   handleAddCart(prodData, 0);
  //   // }
  // };

  const handleAddCart = async (prodData, singleProductDiscount) => {
    console.log("prodData... ", prodData);
    // let mappedDiscountDetails;
    let CheckUnit = handleCheckUnit(prodData.unitId);
    if (prodData?.inventoryManage === 1 && prodData?.quantity === 0) {
      Swal.fire({
        title: "Product Quantity is not available",
      });
      return;
    }

    // let taxVal = handleFindTax(prodData);
    // let taxObj;
    // if (prodData?.priceIncludeTax !== "1") {
    //   taxObj = handleFindTax(prodData);
    // }

    let taxName = "";
    let taxPercent = "";
    let productTax = 0;
    let taxValue = 0;
    let singleProTotal = 0;
    let prQuantity = 1;
    let arr = [...addCart];
    let productDiscount = await ProdDiscountCalculation(prodData);
    let totalProdDiscount = await ProdDiscountCalculation(prodData);
    console.log("productDiscount... ", totalProdDiscount);
    console.log("totalProdDiscount... ", totalProdDiscount);
    // productDiscount = await handleProductDiscount(
    //   prodData?.sellingPrice,
    //   mappedDiscountDetails
    // );
    // if (taxObj !== undefined) {
    //   taxValue = taxObj?.taxValue;
    //   taxName = taxObj?.taxName;
    //   taxPercent = taxObj?.taxValue;
    // }

    // if (prodData?.priceIncludeTax !== "1") {
    //   if (taxVal !== undefined) {
    //     taxValue = taxVal.taxValue;
    //     taxName = taxVal.taxName;
    //     taxPercent = taxVal.taxValue;
    //   }
    // }

    // checking product is already in cart or not
    let find = arr.find((item) => {
      return item.productId === prodData.productId;
    });

    // for check unit is measurable or not
    if (CheckUnit != null) {
      MeasurableOpen(prodData, null, CheckUnit.unitName);
      setMeasurableUnitName(CheckUnit.unitName);
    } else {
      // It's run when first time product added in cart
      if (find === undefined) {
        // if (taxObj !== undefined) {
        taxValue = (prodData?.sellingPrice * Number(prodData?.taxValue)) / 100;
        productTax =
          (prodData?.sellingPrice * Number(prodData?.taxValue)) / 100;
        // }
        singleProTotal =
          totalProdDiscount || productTax
            ? productTax + prodData?.sellingPrice - totalProdDiscount
            : prodData?.sellingPrice;
        console.log("singleProTotal... ", singleProTotal);
        const data = {
          ...prodData,
          prQuantity,
          productTax,
          taxValue,
          singleProTotal,
          productDiscount: productDiscount ? productDiscount : 0,
          discountVal: productDiscount ? productDiscount : 0,
          taxName,
          taxPercent,
        };
        console.log("ADDdata... ", data);
        setAddCart([...addCart, data]);
        setTotal(total + data.sellingPrice);
        taxValue && setTotalTax(totalTax + taxValue);
        totalProdDiscount &&
          setTotalDiscount(totalDiscount + totalProdDiscount);
      } else if (find) {
        // It's run when increasing same product quantity in cart
        arr?.map((elm, index) => {
          if (find.productId === elm.productId) {
            arr[index].prQuantity = arr[index].prQuantity + 1;

            arr[index].taxValue = arr[index].productTax + arr[index].taxValue;

            arr[index].singleProTotal =
              arr[index].singleProTotal +
              (arr[index].productTax +
                arr[index].sellingPrice -
                arr[index].productDiscount);
            setAddCart(arr);
            setTotal(total + arr[index].sellingPrice);
            setTotalTax(totalTax + arr[index].productTax);
            console.log(
              "first ",
              arr[index].productDiscount
                ? totalDiscount + arr[index].productDiscount
                : 0
            );
            arr[index].productDiscount &&
              setTotalDiscount(
                arr[index].productDiscount
                  ? totalDiscount + arr[index].productDiscount
                  : 0
              );
          }
        });
      }
    }
  };

  const MeasurableOpen = (prodData, quentity) => {
    let CheckUnit = handleCheckUnit(prodData.unitId);
    setMeasurableProduct(prodData);
    setMeasurableQuentity(quentity);
    setMeasurableUnitName(CheckUnit.unitName);
    setMeasurableUnitModal(true);
    setProductName(prodData.productName);
  };

  const handleUnitMeasurable = (measurableQuentity, check) => {
    let selectedProductDiscount = 0;
    if (isOnline) {
      let config = apiConfig(
        `${SERVER_URL}discountmapping/getDiscountMapping?lastUpdated=0&productId=${measyrableProduct.productId}`,
        "GET"
      );

      axios(config)
        .then((responese) => {
          if (responese.status === 200) {
            let productDiscount = 0;
            if (responese?.data?.length > 0) {
              let prodPrice =
                measurableQuentity * measyrableProduct.sellingPrice;
              productDiscount = handleProductDiscount(
                prodPrice,
                responese.data
              );
              productDiscount.then((data) => {
                //  handleAddCart(prodData,data)
                handleMeasurableProduct(measurableQuentity, check, data);
              });
            } else {
              handleMeasurableProduct(
                measurableQuentity,
                check,
                productDiscount
              );
            }
          }
          console.log("response dicount mapped list ", responese);
        })
        .catch((error) => {
          console.log("error dicount mapped list ", error);
        });
    } else {
      let mappedDiscountDetails =
        discountMappingApi?.discountMappingDB?.getDiscountMappingDetails(
          measyrableProduct.productId
        );
      setDiscountMappedDetails(mappedDiscountDetails);

      selectedProductDiscount = handleProductDiscount(
        measyrableProduct?.sellingPrice,
        mappedDiscountDetails
      );
      if (selectedProductDiscount) {
        selectedProductDiscount.then((data) => {
          handleMeasurableProduct(measurableQuentity, check, data);
        });
        // handleAddCart(prodData,productDiscount)
      }
    }

    const handleMeasurableProduct = (
      measurableQuentity,
      check,
      singleProductDiscount
    ) => {
      let taxObj = handleFindTax(measyrableProduct);
      let taxName = "";
      let taxPercent = "";
      let productTax = 0;
      let taxValue = 0;
      let singleProTotal = 0;
      let prQuantity = 1;
      let obj = { ...measyrableProduct };
      let arr = [...addCart];
      let productDiscount = singleProductDiscount;
      let totalProdDiscount = singleProductDiscount;

      let measureSellingPr;
      let isMeasurable = true;
      let prevPrice;
      let prevTax;
      let prevDiscount;

      if (obj?.priceIncludeTax !== 1) {
        if (taxObj !== undefined) {
          taxValue = taxObj.taxValue;
          taxName = taxObj.taxName;
          taxPercent = taxObj.taxValue;
        }
      }

      let find = arr.find((item) => {
        return item.productId === obj.productId;
      });

      measureSellingPr = measurableQuentity * obj.sellingPrice;
      prQuantity = measurableQuentity;
      if (taxObj !== undefined) {
        taxValue = (measureSellingPr * taxObj?.taxValue) / 100;
        productTax = (measureSellingPr * taxObj?.taxValue) / 100;
      }
      singleProTotal = productTax + measureSellingPr - singleProductDiscount;

      if (find === undefined) {
        const data = {
          ...obj,
          prQuantity,
          productTax,
          taxValue,
          singleProTotal,
          productDiscount,
          taxName,
          taxPercent,
          isMeasurable,
          measureSellingPr,
          totalProdDiscount,
        };

        setAddCart([...addCart, data]);
        setTotal(total + data.measureSellingPr);
        setTotalTax(totalTax + productTax);

        setTotalDiscount(totalDiscount + totalProdDiscount);
      } else if (find) {
        arr?.map((elm, index) => {
          if (find.productId === elm.productId) {
            if (check) {
              arr[index].prQuantity =
                arr[index].prQuantity + measurableQuentity;
              arr[index].productTax = arr[index].productTax + productTax;
              arr[index].totalProdDiscount =
                arr[index].totalProdDiscount + singleProductDiscount;
              arr[index].singleProTotal =
                arr[index].singleProTotal +
                (arr[index].taxValue + measureSellingPr) -
                singleProductDiscount;
              setAddCart(arr);
              setTotal(total + measureSellingPr);
              setTotalTax(totalTax + productTax);
              setTotalDiscount(totalDiscount + singleProductDiscount);
            } else if (arr[index].prQuantity !== measurableQuentity) {
              prevPrice = arr[index].singleProTotal - arr[index].productTax;
              prevTax = arr[index].productTax;
              prevDiscount = arr[index].totalProdDiscount;
              arr[index].prQuantity = measurableQuentity;
              arr[index].productTax = productTax;

              arr[index].totalProdDiscount = singleProductDiscount;
              arr[index].singleProTotal =
                productTax + measureSellingPr - arr[index].totalProdDiscount;
              setAddCart(arr);
              setTotal(total - prevPrice + measureSellingPr - prevDiscount);
              setTotalTax(totalTax - prevTax + productTax);
              setTotalDiscount(
                totalDiscount + singleProductDiscount - prevDiscount
              );
            }
          }
        });
      }
    };
  };

  const handleIncrement = (index) => {
    let arr = [...addCart];
    // console.log("arr", arr);
    // console.log("index", index);
    // console.log("total", total);
    console.log("arrProductDiscount ", arr[index]);
    if (arr[index].prQuantity >= arr[index].quantity) {
      Swal.fire({
        title: "Product quantity has been exhausted",
      });
    } else {
      arr[index].prQuantity += 1;
      arr[index].taxValue = arr[index].productTax + arr[index].taxValue;
      arr[index].singleProTotal =
        arr[index].singleProTotal +
        (arr[index].productTax + arr[index].sellingPrice) -
        arr[index].productDiscount;
      setAddCart(arr);
      setTotal(total + arr[index].sellingPrice);
      setTotalTax(totalTax + arr[index].productTax);
      setTotalDiscount(totalDiscount + arr[index].productDiscount);
    }
  };

  const handleDecrement = (index) => {
    console.log("totalDiscount... ", totalDiscount);
    let arr = [...addCart];
    arr[index].prQuantity -= 1;
    console.log("arrProductDiscount ", arr[index]);
    if (arr[index].prQuantity === 0) {
      setTotal(total - arr[index].sellingPrice);
      setTotalTax(
        arr[index].productTax ? totalTax - arr[index].productTax : totalTax
      );
      setTotalDiscount(
        arr[index].productDiscount > 0
          ? totalDiscount - arr[index].productDiscount
          : totalDiscount
      );
      arr.splice(index, 1);
      setAddCart(arr);
      return;
    }
    console.log("arrProductDiscount ", arr[index].productDiscount);
    arr[index].taxValue = arr[index].taxValue - arr[index].productTax;
    arr[index].totalProdDiscount =
      arr[index].totalProdDiscount - arr[index].productDiscount;
    arr[index].singleProTotal =
      arr[index].singleProTotal -
      (arr[index].productTax + arr[index].sellingPrice) +
      arr[index].productDiscount;
    setAddCart(arr);
    setTotalTax(totalTax - arr[index].productTax);
    setTotal(total - arr[index]?.sellingPrice);
    setTotalDiscount(totalDiscount - arr[index].productDiscount);
  };

  const handleSetDiscount = (e) => {
    let Total = total + totalTax;
    // setAdditionalDiscount(e.target.value);
    const value = e.target.value.replace(/\D/g, "");
    console.log("value... ", value);
    setAdditionalDiscount(value);
    let disVal = e.target.value;
    let forPersent = (total * disVal) / 100;
    let forRupee = disVal;
    console.log("DISP... ", forPersent);
    console.log("DISR... ", forRupee);
    if (changeOperator) {
      setFlatDiscount(forPersent);
    } else if (!changeOperator && disVal <= Total) {
      setFlatDiscount(forRupee);
    }
  };

  const handleDelete = (index) => {
    setDeletingProductIndex(index);
    // console.log("index... ", index);
    let arr = [...addCart];
    let tableOrderPlacedProducts = location?.state?.selectedProductList[index];
    // console.log("tableOrderPlacedProducts... ", tableOrderPlacedProducts);
    if (arr.length === 1) {
      setCustomer(DefaultCustomer);
    }

    // KOT cancellation reason modal open only if product is not already placed
    if (tableOrderPlacedProducts != undefined) {
      setOpenKotCancellation(true);
    } else {
      // if product is Measurable
      if (arr[index].isMeasurable) {
        setTotalTax(totalTax - arr[index].productTax);
        setTotal(total - arr[index].prQuantity * arr[index].sellingPrice);
        arr[index].productDiscount &&
          setTotalDiscount(
            totalDiscount - arr[index].productDiscount * arr[index].prQuantity
          );
      } else {
        setTotalTax(totalTax - arr[index].prQuantity * arr[index].productTax);
        setTotal(total - arr[index].prQuantity * arr[index].sellingPrice);
        arr[index].productDiscount &&
          setTotalDiscount(
            totalDiscount - arr[index].productDiscount * arr[index].prQuantity
          );
      }

      arr.splice(index, 1);
      setAddCart(arr);
    }
  };

  // Table management
  // radio buttons handler
  const kotCancelReasonHandler = (e) => {
    // console.log("e... ", e?.target?.value);
    setKotCancelReason(e?.target?.value);
  };

  // Table management
  // kot cancellation confirm handler
  const kotCancelletionConfirmHandler = () => {
    let arr = [...addCart];
    if (arr.length === 1) {
      setCustomer(DefaultCustomer);
    }

    let deletingProductDetails = arr[deletingProductIndex];
    // console.log("deletingProductDetails... ", deletingProductDetails);

    if (deletingProductDetails?.isMeasurable) {
      setTotalTax(totalTax - deletingProductDetails?.productTax);
      setTotal(
        total -
        deletingProductDetails?.prQuantity *
        deletingProductDetails?.sellingPrice
      );
      deletingProductDetails?.totalProdDiscount &&
        setTotalDiscount(
          totalDiscount - deletingProductDetails?.totalProdDiscount
        );
    } else {
      setTotalTax(
        totalTax -
        deletingProductDetails?.prQuantity *
        deletingProductDetails?.productTax
      );
      setTotal(
        total -
        deletingProductDetails?.prQuantity *
        deletingProductDetails?.sellingPrice
      );
      deletingProductDetails?.totalProdDiscount &&
        setTotalDiscount(
          totalDiscount - deletingProductDetails?.totalProdDiscount
        );
    }

    const tableOrderSoftDeleteObj = {
      tableOrderId: deletingProductDetails?.tableOrderId,
      productId: deletingProductDetails?.productId,
      isDeleted: 1,
      kotCancelReason: kotCancelReason,
    };

    // soft deleting table order product
    tableOrderTransProductsApi?.tableOrderTransProductsDB?.updateTableOrderSignleProd(
      tableOrderSoftDeleteObj
    );

    arr.splice(deletingProductIndex, 1);
    setAddCart(arr);
    setOpenKotCancellation(false);
  };

  const HandleSetCustomerName = (item) => {
    setCustomer(item);
    setModalVisible(false);
  };
  const HandleSetSalesName = (item) => {
    localStorage.setItem("Sales", JSON.stringify(item));
    setSalesExe(item);
    setModalForExe(false);
  };

  const handleFastPay = () => {
    let finaltotalAmount = (
      total +
      totalTax -
      flatDiscount -
      totalDiscount
    ).toFixed(2);

    if (!salesExe) {
      Swal.fire({
        title: "Please Select Sales Executive",
      });
      return;
    }

    let TransactionDetails = {
      paymentId: getUTCDate(),
      storeId: Number.parseInt(STORE_Id),
      transaction_typeName: "Sales", //TODO this value need to come dynemicaly
      modeOfPayment: modeOfPay?.value,
      mobileNumber: customer.mobileNumber ? customer.mobileNumber : "",
      notes: "",
      discount: Number.parseInt(flatDiscount),
      totalAmount: total,
      totalPayment: 0,
      totalBalance: Number.parseInt(finaltotalAmount),
      finaltotalAmount: Number.parseInt(finaltotalAmount),
      dateAdded: DateFormateForTransaction(new Date()), //"2023-02-18T15:08:44.221Z",
      dateUpdated: DateFormateForTransaction(new Date()), //"2023-02-18T15:08:44.221Z", //TODO check UTC date in string
      updatedBy: "",
      userName: UserName,
      customerId: Number.parseInt(customer?.customerId),
      sales_executiveId: Number.parseInt(salesExe?.id),
      currencyName: STORE_CURRENCY,
      isSync: 0,
      isDeleted: 0,
      clientLastUpdated: getUTCDate(),
      customerName: customer?.customerName,
      salesExecutiveName: salesExe?.name,
      productName: addCart[0].productName,
      productId: addCart[0].productId,
      salesQuantity: addCart[0].prQuantity,
      purchasingPrice: addCart[0].purchasingPrice,
      salesPrice: addCart[0].sellingPrice,
      salestotalAmount: addCart[0].singleProTotal,
      taxValue: addCart[0].taxPercent ? addCart[0].taxPercent : 0,
    };

    // console.log("TransactionDetails... ", TransactionDetails);

    const salesDetailArr = [];
    let salesId = getUTCDate();
    addCart &&
      addCart?.map((item, index) => {
        console.log("item... ", item);
        const salesDetailsObj = {
          clientLastUpdated: getUTCDate(),
          currencyId: 0,
          currencyName: STORE_CURRENCY,
          discountValue: item?.discountVal ? item?.discountVal : 0,
          // "isMeasurable": true,
          lastUpdate: item?.lastUpdate,
          // "measurable": true,
          modeOfPayment: modeOfPay.value,
          // "paymentId": 0,
          productId: item?.productId,
          productName: item?.productName,
          // "productSize": "string",
          purchasingPrice: item?.purchasingPrice,
          salesDetailsId: salesId + index,
          salesPrice: item?.sellingPrice,
          salesQuantity: item?.prQuantity,
          salestotalAmount: item?.singleProTotal,
          taxValue: item?.productTax,
          totalDiscount: item?.productDiscount * item?.prQuantity,
          totalTax: item?.taxValue,
          // "transactionRefId": "string",
          unitId: item?.unitId,
          unitName: item?.unitName,
        };
        salesDetailArr?.push(salesDetailsObj);
      });

    const transactionPayload = {
      clientLastUpdated: getUTCDate(),
      currencyName: STORE_CURRENCY,
      customerId: Number.parseInt(customer?.customerId),
      customerName: customer?.customerName,
      dateAdded: DateFormateForTransaction(new Date()),
      dateUpdated: DateFormateForTransaction(new Date()),
      discount: totalDiscount,
      tax: totalTax,
      flatDiscount: Number.parseInt(flatDiscount),
      finaltotalAmount: Number.parseInt(finaltotalAmount),
      modeOfPayment: modeOfPay?.value,
      notes: "",
      // "orderType": "string",
      paymentId: getUTCDate(),
      // "receivedAmount": 0,
      salesDetail: salesDetailArr,
      salesExecutiveName: salesExe?.name,
      sales_executiveId: Number.parseInt(salesExe?.id),
      storeId: STORE_Id,
      totalAmount: total,
      totalBalance: Number.parseInt(finaltotalAmount),
      totalPayment: 0,
      transaction_typeName: "Sales", //TODO this value need to come dynemicaly
      updatedBy: "",
      userName: COGNITO_USER_INFO?.username,
      isSync: 0,
      isDeleted: 0,
      mobileNumber: customer.mobileNumber ? customer.mobileNumber : "",
    };

    if (isOnline) {
      if (finaltotalAmount != 0) {
        // dispatch(addTransaction(TransactionDetails, transactionSuccessRes));
        dispatch(
          addTransactionNSalesDetails(transactionPayload, transactionSuccessRes)
        );
      }
    } else {
      const result =
        transactionPaymentApi?.transactionPaymentDB?.insertTransactionPayment(
          transactionPayload
        );
      // if transaction complete then we called transaction details api
      if (result.changes === 1) {
        const singleTransactionPaymentDetails =
          transactionPaymentApi?.transactionPaymentDB?.getSingleTransactionPaymentDetails(
            result.lastInsertRowid
          );
        singleTransactionPaymentDetails &&
          handleSuccess(singleTransactionPaymentDetails);
      }
    }
  };

  // it's used for table order management
  const saveHandler = () => {
    const tableOrderPayload = {
      tableOrderId:
        location?.state?.selectedProductList || tableOrderTransPostRes
          ? Number(tableOrderId)
          : getUTCDate(),
      tableId: selectedTable?.tableId,
      tableName: selectedTable?.tableName,
      tableSeatingCount: selectedTable?.seatingCapacityCount,
      waiterId: selectedTable?.waiterId,
      waiterName: selectedTable?.waiterName,
      orderId: getUTCDate(),
      orderNo: 1,
      category: "",
      startDate: getUTCDate(),
      subTotal: 0,
      taxAmount: totalTax,
      charges: 0,
      quantity:
        addCart && addCart?.reduce((acc, item) => acc + item?.prQuantity, 0),
      // item: addCart && addCart?.length,
      finalTotal: total,
      customerId: Number.parseInt(customer?.customerId),
      discount: Number.parseInt(flatDiscount),
      userName: "",
      storeId: STORE_Id,
      isSync: 0,
      isDeleted: 0,
      customerName: customer ? customer?.customerName : "",
      // currencyName: STORE_CURRENCY,
    };

    if (isOnline) {
      // calling server table order transaction api here
      location?.state?.selectedProductList || tableOrderTransPostRes
        ? dispatch(
          updateTableOrderTrans(tableOrderPayload, tableOrderSuccessRes)
        )
        : dispatch(addTableOrderTrans(tableOrderPayload, tableOrderSuccessRes));
    } else {
      console.log("tableOrderPayload... ", tableOrderPayload);
      const tableOrderResult =
        tableOrderPayload && location?.state?.selectedProductList
          ? tableOrderApi?.tableOrderDB?.updateTableOrder(tableOrderPayload)
          : tableOrderApi?.tableOrderDB?.insertTableOrder(tableOrderPayload);

      console.log("tableOrderResult... ", tableOrderResult);
      if (tableOrderResult?.updated !== "updated") {
        let tableOrderProductArray = [];

        if (addCart?.length > 0) {
          addCart?.map((item) => {
            // this for placing first time table order products
            const tableOrderProductPayload = {
              tableOrderId: tableOrderResult.lastInsertRowid,
              productId: item?.productId,
              productName: item?.productName,
              sellingPrice: item?.sellingPrice,
              purchasingPrice: item?.purchasingPrice,
              maxRetailPrice: item?.purchasingPrice,
              quantity: item?.purchasingPrice,
              expiryDate: item?.expiryDate,
              lastUpdate: item?.lastUpdate,
              priceIncludeTax: parseInt(item?.priceIncludeTax),
              prQuantity: item?.prQuantity,
              productTax: item?.productTax,
              taxValue: item?.taxValue,
              singleProTotal: item?.singleProTotal,
              productDiscount: item?.productDiscount,
              taxPercent: item?.taxPercent,
              kotCancelReason: "",
              isDeleted: 0,
            };

            tableOrderProductArray?.push(tableOrderProductPayload);
          });

          tableOrderTransProductsApi?.tableOrderTransProductsDB?.insertTableOrderTransProducts(
            tableOrderProductArray
          );
        }
        // for (let i = 0; i < addCart.length; i++) {
        //   const singleProductDetails = addCart[i];
        //   // console.log("singleProductDetails... ", singleProductDetails);

        //   // this for placing first time table order products
        //   const tableOrderProductPayload = {
        //     tableOrderId: tableOrderResult.lastInsertRowid,
        //     productId: singleProductDetails?.productId,
        //     productName: singleProductDetails?.productName,
        //     sellingPrice: singleProductDetails?.sellingPrice,
        //     purchasingPrice: singleProductDetails?.purchasingPrice,
        //     maxRetailPrice: singleProductDetails?.purchasingPrice,
        //     quantity: singleProductDetails?.purchasingPrice,
        //     expiryDate: singleProductDetails?.expiryDate,
        //     lastUpdate: singleProductDetails?.lastUpdate,
        //     priceIncludeTax: parseInt(singleProductDetails?.priceIncludeTax),
        //     prQuantity: singleProductDetails?.prQuantity,
        //     productTax: singleProductDetails?.productTax,
        //     taxValue: singleProductDetails?.taxValue,
        //     singleProTotal: singleProductDetails?.singleProTotal,
        //     productDiscount: singleProductDetails?.productDiscount,
        //     taxPercent: singleProductDetails?.taxPercent,
        //     kotCancelReason: "",
        //     isDeleted: 0,
        //   };
        //   // console.log("tableOrderProductPayload... ", tableOrderProductPayload);

        //   tableOrderTransProductsApi?.tableOrderTransProductsDB?.insertTableOrderTransProducts(
        //     tableOrderProductPayload
        //   );
        // }
        // else is working for update table order products
      } else {
        let tableOrderPlacedProducts = location?.state?.selectedProductList;
        // for (let j = 0; j < tableOrderPlacedProducts?.length; j++) {
        //   const placedProductDetails = tableOrderPlacedProducts[j];

        //   addCart &&
        //     addCart?.map((item) => {
        //       // if user increase quntity of exiting product then run this code
        //       if (item?.productId === placedProductDetails?.productId) {
        //         console.log("productIdsMATCHED....");
        //         const updateTableOrderProdPayload = {
        //           ...placedProductDetails,
        //           prQuantity: item?.prQuantity,
        //           singleProTotal: (
        //             item?.sellingPrice * item?.prQuantity
        //           ).toFixed(2),
        //           taxValue: item?.taxValue && item?.taxValue.toFixed(2),
        //         };

        //         tableOrderTransProductsApi?.tableOrderTransProductsDB?.updateTableOrderSignleProd(
        //           updateTableOrderProdPayload
        //         );
        //       } else {
        //         console.log("productIdsNOT...MATCHED....");
        //         // adding new product in existing table order
        //         const tableOrderProductPayload = {
        //           tableOrderId: Number(tableOrderId),
        //           productId: item?.productId,
        //           productName: item?.productName,
        //           sellingPrice: item?.sellingPrice,
        //           purchasingPrice: item?.purchasingPrice,
        //           maxRetailPrice: item?.purchasingPrice,
        //           quantity: item?.purchasingPrice,
        //           expiryDate: item?.expiryDate,
        //           lastUpdate: item?.lastUpdate,
        //           priceIncludeTax: parseInt(item?.priceIncludeTax),
        //           prQuantity: item?.prQuantity,
        //           productTax: item?.productTax,
        //           taxValue: item?.taxValue,
        //           singleProTotal: (
        //             item?.sellingPrice * item?.prQuantity
        //           ).toFixed(2),
        //           productDiscount: item?.productDiscount,
        //           taxPercent: item?.taxPercent,
        //           kotCancelReason: "",
        //           isDeleted: 0,
        //         };

        //         tableOrderTransProductsApi?.tableOrderTransProductsDB?.insertTableOrderTransSingleProduct(
        //           tableOrderProductPayload
        //         );
        //       }
        //     });
        // }

        // Check if tableOrderPlacedProducts and addCart are valid arrays
        if (Array.isArray(tableOrderPlacedProducts) && Array.isArray(addCart)) {
          console.log("tableOrderPlacedProducts... ", tableOrderPlacedProducts);
          // Loop through each placed product
          addCart.forEach((item) => {
            // Find matching product in addCart
            const matchingProduct = tableOrderPlacedProducts.find(
              (placedProductDetails) =>
                placedProductDetails?.productId === item?.productId
            );
            console.log("matchingProduct... ", matchingProduct);

            if (matchingProduct) {
              // Update existing product details
              console.log("productMATCHED");
              const updateTableOrderProdPayload = {
                ...matchingProduct,
                prQuantity: matchingProduct?.prQuantity,
                singleProTotal: (
                  matchingProduct?.sellingPrice * matchingProduct?.prQuantity
                ).toFixed(2),
                taxValue:
                  matchingProduct?.taxValue &&
                  matchingProduct?.taxValue.toFixed(2),
              };

              tableOrderTransProductsApi?.tableOrderTransProductsDB?.updateTableOrderSignleProd(
                updateTableOrderProdPayload
              );
            } else {
              // Add new product to the order
              console.log("productNOTMATCHED");
              const tableOrderProductPayload = {
                tableOrderId: Number(tableOrderId),
                productId: item?.productId,
                productName: item?.productName,
                sellingPrice: item?.sellingPrice,
                purchasingPrice: item?.purchasingPrice,
                maxRetailPrice: item?.purchasingPrice,
                quantity: item?.purchasingPrice,
                expiryDate: item?.expiryDate,
                lastUpdate: item?.lastUpdate,
                priceIncludeTax: parseInt(item?.priceIncludeTax),
                prQuantity: item?.prQuantity,
                productTax: item?.productTax,
                taxValue: item?.taxValue,
                singleProTotal: (item?.sellingPrice * item?.prQuantity).toFixed(
                  2
                ),
                productDiscount: item?.productDiscount,
                taxPercent: item?.taxPercent,
                kotCancelReason: "",
                isDeleted: 0,
              };

              tableOrderTransProductsApi?.tableOrderTransProductsDB?.insertTableOrderTransSingleProduct(
                tableOrderProductPayload
              );
            }
          });
        }
      }
    }

    setAddCart([]);
    setTotal(0);
    setTotalTax(0);
    setTotalDiscount(0);
    setFlatDiscount(0);
    // navigate("/tables")
  };

  // this method called after table order transaction post api called
  const tableOrderSuccessRes = (tableOrderTransRes) => {
    setTableOrderTransPostRes(tableOrderTransRes);
    postTableOrderTrans(tableOrderTransRes);
    // console.log("tableOrderTransRes ", tableOrderTransRes);
  };

  // this method for table order transaction product server api
  const postTableOrderTrans = (tableOrderTransRes) => {
    // if condition runs on first time when table order transaction placed
    if (tableOrderTransRes || tableOrderTransPostRes) {
      let productArr = [];

      addCart &&
        addCart?.map((item) => {
          // this for placing first time table order products
          const tableOrderProductPayload = {
            tableOrderId: tableOrderTransRes || tableOrderTransPostRes,
            productId: item?.productId,
            productName: item?.productName,
            sellingPrice: item?.sellingPrice,
            purchasingPrice: item?.purchasingPrice,
            maxRetailPrice: item?.purchasingPrice,
            quantity: item?.quantity,
            expiryDate: item?.expiryDate,
            lastUpdate: item?.lastUpdate,
            priceIncludeTax: parseInt(item?.priceIncludeTax),
            prQuantity: item?.prQuantity,
            productTax: item?.productTax,
            taxValue: item?.taxValue,
            singleProTotal: item?.singleProTotal,
            productDiscount: item?.productDiscount,
            taxPercent: item?.taxPercent,
            kotCancelReason: "",
            isDeleted: 0,
          };

          productArr?.push(tableOrderProductPayload);
        });

      console.log("productArr... ", productArr);
      dispatch(
        addTableOrderTransProduct(productArr, showTableOrderSucceessPopUp)
      );
      // for (let i = 0; i < addCart.length; i++) {
      //   const singleProductDetails = addCart[i];
      //   // console.log("singleProductDetails... ", singleProductDetails);

      //   // this for placing first time table order products
      //   const tableOrderProductPayload = {
      //     tableOrderId: tableOrderTransRes || tableOrderTransPostRes,
      //     productId: singleProductDetails?.productId,
      //     productName: singleProductDetails?.productName,
      //     sellingPrice: singleProductDetails?.sellingPrice,
      //     purchasingPrice: singleProductDetails?.purchasingPrice,
      //     maxRetailPrice: singleProductDetails?.purchasingPrice,
      //     quantity: singleProductDetails?.purchasingPrice,
      //     expiryDate: singleProductDetails?.expiryDate,
      //     lastUpdate: singleProductDetails?.lastUpdate,
      //     priceIncludeTax: parseInt(singleProductDetails?.priceIncludeTax),
      //     prQuantity: singleProductDetails?.prQuantity,
      //     productTax: singleProductDetails?.productTax,
      //     taxValue: singleProductDetails?.taxValue,
      //     singleProTotal: singleProductDetails?.singleProTotal,
      //     productDiscount: singleProductDetails?.productDiscount,
      //     taxPercent: singleProductDetails?.taxPercent,
      //     kotCancelReason: "",
      //     isDeleted: 0,
      //   };

      //   // in the last iteration of product list we displayed the success popup
      //   // if (i === addCart.length - 1) {
      //   //   showTableOrderSucceessPopUp("Table order placed successfully");
      //   // }
      //   // console.log("tableOrderProductPayload... ", tableOrderProductPayload);
      //   dispatch(addTableOrderTransProduct(tableOrderProductPayload));
      // }
      // else is working for update table order products
    } else {
      // else condition runs if user update old table order transaction
      let tableOrderPlacedProducts = location?.state?.selectedProductList;
      for (let j = 0; j < addCart?.length; j++) {
        const placedProductDetails = tableOrderPlacedProducts[j];

        // addCart &&
        //   addCart?.map((item) => {
        // if user increase quntity of exiting product then run this code
        // console.log("PproductIdsMATCHED... ", placedProductDetails?.productId)
        if (addCart[j]?.productId === placedProductDetails?.productId) {
          const updateTableOrderProdPayload = {
            ...placedProductDetails,
            prQuantity: addCart[j]?.prQuantity,
            singleProTotal: (
              addCart[j]?.sellingPrice * addCart[j]?.prQuantity
            ).toFixed(2),
            taxValue: addCart[j]?.taxValue && addCart[j]?.taxValue.toFixed(2),
          };

          // in the last iteration of product list we displayed the success popup
          if (j === addCart.length - 1) {
            showTableOrderSucceessPopUp("Table order updated successfully");
          }

          dispatch(UpdateTableOrderTransProduct(updateTableOrderProdPayload));
        } else {
          // adding new product in existing table order
          const tableOrderProductPayload = {
            tableOrderId: Number(tableOrderId),
            productId: addCart[j]?.productId,
            productName: addCart[j]?.productName,
            sellingPrice: addCart[j]?.sellingPrice,
            purchasingPrice: addCart[j]?.purchasingPrice,
            maxRetailPrice: addCart[j]?.purchasingPrice,
            quantity: addCart[j]?.purchasingPrice,
            expiryDate: addCart[j]?.expiryDate,
            lastUpdate: addCart[j]?.lastUpdate,
            priceIncludeTax: parseInt(addCart[j]?.priceIncludeTax),
            prQuantity: addCart[j]?.prQuantity,
            productTax: addCart[j]?.productTax,
            taxValue: addCart[j]?.taxValue,
            singleProTotal: (
              addCart[j]?.sellingPrice * addCart[j]?.prQuantity
            ).toFixed(2),
            productDiscount: addCart[j]?.productDiscount,
            taxPercent: addCart[j]?.taxPercent,
            kotCancelReason: "",
            isDeleted: 0,
          };

          // in the last iteration of product list we displayed the success popup
          if (j === addCart.length - 1) {
            showTableOrderSucceessPopUp("Table order placed successfully");
          }

          dispatch(addTableOrderTransProduct(tableOrderProductPayload));
        }
        // });
      }
    }
  };

  // Table order placed success and update popup displayed
  const showTableOrderSucceessPopUp = (popMsg) => {
    setPopUpMsg(popMsg);
    setIsPopupOpen(true);
  };

  const transactionSuccessRes = (TransactionDetails) => {
    // let salesDetailsArr = [];
    // let salesId = getUTCDate();
    // for (let index = 0; index < addCart.length; index++) {
    //   let SalesDetailsObj = {
    //     salesDetailsId: salesId + index,
    //     paymentId: TransactionDetails.paymentId,
    //     productName: addCart[index].productName,
    //     productId: addCart[index].productId,
    //     salesQuantity: addCart[index].prQuantity,
    //     purchasingPrice: addCart[index].purchasingPrice,
    //     salesPrice: addCart[index].sellingPrice,
    //     salestotalAmount: addCart[index].singleProTotal,
    //     taxValue: addCart[index].taxValue ? addCart[index].taxValue : 0,
    //     discountValue: addCart[index].totalProdDiscount
    //       ? addCart[index].totalProdDiscount
    //       : 0,
    //     modeOfPayment: modeOfPay.value, //or Refund
    //     currencyId: 0,
    //     currencyName: STORE_CURRENCY,
    //     isSync: 0,
    //     isDeleted: 0,
    //     clientLastUpdated: getUTCDate(),
    //   };
    //   salesDetailsArr.push(SalesDetailsObj);
    // }

    // dispatch(
    //   addSalesDetails(
    //     salesDetailsArr,
    //     TransactionDetails,
    //     handleSuccess,
    //     setApiError
    //   )
    // );
    handleSuccess(TransactionDetails);
  };

  const handleApplyDiscount = (product) => {
    setSingleProduct(product);
    setDiscountModal(true);
  };

  // const handleSuccess = () => {
  //   Swal.fire({
  //     icon: "success",
  //     title: "Product Transaction Successfull.",
  //   });
  // };

  // to show success process
  const handleSuccess = (TransactionDetails) => {
    showTableOrderSucceessPopUp("Product order placed successfully");
    setSaveTransDetails(TransactionDetails);
    setCustomer(DefaultCustomer);
    setTotal(0);
    // setTotalTax(0);
    // setTotalDiscount(0);
    setnewCartlist(addCart);
    setAddCart("");
    productPlacedSuccess();
    if (parkData1 && parkData1[0]?.customerId == customer?.customerId) {
      localStorage.removeItem("parkData1");
      parkFunction();
    }
  };

  // to store park data in local storege
  const handlePutOnHold = () => {
    if (!salesExe) {
      Swal.fire({
        title: "Please Select Sales Executive",
      });
      return;
    }
    let park = [...addCart];
    park[0] = {
      ...park[0],
      customerName: customer.customerName,
      customerId: customer.customerId,
    };
    // console.log("park", park);
    if (addCart) {
      storeObjInLocalStrg("parkData1", park);
    }
    parkFunction();
    setAddCart("");
    setTotal(total);
    setTotalTax(0);
    setCustomer(DefaultCustomer);
    // setSaveTransDetails(false)
  };

  // get park customer data from local storage
  const handleGetPark = () => {
    if (addCart != "") {
      Swal.fire({
        title: "Please Complete The Billing First Or Clear Product From Cart",
      });
    } else {
      if (parkData1) {
        setCustomer({
          customerName: parkData1[0].customerName,
          customerId: parkData1[0].customerId,
        });
        parkFunction();
        // console.log(parkData1);
        let total = 0;
        let totalTax = 0;
        parkData1?.map((item) => {
          total = total + item.prQuantity * item.sellingPrice;
          totalTax = totalTax + item.prQuantity * item.productTax;
        });
        setTotal(total);
        setTotalTax(totalTax);
        setAddCart([...parkData1]);
      }
      localStorage.removeItem("parkData1");
      parkFunction();
    }
  };

  // to remove park data from local storage
  const handleRemoveParkData = () => {
    const remove = () => {
      if (parkData1[0]?.customerId === customer.customerId) {
        setAddCart("");
      }
      localStorage.removeItem("parkData1");
      parkFunction();
    };
    PopUp("warning", "Are you sure !", true, "Yes, remove it!", remove);
  };

  const handleClearCart = () => {
    const recall = () => {
      setAddCart("");
      setTotal(0);
      setTotalTax(0);
      setCustomer(DefaultCustomer);
    };
    PopUp("warning", "Are you sure !", true, "Yes, Clear it!", recall);
  };

  // table remove handler
  const tableRemoveHandler = () => {
    localStorage.removeItem("selectedTable");
    setSelectedTable(null);
  };

  const handleShowHideImg = () => {
    localStorage.setItem("ShowHideGridImg", !showHideImg);
    setShowHideImg(!showHideImg);
  };

  // Category select handler
  const CategoryhandleClick = (categoryId) => {
    if (isOnline) {
      if (categoryId === "All") {
        dispatch(getProductList(0, 0, ""));
      } else {
        dispatch(getProuductByCategoryId(categoryId, true, 0, 0, ""));
      }
      setSelectedCategory(categoryId);
    } else {
      setSelectedCategory("All");
      const productList = productApi?.productDB?.getProductsByCategoryId(categoryId);
      console.log("productListsqlite... ", productList);
      productList && setProduct(productList);
    }
  };


  useEffect(() => {
    const localStorageLang = localStorage.getItem("defaultLang");
    if (localStorageLang === "ar") {
      setDefaultLanguage("Arabic");
    } else if (localStorageLang === "en") {
      setDefaultLanguage("English");
    }
  }, [localStorage.getItem("defaultLang")]);

  const downloadPDFHandler = () => {
    const content = componentRef1.current;

    const doc = new jsPDF();
    doc.html(content, {
      callback: function (doc) {
        doc.save("invoice.pdf");
      },
      html2canvas: { scale: 0.40 },
    });

    // doc.text("Invoice Details", 20, 10);

    // doc.save('Invoice.pdf');
  };


  return (
    <MainContentArea scroll={"auto"}>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {newCustomerModal && (
            <CustomerModal
              isModelVisible={newCustomerModal}
              customerData={null}
              isEdit={false}
              setshow={setNewCustomerModal}
            />
          )}
          {measurableUnitModal && (
            <MeasurableUnitModal
              measurableQuentity={measurableQuentity}
              measurableUnitModal={measurableUnitModal}
              measurableUnitName={measurableUnitName}
              productName={productName}
              setMeasurableUnitModal={setMeasurableUnitModal}
              setMeasurableQuentity={setMeasurableQuentity}
              handleUnitMeasurable={handleUnitMeasurable}
            />
          )}
          <Modal
            size="small"
            isOpen={modalForExe}
            toggle={() => setModalForExe(!modalForExe)}
          >
            <ModalHeader
              className="popup-modal"
              toggle={() => setModalForExe(!modalForExe)}
            >
              {t("Billing.selectSalesExecutive")}
            </ModalHeader>
            <ModalBody className="popup-modal">
              <div className="search-container searchClass">
                <input
                  className="form-control "
                  type="search"
                  placeholder={t("Billing.searchProducts")}
                  aria-label="Search"
                  value={salesExeSearch}
                  onChange={(e) => setSalesExeSearch(e.target.value)}
                />
                <BiSearch className="searchIcon" />
              </div>
              {salesExeData
                .filter((item) =>
                  item.name.toLowerCase().includes(salesExeSearch)
                )
                ?.map((item, index) => (
                  <span key={index}>
                    <div className="subtotal" key={index}>
                      <div>{item.name}</div>
                      <div
                        className="link-select"
                        onClick={() => HandleSetSalesName(item)}
                      >
                        {t("Billing.select")}
                      </div>
                    </div>
                    <hr />
                  </span>
                ))}
            </ModalBody>
          </Modal>
          <Modal
            size="small"
            isOpen={isModelVisible}
            toggle={() => setModalVisible(!isModelVisible)}
          >
            <ModalHeader
              className="popup-modal"
              toggle={() => setModalVisible(!isModelVisible)}
            >
              {t("Billing.selectCustomer")}
            </ModalHeader>
            <ModalBody className="popup-modal">
              <div className="search-container searchClass">
                <input
                  className="form-control "
                  type="search"
                  placeholder={t("Billing.searchProducts")}
                  aria-label="Search"
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                />
                <BiSearch className="searchIcon" />
              </div>
              {customerData?.customer
                ?.filter((item) =>
                  item.customerName.toLowerCase().includes(customerSearch)
                )
                ?.map((item, index) => (
                  <span key={index}>
                    <div className="subtotal" key={index}>
                      <div>
                        {item.customerName}
                        <br />
                        {item.mobileNumber}
                      </div>
                      <div
                        className="link-select"
                        onClick={() => HandleSetCustomerName(item)}
                      >
                        {t("Billing.select")}
                      </div>
                    </div>
                    <hr />
                  </span>
                ))}
            </ModalBody>
          </Modal>
          <Modal
            size="small"
            isOpen={expireModal}
            toggle={() => setExpireModal(!expireModal)}
          >
            <ModalHeader
              className="popup-modal"
              toggle={() => setExpireModal(!expireModal)}
            >
              {t("Billing.expiredProduct")}
            </ModalHeader>
            <ModalBody className="popup-modal">
              <div className="search-container searchClass">
                <input
                  className="form-control "
                  type="search"
                  placeholder={t("Billing.searchProducts")}
                  aria-label="Search"
                  value={expiredProdSearch}
                  onChange={(e) => setExpiredProdSearch(e.target.value)}
                />
                <BiSearch className="searchIcon" />
              </div>
              {expireProduct
                ?.filter((item) =>
                  item?.productName?.toLowerCase().includes(expiredProdSearch)
                )
                ?.map((item, index) => (
                  <span key={index}>
                    <div className="subtotal" key={index}>
                      <div>
                        {item.productName[0].toUpperCase() +
                          item.productName.slice(1)}
                      </div>
                      <div
                        className="link-select"
                        onClick={() => handleApplyDiscount(item)}
                      >
                        {t("Billing.applyDiscount")}
                      </div>
                    </div>
                    <hr />
                  </span>
                ))}
            </ModalBody>
          </Modal>
          <Modal
            size="small"
            isOpen={expiringModal}
            toggle={() => setExpiringModal(!expiringModal)}
          >
            <ModalHeader
              className="popup-modal"
              toggle={() => setExpiringModal(!expiringModal)}
            >
              {t("Billing.productExpiring")}
            </ModalHeader>
            <ModalBody className="popup-modal">
              <div className="search-container searchClass">
                <input
                  className="form-control "
                  type="search"
                  placeholder={t("Billing.searchProducts")}
                  aria-label="Search"
                  value={expiredProdSearch}
                  onChange={(e) => setExpiredProdSearch(e.target.value)}
                />
                <BiSearch className="searchIcon" />
              </div>
              {expiringProduct
                ?.filter((item) =>
                  item.productName.toLowerCase().includes(expiredProdSearch)
                )
                ?.map((item, index) => (
                  <span key={index}>
                    <div className="subtotal" key={index}>
                      <div>{item.productName}</div>
                      <div
                        className="link"
                        onClick={() => handleApplyDiscount(item)}
                      >
                        {t("Billing.applyDiscount")}
                      </div>
                    </div>
                    <hr />
                  </span>
                ))}
            </ModalBody>
          </Modal>
          {discountModal && (
            <ApplyDiscountModal
              discountModal={discountModal}
              setDiscountModal={setDiscountModal}
              singleProduct={singleProduct}
            />
          )}

          <>
            <div className="billing-main-section">
              <div className="billing-left-section">
                <div className="">
                  {/* product expiry or expire */}
                  <div className="flex-wrap gap-2 mb-1 productExLink d-flex align-items-center">
                    <Button
                      variant="contained"
                      onClick={() => setExpiringModal(true)}
                      style={{
                        backgroundColor: "var(--button-bg-color)",
                        color: "var(--button-color)",
                      }}
                    >
                      {expiringProduct.length} {t("Billing.productExpiring")}
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => setExpireModal(true)}
                      style={{ backgroundColor: "#ff4b4b" }}
                    >
                      {expireProduct.length} {t("Billing.expiredProduct")}{" "}
                    </Button>

                    <div className="flex-wrap gap-2 mb-1 productExLink d-flex align-items-center">
                      <Button
                        variant="contained"
                        onClick={handleListButton}
                        style={{
                          // backgroundColor: `${gridActive === false
                          //   ? "#004A66"
                          //   : "var(--white-color)"
                          //   }`,
                          // color: `${gridActive === false
                          //   ? "var(--white-color)"
                          //   : "#004A66"f
                          //   }`,

                          backgroundColor: gridDisableBackGround,
                          color: gridChangeBackGround,
                        }}
                      >
                        <BsList style={{ fontSize: 25 }} />
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handleGridButton}
                        style={{
                          // backgroundColor: `${gridActive === true
                          //   ? "#004A66"
                          //   : "var(--white-color)"
                          //   }`,
                          // color: `${gridActive === true
                          //   ? "var(--white-color)"
                          //   : "#004A66"
                          //   }`,

                          backgroundColor: gridChangeBackGround,
                          color: gridDisableBackGround,
                        }}
                      >
                        <BsFillGridFill style={{ fontSize: 25 }} />
                      </Button>
                    </div>
                    <div onClick={handleShowHideImg} className="pointer">
                      {showHideImg ? (
                        <CiImageOn className="text-Color" size={35} />
                      ) : (
                        <CiImageOff className="text-Color" size={35} />
                      )}
                    </div>
                  </div>
                </div>
                <div className="search-container">
                  <input
                    className="form-control "
                    type="search"
                    placeholder={t("AllProduct.searchProducts")}
                    aria-label="Search"
                    value={searchProduct}
                    onChange={(e) => setSearchProduct(e.target.value)}
                  />
                  <BiSearch className="searchIcon" />
                </div>
                <div className="main-category-section mt-4">
                  <h4
                    className="mt-4"
                    style={{
                      color: "var(--text-color)",
                    }}
                  >
                    {t("Billing.chooseCategory")}
                  </h4>
                  {/* <div className=" category-list left-cartBody">
                    <ul className="list-group list-group-flush">
                      <li
                        className={` list-group-item category-item  ${selectedCategory === "All" ? "active" : ""
                          }`}
                        onClick={() => CategoryhandleClick("All")}
                      >
                        All Categories
                      </li>
                      {productCategorydata &&
                        productCategorydata?.map((item, index) => (
                          <li
                            key={index}
                            className={`list-group-item category-item ${selectedCategory === item.categoryId
                              ? "active"
                              : ""
                              }`}
                            onClick={() => CategoryhandleClick(item.categoryId)}
                          >
                            {item.categoryName}
                          </li>
                        ))}
                    </ul>
                  </div> */}
                  <CategoryList
                    productCategorydata={productCategorydata}
                    CategoryhandleClick={CategoryhandleClick}
                    selectedCategory={selectedCategory}
                  />
                </div>

                <div className="d-flex">
                  {/* <div
                  style={{
                    marginLeft: 5,
                    cursor: "pointer",
                    textAlign: "center",
                    backgroundColor: gridChangeBackGround,
                    width: 40,
                    padding: 4,
                  }}
                  onClick={handleGridButton}
                >
                  <span
                    style={{
                      alignItems: "center",
                      fontWeight: "bold",
                      fontSize: 17,
                      color: gridDisableBackGround,
                    }}
                  >
                    <BsList style={{ fontSize: 25 }} />
                  </span>
                </div> */}
                  {/* <div
                  style={{
                    textAlign: "center",
                    cursor: "pointer",
                    backgroundColor: gridDisableBackGround,
                    width: 40,
                    padding: 4,
                  }}
                  onClick={handleListButton}
                >
                  <span
                    style={{
                      fontWeight: "bold",
                      fontSize: 17,
                      color: gridChangeBackGround,
                    }}
                  >
                    <BsFillGridFill style={{ fontSize: 25 }} />
                  </span>
                </div> */}

                  {/* <div
                  className="expProduct"
                  style={{
                    height: "10px",
                    width: "100%",
                    paddingLeft: 5,

                    cursor: "pointer",
                    paddingTop: 3,
                    color: "var(--light-blue-color)",
                  }}
                >
                  <span
                    onClick={() => setExpiringModal(true)}
                    style={{ textDecoration: "underLine", marginRight: 9 }}
                  >
                    {expiringProduct.length} {t("Billing.productExpiring")}{" "}
                  </span>{" "}
                  <span
                    onClick={() => setExpireModal(true)}
                    style={{ textDecoration: "underLine" }}
                  >
                    {expireProduct.length} {t("Billing.expiredProduct")}{" "}
                  </span>
                </div> */}
                </div>

                {/* { discountModal && <ApplyDiscountModal discountModal={discountModal} setDiscountModal={setDiscountModal} singleProduct={singleProduct} />} */}
                <h4
                  className="mt-2"
                  style={{
                    color: "var(--text-color)",
                  }}
                >
                  {t("Billing.products")}{" "}
                </h4>
                {/* <div className="cart-main w-100"> */}
                <div className="overflow-auto left-dev cardBox d-flex flex-column">
                  <div className="left-cartBody">
                    {grid ? (
                      <>
                        <table className="table table-hover ">
                          {product?.length > 0 && (
                            <thead className="table-secondary sticky-top">
                              <tr>
                                <th
                                  onClick={() =>
                                    setProduct(
                                      sortTableDataHandler(
                                        product,
                                        sortOrder,
                                        setSortOrder
                                      )
                                    )
                                  }
                                  className="leftTable Name-cursor"
                                >
                                  {t("Billing.productName")}
                                  {getSortArrow(sortOrder)}
                                </th>
                                <th className="leftTable">
                                  {t("Billing.mrp")}
                                </th>
                                <th className="leftTable">
                                  {t("Billing.sellingPrice")}
                                </th>
                                <th className="">{t("AllProduct.quantity")}</th>
                              </tr>
                            </thead>
                          )}

                          {product?.length > 0 &&
                            product
                              .filter(
                                (item) =>
                                  item?.productName
                                    ?.toLowerCase()
                                    .includes(searchProduct) &&
                                  (selectedCategory === "All" ||
                                    item.categoryId === selectedCategory)
                              )
                              ?.map((item, index) => (
                                <tbody key={index}>
                                  <tr
                                    className="pointer"
                                    onClick={() => handleAddCart(item)}
                                  >
                                    <td className="leftTable">
                                      <span title={item.productName}>
                                        {handleTrim(item?.productName)}
                                      </span>
                                    </td>
                                    <td className="leftTable">
                                      {defaultLanguage === "ar" ||
                                        defaultLanguage === "عربي" ? (
                                        <td>
                                          {item?.maxRetailPrice}
                                          {CurrencySymbol}
                                        </td>
                                      ) : (
                                        <td>
                                          {CurrencySymbol}
                                          {item?.maxRetailPrice}
                                        </td>
                                      )}
                                    </td>
                                    <td className="leftTable">
                                      {defaultLanguage === "ar" ||
                                        defaultLanguage === "عربي" ? (
                                        <td>
                                          {item?.sellingPrice}
                                          {CurrencySymbol}
                                        </td>
                                      ) : (
                                        <td>
                                          {CurrencySymbol}
                                          {item?.sellingPrice}
                                        </td>
                                      )}
                                    </td>
                                    <td>{(item?.inventoryManage === 1 && item?.quantity >= 0) ? item?.quantity : "-"}</td>
                                  </tr>
                                </tbody>
                              ))}
                        </table>
                        {selectedCategory !== "All" &&
                          product.filter(
                            (item) => item?.categoryId === selectedCategory
                          ).length === 0 && <EmptyProductsCategoryMessege />}
                      </>
                    ) : (
                      <>
                        <div className="card-section">
                          {product
                            .filter(
                              (item) =>
                                item?.productName
                                  ?.toLowerCase()
                                  .includes(searchProduct) &&
                                (selectedCategory === "All" ||
                                  item.categoryId === selectedCategory)
                            )
                            .map((item, index) => (
                              <Card
                                key={index}
                                className="billing-card pointer"
                                onClick={() => handleAddCart(item)}
                                style={{
                                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                                  background: "var(--main-bg-color)",
                                  borderRadius: "10px",
                                  border: "1px solid rgb(108, 117, 125)",
                                }}
                              >
                                <CardContent
                                  className="card-content"
                                  style={{
                                    color: "var(--white-color)",
                                    paddingBottom: "10px",
                                  }}
                                >
                                  <Typography variant="h6" component="div">
                                    <span title={item.productName}>
                                      {showHideImg && (
                                        <img
                                          src={
                                            item?.imageUrl
                                              ? item?.imageUrl
                                              : defaultImage
                                          }
                                          alt=""
                                          width="100%"
                                          height="160px"
                                          style={{ borderRadius: "10px" }}
                                        />
                                      )}
                                    </span>
                                    <div className="mt-2 product-details">
                                      <div className="product-name">
                                        {/* {item.productName[0].toUpperCase() +
                                          item.productName.slice(1)}
                                        {item.productName.length >= 20
                                          ? "..."
                                          : null} */}
                                        {handleTrim(item?.productName)}
                                      </div>
                                      {/* <div className="">
                                    <span>{t("Billing.mrp")}{CurrencySymbol}</span>
                                    <span>{item.maxRetailPrice}</span>
                                  </div> */}
                                      <div className="">
                                        <span>
                                          {/* {t("Billing.price")} */}
                                          {CurrencySymbol}
                                        </span>
                                        <span
                                          style={{
                                            fontWeight: "600",
                                            fontSize: "16px",
                                          }}
                                        >
                                          {item.sellingPrice.toFixed(2)}
                                        </span>
                                      </div>
                                    </div>
                                  </Typography>
                                </CardContent>
                              </Card>
                            ))}

                        </div>
                        {selectedCategory !== "All" &&
                          product.filter(
                            (item) => item.categoryId === selectedCategory
                          ).length === 0 && <EmptyProductsCategoryMessege />}
                      </>
                    )}

                  </div>
                </div>
              </div>

              <div className="overflow-auto right-dev cardBox">
                {addCart && addCart.length > 0 ? (
                  <>
                    <div className="right-cartBody">
                      {addCart?.map((item, index) => (
                        <CartProductItem
                          item={item}
                          index={index}
                          handleDelete={handleDelete}
                          handleDecrement={handleDecrement}
                          MeasurableOpen={MeasurableOpen}
                          handleIncrement={handleIncrement}
                          measurableUnitName={measurableUnitName}
                          total={total}
                        />
                      ))}

                      {/* <table className="table">
                          <thead>
                            <tr>
                              <th>{t("billing.ProductName")}</th>
                              <th>{t("billing.Quantity")}</th>
                              <th>{t("billing.Remove")}</th>
                              <th>{t("billing.Price")}</th>
                            </tr>
                          </thead>
                          {addCart.map((item, index) => (
                            <tbody
                              key={index}
                              style={{ verticalAlign: "middle" }}
                            >
                              <tr>
                                <td className="rightTable">
                                  {" "}
                                  <span
                                    title={item.productName}
                                    className="cartName"
                                  >
                                    {item.productName[0].toUpperCase() + item.productName.slice(1)}
                                    {handleTrim(item.productName)}
                                    <span>
                                      {item.productName.length >= 20
                                        ? "..."
                                        : null}
                                    </span>
                                  </span>
                                  <br />
                                </td>
                                <td className="rightTable ">
                                  <div className="quantityClass ">
                                    {item?.isMeasurable ? (
                                      <button
                                        className="btn quentitybotton"
                                        onClick={() => handleDelete(index)}
                                      >
                                        x
                                      </button>
                                    ) : (
                                      <button
                                        className="btn quentitybotton"
                                        onClick={() => handleDecrement(index)}
                                      >
                                        -
                                      </button>
                                    )}
                                    {item.prQuantity}
                                    <button
                                      className="btn quentitybotton"
                                      onClick={() =>
                                        item?.isMeasurable
                                          ? MeasurableOpen(
                                            item,
                                            item.prQuantity,
                                            measurableUnitName
                                          )
                                          : handleIncrement(index)
                                      }
                                    >
                                      +
                                    </button>
                                  </div>
                                </td>
                                <td className="rightTable">
                                  {" "}
                                  <button
                                    className="btn text-Color"
                                    onClick={() => handleDelete(index)}
                                  >
                                    <RiDeleteBin5Line
                                      className="icon-mar"
                                      size={20}
                                    />
                                  </button>
                                </td>
                                <td style={{ padding: 5 }}>
                                  {STORE_CURRENCY}
                                  {item.sellingPrice.toFixed(2)}
                                  <br />
                                  {item.productTax > 0 ? (
                                    <span className="text-danger">
                                      {item.taxName}@{item.taxPercent}%
                                      <br />
                                    </span>
                                  ) : null}
                                  {item.totalProdDiscount > 0 ? (
                                    <span className="text-success">
                                      {STORE_CURRENCY}
                                      {item.totalProdDiscount.toFixed(2)} <br />
                                    </span>
                                  ) : null}
                                  {STORE_CURRENCY}
                                  {item.singleProTotal.toFixed(2)}
                                </td>
                              </tr>
                            </tbody>
                          ))}
                        </table> */}
                    </div>
                    <div className="total-Cart" style={{ marginTop: "10px" }}>
                      <div className="subtotal" style={{ marginTop: 10 }}>
                        <div className="subtotal-link">
                          {t("Billing.customer")} : {customer?.customerName}
                          <br />
                          <span
                            className="link"
                            onClick={() => setModalVisible(true)}
                          >
                            {t("Billing.change")}
                          </span>
                        </div>
                        <div className="subtotal-link">
                          {" "}
                          {t("Billing.salesExecutive")} :{" "}
                          {salesExe ? salesExe?.name : "Not Set"}
                          <br />
                          <span
                            className="link"
                            onClick={() => setModalForExe(true)}
                          >
                            {t("Billing.change")}
                          </span>
                        </div>
                      </div>
                      <div className="subtotal">
                        <div>
                          <span className=" text-danger">
                            {" "}
                            {t("Billing.tax")}
                          </span>
                        </div>
                        <div className="text-danger">
                          {defaultLanguage === "ar" ||
                            defaultLanguage === "عربي" ? (
                            <span>
                              {totalTax.toFixed(2)}
                              {CurrencySymbol}
                            </span>
                          ) : (
                            <span>
                              {CurrencySymbol}
                              {totalTax.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="subtotal">
                        <div>
                          <span className=" text-success">
                            {t("Billing.discount")}{" "}
                          </span>
                        </div>
                        <div className="text-success">
                          {defaultLanguage === "ar" ||
                            defaultLanguage === "عربي" ? (
                            <span>
                              {totalDiscount?.toFixed(2)}
                              {CurrencySymbol}
                            </span>
                          ) : (
                            <span>
                              {CurrencySymbol}
                              {totalDiscount?.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-Color" style={{ margin: 3 }}>
                        {t("Billing.applyAdditionalDiscount")}{" "}
                      </p>
                      <div className="subtotal ">
                        <div className="subtotal sizeClass ">
                          <div className="me-2">
                            <p className="taxtclass">
                              <input
                                className="form-control"
                                style={{ width: 150 }}
                                placeholder={t("Billing.flateDiscount")}
                                maxLength={maxlength}
                                value={additionalDiscount}
                                type="tel"
                                onChange={(e) => handleSetDiscount(e)}
                              />{" "}
                            </p>
                          </div>
                          <div className="discountBtnClass">
                            <Button
                              variant="contained"
                              onClick={handlePercentButton}
                              style={{
                                // backgroundColor: `${discountTypeActive === false
                                //   ? "var(--persent-button-bg)"
                                //   : "var(--persent-button)"
                                //   }`,
                                // color: `${discountTypeActive === false
                                //   ? "var(--persent-button)"
                                //   : "var(--persent-button-bg)"
                                //   }`,
                                // borderTopRightRadius: "0",
                                // borderBottomRightRadius: "0",
                                backgroundColor: changeOperator
                                  ? "var(--main-bg-color)"
                                  : "var(--white-color)",
                                color: changeOperator
                                  ? "var(--white-color)"
                                  : "var(--main-bg-color)",
                                borderRadius: "5px 0px 0px 5px",
                              }}
                            >
                              %
                            </Button>

                            <Button
                              variant="contained"
                              onClick={handleRupeeButton}
                              style={{
                                // backgroundColor: `${discountTypeActive === true
                                //   ? "var(--persent-button-bg)"
                                //   : "var(--persent-button)"
                                //   }`,
                                // color: `${discountTypeActive === true
                                //   ? "var(--persent-button)"
                                //   : "var(--persent-button-bg)"
                                //   }`,
                                // borderTopLeftRadius: "0",
                                // borderBottomLeftRadius: "0",
                                // color: infoBackground,
                                // backgroundColor: disableBackground,
                                backgroundColor: changeOperator
                                  ? "var(--white-color)"
                                  : "var(--main-bg-color)",
                                color: changeOperator
                                  ? "var(--main-bg-color)"
                                  : "var(--white-color)",
                                borderRadius: "0px 5px 5px 0px",
                              }}
                            >
                              {STORE_CURRENCY}
                            </Button>
                          </div>
                        </div>

                        <div className="text-Color">
                          {/* {STORE_CURRENCY}
                            {flatDiscount === ""
                              ? 0
                              : parseFloat(flatDiscount).toFixed(2)} */}
                          {/* {flatDiscount === "" ? 0 : flatDiscount.toFixed(2)} */}

                          {defaultLanguage === "ar" ||
                            defaultLanguage === "عربي" ? (
                            <span>
                              {flatDiscount === ""
                                ? 0
                                : parseFloat(flatDiscount).toFixed(2)}
                              {CurrencySymbol}
                            </span>
                          ) : (
                            <span>
                              {CurrencySymbol}
                              {flatDiscount === ""
                                ? 0
                                : parseFloat(flatDiscount).toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                      <hr className="hrclass" style={{ margin: 7 }} />

                      {/* Billing final section start from here */}
                      <div className=" billing-section">
                        <div className="billing-final-section">
                          <div className="final-section-item">
                            <p>{t("Billing.item")}</p>
                            <span>{addCart && addCart?.length}</span>
                          </div>
                          <div className="final-section-item">
                            <p>{t("Billing.quantity")}</p>
                            <span>
                              {addCart &&
                                addCart?.reduce(
                                  (acc, item) => acc + item?.prQuantity,
                                  0
                                )}
                            </span>
                          </div>
                          {selectedTable && (
                            <div className="final-section-item">
                              <p>{t("Billing.table")}</p>
                              <span>
                                {selectedTable && selectedTable?.tableName}
                              </span>
                            </div>
                          )}

                          <div className="final-section-item">
                            <p>{t("Billing.total")}</p>
                            <div>
                              {flatDiscount > 0 ? (
                                <div className="text-Color">
                                  {
                                    <strike>
                                      {defaultLanguage === "ar" ||
                                        defaultLanguage === "عربي" ? (
                                        <span>
                                          {(total + totalTax).toFixed(2)}
                                        </span>
                                      ) : (
                                        <span>
                                          {CurrencySymbol}
                                          {(total + totalTax).toFixed(2)}
                                        </span>
                                      )}
                                    </strike>
                                  }
                                </div>
                              ) : (
                                <div className="text-Color">
                                  {defaultLanguage === "ar" ||
                                    defaultLanguage === "عربي" ? (
                                    <span>
                                      {(
                                        total +
                                        totalTax -
                                        totalDiscount
                                      ).toFixed(2)}
                                      {CurrencySymbol}
                                    </span>
                                  ) : (
                                    <span>
                                      {CurrencySymbol}
                                      {(
                                        total +
                                        totalTax -
                                        totalDiscount
                                      ).toFixed(2)}
                                    </span>
                                  )}
                                </div>
                              )}

                              {/* this value dispalyed below total price after trike */}
                              {flatDiscount > 0 ? (
                                <span className="text-Color">
                                  {defaultLanguage === "ar" ||
                                    defaultLanguage === "عربي" ? (
                                    <span>
                                      {(
                                        total +
                                        totalTax -
                                        totalDiscount -
                                        flatDiscount
                                      ).toFixed(2)}
                                      {CurrencySymbol}
                                    </span>
                                  ) : (
                                    <span>
                                      {CurrencySymbol}
                                      {(
                                        total +
                                        totalTax -
                                        totalDiscount -
                                        flatDiscount
                                      ).toFixed(2)}
                                    </span>
                                  )}
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </div>
                        {/* Billing final section end from here */}

                        {/* <div className="subtotal">
                          <div>
                            <p className="text-Color" style={{ margin: 3 }}>
                              {t("billing.Total")}
                            </p>
                          </div>
                          <div>
                            {flatDiscount > 0 ? (
                              <div className="text-Color">
                                {
                                  <strike>
                                    {STORE_CURRENCY}
                                    {(total + totalTax).toFixed(2)}
                                  </strike>
                                }
                              </div>
                            ) : (
                              <div className="text-Color">
                                {STORE_CURRENCY}
                                {(total + totalTax - totalDiscount).toFixed(2)}
                              </div>
                            )}
                            {flatDiscount > 0 ? (
                              <span className="text-Color">
                                {STORE_CURRENCY}
                                {(
                                  total +
                                  totalTax -
                                  totalDiscount -
                                  flatDiscount
                                ).toFixed(2)}
                              </span>
                            ) : null}
                          </div>
                        </div> */}
                        <div className="subtotal">
                          {!selectedTable && (
                            <div>
                              <span>{t("Billing.selectPaymentMode")}</span>
                              <Select
                                placeholder={t("Billing.selectPaymentMode")}
                                getOptionLabel={(SelectedPaymentMode) =>
                                  SelectedPaymentMode?.value
                                }
                                options={SelectedPaymentMode}
                                style={{ width: 40 }}
                                styles={CUSTOM_DROPDOWN_STYLE}
                                value={modeOfPay}
                                onChange={(e) => {
                                  setModeOfPay(e);
                                  setError(false); // Clear the validation error when modeOfPay changes
                                }}
                                isClearable
                              />
                              {error &&
                                (!modeOfPay || modeOfPay.length === 0) ? (
                                <span className="text-danger">
                                  Please select payment mode
                                </span>
                              ) : null}
                            </div>
                          )}
                          <div></div>
                          <div>
                            <Button
                              variant="contained"
                              onClick={handleClearCart}
                              style={{
                                backgroundColor: "var(--white-color)",
                                color: " var(--main-bg-color)",
                                marginTop: 7,
                                marginBottom: 7,
                                marginRight: "0.5rem",
                                border: " 1px solid  var(--main-bg-color)",
                              }}
                            >
                              {t("Billing.clearCart")}
                            </Button>
                            <Button
                              variant="contained"
                              onClick={
                                selectedTable ? saveHandler : handleFastPay
                              }
                              style={{
                                backgroundColor: "var(--main-bg-color)",
                                color: "var(--white-color)",
                                marginTop: 5,
                                marginBottom: 5,
                                marginRight: 5,
                                border: " 2px solid  var(--main-bg-color)",
                              }}
                            >
                              {selectedTable
                                ? t("Billing.sendToKOT")
                                : t("Billing.fastPay")}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div>
                    {saveTransDetails ? (
                      <div>
                        <BillingThermalSmallInvoice
                          width=""
                          height=""
                          saveTransDetails={saveTransDetails}
                          componentRef1={componentRef1}
                          addCart={newCartlist}
                          totalTax={totalTax}
                          totalDiscount={totalDiscount}
                          total={total}
                        />
                        {/* <span ref={componentRef} className="text-center">
                            <h3 className="text-center bolt">
                              {t("billing.Paymentsuccess!")}
                            </h3>
                            <div>
                              <BiCheck
                                size={20}
                                style={{
                                  color: "#fff",
                                  backgroundColor: "#008001",
                                  borderRadius: "50%",
                                  width: "35%",
                                  alignItems: "center",
                                  height: "45%",
                                }}
                              />
                            </div>

                            <table
                              className="table"
                              style={{
                                border: "1px solid #008001",
                                marginTop: 10,
                              }}
                            >
                              <tbody style={{ textAlign: "start" }}>
                                <tr>
                                  <td
                                    style={{ borderRight: "1px solid #008001" }}
                                  >
                                    {t("billing.Customername")}
                                  </td>
                                  <td className="">
                                    {" "}
                                    {saveTransDetails?.customerName}
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    style={{ borderRight: "1px solid #008001" }}
                                  >
                                    {t("billing.Orderid")}
                                  </td>
                                  <td>{saveTransDetails?.paymentId}</td>
                                </tr>
                                <tr>
                                  <td
                                    style={{ borderRight: "1px solid #008001" }}
                                  >
                                    {t("billing.Totalamount")}
                                  </td>
                                  <td>
                                    {STORE_CURRENCY}
                                    {saveTransDetails?.totalBalance.toFixed(2)}
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    style={{ borderRight: "1px solid #008001" }}
                                  >
                                    {t("billing.Paymenttype")}
                                  </td>
                                  <td> {saveTransDetails?.modeOfPayment}</td>
                                </tr>
                                <tr>
                                  <td
                                    style={{ borderRight: "1px solid #008001" }}
                                  >
                                    {t("billing.Salesexecutivename")}
                                  </td>
                                  <td>
                                    {" "}
                                    {saveTransDetails?.salesExecutiveName}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </span> */}
                        <div className="subtotal">
                          <div className="printerPDF-btn text-Color pointer">
                            <ReactToPrint
                              trigger={() => (
                                <BsFillPrinterFill
                                  size={30}
                                  style={{ margin: 5 }}
                                />
                              )}
                              // content={() => componentRef.current}
                              content={() => componentRef1.current}
                              pageStyle="print"
                              documentTitle="Invoice Details"
                              bodyClass="printer"
                              onAfterPrint={() =>
                                console.log("document printed!")
                              }
                            />
                          </div>

                          <MdPictureAsPdf
                            className="pointer"
                            size={30}
                            style={{ margin: 5 }}
                            onClick={downloadPDFHandler}
                          />
                        </div>
                      </div>
                    ) : (
                      <h5
                        className="text-center text-Color"
                        style={{ marginTop: 5 }}
                      >
                        {t("Billing.emptyCart")}
                      </h5>
                    )}
                  </div>
                )}
                <hr className="hrclass" style={{ margin: 7 }} />
                <div className="subtotal">
                  {parkData1 ? (
                    <div className="mt-1">
                      <MdShoppingCart className="text-Color" size={20} />
                      <span className="text-Color">
                        {" "}
                        {parkData1[0]?.customerName} ({parkData1.length}){" "}
                      </span>
                    </div>
                  ) : null}

                  <>
                    {parkData1 ? (
                      <Button
                        className="btn me-2 UB-btn"
                        style={{
                          marginLeft: 5,
                          background: "var(--white-color)",
                          color: " var(--main-bg-color)",
                          fontsize: " 22px",
                          border: " 2px solid  var(--main-bg-color)",
                        }}
                        onClick={handleRemoveParkData}
                      >
                        {t("Billing.remove")}
                      </Button>
                    ) : null}

                    {parkData1 ? (
                      <Button
                        variant="contained"
                        onClick={handleGetPark}
                        style={{
                          backgroundColor: "var(--main-bg-color)",
                          color: "var(--white-color)",
                          marginTop: 5,
                          marginBottom: 5,
                        }}
                      >
                        {t("Billing.pullBack")}
                      </Button>
                    ) : (
                      <>
                        {addCart.length >= 1 ? (
                          <div className="d-flex justify-content-between align-items-center w-100">
                            <Button
                              variant="contained"
                              onClick={handlePutOnHold}
                              style={{
                                backgroundColor: "var(--white-color)",
                                color: "var(--main-bg-color)",
                                border: "1px solid var(--main-bg-color)",
                                marginTop: 5,
                                marginBottom: 5,
                              }}
                            >
                              {t("Billing.putOnHold")}
                            </Button>
                            {selectedTable && (
                              <Button
                                variant="contained"
                                onClick={tableRemoveHandler}
                                style={{
                                  backgroundColor: "var(--main-bg-color)",
                                  color: "var(--white-color)",
                                  marginTop: 5,
                                  marginBottom: 5,
                                }}
                              >
                                {t("Billing.removeTable")}
                              </Button>
                            )}
                          </div>
                        ) : null}
                      </>
                    )}
                  </>
                </div>
              </div>
            </div>

            {/* </div> */}
          </>
          {isPopupOpen ? (
            <AlertpopUP
              open={isPopupOpen}
              // message={
              //   apiError?.length > 0 ? apiError : "Product placed successfully!"
              // }
              message={popUpMsg && popUpMsg}
              severity={apiError?.length > 0 ? "error" : "success"}
              onClose={handleClose}
            />
          ) : null}

          {openKotCancellation ? (
            <KotCancellationModal
              isModelVisible={openKotCancellation}
              setShow={setOpenKotCancellation}
              kotCancelReasonHandler={kotCancelReasonHandler}
              kotCancelReason={kotCancelReason}
              kotCancelletionConfirmHandler={kotCancelletionConfirmHandler}
            />
          ) : null}
        </>
      )}
    </MainContentArea>
  );
};

export default CartPage;
