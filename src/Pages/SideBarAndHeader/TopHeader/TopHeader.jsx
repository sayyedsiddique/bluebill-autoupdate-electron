import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import "./TopHeader.css";

import { BsFillMoonStarsFill, BsSunFill } from "react-icons/bs";
import LoadingSpinner from "../../../Components/LoadingSpinner/LoadingSpinner";
import { retrieveObj, DEFAULT_IMAGE } from "../../../Containts/Values";
import { useTranslation } from "react-i18next";
import {
  getBrandNotSyncList,
  getCategoryNotSyncList,
  getCustomerNotSyncList,
  getDiscountMappingNotSyncList,
  getDiscountNotSyncList,
  getMappedTaxNotSyncList,
  getProductNotSyncList,
  getSalesDetailsNotSyncList,
  getSalesExecutiveNotSyncList,
  getTaxNotSyncList,
  getTransactionPaymentNotSyncList,
  getUnitNotSyncList,
} from "../../../utils/constantFunctions";
import { syncAllTogether } from "../../../Redux/Sync/syncSlice";

const TopBar = (props) => {
  const { defaultLang } = props;
  const appUpdate = window.appUpdate
  const api = window.api
 
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const [storeImg, setStoreImg] = useState("");
  const [storeName, setStoreName] = useState("");

  const [modeToggle, setodeToggle] = useState(false);
  const sidenavToggleState = useSelector(
    (state) => state.sidenavToggle.showMenu
  );
  const path = useLocation();

  const { productId } = useParams();
  const [appUpdateMessage, setAppUpdateMessage] = useState("")

  const pageHeading =
    path.pathname === "/" ? (
      <span>{storeName}</span>
    ) : path.pathname === "/online-order" ? (
      t("TopHeader.allOnlineOrders")
    ) : path.pathname === `/online-order/${productId}` ? (
      t("TopHeader.orderDetails")
    ) : path.pathname === "/products" ? (
      t("TopHeader.allProducts")
    ) : path.pathname === `/product/productId=${productId}` ? (
      t("TopHeader.productDetails")
    ) : path.pathname === `/add-product` ? (
      t("TopHeader.addNewProduct")
    ) : path.pathname === "/Customers" ? (
      t("TopHeader.customerDetails")
    ) : path.pathname === "/Discount" ? (
      t("TopHeader.discountDetails")
    ) : path.pathname === "/Taxes" ? (
      t("TopHeader.taxesDetails")
    ) : path.pathname === "/Brands" ? (
      t("TopHeader.brandsDetails")
    ) : path.pathname === "/Units" ? (
      t("TopHeader.unitsDetails")
    ) : path.pathname === "/Category" ? (
      t("TopHeader.categoryDetails")
    ) : path.pathname === "/salesexecutive" ? (
      t("TopHeader.salesExecutive")
    ) : path.pathname === "/signin" ? (
      t("TopHeader.LogInPage")
    ) : path.pathname === "/storesetting" ? (
      t("TopHeader.storeSetting")
    ) : path.pathname === "/storeedit" ? (
      t("TopHeader.storeEdit")
    ) : path.pathname === "/cart" ? (
      t("TopHeader.billing")
    ) : path.pathname === "/transaction" ? (
      t("Transaction.transactionDetails")
    ) : path.pathname === "/storecreation" ? (
      "Add Store"
    ) : path.pathname === "/report" ? (
      t("TopHeader.reportDetails")
    ) : (
      ""
    );

  const topbarContainerEn = sidenavToggleState
    ? "topbar-container active"
    : "topbar-container";

  const topbarContainerAr = sidenavToggleState
    ? "topbar-container-ar active"
    : "topbar-container-ar";

    useEffect(() => {
      console.log("headerUpdateCHala")
      const message = appUpdate?.getAppAvailableUpdate()
      setAppUpdateMessage(message)
     console.log("message... ", message)
    },[])

  useEffect(() => {
    retrieveObj("storeInfo").then((info) => {
      if (info !== null) {
        setStoreImg(info && info[0]?.imageUrl);
        setStoreName(info && info[0]?.storeName);
      }
    });
  }, [localStorage.getItem("storeInfo")]);

  useEffect(() => {
    let mode = localStorage.getItem("darkMode");

    if (mode === "true") {
      console.log("mode", mode);
      setDarkMode();
      setodeToggle(true);
    } else {
      setLightMode();
      setodeToggle(false);
      console.log("mode", mode);
    }
  }, []);

  const toggleHandle = (mode) => {
    if (mode === true) {
      localStorage.setItem("darkMode", true);
      setodeToggle(true);
      console.log("toggleHandle", mode);
      setDarkMode();
    } else {
      localStorage.setItem("darkMode", false);
      setodeToggle(false);
      console.log("toggleHandle", mode);
      setLightMode();
    }
  };

  const setDarkMode = () => {
    document.querySelector("body").setAttribute("data-theme", "dark");
  };

  const setLightMode = () => {
    document.querySelector("body").setAttribute("data-theme", "light");
  };


  const synchHandler = () => {
    // Local not sync data 
    const brandNotSyncList = getBrandNotSyncList();
    const unitNotSyncList = getUnitNotSyncList();
    const categoryNotSyncList = getCategoryNotSyncList();
    const salesExecutiveNotSyncList = getSalesExecutiveNotSyncList();
    const customerNotSyncList = getCustomerNotSyncList();
    const taxNotSyncList = getTaxNotSyncList();
    const mappedTaxNotSyncList = getMappedTaxNotSyncList();
    const discountNotSyncList = getDiscountNotSyncList();
    const discountMappingNotSyncList = getDiscountMappingNotSyncList();
    const transactionPaymentNotSyncList = getTransactionPaymentNotSyncList();
    const salesDetailsNotSyncList = getSalesDetailsNotSyncList();
    const productNotSyncList = getProductNotSyncList();

    const allNotSyncValues = {
      brandNotSyncList: brandNotSyncList,
      unitNotSyncList: unitNotSyncList,
      categoryNotSyncList: categoryNotSyncList,
      salesExecutiveNotSyncList: salesExecutiveNotSyncList,
      customerNotSyncList: customerNotSyncList,
      taxNotSyncList: taxNotSyncList,
      mappedTaxNotSyncList: mappedTaxNotSyncList,
      discountNotSyncList: discountNotSyncList,
      discountMappingNotSyncList: discountMappingNotSyncList,
      transactionPaymentNotSyncList: transactionPaymentNotSyncList,
      salesDetailsNotSyncList: salesDetailsNotSyncList,
      productNotSyncList: productNotSyncList,
    };
    console.log("allNotSyncValues... ", allNotSyncValues);

    allNotSyncValues && dispatch(syncAllTogether(allNotSyncValues));
  };

  return (
    <>
      {!isLoaded ? (
        <div
          className={
            (defaultLang && defaultLang?.name === "Arabic") ||
            defaultLang?.name === "عربي"
              ? topbarContainerAr
              : topbarContainerEn
          }
        >
          <div className=" ms-0 topbar-header p-0">
            <div className="  d-md-block  store_name ps-md-3">
              <h3
                className={
                  (defaultLang && defaultLang?.name === "Arabic") ||
                  defaultLang?.name === "عربي"
                    ? "pageHeading-ar mb-0"
                    : "pageHeading mb-0"
                }
              >
                {pageHeading}
              </h3>
              <span>{appUpdateMessage}
              </span>
            </div>

            <div className="profile_container gap-2 pointer">
              {modeToggle ? (
                <i
                  onClick={() => toggleHandle(false)}
                  className="fas fa-moon text-Class me-3"
                  style={{ backgroundColor: "var(--topHeader-bg-color)" }}
                >
                  <BsSunFill size={20} />
                </i>
              ) : (
                <i
                  className="fas fa-moon me-3 text-Class"
                  onClick={() => toggleHandle(true)}
                >
                  <BsFillMoonStarsFill size={20} />
                </i>
              )}

              <div>
                <button
                  className="btn btn-primary "
                  onClick={synchHandler}
                  style={{
                    background: "var(--main-bg-color)",
                    color: "var(--white-color)",
                    fontsize: " 22px",
                    // marginLeft: "20px",
                    border:"1px solid #6c757d",
                    
                  }}
                >
                  Sync
                </button>
              </div>

              <div className="user me-2">
                <div className="img_container">
                  {path.pathname !== "/storecreation" ? (
                    <img
                      src={storeImg ? storeImg : DEFAULT_IMAGE}
                      onClick={() => navigate("/storesetting")}
                      alt="user pic"
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <LoadingSpinner />
      )}
    </>
  );
};

export default TopBar;
