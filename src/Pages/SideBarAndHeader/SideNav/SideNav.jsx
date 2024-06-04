import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./SideNav.css";

import { BiCategory, BiMenu } from "react-icons/bi";
import { RiBillFill, RiLogoutCircleRLine, RiStore2Line } from "react-icons/ri";
import { HiHome } from "react-icons/hi";
import { TbReportSearch } from "react-icons/tb";
import { HiClipboardList, HiUser } from "react-icons/hi";
import { FaBoxOpen } from "react-icons/fa";
import { BsPeopleFill } from "react-icons/bs";
import { sidenavToggle } from "../../../Redux/SidenavSlice/sidenavSlice";
import { Auth } from "aws-amplify";
import {
  SERVER_URL,
  retrieveObj,
  storeObjInLocalStrg,
} from "../../../Containts/Values";
import LanguageOption from "../../../Components/LanguageOption";
import { IconContext } from "react-icons";
import { HiTranslate } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import Collapse from "react-bootstrap/Collapse";
import { FiChevronDown } from "react-icons/fi";
import { AiOutlineTransaction } from "react-icons/ai";
import { IoSettings } from "react-icons/io5";
import { MdOutlineRestaurant } from "react-icons/md";
import { MdOutlineInventory } from "react-icons/md";
import { MdTableRestaurant } from "react-icons/md";
import { authError, authLoading } from "../../../Redux/authSlice/authSlice";
import axios from "axios";
import Swal from "sweetalert2";
import TrailInformationCard from "../../../Components/TrialInformationCard/TrailInformationCard";
import {
  getStoreDetailsFromLocalStorage,
  validateLicense,
} from "../../../utils/constantFunctions";
import useLicenseValidation from "../../../hooks/useLicenseValidation";
import { getPaymentDetails } from "../../../Redux/SubscriptionPaymentSlice/SubscriptionPaymentSlice";
import UpdateDownloadModal from "../../../Components/Modals/UpdateDownloadModal";

const SideNav = (props) => {
  const deleteAllSqliteDataApi = window.deleteAllDataApi;
  const appUpdate = window.appUpdate;

  const { defaultLang, selectHandler, isLogoutOnly } = props;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const history = useNavigate();
  const { t } = useTranslation();
  const sidenavToggleState = useSelector(
    (state) => state.sidenavToggle.showMenu
  );
  const licenseDetailsData = useSelector(
    (state) => state.license.licenseDetails
  );
  console.log("licenseDetailsData..", licenseDetailsData);

  console.log("sidenavToggleState", sidenavToggleState);
  const isOnline = useSelector((state) => state.checkInternet.isOnline);
  // Calling custom hook
  const isLicenseValidate = useLicenseValidation();
  // console.log("isLicenseValidate", isLicenseValidate);
  const [storeName, setStoreName] = useState("");
  const [productsCollapse, setproductsCollapse] = useState(false);
  console.log("productsCollapse", productsCollapse);
  const [restaurantsCollapse, setRestaurantsCollapse] = useState(false);
  console.log("restaurantsCollapse", restaurantsCollapse);
  const [inventoryCollapse, setInventoryCollapse] = useState(false);
  const [isRestaurant, setIsRestaurant] = useState(false);
  const [cognitoUserId, setCognitoUserId] = useState();
  console.log("cognitoUserId... ", cognitoUserId);
  const [showUpdateDownloadMD, setShowUpdateDownloadMD] = useState(false);
  const [availableUpdateMsg, setAvailableUpdateMsg] = useState({
    message: "",
    version: "",
    downloadProgress: 0,
  });
  console.log("availableUpdateMsg... ", availableUpdateMsg);

  const restaurantCollapseHandler = () => {
    sidenavToggleState === true
      ? dispatch(sidenavToggle.toggle())
      : setRestaurantsCollapse(!restaurantsCollapse);
  };

  const restaurantUnColHandler = () => {
    console.log("rest un colapse");
    restaurantsCollapse === false && dispatch(sidenavToggle.toggle());
  };

  const inventoryCollapseHandler = () => {
    sidenavToggleState === true
      ? dispatch(sidenavToggle.toggle())
      : setInventoryCollapse(!inventoryCollapse);
  };

  const productCollapseHandler = () => {
    console.log("prod colapse");
    sidenavToggleState === true
      ? dispatch(sidenavToggle.toggle())
      : setproductsCollapse(!productsCollapse);
  };

  const productUnColHandler = () => {
    console.log("prod un colapse");
    productsCollapse === false && dispatch(sidenavToggle.toggle());
  };

  const toggleHandler = () => {
    console.log("toggle handler");
    dispatch(sidenavToggle.toggle());
    productsCollapse === true && setproductsCollapse(false);
    restaurantsCollapse === true && setRestaurantsCollapse(false);
    inventoryCollapse === true && setInventoryCollapse(false);
  };

  // checking for app update
  useEffect(() => {
    const message = appUpdate?.checkingForUpdate();
    // Handling the update available scenario
    appUpdate?.updateAvailable().then((version) => {
      if (version) {
        setAvailableUpdateMsg({ ...availableUpdateMsg, version: version });
      }
    });
  }, []);

  useEffect(() => {}, [
    sidenavToggleState,
    productsCollapse,
    restaurantsCollapse,
  ]);

  useEffect(() => {
    retrieveObj("storeInfo").then((info) => {
      const storeCategory = info && info[0]?.storeCategory;
      setIsRestaurant(storeCategory === "Restaurants");
      setStoreName(info && info[0]?.storeName);
    });
    const cognitoUserDetails = getStoreDetailsFromLocalStorage("storeUserInfo");
    cognitoUserDetails && setCognitoUserId(cognitoUserDetails?.userId);
  }, []);

  // Getting payment details from server
  useEffect(() => {
    cognitoUserId && dispatch(getPaymentDetails(cognitoUserId));
  }, [cognitoUserId]);

  const logoHandler = () => {
    history("/");
  };

  const handleLogOut = async () => {
    // setIsLoaded(true);

    try {
      await Auth.signOut();
      // props.auth(false)
      localStorage.clear();
      navigate("/");
      window.location.reload();
      // setIsLoaded(false);
    } catch (error) {
      alert(error.message);
    }
  };

  const logoutPopUpOpenHandler = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to logout? If you logout your all data will be deleted.",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout it!",
    }).then((data) => {
      if (data.isConfirmed) {
        // Here we deleting all sqlite data
        if (isOnline) {
          handleLogOut();
        } else {
          // deleteAllSqliteDataApi?.deleteAllSqliteDataHandler();
          handleLogOut();
        }
      }
    });
  };

  const languageHandler = () => {
    console.log("lang chala");
    dispatch(sidenavToggle.toggle());
  };

  const toggleClassesEn = sidenavToggleState ? "sidebar active" : "sidebar";
  const toggleClassesAr = sidenavToggleState
    ? "sidebar-ar active"
    : "sidebar-ar";

  const sidebarListContainer =
    (defaultLang && defaultLang?.name === "Arabic") ||
    defaultLang?.name === "عربي"
      ? "sidebar_list_container-ar"
      : "sidebar_list_container";
  const sidebarList =
    (defaultLang && defaultLang?.name === "Arabic") ||
    defaultLang?.name === "عربي"
      ? "sidebar_list-ar"
      : "sidebar_list";

  const updaetAvailableHandler = () => {
    setShowUpdateDownloadMD(!showUpdateDownloadMD);
  };

  const updateNowHandler = () => {
    // orun only if update available
    if (availableUpdateMsg?.version) {
      const updateDownload = appUpdate?.downloadUpdate();
      updateDownload &&
        setAvailableUpdateMsg({
          ...availableUpdateMsg,
          message: updateDownload,
        });
      appUpdate?.updateDownloadProgress((downloadProgress) => {
        if (downloadProgress) {
          const progressMessage = `Download speed: ${downloadProgress.bytesPerSecond} - Downloaded ${downloadProgress.percent}% (${downloadProgress.transferred}/${downloadProgress.total})`;
          setAvailableUpdateMsg((prevState) => ({
            ...prevState,
            downloadProgress: Number(downloadProgress.percent).toFixed(2),
            message: progressMessage,
          }));
        }
      });
    }
  };

  // quiteAndInstall application
  const quiteAndInstall = () => {
    appUpdate?.quitAndInstall();
  };

  return (
    <div
      className={
        (defaultLang && defaultLang?.name === "Arabic") ||
        defaultLang?.name === "عربي"
          ? toggleClassesAr
          : toggleClassesEn
      }
    >
      <div className="logo_container pt-0">
        <div className="logo" onClick={logoHandler}>
          <h4 className="logo_name" title={storeName}>
            {storeName}
          </h4>
        </div>
        <BiMenu className="menu_icon" onClick={toggleHandler} />
      </div>
      <div
        className={sidebarListContainer}
        // style={{maxHeight: sidenavToggleState ? "78%" : "59%"}}
        style={{
          maxHeight:
            isLicenseValidate?.licensePlan === "free" && !sidenavToggleState
              ? "60%"
              : "78%",
        }}
      >
        <ul className={sidebarList}>
          {!isLogoutOnly && (
            <>
              {availableUpdateMsg?.version && (
                <li>
                  <NavLink
                    // to="/"
                    className={(navData) =>
                      navData.isActive ? "aTag active" : "aTag"
                    }
                    style={{
                      justifyContent: "center",
                      backgroundColor: "var(--white-color)",
                      color: "var(--main-bg-color)",
                    }}
                    onClick={updaetAvailableHandler}
                  >
                    {/* <HiHome className="menu_icons" /> */}
                    <span className="sidebar_item">
                      {t("Update Available")}
                    </span>
                  </NavLink>
                  <span className="tooltip">{t("Update Available")}</span>
                </li>
              )}

              <li>
                <NavLink
                  to="/"
                  className={(navData) =>
                    navData.isActive ? "aTag active" : "aTag"
                  }
                >
                  <HiHome className="menu_icons" />
                  <span className="sidebar_item">{t("SideNav.dashboard")}</span>
                </NavLink>
                <span className="tooltip">{t("SideNav.dashboard")}</span>
              </li>
              <li>
                <NavLink
                  to="/cart"
                  className={(navData) =>
                    navData.isActive ? "aTag active" : "aTag"
                  }
                >
                  <RiBillFill className="menu_icons" />
                  <span className="sidebar_item">{t("SideNav.billing")}</span>
                </NavLink>
                <span className="tooltip">{t("SideNav.billing")}</span>
                {/* AiOutlineTransaction */}
              </li>

              {isRestaurant && (
                <li>
                  <NavLink
                    to="/tables"
                    className={(navData) =>
                      navData.isActive ? "aTag active" : "aTag"
                    }
                  >
                    <MdTableRestaurant className="menu_icons" />
                    <span className="sidebar_item">
                      {t("SideNav.tableManagement")}
                    </span>
                  </NavLink>
                  <span className="tooltip">
                    {t("SideNav.tableManagement")}
                  </span>
                </li>
              )}
              <li>
                <NavLink
                  to="/transaction"
                  className={(navData) =>
                    navData.isActive ? "aTag active" : "aTag"
                  }
                >
                  <AiOutlineTransaction className="menu_icons" />
                  <span className="sidebar_item">
                    {t("SideNav.transaction")}
                  </span>
                </NavLink>
                <span className="tooltip">{t("SideNav.transaction")}</span>
              </li>

              <li>
                <NavLink
                  to="report"
                  className={(navData) =>
                    navData.isActive ? "aTag active" : "aTag"
                  }
                >
                  <TbReportSearch className="menu_icons" />
                  <span className="sidebar_item">{t("SideNav.report")}</span>
                </NavLink>
                <span className="tooltip">{t("SideNav.report")}</span>
              </li>

              <li>
                <NavLink
                  to="/online-order?status=Pending"
                  className={(navData) =>
                    navData.isActive ? "aTag active" : "aTag"
                  }
                >
                  <HiClipboardList className="menu_icons" />
                  <span className="sidebar_item">
                    {t("SideNav.onlineOrder")}
                  </span>
                </NavLink>
                <span className="tooltip">{t("SideNav.onlineOrder")}</span>
              </li>

              <div>
                <div
                  className="d-flex flex-row align-items-center py-2 px-2 rounded-3 gap-2"
                  style={{ cursor: "pointer" }}
                  onClick={productCollapseHandler}
                >
                  {/* product and icon container */}
                  <div
                    className="d-flex align-items-center cursor gap-2"
                    data-bs-toggle="collapse"
                    data-bs-target="#panelsStayOpen-collapseOne"
                    aria-expanded="true"
                    aria-controls="panelsStayOpen-collapseOne"
                    onClick={productUnColHandler}
                  >
                    <IconContext.Provider
                      value={{
                        color: "#fff",
                        size: "25px",
                        className: "global-class-name",
                      }}
                    >
                      <FaBoxOpen width="50" height="50" />
                    </IconContext.Provider>
                  </div>
                  {/* downarrow container */}
                  <div className=" gap-3 dropdown_icon menuItem-container">
                    <div className="without_dropdown_icon">
                      <span className="sidebar_item">
                        {t("SideNav.productsManagement")}
                      </span>
                    </div>
                    <div
                      className={`cursor p-0 ${
                        productsCollapse ? "rotate-180" : ""
                      }`}
                      aria-controls="example-collapse-text"
                      aria-expanded={productsCollapse}
                    >
                      <IconContext.Provider
                        value={{
                          size: "25px",
                          color: "#fff",
                        }}
                      >
                        <FiChevronDown
                          className={`cursor p-0 ${
                            productsCollapse ? "rotate-180" : ""
                          }`}
                        />
                      </IconContext.Provider>
                    </div>
                  </div>
                </div>
                <Collapse in={productsCollapse}>
                  <div
                    id="panelsStayOpen-collapseOne"
                    className="mt-2"
                    aria-labelledby="pane lsStayOpen-headingOne"
                  >
                    <div className="d-flex flex-column gap-2 px-4">
                      {/* Products Dashboard */}
                      <NavLink
                        to="/products"
                        className={(navData) =>
                          navData.isActive ? "aTag active" : "aTag"
                        }
                      >
                        <div
                          className={`d-flex justify-content-between  align-items-center rounded-3`}
                        >
                          <div
                            className={`d-flex flex-row  align-items-center rounded-3 gap-2 py-2 px-2 cursor`}
                          >
                            <div className="without_dropdown_icon">
                              <span className="px-2">
                                {t("SideNav.product")}
                              </span>
                            </div>
                          </div>
                        </div>
                      </NavLink>

                      {/* Discount Dashboard */}
                      <NavLink
                        to="/Discount"
                        className={(navData) =>
                          navData.isActive ? "aTag active" : "aTag"
                        }
                      >
                        <div
                          className={`d-flex justify-content-between  align-items-center rounded-3`}
                        >
                          <div
                            className={`d-flex flex-row  align-items-center rounded-3 gap-2 py-2 px-2 cursor`}
                          >
                            <div className="without_dropdown_icon">
                              <span className="px-2">
                                {t("SideNav.discountsOffers")}
                              </span>
                            </div>
                          </div>
                        </div>
                      </NavLink>

                      {/* Taxes Dashboard */}
                      <NavLink
                        to="/Taxes"
                        className={(navData) =>
                          navData.isActive ? "aTag active" : "aTag"
                        }
                      >
                        <div
                          className={`d-flex justify-content-between  align-items-center rounded-3`}
                        >
                          <div
                            className={`d-flex flex-row  align-items-center rounded-3 gap-2 py-2 px-2 cursor`}
                          >
                            <div className="without_dropdown_icon">
                              <span className="px-2">{t("SideNav.taxes")}</span>
                            </div>
                          </div>
                        </div>
                      </NavLink>

                      {/* Unit Dashboard */}
                      <NavLink
                        to="/Units"
                        className={(navData) =>
                          navData.isActive ? "aTag active" : "aTag"
                        }
                      >
                        <div
                          className={`d-flex justify-content-between  align-items-center rounded-3`}
                        >
                          <div
                            className={`d-flex flex-row  align-items-center rounded-3 gap-2 py-2 px-2 cursor`}
                          >
                            <div className="without_dropdown_icon">
                              <span className="px-2">{t("SideNav.units")}</span>
                            </div>
                          </div>
                        </div>
                      </NavLink>

                      {/* Brand Dashboard */}
                      <NavLink
                        to="/Brands"
                        className={(navData) =>
                          navData.isActive ? "aTag active" : "aTag"
                        }
                      >
                        <div
                          className={`d-flex justify-content-between  align-items-center rounded-3`}
                        >
                          <div
                            className={`d-flex flex-row  align-items-center rounded-3 gap-2 py-2 px-2 cursor`}
                          >
                            <div className="without_dropdown_icon">
                              <span className="px-2">
                                {t("SideNav.brands")}
                              </span>
                            </div>
                          </div>
                        </div>
                      </NavLink>
                    </div>
                  </div>
                </Collapse>
              </div>

              {/* Inventory Management dropdown */}
              {isRestaurant && (
                <div>
                  <div
                    className="d-flex flex-row align-items-center py-2 px-2 rounded-3 gap-2"
                    style={{ cursor: "pointer" }}
                    onClick={inventoryCollapseHandler}
                  >
                    {/* product and icon container */}
                    <div
                      className="d-flex align-items-center cursor gap-2"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseOne"
                      aria-expanded="true"
                      aria-controls="panelsStayOpen-collapseOne"
                      onClick={productUnColHandler}
                    >
                      <IconContext.Provider
                        value={{
                          color: "#fff",
                          size: "25px",
                          className: "global-class-name",
                        }}
                      >
                        <MdOutlineInventory width="50" height="50" />
                      </IconContext.Provider>
                    </div>
                    {/* downarrow container */}
                    <div className=" gap-3 dropdown_icon menuItem-container">
                      <div className="without_dropdown_icon">
                        <span className="sidebar_item">
                          {t("SideNav.inventoryManagement")}
                        </span>
                      </div>
                      <div
                        className={`cursor p-0 ${
                          inventoryCollapse ? "rotate-180" : ""
                        }`}
                        aria-controls="example-collapse-text"
                        aria-expanded={inventoryCollapse}
                      >
                        <IconContext.Provider
                          value={{
                            size: "25px",
                            color: "#fff",
                          }}
                        >
                          <FiChevronDown
                            className={`cursor p-0 ${
                              inventoryCollapse ? "rotate-180" : ""
                            }`}
                          />
                        </IconContext.Provider>
                      </div>
                    </div>
                  </div>
                  <Collapse in={inventoryCollapse}>
                    <div
                      id="panelsStayOpen-collapseOne"
                      className="mt-2"
                      aria-labelledby="pane lsStayOpen-headingOne"
                    >
                      <div className="d-flex flex-column gap-2">
                        {/* StockDashboardPage*/}
                        <NavLink
                          to="/StockDashboardPage"
                          className={(navData) =>
                            navData.isActive ? "aTag active" : "aTag"
                          }
                        >
                          <div
                            className={`d-flex justify-content-between  align-items-center rounded-3`}
                          >
                            <div
                              className={`d-flex flex-row  align-items-center rounded-3 gap-2 py-2 px-2 cursor`}
                            >
                              <div className="without_dropdown_icon">
                                <span className="px-2">
                                  {t("SideNav.stockDashboard")}
                                </span>
                              </div>
                            </div>
                          </div>
                        </NavLink>

                        {/* PurchaseOrderPage */}
                        <NavLink
                          to="/PurchaseOrderPage"
                          className={(navData) =>
                            navData.isActive ? "aTag active" : "aTag"
                          }
                        >
                          <div
                            className={`d-flex justify-content-between  align-items-center rounded-3`}
                          >
                            <div
                              className={`d-flex flex-row  align-items-center rounded-3 gap-2 py-2 px-2 cursor`}
                            >
                              <div className="without_dropdown_icon">
                                <span className="px-2">
                                  {t("SideNav.purchaseOrder")}
                                </span>
                              </div>
                            </div>
                          </div>
                        </NavLink>
                      </div>
                    </div>
                  </Collapse>
                </div>
              )}

              {/* Restaurants Management dropdown */}
              {isRestaurant && (
                <div>
                  <div
                    className="d-flex flex-row align-items-center py-2 px-2 rounded-3 gap-2"
                    style={{ cursor: "pointer" }}
                    onClick={restaurantCollapseHandler}
                  >
                    {/* product and icon container */}
                    <div
                      className="d-flex align-items-center cursor gap-2"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseOne"
                      aria-expanded="true"
                      aria-controls="panelsStayOpen-collapseOne"
                      onClick={restaurantUnColHandler}
                    >
                      <IconContext.Provider
                        value={{
                          color: "#fff",
                          size: "25px",
                          className: "global-class-name",
                        }}
                      >
                        <MdOutlineRestaurant width="50" height="50" />
                      </IconContext.Provider>
                    </div>
                    {/* downarrow container */}
                    <div className=" gap-3 dropdown_icon menuItem-container">
                      <div className="without_dropdown_icon">
                        <span className="sidebar_item">
                          {t("SideNav.restaurantManagement")}
                        </span>
                      </div>
                      <div
                        className={`cursor p-0 ${
                          restaurantsCollapse ? "rotate-180" : ""
                        }`}
                        aria-controls="example-collapse-text"
                        aria-expanded={restaurantsCollapse}
                      >
                        <IconContext.Provider
                          value={{
                            size: "25px",
                            color: "#fff",
                          }}
                        >
                          <FiChevronDown
                            className={`cursor p-0 ${
                              restaurantsCollapse ? "rotate-180" : ""
                            }`}
                          />
                        </IconContext.Provider>
                      </div>
                    </div>
                  </div>
                  <Collapse in={restaurantsCollapse}>
                    <div
                      id="panelsStayOpen-collapseOne"
                      className="mt-2"
                      aria-labelledby="pane lsStayOpen-headingOne"
                    >
                      <div className="d-flex flex-column gap-2 px-4">
                        {/* Floor Dashboard */}
                        <NavLink
                          to="/floor-dashboard"
                          className={(navData) =>
                            navData.isActive ? "aTag active" : "aTag"
                          }
                        >
                          <div
                            className={`d-flex justify-content-between  align-items-center rounded-3`}
                          >
                            <div
                              className={`d-flex flex-row  align-items-center rounded-3 gap-2 py-2 px-2 cursor`}
                            >
                              <div className="without_dropdown_icon">
                                <span className="px-2">
                                  {t("SideNav.floor")}
                                </span>
                              </div>
                            </div>
                          </div>
                        </NavLink>

                        {/* Table Dashboard */}
                        <NavLink
                          to="/TablePage"
                          className={(navData) =>
                            navData.isActive ? "aTag active" : "aTag"
                          }
                        >
                          <div
                            className={`d-flex justify-content-between  align-items-center rounded-3`}
                          >
                            <div
                              className={`d-flex flex-row  align-items-center rounded-3 gap-2 py-2 px-2 cursor`}
                            >
                              <div className="without_dropdown_icon">
                                <span className="px-2">
                                  {t("SideNav.table")}
                                </span>
                              </div>
                            </div>
                          </div>
                        </NavLink>
                      </div>
                    </div>
                  </Collapse>
                </div>
              )}

              <li>
                <NavLink
                  to="/Customers"
                  className={(navData) =>
                    navData.isActive ? "aTag active" : "aTag"
                  }
                >
                  <HiUser className="menu_icons" />
                  <span className="sidebar_item">{t("SideNav.customers")}</span>
                </NavLink>
                <span className="tooltip">{t("SideNav.customers")}</span>
              </li>

              <li>
                <NavLink
                  to="/Category"
                  className={(navData) =>
                    navData.isActive ? "aTag active" : "aTag"
                  }
                >
                  <BiCategory className="menu_icons" />
                  <span className="sidebar_item">{t("SideNav.category")}</span>
                </NavLink>
                <span className="tooltip">{t("SideNav.categoryDetails")}</span>
              </li>

              <li>
                <NavLink
                  to="/salesexecutive"
                  className={(navData) =>
                    navData.isActive ? "aTag active" : "aTag"
                  }
                >
                  <BsPeopleFill className="menu_icons" />
                  <span className="sidebar_item">
                    {t("SideNav.salesExecutive")}
                  </span>
                </NavLink>
                <span className="tooltip">
                  {t("SideNav.salesExecutiveDetails")}
                </span>
              </li>

              <li>
                <NavLink
                  to="/storesetting"
                  className={(navData) =>
                    navData.isActive ? "aTag active" : "aTag"
                  }
                >
                  <RiStore2Line className="menu_icons" />
                  <span className="sidebar_item">
                    {t("SideNav.storeSetting")}
                  </span>
                </NavLink>
                <span className="tooltip">{t("SideNav.language")}</span>
              </li>

              <li>
                <NavLink
                  to="/AccountAndSettings"
                  className={(navData) =>
                    navData.isActive ? "aTag active" : "aTag"
                  }
                >
                  <IoSettings className="menu_icons" />
                  <span className="sidebar_item">
                    {t("SideNav.accountSettings")}
                  </span>
                </NavLink>
                <span className="tooltip">{t("SideNav.language")}</span>
              </li>
            </>
          )}

          {/* <div className="language-container">
            <div className="lang-icon-container" onClick={languageHandler}>
              <IconContext.Provider
                value={{ color: "var(--white-color)", size: "2em" }}
              >
                <HiTranslate className="menu_icons" />
              </IconContext.Provider>
            </div>
            <div className="lang-select-container">
              <LanguageOption
                selectHandler={selectHandler}
                defaultLang={defaultLang}
              />
            </div>
            <span className="tooltip">{t("SideNav.language")}</span>
          </div>

          <li onClick={logoutPopUpOpenHandler} style={{ cursor: "pointer" }}>
            <IconContext.Provider value={{ color: "var(--white-color)" }}>
              <RiLogoutCircleRLine className="menu_icons" />
            </IconContext.Provider>

            <span className="sidebar_item logout-text-color">
              {t("SideNav.logout")}
            </span>
            <span className="tooltip">{t("SideNav.logout")}</span>
          </li> */}
        </ul>
      </div>

      <div
        className={sidebarListContainer}
        style={{
          maxHeight:
            isLicenseValidate?.licensePlan === "free" && !sidenavToggleState
              ? "40%"
              : "",
        }}
      >
        <ul className={sidebarList}>
          {!isLogoutOnly && (
            <>
              {(isLicenseValidate?.licensePlan === "free" ||
                !licenseDetailsData) &&
              !sidenavToggleState ? (
                <div className="tralicard mb-3">
                  <TrailInformationCard storeName={storeName} />
                </div>
              ) : null}

              {/* {isLicenseValidate?.licensePlan === "free" && (!sidenavToggleState || !licenseDetailsData) && (
                <div className="tralicard mb-3">
                  <TrailInformationCard storeName={storeName} />
                </div>
              )} */}

              <div className="language-container">
                <div className="lang-icon-container" onClick={languageHandler}>
                  <IconContext.Provider
                    value={{ color: "var(--white-color)", size: "2em" }}
                  >
                    <HiTranslate className="menu_icons" />
                  </IconContext.Provider>
                </div>
                <div className="lang-select-container">
                  <LanguageOption
                    selectHandler={selectHandler}
                    defaultLang={defaultLang}
                  />
                </div>
                <span className="tooltip">{t("SideNav.language")}</span>
              </div>

              <li
                onClick={logoutPopUpOpenHandler}
                style={{ cursor: "pointer" }}
              >
                <IconContext.Provider value={{ color: "var(--white-color)" }}>
                  <RiLogoutCircleRLine className="menu_icons" />
                </IconContext.Provider>

                <span className="sidebar_item logout-text-color">
                  {t("SideNav.logout")}
                </span>
                <span className="tooltip">{t("SideNav.logout")}</span>
              </li>
            </>
          )}
        </ul>
      </div>
      <UpdateDownloadModal
        setModalOpen={setShowUpdateDownloadMD}
        modalOpen={showUpdateDownloadMD}
        updateMessage={availableUpdateMsg}
        updateNowHandler={updateNowHandler}
        quiteAndInstall={quiteAndInstall}
      />
    </div>
  );
};

export default SideNav;
