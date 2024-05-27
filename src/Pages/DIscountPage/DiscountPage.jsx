import axios from "axios";
import React, { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin5Line } from "react-icons/ri";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";
import MainContentArea from "../MainContentArea/MainContentArea";
import "./DiscountPage.css";
import DiscountModal from "./DiscountModal";
import {
  GET_DISCOUNT,
  pageSizeForPag,
  retrieveObj,
  SERVER_URL,
  STORE_CURRENCY,
  UPSERT_DISCOUNT,
} from "../../Containts/Values";
import Swal from "sweetalert2";
import NoOnlineOrderItem from "../../Components/OnlineOrders/NoOnlineOrderItem/NoOnlineOrderItem";
import { useDispatch, useSelector } from "react-redux";
import {
  addDiscount,
  deleteDiscount,
  getDiscountlist,
  getMappedDiscountListByStoreId,
} from "../../Redux/Discount/discountSlice";
import { Link, useNavigate } from "react-router-dom";
import RemoveDiscountModal from "./RemoveDiscountModal";
import ApplyDiscountModal from "./ApplyDiscountModal";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { Button } from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";
import AlertpopUP from "../../utils/AlertPopUP";
import {
  apiFailureResponse,
  getSortArrow,
  handleReload,
  showPopupHandleClick,
  sortTableDataHandler,
} from "../../utils/constantFunctions";
import ErrorBoundary from "../../Components/ErrorBoundary/ErrorBoundary";
import { FaSortDown } from "react-icons/fa";
import { BiSearch } from "react-icons/bi";
import { TiArrowSortedDown } from "react-icons/ti";
import useLicenseValidation from "../../hooks/useLicenseValidation";
import SubscriptionPlanModal from "../../Components/TrialInformationCard/SubscriptionPlanModal";
import RocketImage from "../../assets/images/RocketIcon.png";
import debounce from "lodash/debounce";
import Pagination from "@mui/material/Pagination";
import CachedIcon from '@mui/icons-material/Cached';
import ReloadButton from "../../Components/ReloadButton/ReloadButton";
let userToken = localStorage.getItem("userToken");

const Discount = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const discountApi = window.discountApi;
  const isOnline = useSelector((state) => state.checkInternet.isOnline);
  const getDiscount = useSelector((state) => state.discount.discountData);
  console.log("getDiscountAPIData... ", getDiscount);
  const isLoading = useSelector((state) => state.discount.loading);
  const [show, setshow] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editData, seteditData] = useState({});
  const [search, setsearch] = useState([]);
  const [data, setdata] = useState([]);
  const [searchProduct, setSearchProduct] = useState([]);
  console.log("DiscountData... ", data);
  console.log("isOnline... ", isOnline);
  const [discountMap, setDiscountMap] = useState([]);
  const [showRemoveMappedModal, setShowRemoveMappedModal] = useState(false);
  const [showApplyMappedModal, setShowApplyMappedModal] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState({});
  const [discountPostRes, setDiscountPostRes] = useState({});
  const defaultLang = useSelector((state) => state.language.language);
  const [defaultLanguage, setDefaultLanguage] = useState(defaultLang?.name);
  const CurrencySymbol = localStorage.getItem("StoreCurrency");
  // Calling custom hook
  const isLicenseValidate = useLicenseValidation();
  console.log("isLicenseValidate... ", isLicenseValidate)
  const [modalOpen, setModalOpen] = useState(false);

  // State variables for infiniteScroll
  const [discountList, setDiscountList] = useState([]);
  console.log("LIST... ", discountList);
  const [pageNumber, setPageNumber] = useState(1);
  console.log("pageNumber... ", pageNumber);

  const [isPopupOpen, setIsPopupOpen] = useState(false); // for popup
  const [apiError, setApiError] = useState("");
  const [sortOrder, setSortOrder] = useState("descending");
  const [popUpMessage, setPopUpMessage] = useState("");
  const [priceModalOpen, setPriceModalOpen] = useState(false)
  const [isReloading, setIsReloading] = useState(false);
  console.log("isReloading", isReloading);

  console.log("apiError", apiError);

  // getting local storage default language
  useEffect(() => {
    const localStorageLang = localStorage.getItem("defaultLang");
    if (localStorageLang === "ar") {
      setDefaultLanguage("Arabic");
    } else if (localStorageLang === "en") {
      setDefaultLanguage("English");
    }
  }, [localStorage.getItem("defaultLang")]);

  useEffect(() => {
    defaultLang && setDefaultLanguage(defaultLang?.name);
  }, [defaultLang?.name]);

  // apiError state empty after 3 second
  // and user redirect to /discount page
  useEffect(() => {
    if (apiError?.length > 0) {
      showPopupHandleClick(setIsPopupOpen, 3000, setApiError); //for popUp msg
    }
  }, [apiError?.length > 0,]);

  // useEffect(() => {
  //   data?.length > 0 && setDiscountList(data?.slice(0, 5));
  // }, [data]);

  // after i got api response from server we store in state
  useEffect(() => {
    getDiscount?.discount?.length > 0 && setdata(getDiscount?.discount);
  }, [getDiscount?.discount]);

  // we call dicounst list api here
  useEffect(() => {
    if (isOnline) {
      console.log("onlineChala");
      dispatch(getDiscountlist(pageNumber, pageSizeForPag, "", ""));
      dispatch(getMappedDiscountListByStoreId());
    } else {
      console.log("offlineChala");
      let arr = []
      const discountListData = discountApi?.discountDB?.getAllDiscounts();
      console.log("LocalDiscountList... ", discountListData);

      discountListData &&
        discountListData?.map((item) => {
          const now = new Date();
          const expiry = new Date(item?.endDate);
          const date = new Date();
          const options = {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
          };

          let obj = {
            ...item,
            isExpire: expiry <= now,
          };
          arr.push(obj);
        });
      arr && setdata(arr);
    }
  }, [isOnline, discountPostRes]);

  // to find discount is valid or expired
  useEffect(() => {
    let arr = [];


    if (getDiscount?.discount?.length > 0) {
      getDiscount?.discount &&
        getDiscount?.discount?.map((item) => {
          const now = new Date();
          const expiry = new Date(item?.endDate);
          const date = new Date();
          const options = {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
          };

          // console.log(
          //   date.toLocaleString("en-US", options) +
          //     " " +
          //     date.toLocaleTimeString("en-US", {
          //       hour: "numeric",
          //       minute: "numeric",
          //       hour12: true,
          //     })
          // );
          let obj = {
            ...item,
            isExpire: expiry <= now,
          };
          arr.push(obj);
          // expiry < now
        });
      console.log("arrExpiry... ", arr);
      arr?.length > 0 && setdata(arr);
    }


  }, [getDiscount?.discount]);

  const handleClose = () => {
    setIsPopupOpen(false);
  };

  // to edit discount offer
  const editDiscount = (id) => {
    const selectedDiscount = data.find((item) => {
      return item.discountId === id;
    });

    // discount details get from sqlite databse by id
    // discountApi?.discountDB?.getDiscountDetailsById(1696231342579)

    setshow(true);
    setIsEdit(true);
    seteditData(selectedDiscount);
  };

  // for add new discount coupan
  const handleAddDiscount = () => {
    seteditData(null);
    setshow(true);
    setIsEdit(false);
  };

  //discount delete successfully popup
  const discountCreationSuccess = () => {
    setshow(false);
    showPopupHandleClick(
      setIsPopupOpen,
      3000,
      setApiError,
      navigate,
      "/Discount"
    ); //for popUp msg
    console.log("discountsSuccessfullyAdded");
  };

  // to delete discount
  const HandleDelete = async (id) => {
    const selectDelete = data.find((item) => {
      return item.discountId === id;
    });

    const deleteData = {
      discountName: selectDelete.discountName,
      discountVal: selectDelete.discountVal,
      discountId: selectDelete.discountId,
      isDeleted: 1,
      endDate: selectDelete?.endDate,
      isPercent: selectDelete?.isPercent,
      isSync: selectDelete?.isSync,
      lastUpdate: selectDelete?.lastUpdate,
      startDate: selectDelete?.startDate,
      storeId: selectDelete?.storeId,
    };

    if (isOnline) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(
            deleteDiscount(deleteData, discountCreationSuccess, setPopUpMessage)
          );
          // axios
          //   .post(`${SERVER_URL}${UPSERT_DISCOUNT}`, deleteData, {
          //     headers: { Authorization: `Bearer ${userToken} ` },
          //   })
          //   .then(({ data }) => {
          //     console.log(data);
          //     dispatch(getDiscountlist(pageNumber, pageSizeForPag, ""));
          //     // fetchApi();
          //   });
        }
      });
    } else {
      // discount delete from sqlite databse by id
      const result = discountApi?.discountDB?.updateDiscountById(deleteData);
      const discountList = discountApi?.discountDB?.getAllDiscounts();
      setdata(discountList);
    }
  };

  // handle for remove discount from product
  const removeDisFromProHandler = (item) => {
    // for show the popupMessege for upgrade plan
    if (isLicenseValidate?.licensePlan === "dummy") { // TODO change dummy with free 
      Swal.fire({
        title: "Access Denied",
        html: "<span style='color: white'>Upgrade to unlock this feature</span>",
        iconHtml: `<img src="${RocketImage}" width="100" height="100">`,
        confirmButtonText: "Upgrade Plan",
        showCloseButton: true,
        closeButtonHtml: '<span style="color:#ffffffb5;">&times;</span>',
        customClass: {
          icon: "no-border",
          confirmButton: "custom-button-class",
          popup: "custom-popup-class",
          title: "title-color",
        },
        confirmButtonColor: "",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          handleUpgrade();
        }
      });
    } else {
      // setShowRemoveMappedModal(true);
      // setSelectedDiscount(item);
      navigate("/Discount/apply-discount-on-products", { state: { discount: item, isDiscountMapped: true } })
    }
  };

  // handle for apply discount on product
  const appyDisOnProHandler = (item) => {

    // for show the popupMessege for upgrade plan
    if (isLicenseValidate?.licensePlan === "dummy") { // TODO change dummy with free 
      Swal.fire({
        title: "Access Denied",
        html: "<span style='color: white'>Upgrade to unlock this feature</span>",
        iconHtml: `<img src="${RocketImage}" width="100" height="100">`,
        confirmButtonText: "Upgrade Plan",
        showCloseButton: true,
        closeButtonHtml: '<span style="color:#ffffffb5;">&times;</span>',
        customClass: {
          icon: "no-border",
          confirmButton: "custom-button-class",
          popup: "custom-popup-class",
          title: "title-color",
        },
        confirmButtonColor: "",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          handleUpgrade();
        }
      });
    } else {
      // setShowApplyMappedModal(true);
      // setSelectedDiscount(item);
      navigate("/Discount/apply-discount-on-products", { state: { discount: item, isDiscountMapped: false } })
    }
  };

  // for open subscription modal
  const handleUpgrade = () => {
    setModalOpen(true);
  };

  // Function to handle search input change
  const serachHander = debounce((e) => {
    const inputText = e.target.value;
    setsearch(inputText);
    dispatch(getDiscountlist(pageNumber, pageSizeForPag, inputText, ""));
  }, 1000);

  const paginationHandler = (e, p) => {
    console.log("paginationHandler... ", e, p);
    if (isOnline) {
      dispatch(getDiscountlist(p, pageSizeForPag, "", ""));
    } else {
      const discountList = discountApi?.discountDB?.getAllDiscounts();
      setdata(discountList);
    }
    setPageNumber(p);
  };



  return (
    <MainContentArea>

      <div className="main-container">
        <div className="table-cartbox">
          <div>
            <ReloadButton
              isReloading={isReloading}
              reloadHandler={() =>
                handleReload(
                  isReloading,
                  setIsReloading,
                  () => dispatch(getDiscountlist(pageNumber, pageSizeForPag, "", ""))
                )
              }
            />
          </div>
          <div className="header-container">
            <div className="table-heading">
              <h3>{t("DiscountDetails.discountTableHeading")}</h3>
            </div>
            <div className="search-container">
              <input
                type="search"
                className="form-control"
                placeholder={t("DiscountDetails.SearchDiscountName")}
                aria-label="Search"
                onChange={serachHander}
              />
              <BiSearch className="searchIcon" />
            </div>

            {
              <RemoveDiscountModal
                isModelVisible={showRemoveMappedModal}
                selectedDiscount={selectedDiscount}
                setshow={setShowRemoveMappedModal}
              />
            }

            <div>
              <Button
                variant="contained"
                style={{
                  backgroundColor: "var(--button-bg-color)",
                  color: "var(--button-color)",
                  // marginTop: 5,
                }}
                onClick={handleAddDiscount}
              >
                {t("DiscountDetails.createCoupon")}
              </Button>
            </div>
          </div>

          {
            <ApplyDiscountModal
              isModelVisible={showApplyMappedModal}
              selectedDiscount={selectedDiscount}
              setshow={setShowApplyMappedModal}
            />
          }
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="row">
              {data && data.length > 0 ? (
                // <div className="card cardradius">
                <div className="pt-0 my-3 card-body">
                  <table className="table table-borderless table-hover">
                    <thead className="table-secondary sticky-top">
                      <tr>
                        <th
                          onClick={() =>
                            setdata(
                              sortTableDataHandler(data, sortOrder, setSortOrder)
                            )
                          }
                          className="Name-cursor"
                        >
                          {t("DiscountDetails.discount")}
                          {getSortArrow(sortOrder)}
                        </th>
                        <th>{t("DiscountDetails.startDate")}</th>
                        <th>{t("DiscountDetails.endDate")}</th>
                        <th>{t("DiscountDetails.Expire")}</th>
                        <th>{t("DiscountDetails.removeDiscountFromProduct")}</th>
                        <th>{t("DiscountDetails.applyDiscountOnProduct")}</th>
                        <th>{t("DiscountDetails.edit")}</th>
                        <th>{t("DiscountDetails.delete")}</th>
                      </tr>
                    </thead>
                    {data
                      ?.filter((item) => {
                        if (search === "") {
                          return item;
                        } else if (
                          item.discountName.toLowerCase().includes(search)
                        ) {
                          return item;
                        }
                      })
                      ?.map((item, index) => (
                        <tbody key={index}>
                          <tr key={index}>
                            <td>
                              {item?.discountName}
                              <br />
                              {item?.isPercent ? (
                                <p>{item?.discountVal}%</p>
                              ) : (
                                <p>
                                  {defaultLanguage === "ar" ||
                                    defaultLanguage === "عربي" ? (
                                    <td>
                                      {item?.discountVal}
                                      {CurrencySymbol}
                                    </td>
                                  ) : (
                                    <td>
                                      {CurrencySymbol}
                                      {item?.discountVal}
                                    </td>
                                  )}
                                </p>
                              )}
                            </td>
                            <td>
                              {item?.startDate &&
                                moment(item?.startDate).format("DD/MM/YYYY")}
                            </td>
                            <td>
                              {item?.endDate &&
                                moment(item?.endDate).format("DD/MM/YYYY")}
                            </td>
                            <td>
                              {item?.isExpire === true ? (
                                <span className="text-danger">{t("AllProduct.expired")}</span>
                              ) : (
                                <span className="text-success">{t("AllProduct.valid")}</span>
                              )}
                            </td>
                            <td>
                              <div>
                                {/* <Link
                                style={{ color: "var(--light-blue-color" }}
                                onClick={() => removeDisFromProHandler(item)}
                              >
                                {t("DiscountDetails.removeDiscountFromProduct")}
                              </Link> */}
                                <span style={{ color: "var(--light-blue-color", cursor: "pointer" }}
                                  onClick={() => removeDisFromProHandler(item)}>
                                  {t("DiscountDetails.removeDiscountFromProduct")}
                                </span>
                              </div>
                            </td>
                            <td>
                              <div>
                                {/* <Link
                                style={{ color: "var(--light-blue-color" }}
                                onClick={() => appyDisOnProHandler(item)}
                              >
                                {t("DiscountDetails.applyDiscountOnProduct")}
                              </Link> */}
                                <span style={{ color: "var(--light-blue-color", cursor: "pointer" }}
                                  onClick={() => appyDisOnProHandler(item)}>
                                  {t("DiscountDetails.applyDiscountOnProduct")}
                                </span>
                              </div>
                            </td>

                            <td>
                              <button
                                className="btn text-Color"
                                onClick={() => editDiscount(item?.discountId)}
                              >
                                <CiEdit size={25} />
                              </button>
                            </td>
                            <td>
                              <button
                                className="btn text-Color"
                                onClick={() => HandleDelete(item?.discountId)}
                              >
                                <RiDeleteBin5Line size={25} />
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      ))}
                  </table>
                </div>
              ) : (
                // </div>
                <NoOnlineOrderItem orderStatus={"Discount Data"} />
              )}
            </div>
          )}
          {console.log("totalDiscount ", getDiscount?.totalDiscount / 5)}

          {isOnline && getDiscount?.totalDiscount > 0 && (
            <Pagination
              count={Math.ceil(getDiscount?.totalDiscount / 5)}
              // color="primary"
              onChange={paginationHandler}
            />
          )}
        </div>
      </div>

      {show && (
        <ErrorBoundary>
          <DiscountModal
            // fetchApi={fetchApi}
            isModelVisible={show}
            isEdit={isEdit}
            discountData={editData}
            setshow={setshow}
            setDiscountPostRes={setDiscountPostRes}
            discountCreationSuccess={discountCreationSuccess}
            setPopUpMessage={setPopUpMessage}
            popUpMessage={popUpMessage}
            setIsPopupOpen={setIsPopupOpen}
            setApiError={setApiError}
            setPriceModalOpen={setPriceModalOpen}
            priceModalOpen={priceModalOpen}

          />
        </ErrorBoundary>
      )}

      <AlertpopUP
        open={isPopupOpen}
        message={
          apiError?.length > 0 ? apiError : popUpMessage
          // "Discount deleted successfully!"
        }
        severity={apiError?.length > 0 ? "error" : "success"}
        onClose={handleClose}
      />

      <SubscriptionPlanModal
        isModelVisible={priceModalOpen}
        setShow={setPriceModalOpen}
      />
    </MainContentArea>
  );
};
export default Discount;
