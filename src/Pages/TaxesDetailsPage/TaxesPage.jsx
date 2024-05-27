import axios from "axios";
import React, { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin5Line } from "react-icons/ri";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";
import {
  GET_TAX,
  GET_TAX_MAPPING,
  getUTCDate,
  pageSizeForPag,
  retrieveObj,
  SERVER_URL,
  UPSERT_TAX,
} from "../../Containts/Values";
import MainContentArea from "../MainContentArea/MainContentArea";
import TaxModal from "./TaxModel";
import Swal from "sweetalert2";
import "./TaxesDetailsPage.css";
import { Link, useNavigate } from "react-router-dom";
import TaxMapping from "./TaxMapping";
import NoOnlineOrderItem from "../../Components/OnlineOrders/NoOnlineOrderItem/NoOnlineOrderItem";
import { useDispatch, useSelector } from "react-redux";
import {
  addTax,
  deleteTax,
  getTaxList,
  getTaxMappedList,
} from "../../Redux/Tax/taxSlice";
import AppyTaxMapping from "./AppyTaxMapping";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";
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
import { BiSearch } from "react-icons/bi";
import { TiArrowSortedDown } from "react-icons/ti";
import Pagination from "@mui/material/Pagination";
import debounce from "lodash/debounce";
import SubscriptionPlanModal from "../../Components/TrialInformationCard/SubscriptionPlanModal";
import CachedIcon from '@mui/icons-material/Cached';
import ReloadButton from "../../Components/ReloadButton/ReloadButton";

let userToken = localStorage.getItem("userToken");

const Taxes = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const taxApi = window.taxApi;
  const mappedTaxApi = window.mappedTaxApi;
  const getTaxdata = useSelector((state) => state.tax.taxData);
  const isLoaded = useSelector((state) => state.tax.loading);

  const mappedTaxList = useSelector((state) => state.tax.mappedTaxList);
  const productData = useSelector((state) => state.product.productData);
  console.log("productDataDASH... ", productData);

  const [show, setshow] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editData, seteditData] = useState({});
  const [search, setsearch] = useState([]);
  const [data, setdata] = useState([]);
  const [searchProduct, setSearchProduct] = useState([]);
  console.log("data", data);
  const [taxMap, settaxMap] = useState([]);
  const isLoading = useSelector((state) => state.tax.loading);

  const [visibleApplyModal, setvisibleApplyModal] = useState(false);
  const [showAppyTaxToast, setshowAppyTaxToast] = useState(false);
  const [applyTaxData, setapplyTaxData] = useState({});
  const [taxMappedProducts, settaxMappedProducts] = useState([]);
  const isOnline = useSelector((state) => state.checkInternet.isOnline);
  const [TaxPostRes, setTaxPostRes] = useState({});
  const [mappedTaxDataList, setMappedTaxDataList] = useState([]);
  const [priceModalOpen, setPriceModalOpen] = useState(false)

  // State variables for infiniteScroll
  const [taxList, setTaxList] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // for popup
  const [apiError, setApiError] = useState("");
  const [sortOrder, setSortOrder] = useState("descending");
  const [popUpMessage, setPopUpMessage] = useState("");
  const [isReloading, setIsReloading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  console.log("pageNumber..", pageNumber);

  console.log("apiError", apiError);

  // apiError state empty after 3 second
  // and user redirect to /tax page
  useEffect(() => {
    if (apiError?.length > 0) {
      showPopupHandleClick(setIsPopupOpen, 3000, setApiError); //for popUp msg
    }
    // console.log("popUpMessage...tax ", popUpMessage)
  }, [apiError?.length > 0]);

  const handleClose = () => {
    setIsPopupOpen(false);
  };

  // after tax api call tax data store into data state
  useEffect(() => {
    mappedTaxList?.length > 0 && setMappedTaxDataList(mappedTaxList);
    getTaxdata?.tax?.length > 0 && setdata(getTaxdata?.tax);
  }, [getTaxdata?.tax, mappedTaxList]);

  useEffect(() => {
    if (isOnline) {
      dispatch(getTaxMappedList());
    } else {
      const mappedTaxData = mappedTaxApi?.mappedTaxDB?.getMappedTaxList();
      mappedTaxData && setMappedTaxDataList(mappedTaxData);
    }
  }, [isOnline]);

  // here we call tax api
  useEffect(() => {
    if (isOnline) {
      dispatch(getTaxList(pageNumber, pageSizeForPag, ""));
    } else {
      const taxList = taxApi?.taxDB?.getAllTaxes();
      console.log("taxList... ", taxList)
      setdata(taxList);
    }
  }, [isOnline, TaxPostRes]);

  // useEffect(() => {
  //   // setdata(getTaxdata);
  //   data && setTaxList(data?.slice(0, 5));
  // }, [data]);

  // useEffect(() => {
  //   const responseTimeOut = setTimeout(() => {
  //     setTaxPostRes({})
  //   }, 2000);

  //   return () => {
  //     clearTimeout(responseTimeOut)
  //   }
  // },[TaxPostRes])

  // Filter tax array with product id
  // in the product isCheck property added with true value
  // no use case for now
  useEffect(() => {
    let taxMappedProduct = [];
    let selectedTax = [];
    mappedTaxDataList &&
      mappedTaxDataList?.filter((taxItem) => {
        if (taxItem?.taxId === applyTaxData.taxId) {
          selectedTax.push(taxItem);
        }
      });

    selectedTax &&
      selectedTax?.map((taxItem) => {
        productData?.product &&
          productData?.product?.map((prodItem) => {
            if (taxItem?.productId === prodItem?.productId) {
              let newObj = {
                ...prodItem,
                isCheck: true,
                taxId: taxItem?.taxId,
                storeId: taxItem?.storeId,
              };
              taxMappedProduct.push(newObj);
            }
          });
      });
    settaxMappedProducts(taxMappedProduct);
  }, [mappedTaxDataList, productData?.product]);

  const editTax = (id) => {
    const selectedData = data.find((item) => {
      return item.taxId === id;
    });

    // get sqlite database tax details by id
    // taxApi?.taxDB?.getTaxDetailsById(parseInt(1696055523989))

    setshow(true);
    setIsEdit(true);
    seteditData(selectedData);
  };

  // to open add tax modal
  const handleAddTax = () => {
    seteditData(null);
    setshow(true);
    setIsEdit(false);
  };

  //tax delete successfully popup
  const taxCreationSuccess = () => {
    showPopupHandleClick(setIsPopupOpen, 3000, setApiError, navigate, "/Taxes"); //for popUp msg
    // console.log("tax deleted success");
  };

  // for delete tax
  const HandleDelete = async (id) => {
    const selectDelete = data.find((item) => item.taxId === id);
    const findMap = mappedTaxDataList.find((item) => item.taxId === id);
    console.log("selectDelete",selectDelete);
    console.log("findMap... ", findMap);
    const deleteData = {
      taxName: selectDelete.taxName,
      taxValue: selectDelete.taxValue,
      taxId: selectDelete.taxId,
      isDeleted: 1,
      isSync: selectDelete?.isSync,
      storeId: selectDelete?.storeId,
      lastUpdate: getUTCDate(),
    };

    if (isOnline) {
      if (findMap?.taxId) {
        Swal.fire({
          title: "Please remove this tax from asign product then try again",
          confirmButtonColor: "#3085d6",
        });
      } else {
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
              deleteTax(deleteData, taxCreationSuccess, setPopUpMessage)
            );
            // axios
            //   .post(`${SERVER_URL}${UPSERT_TAX}`, deleteData, {
            //     headers: { Authorization: `Bearer ${userToken} ` },
            //   })
            //   .then(({ data }) => {
            //     // console.log(data);
            //     dispatch(getTaxList(pageNumber, pageSizeForPag, ""));
            //   });
          }
        });
      }
    } else {
      if (findMap?.taxId) {
        Swal.fire({
          title: "Please remove this tax from asign product then try again",
          confirmButtonColor: "#3085d6",
        });
      } else {
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!",
        }).then((result) => {
          if (result.isConfirmed) {
            // tax delete from sqlite database
            const result = taxApi?.taxDB?.deleteTaxById(deleteData?.taxId); // it's hard delete
            const taxList = taxApi?.taxDB?.getAllTaxes();
            setdata(taxList);
          }
        });
      }
    }
  };

  // Function to handle search input change
  const serachHander = debounce((e) => {
    const inputText = e.target.value;
    setsearch(inputText);
    dispatch(getTaxList(pageNumber, pageSizeForPag, inputText));
  }, 1000);

  const paginationHandler = (e, p) => {
    console.log("paginationHandler... ", e, p);
    if (isOnline) {
      dispatch(getTaxList(p, pageSizeForPag, ""));
    } else {
      const taxList = taxApi?.taxDB?.getAllTaxes();
      setdata(taxList);
    }
    setPageNumber(p);
  };

  // to open remove tax modal
  // const handleApply = (id) => {
  //   const selectToApply = data.find((item) => item.taxId === id);
  //   setvisibleApplyModal(true);
  //   setapplyTaxData(selectToApply);
  // };

  const removeTaxOnProductHanlder = (taxItem) => {
    // const selectToApply = data.find((item) => item.taxId === id);
    // setvisibleApplyModal(true);
    // setapplyTaxData(selectToApply);
    navigate("/Taxes/apply-tax-on-products", { state: { tax: taxItem, isTaxMapped: true } })
  }

  //  to open tax apply modal
  const appyTaxOnProductHandler = (taxItem) => {
    navigate("/Taxes/apply-tax-on-products", { state: { tax: taxItem, isTaxMapped: false } })
    // setapplyTaxData(taxItem);
    // setshowAppyTaxToast(true);
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
                  () => dispatch(getTaxList(pageNumber, pageSizeForPag, "", ""))
                )
              }
            />
          </div>
          <div className="header-container">
            <div className="table-heading">
              <h3>{t("TaxDetails.taxTableHeading")}</h3>
            </div>
            <div className="search-container">
              <input
                type="Search"
                className="form-control"
                placeholder={t("TaxDetails.searchTaxName")}
                aria-label="Search"
                onChange={serachHander}
              />
              <BiSearch className="searchIcon" />
            </div>

            {/* tax remove from product */}
            {visibleApplyModal && (
              <TaxMapping
                isModelVisible={visibleApplyModal}
                applyTax={applyTaxData}
                setshow={setvisibleApplyModal}
                mapData={taxMap}
                getTaxMappedList={getTaxMappedList}
              />
            )}
            {/* tax apply on product */}
            {showAppyTaxToast && (
              <AppyTaxMapping
                isModelVisible={showAppyTaxToast}
                applyTaxItem={applyTaxData}
                setshowApplyToast={setshowAppyTaxToast}
              />
            )}

            <div>
              <Stack spacing={2} direction="row">
                <Button
                  variant="contained"
                  onClick={handleAddTax}
                  style={{
                    backgroundColor: "var(--button-bg-color)",
                    color: "var(--button-color)",
                  }}
                >
                  {t("TaxDetails.addTax")}
                </Button>
              </Stack>
            </div>
          </div>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="row">
              {data && data[0] !== undefined ? (
                // <div className="card cardradius">
                <div className="card-body my-3 pt-0">
                  <table className="table table-hover table-borderless ">
                    <thead className="table-secondary top-sticky">
                      <tr>
                        <th
                          onClick={() =>
                            setdata(
                              sortTableDataHandler(data, sortOrder, setSortOrder)
                            )
                          }
                          className="Name-cursor"
                        >
                          {t("TaxDetails.taxes")}
                          {getSortArrow(sortOrder)}
                        </th>
                        <th>{t("TaxDetails.values")}</th>
                        <th>{t("TaxDetails.removeTax")}</th>
                        <th>{t("TaxDetails.applyTax")}</th>
                        <th>{t("TaxDetails.edit")}</th>
                        <th>{t("TaxDetails.delete")}</th>
                      </tr>
                    </thead>

                    {data
                      ?.filter((item) =>
                        item.taxName.toLowerCase().includes(search)
                      )
                      ?.map((taxItem, index) => (
                        <tbody key={index}>
                          <tr>
                            <td>
                              <div>{taxItem?.taxName}</div>
                            </td>
                            <td>
                              <div>{taxItem?.taxValue}%</div>
                            </td>
                            <td>
                              <div>
                                {/* <Link
                                style={{ color: "var(--light-blue-color" }}
                                onClick={() => removeTaxOnProductHanlder(taxItem)}
                              >
                                {t("TaxDetails.removeTaxFromProduct")}
                              </Link> */}
                                <span style={{ color: "var(--light-blue-color", cursor: "pointer" }}
                                  onClick={() => removeTaxOnProductHanlder(taxItem)}>
                                  {t("TaxDetails.removeTaxFromProduct")}
                                </span>
                              </div>
                            </td>
                            <td>
                              <div>
                                {/* <Link
                                style={{ color: "var(--light-blue-color" }}
                                onClick={() => appyTaxOnProductHandler(taxItem)}
                              >
                                {t("TaxDetails.applyTaxOnProduct")}
                              </Link> */}
                                <span style={{ color: "var(--light-blue-color", cursor: "pointer" }}
                                  onClick={() => appyTaxOnProductHandler(taxItem)}>
                                  {t("TaxDetails.applyTaxOnProduct")}
                                </span>
                              </div>
                            </td>
                            <td>
                              <div>
                                <button
                                  className="btn text-Color"
                                  onClick={() => editTax(taxItem?.taxId)}
                                >
                                  <CiEdit size={25} />
                                </button>
                              </div>
                            </td>
                            <td>
                              <div>
                                <button
                                  className="btn text-Color"
                                  onClick={() => HandleDelete(taxItem?.taxId)}
                                >
                                  <RiDeleteBin5Line size={25} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      ))}
                  </table>
                </div>
              ) : (
                // </div>
                <NoOnlineOrderItem orderStatus={"Tax Data"} />
              )}
            </div>
          )}
          {isOnline && getTaxdata?.totalTax > 0 && (
            <Pagination
              count={Math.ceil(getTaxdata?.totalTax / 5)}
              // color="primary"
              onChange={paginationHandler}
            />
          )}

        </div>
      </div>

      {show && (
        <ErrorBoundary>
          <TaxModal
            isModelVisible={show}
            isEdit={isEdit}
            taxData={editData}
            setshow={setshow}
            setTaxPostRes={setTaxPostRes}
            taxCreationSuccess={taxCreationSuccess}
            setPopUpMessage={setPopUpMessage}
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
          // "Tax deleted successfully!"
        }
        severity={apiError?.length > 0 ? "error" : "success"}
        onClose={handleClose}
      />

      <SubscriptionPlanModal
        isModelVisible={priceModalOpen}
        setShow={setPriceModalOpen} />
    </MainContentArea>
  );
};
export default Taxes;
