import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";
import NoOnlineOrderItem from "../../Components/OnlineOrders/NoOnlineOrderItem/NoOnlineOrderItem";
import {
  GET_BRAND,
  SERVER_URL,
  UPSERT_BRAND,
  pageSizeForPag,
} from "../../Containts/Values";
import {
  addBrand,
  deleteBrand,
  getBrandList,
  syncBrandData,
} from "../../Redux/Brand/brandSlice";
import MainContentArea from "../MainContentArea/MainContentArea";
import BrandModal from "./BrandModal";
import "./BrandPage.css";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import AlertpopUP from "../../utils/AlertPopUP";
import {
  apiFailureResponse,
  debounceSearch,
  getSortArrow,
  handleReload,
  showPopupHandleClick,
  sortTableDataHandler,
} from "../../utils/constantFunctions";
import { useNavigate } from "react-router-dom";
import ErrorBoundary from "../../Components/ErrorBoundary/ErrorBoundary";
import { Button } from "@mui/material";
import { getBrandNotSyncList } from "../../utils/constantFunctions";
import { BiSearch } from "react-icons/bi";
import { TiArrowSortedDown } from "react-icons/ti";
import Pagination from "@mui/material/Pagination";
import debounce from "lodash/debounce";
import SubscriptionPlanModal from "../../Components/TrialInformationCard/SubscriptionPlanModal";
import CachedIcon from '@mui/icons-material/Cached';
import ReloadButton from "../../Components/ReloadButton/ReloadButton";
import { IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';


let userToken = localStorage.getItem("userToken");
const Brands = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const brandApi = window.brandApi;
  const isOnline = useSelector((state) => state.checkInternet.isOnline);
  const brandData = useSelector((state) => state.brand.brandData);
  const isLoading = useSelector((state) => state.brand.brandLoading);
  console.log("isLoading..brand", isLoading);
  const [show, setshow] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editData, seteditData] = useState({});
  console.log("editData... ", editData);
  const [search, setsearch] = useState([]);
  const [data, setdata] = useState([]);
  const [brandPostRes, setBrandPostRes] = useState({});
  console.log("brandPostRes.. ", brandData);
  console.log("brandData", data);
  const [popUpMessage, setPopUpMessage] = useState("");
  const [priceModalOpen, setPriceModalOpen] = useState(false)
  console.log("priceModalOpen... ", priceModalOpen)
  const [isReloading, setIsReloading] = useState(false);

  // const [anchorEl, setAnchorEl] = useState(null);

  // State variables for infiniteScroll
  const [brandList, setBrandList] = useState([]);
  console.log("brandList", brandList);

  const [isPopupOpen, setIsPopupOpen] = useState(false); // for popup
  const [apiError, setApiError] = useState("");
  console.log("apiError", apiError);
  const [sortOrder, setSortOrder] = useState("descending");
  console.log("sortOrder ", sortOrder);
  const [pageNumber, setPageNumber] = useState(1);
  console.log("pageCount... ", pageNumber);
  // apiError state empty after 3 second
  // and user redirect to /brand page
  useEffect(() => {
    if (apiError?.length > 0) {
      showPopupHandleClick(setIsPopupOpen, 3000, setApiError); //for popUp msg
    }
    console.log("popUpMessage...brand ", popUpMessage);
  }, [apiError?.length > 0, popUpMessage]);

  const handleClose = () => {
    setIsPopupOpen(false);
  };

  // here we store brand api list data in state
  useEffect(() => {
    brandData?.brand?.length > 0 && setdata(brandData?.brand);
  }, [brandData?.brand]);

  // here we call brand list api
  useEffect(() => {
    // fetchApi();
    if (isOnline) {
      dispatch(getBrandList(pageNumber, pageSizeForPag, ""));
    } else {
      const brandList = brandApi?.brandDB?.getBrands();
      setdata(brandList);
    }
  }, [isOnline, brandPostRes]);

  useEffect(() => {
    data && setBrandList(data?.slice(0, 5));
  }, [data]);

  const synchBrand = () => {
    const brandNotSyncList = getBrandNotSyncList();
    console.log("brandNotSyncList... ", brandNotSyncList);

    brandNotSyncList?.length > 0 && dispatch(syncBrandData(brandNotSyncList));
  };
  // for open edit brand modal
  const editBrand = (id) => {
    const selectedBrand = data.find((item) => {
      return item.brandId === id;
    });

    setshow(true);
    seteditData(selectedBrand);
    setIsEdit(true);
  };

  // for open add brand modal
  const handleAddBrand = () => {
    seteditData(null);
    setshow(true);
    setIsEdit(false);
  };

  //brand delete successfully popup
  const brandCreationSuccess = () => {
    setshow(false);
    showPopupHandleClick(
      setIsPopupOpen,
      3000,
      setApiError,
      navigate,
      "/Brands"
    ); //for popUp msg
  };

  // for delete brand
  const HandleDelete = async (id) => {
    const selectDelete = data.find((item) => {
      return item.brandId === id;
    });

    const deleteData = {
      brandName: selectDelete?.brandName,
      brandId: selectDelete?.brandId,
      storeId: selectDelete?.storeId,
      isDeleted: 1,
      lastUpdate: selectDelete?.lastUpdate,
      isSync: selectDelete?.isSync,
    };

    if (isOnline) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        // icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(
            deleteBrand(deleteData, brandCreationSuccess, setPopUpMessage)
          );
          // axios
          //   .post(`${SERVER_URL}${UPSERT_BRAND}`, deleteData, {
          //     headers: { Authorization: `Bearer ${userToken} ` },
          //   })
          //   .then(({ data }) => {
          //     console.log(data);
          //     // fetchApi();
          //     dispatch(getBrandList(pageNumber, pageSizeForPag, ""));
          //   });
        }
      });
    } else {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        // icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          // it's sqlite method
          const result = brandApi?.brandDB?.updateBrandById(deleteData);
          const brandList = brandApi?.brandDB?.getBrands();
          setdata(brandList);
        }
      });
    }
  };



  // Function to handle search input change
  const serachHander = debounce((e) => {
    const inputText = e.target.value;
    setsearch(inputText);
    dispatch(getBrandList(pageNumber, pageSizeForPag, inputText));
  }, 1000);

  const paginationHandler = (e, p) => {
    console.log("paginationHandler... ", e, p);
    if (isOnline) {
      dispatch(getBrandList(p, pageSizeForPag, ""));
    } else {
      const brandList = brandApi?.brandDB?.getBrands();
      setdata(brandList);
    }
    setPageNumber(p);
  };


  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClosebtn = () => {
    setAnchorEl(null);
  };

  // console.log(sortTableDataHandler(data, "ascending", setSortOrder));

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
                  () => dispatch(getBrandList(pageNumber, pageSizeForPag, "", ""))
                )
              }
            />
          </div>
          <div className="header-container">
            <div className="table-heading">
              <h3>{t("BrandDetails.brandList")}</h3>
            </div>
            <div className="search-container">
              <input
                type="Search"
                className="form-control"
                placeholder={t("BrandDetails.searchBrandName")}
                aria-label="Search"
                onChange={serachHander}
              />
              <BiSearch className="searchIcon" />
            </div>

            {/* {show && (
              <ErrorBoundary>
              <BrandModal
                // fetchApi={fetchApi}
                isModelVisible={show}
                brandData={editData}
                setshow={setshow}
                setBrandPostRes={setBrandPostRes}
              />
              </ErrorBoundary>
            )} */}

            {/* <div>
              <button
                className="btn btn-primary "
                onClick={handleAddBrand}
                style={{
                  backgroundColor: "var(--button-bg-color)",
                  color: "var(--button-color)",
                  fontsize: " 22px",
                }}
              >
                {t("brandDetails.AddBrands")}
              </button>
            </div> */}
            <div className="d-flex align-items-center" style={{ gap: "10px" }}>
              <Button
                variant="contained"
                style={{
                  backgroundColor: "var(--button-bg-color)",
                  color: "var(--button-color)",
                }}
                onClick={handleAddBrand}
              >
                {t("BrandDetails.addBrands")}
              </Button>

              {/* <CachedIcon
                  style={{
                    color: "var(--text-color)",
                    cursor: "pointer",
                  }}
                  onClick={handleReload}
                /> */}

            </div>
          </div>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="row">
              {data && data?.length > 0 ? (
                // <div className="card cardradius">
                <div className="card-body my-3 pt-0">
                  <table className="table table-hover table-borderless">
                    <thead className="table-secondary sticky-top">
                      <tr>
                        <th
                          className="col-10 Name-cursor"
                          onClick={() =>
                            setdata(
                              sortTableDataHandler(
                                data,
                                sortOrder,
                                setSortOrder
                              )
                            )
                          }
                        >
                          {t("BrandDetails.brand")}
                          {getSortArrow(sortOrder)}
                        </th>
                        <th className="col-1">{t("BrandDetails.edit")}</th>
                        <th className="col-1">{t("BrandDetails.delete")}</th>
                      </tr>
                    </thead>

                    {data
                      ?.filter((item) =>
                        item.brandName.toLowerCase().includes(search)
                      )
                      ?.map(({ brandName, imageUrl, brandId }, index) => (
                        <tbody key={index}>
                          <tr>
                            <td>
                              {imageUrl ? (
                                <img
                                  src={imageUrl}
                                  alt="brand image"
                                  width="50"
                                  height="50"
                                  className="cursor-pointer"
                                />
                              ) : (
                                <img
                                  src={"Images/default-image.png"}
                                  alt="brand image"
                                  width="50"
                                  height="50"
                                  className="cursor-pointer"
                                />
                              )}

                              <span style={{ marginLeft: "10px" }}>
                                {brandName}
                              </span>
                            </td>

                            <td>
                              <button
                                className="btn text-Color"
                                onClick={() => editBrand(brandId)}
                              >
                                <CiEdit size={25} />
                              </button>
                            </td>
                            <td>
                              <button
                                className="btn text-Color"
                                onClick={() => HandleDelete(brandId)}
                              >
                                <RiDeleteBin5Line size={25} />
                              </button>
                            </td>

                            {/* <td>
                              <IconButton onClick={handleClick}>
                                <MoreVertIcon />
                              </IconButton>
                              <Menu
                                anchorEl={anchorEl}
                                id="account-menu"
                                open={open}
                                onClose={handleClosebtn}
                                onClick={handleClosebtn} >
                                <MenuItem onClick={() => editBrand(brandId)}>Edit</MenuItem>
                                <MenuItem onClick={() => HandleDelete(brandId)}>Delete</MenuItem>
                              </Menu>
                            </td> */}

                          </tr>
                        </tbody>
                      ))}
                  </table>
                </div>
              ) : (
                // </div>
                <NoOnlineOrderItem orderStatus={"Brand Data"} />
              )}
            </div>
          )}
          {console.log("totalBrand ", brandData?.totalBrand / 5)}

          {isOnline && brandData?.totalBrand > 0 && (
            <Pagination
              count={Math.ceil(brandData?.totalBrand / 5)}
              // color="primary"
              onChange={paginationHandler}
            />
          )}
        </div>
      </div >

      {show && (
        <ErrorBoundary>
          <BrandModal
            isModelVisible={show}
            brandData={editData}
            isEdit={isEdit}
            setshow={setshow}
            setBrandPostRes={setBrandPostRes}
            brandCreationSuccess={brandCreationSuccess}
            setPopUpMessage={setPopUpMessage}
            setIsPopupOpen={setIsPopupOpen}
            setApiError={setApiError}
            popUpMessage={popUpMessage}
            priceModalOpen={priceModalOpen}
            setPriceModalOpen={setPriceModalOpen}

          />
        </ErrorBoundary>
      )}

      <AlertpopUP
        open={isPopupOpen}
        message={
          apiError?.length > 0 ? apiError : popUpMessage
          // "Brand deleted successfully!"
        }
        severity={apiError?.length > 0 ? "error" : "success"}
        onClose={handleClose}
      />
      <SubscriptionPlanModal
        isModelVisible={priceModalOpen}
        setShow={setPriceModalOpen}
      />
    </MainContentArea >
  );
};
export default Brands;
