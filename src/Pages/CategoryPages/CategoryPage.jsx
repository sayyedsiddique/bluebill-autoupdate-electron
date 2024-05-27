import axios from "axios";
import React, { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";
import NoOnlineOrderItem from "../../Components/OnlineOrders/NoOnlineOrderItem/NoOnlineOrderItem";
import {
  GET_CATEGORY,
  SERVER_URL,
  STORE_Id,
  UPSERT_CATEGORY,
  pageSizeForPag,
} from "../../Containts/Values";
import {
  addCategory,
  deleteCategory,
  getCategoryList,
} from "../../Redux/Category/categorySlice";
import MainContentArea from "../MainContentArea/MainContentArea";
import CategoryModal from "./CategoryModal";
import "./CategoryPage.css";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import ErrorBoundary from "../../Components/ErrorBoundary/ErrorBoundary";
import { BiSearch } from "react-icons/bi";
import { TiArrowSortedDown } from "react-icons/ti";
import {
  getSortArrow,
  handleReload,
  showPopupHandleClick,
  sortTableDataHandler,
} from "../../utils/constantFunctions";
import AlertpopUP from "../../utils/AlertPopUP";
import { useNavigate } from "react-router-dom";
import DragAndDropPureHtml from "../../Components/DragandDrop/DragAndDropPureHtml";
import debounce from "lodash/debounce";
import Pagination from "@mui/material/Pagination";
import SubscriptionPlanModal from "../../Components/TrialInformationCard/SubscriptionPlanModal";
import CachedIcon from '@mui/icons-material/Cached';
import ReloadButton from "../../Components/ReloadButton/ReloadButton";

let userToken = localStorage.getItem("userToken");

const Category = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const categoryApi = window.categoryApi;
  const isOnline = useSelector((state) => state.checkInternet.isOnline);
  console.log("isOnline... ", isOnline)
  const categoriesData = useSelector((state) => state.category.categoriesData);
  const isLoading = useSelector((state) => state.category.loading);
  const [StoreId, setStoreId] = useState("");
  const [show, setshow] = useState(false);
  console.log("show..modal", show);
  const [isEdit, setIsEdit] = useState(false);
  const [editData, seteditData] = useState({});
  const [search, setsearch] = useState([]);
  const [data, setdata] = useState([]);
  console.log("data... ", data);
  const [sortOrder, setSortOrder] = useState("descending");
  console.log("sortOrder", sortOrder);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // for popup
  const [popUpMessage, setPopUpMessage] = useState("");

  const [apiError, setApiError] = useState("");
  const [imageFile, setImageFile] = useState([]);

  const [open, setOpen] = useState(false);
  // console.log("catergoryData ", data);
  // State variables for infiniteScroll
  const [categoryList, setCategoryList] = useState([]);
  console.log("categoryList... ", categoryList);

  const [categoryPostRes, setCategoryPostRes] = useState({});
  const [pageNumber, setPageNumber] = useState(1);
  console.log("pageNumber", pageNumber);
  const [priceModalOpen, setPriceModalOpen] = useState(false)
  console.log("priceModalOpen... ", priceModalOpen)
  const [isReloading, setIsReloading] = useState(false);

  // apiError state empty after 3 second
  // and user redirect to /category page
  useEffect(() => {
    if (apiError?.length > 0) {
      showPopupHandleClick(setIsPopupOpen, 3000, setApiError); //for popUp msg
    }
    console.log("popUpMessage...category ", popUpMessage)
  }, [apiError?.length > 0, popUpMessage]);

  const handleClose = () => {
    setIsPopupOpen(false);
  };

  // if categoriesData has data then it store in data state
  useEffect(() => {
    categoriesData?.category?.length > 0 && setdata(categoriesData?.category);
  }, [categoriesData?.category]);

  // get data from redux and store in state
  useEffect(() => {
    setdata(data);
    data && setCategoryList(data?.slice(0, 5));
  }, [data]);

  // get all categories from api
  useEffect(() => {
    // fetchApi();
    if (isOnline) {
      dispatch(getCategoryList(pageNumber, pageSizeForPag, ""));
    } else {
      const categories = categoryApi?.categoryDB?.getAllCategories();
      console.log("categoriessqlite... ", categories);
      setdata(categories);
    }
  }, [isOnline, categoryPostRes]);

  // for open edit category modal
  const editCategory = (id) => {
    const selectedCategory = data.find((item) => {
      return item.categoryId === id;
    });

    // get category details by id
    // categoryApi?.categoryDB?.getCategoryDetailsById(1696241264515)

    setshow(true);
    setIsEdit(true);
    seteditData(selectedCategory);
  };

  // for open add category modal
  const handleAddCategory = () => {
    seteditData(null);
    setshow(true);
    setIsEdit(false);
  };

  const categoryCreationSuccess = () => {
    setshow(false);
    showPopupHandleClick(
      setIsPopupOpen,
      3000,
      setApiError,
      navigate,
      "/Category"
    ); //for popUp msg
  };

  // for delete category
  const HandleDelete = (id) => {
    const selectDelete = data.find((item) => {
      return item.categoryId === id;
    });

    console.log("selectDelete... ", selectDelete)
    const deleteData = {
      categoryName: selectDelete.categoryName,
      categoryId: selectDelete.categoryId,
      storeId: STORE_Id,
      isDeleted: 1,
      lastUpdate: 0,
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
            deleteCategory(deleteData, categoryCreationSuccess, setPopUpMessage)
          );
          // axios
          //   .post(`${SERVER_URL}${UPSERT_CATEGORY}`, deleteData, {
          //     headers: { Authorization: `Bearer ${userToken} ` },
          //   })
          //   .then(({ data }) => {
          //     console.log(data);
          //     if (data) {
          //       dispatch(getCategoryList(pageNumber, pageSizeForPag, ""));
          //     }
          //     // fetchApi();
          //   });
        }
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
          // delete category from sqlite database
          const result =
            categoryApi?.categoryDB?.updateCategoryById(deleteData);
          const categories = categoryApi?.categoryDB?.getAllCategories();
          setdata(categories);
        }
      });
    }
  };




  // Function to handle search input change
  const serachHander = debounce((e) => {
    const inputText = e.target.value;
    setsearch(inputText);
    dispatch(getCategoryList(pageNumber, pageSizeForPag, inputText));
  }, 1000);

  const paginationHandler = (e, p) => {
    console.log("paginationHandler... ", e, p);
    if (isOnline) {
      dispatch(getCategoryList(p, pageSizeForPag, ""));
    } else {
      const categories = categoryApi?.categoryDB?.getAllCategories();
      setdata(categories);
    }
    setPageNumber(p);
  };

  const FindMapping = async () => {
    try {
      let Result = await axios.get(
        `${SERVER_URL}categoryMapping/getCategoryMapping?categoryName-categoryName`,
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  // const handleClose = (event, reason) => {
  //   if (reason === "clickaway") {
  //     return;
  //   }

  //   setOpen(false);
  // };

  return (
    <MainContentArea>
      {/* <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          This is a success message!
        </Alert>
      </Snackbar> */}
      {/* <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          This is a success message!
        </Alert>
      </Snackbar> */}
      {/* {isLoading ? (
        <LoadingSpinner />
      ) : ( */}
      <div className="main-container">
        <div className="table-cartbox">
          <div>
            <ReloadButton
              isReloading={isReloading}
              reloadHandler={() =>
                handleReload(
                  isReloading,
                  setIsReloading,
                  () => dispatch(getCategoryList(pageNumber, pageSizeForPag, "", ""))
                )
              }
            />
          </div>
          <div className="header-container">
            <div className="table-heading">
              <h3>{t("CategoryDetails.categoryList")}</h3>
            </div>
            <div className="search-container">
              <input
                type="Search"
                className="form-control"
                placeholder={t("CategoryDetails.search")}
                aria-label="Search"
                onChange={serachHander}
              />
              <BiSearch className="searchIcon" />
            </div>

            <div>
              <Button
                variant="contained"
                style={{
                  backgroundColor: "var(--button-bg-color)",
                  color: "var(--button-color)",
                }}
                onClick={handleAddCategory}
              >
                {t("CategoryDetails.addCategory")}
              </Button>
            </div>
          </div>
          {isLoading ? (
            <div>
              <LoadingSpinner />
            </div>
          ) : (
            <div className="row">
              {data && data.length > 0 ? (
                // <div className="card cardradius">
                <div className="card-body my-3 pt-0">
                  <table className="table table-hover  table-borderless">
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
                          {t("CategoryDetails.category")}
                          {getSortArrow(sortOrder)}
                        </th>
                        <th className="col-1">{t("CategoryDetails.edit")}</th>
                        <th className="col-1">
                          {t("CategoryDetails.delete")}
                        </th>
                      </tr>
                    </thead>

                    {categoryList &&
                      categoryList
                        ?.filter((item) =>
                          item.categoryName.toLowerCase().includes(search)
                        )
                        ?.map(
                          ({ categoryName, imageUrl, categoryId }, index) => (
                            <tbody key={index}>
                              <tr>
                                <td>
                                  {imageUrl ? (
                                    <img
                                      src={imageUrl}
                                      alt="category image"
                                      width="50"
                                      height="50"
                                      className="cursor-pointer"
                                    />
                                  ) : (
                                    <img
                                      src={"Images/default-image.png"}
                                      alt="category image"
                                      width="50"
                                      height="50"
                                      className="cursor-pointer"
                                    />
                                  )}

                                  <span style={{ marginLeft: "10px" }}>
                                    {categoryName}
                                  </span>
                                </td>

                                <td>
                                  <button
                                    className="btn text-Color"
                                    onClick={() => editCategory(categoryId)}
                                  >
                                    <CiEdit size={25} />
                                  </button>
                                </td>

                                <td>
                                  <button
                                    className="btn text-Color"
                                    onClick={() => HandleDelete(categoryId)}
                                  >
                                    <RiDeleteBin5Line size={25} />
                                  </button>
                                  {/* </div> */}
                                </td>
                              </tr>
                            </tbody>
                          )
                        )}
                  </table>
                </div>
              ) : (
                // </div>
                <NoOnlineOrderItem orderStatus={"Category Data"} />
              )}
            </div>
          )}
          {console.log("totalCategory ", categoriesData?.totalCategory / 5)}

          {isOnline && categoriesData?.totalCategory > 0 && (
            <Pagination
              count={Math.ceil(categoriesData?.totalCategory / 5)}
              // color="primary"
              onChange={paginationHandler}
            />
          )}
        </div>
      </div>
      {/* )} */}

      {show && (
        <ErrorBoundary>
          <CategoryModal
            isModelVisible={show}
            isEdit={isEdit}
            categoryData={editData}
            setshow={setshow}
            // setOpen={setOpen}
            setCategoryPostRes={setCategoryPostRes}
            categoryCreationSuccess={categoryCreationSuccess}
            setPopUpMessage={setPopUpMessage}
            popUpMessage={popUpMessage}
            setApiError={setApiError}
            setIsPopupOpen={setIsPopupOpen}
            priceModalOpen={priceModalOpen}
            setPriceModalOpen={setPriceModalOpen}
          />
        </ErrorBoundary>
      )}

      <AlertpopUP
        open={isPopupOpen}
        message={
          apiError?.length > 0 ? apiError : popUpMessage
          // "Unit deleted successfully!"
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
export default Category;
