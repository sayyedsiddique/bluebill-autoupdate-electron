import axios from "axios";
import React, { useEffect, useState } from "react";
import "./SalesExecutivePage.css";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin5Line } from "react-icons/ri";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";
import {
  SERVER_URL,
  STORE_Id,
  UPSERT_SALESEXECUTIVE,
  getUTCDate,
} from "../../Containts/Values";
import MainContentArea from "../MainContentArea/MainContentArea";
import NoOnlineOrderItem from "../../Components/OnlineOrders/NoOnlineOrderItem/NoOnlineOrderItem";
import SalesExModal from "./SalesExModal";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteSalesExecutive,
  getSalesExecutiveList,
} from "../../Redux/SalesExecutive/SalesExecutiveSlice";
import { useTranslation } from "react-i18next";
import { Button } from "@mui/material";
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
import { useNavigate } from "react-router-dom";
import AlertpopUP from "../../utils/AlertPopUP";
import CachedIcon from '@mui/icons-material/Cached';
import ReloadButton from "../../Components/ReloadButton/ReloadButton";

let userToken = localStorage.getItem("userToken");

const SalesExecutive = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const salesExecutiveApi = window.salesExecutiveApi;
  const isOnline = useSelector((state) => state.checkInternet.isOnline);
  const SalesExecutiveData = useSelector(
    (state) => state.salesExecutive.SalesExecutiveData
  );
  const isLoading = useSelector((state) => state.salesExecutive.loading);
  // const [isLoaded, setIsLoaded] = useState(true);
  const [show, setshow] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editData, seteditData] = useState({});
  const [search, setsearch] = useState([]);
  const [data, setdata] = useState([]);
  console.log("data... ", data);
  const salesManObj = JSON.parse(localStorage.getItem("Sales"));
  const [salesMan, setSalesMan] = useState(salesManObj?.name);
  // it's for refetching sales executive list after any post api call
  const [salesExPostRes, setSalesExPostRes] = useState({});
  const [sortOrder, setSortOrder] = useState("descending");
  console.log("sortOrder", sortOrder);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // for popup
  const [popUpMessage, setPopUpMessage] = useState("");
  const [apiError, setApiError] = useState("");

  // State variables for infiniteScroll
  const [salesExecutiveList, setSalesExecutiveList] = useState([]);
  console.log("salesExecutiveList...", salesExecutiveList);
  const [dataLength, setDataLength] = useState(5);
  const [hasMore, setHasMore] = useState(true);
  const [isReloading, setIsReloading] = useState(false);

  // / apiError state empty after 3 second
  // and user redirect to /salesExecutive page
  useEffect(() => {
    if (apiError?.length > 0) {
      showPopupHandleClick(setIsPopupOpen, 3000, setApiError); //for popUp msg
    }
  }, [apiError?.length > 0]);

  const handleClose = () => {
    setIsPopupOpen(false);
  };

  useEffect(() => {
    setdata(SalesExecutiveData);
    setSalesExecutiveList(SalesExecutiveData.slice(0, 5));
  }, [SalesExecutiveData]);

  // get all sales executive from sqlite database
  useEffect(() => {
    const salesExList =
      salesExecutiveApi?.salesExecutiveDB?.getAllSalesExecutive();
    setdata(salesExList);
  }, [salesExPostRes]);

  // useEffect(() => {
  //   dispatch(getSalesExecutiveList());
  //   // fetchApi();
  // }, []);

  console.log("SalesExecutiveData", SalesExecutiveData);
  // it store real api sales executive data
  useEffect(() => {
    SalesExecutiveData?.length > 0 && setdata(SalesExecutiveData);
  }, [SalesExecutiveData]);

  // fetching sales executive data
  useEffect(() => {
    if (isOnline) {
      dispatch(getSalesExecutiveList());
    } else {
      const salesExList =
        salesExecutiveApi?.salesExecutiveDB?.getAllSalesExecutive();
      setdata(salesExList);
    }
    // fetchApi();
  }, []);

  // for open edit sales modal
  const handelEdit = (id) => {
    const newdata = data.find((item) => {
      return item.id === id;
    });
    setshow(true);
    setIsEdit(true);

    // get sales executive details by id from sqlite data base
    // salesExecutiveApi?.salesExecutiveDB?.getSalesExecutiveDetailsById(1696319409782);
    // setshow(true);
    seteditData(newdata);
    console.log(newdata);
  };

  // for open add sales modal
  const addData = () => {
    setIsEdit(false);
    seteditData(null);
    setshow(true);
  };

  const salesExecutiveCreationSuccess = () => {
    setshow(false); // close sale executive creation modal
    showPopupHandleClick(
      setIsPopupOpen,
      3000,
      setApiError,
      navigate,
      "/salesExecutive"
    ); //for popUp msg
  };

  // for delete sales
  const HandleDelete = async (id) => {
    const selectDelete = data.find((item) => {
      return item.id === id;
    });

    const deleteData = {
      activated: "n",
      id: selectDelete?.id,
      name: selectDelete?.name,
      // isDeleted: 1,
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
            deleteSalesExecutive(
              deleteData,
              salesExecutiveCreationSuccess,
              setPopUpMessage
            )
          );
          localStorage.removeItem("Sales");

          // axios
          //   .post(`${SERVER_URL}${UPSERT_SALESEXECUTIVE}`, deleteData, {
          //     headers: { Authorization: `Bearer ${userToken} ` },
          //   })
          //   .then(({ data }) => {
          //     console.log(data);
          //     // fetchApi();
          //     dispatch(getSalesExecutiveList());
          //     setshow(false);
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
          localStorage.removeItem("Sales");

          // delete sales executive details by id from sqlite data base
          const result =
            salesExecutiveApi?.salesExecutiveDB?.updateSalesExecutive(
              deleteData
            );
          setSalesExPostRes(result);
        }
      });
    }
  };

  // to activate sales executive
  const handleActivate = (item) => {
    // if (
    //   item.activated === "Y" ||
    //   (item.activated === 1 && item?.id === salesManObj?.id)
    // ) {
    //   localStorage.removeItem("Sales");
    // }

    if (isOnline) {
      const postData = {
        activated: item.activated === "Y" ? "N" : "Y",
        id: item.id,
        name: item.name,
      };
      axios
        .post(`${SERVER_URL}${UPSERT_SALESEXECUTIVE}`, postData, {
          headers: { Authorization: `Bearer ${userToken} ` },
        })
        .then(({ data }) => {
          console.log("helloe add");
          // fetchApi();
          dispatch(getSalesExecutiveList());
        });
    } else {
      // for sqlite database
      const postSchemaData = {
        activated: item?.activated === 1 ? 0 : 1,
        id: item?.id,
        name: item?.name,
        isSync: item?.isSync,
        storeId: item?.storeId,
        isDeleted: 0,
      };
      console.log("postSchemaData... ", postSchemaData);
      const result =
        salesExecutiveApi?.salesExecutiveDB?.updateSalesExecutive(
          postSchemaData
        );
      setSalesExPostRes(result);
    }
  };

  //  to set sales executive on duty
  const handleSetOnDuty = (item) => {
    localStorage.setItem("Sales", JSON.stringify(item));
    dispatch(getSalesExecutiveList());
    // window.location.reload();
  };

  // Infinite scroll handler
  const fetchMoreData = () => {
    if (salesExecutiveList.length >= SalesExecutiveData.length) {
      setHasMore(false);
    }
    setTimeout(() => {
      setSalesExecutiveList(
        salesExecutiveList.concat(
          SalesExecutiveData.slice(dataLength, dataLength + 5)
        )
      );
    });
    setDataLength((prev) => prev + 5);
  };


  return (
    <MainContentArea>
      {isLoading ? (
        <div>
          <LoadingSpinner />
        </div>
      ) : (
        <div className="main-container">
          <div className="table-cartbox">
            <div>
              <ReloadButton
                isReloading={isReloading}
                reloadHandler={() =>
                  handleReload(
                    isReloading,
                    setIsReloading,
                    () => dispatch(getSalesExecutiveList())
                  )
                }
              />
            </div>
            <div className="header-container">
              <div className="table-heading">
                <h3>{t("SalesExecutive.salesExcutiveList")}</h3>
              </div>
              <div className="search-container">
                <input
                  type="Search"
                  className="form-control"
                  placeholder={t("SalesExecutive.search")}
                  aria-label="Search"
                  onChange={(e) => setsearch(e.target.value)}
                />
                <BiSearch className="searchIcon" />
              </div>

              {/* {show && (
              <SalesExModal
                isModelVisible={show}
                isEdit={isEdit}
                data={editData}
                setshow={setshow}
                setSalesExPostRes={setSalesExPostRes}
              />
            )} */}

              <div>
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "var(--button-bg-color)",
                    color: "var(--button-color)",
                  }}
                  onClick={addData}
                >
                  {t("SalesExecutive.addSalesExecutive")}
                </Button>
              </div>
            </div>

            <div className="row">
              {data && data[0] !== undefined ? (
                // <div className="card cardradius">
                <div className="card-body my-3 pt-0">
                  <InfiniteScroll
                    dataLength={salesExecutiveList.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    height={320}
                    loader={
                      salesExecutiveList.length > 6 ? (
                        <p className="text-Color">loading...</p>
                      ) : null
                    }
                  >
                    <table className="table table-hover table-borderless">
                      <thead className="table-secondary sticky-top">
                        <tr>
                          <th
                            onClick={() =>
                              setSalesExecutiveList(
                                sortTableDataHandler(
                                  salesExecutiveList,
                                  sortOrder,
                                  setSortOrder
                                )
                              )
                            }
                            className=" Name-cursor col-5"
                          >
                            {t("SalesExecutive.salesExecutive")}
                            {getSortArrow(sortOrder)}
                          </th>
                          <th className="col-5">
                            {t("SalesExecutive.activeInactive")}
                          </th>
                          <th className="col-1">{t("SalesExecutive.edit")}</th>
                          <th className="col-1">
                            {t("SalesExecutive.delete")}
                          </th>
                        </tr>
                      </thead>

                      {data
                        ?.filter((item) =>
                          item.name.toLowerCase().includes(search)
                        )
                        ?.map((item, index) => (
                          <tbody key={index}>
                            <tr>
                              <td>{item.name}</td>
                              <td>
                                <div className="form-check form-switch ">
                                  <input
                                    className="form-check-input SE-toggle"
                                    type="checkbox"
                                    id="flexSwitchCheckDefault"
                                    checked={
                                      item.activated === "Y" ||
                                        item.activated === 1
                                        ? true
                                        : false
                                    }
                                    onClick={() => handleActivate(item)}
                                  />

                                  {item.activated === "Y" ? (
                                    <div>
                                      <label
                                        className="form-check-label tcolor"
                                        htmlFor="flexSwitchCheckDefault"
                                      >
                                        {t("SalesExecutive.active")}
                                      </label>
                                      <Button
                                        onClick={() => handleSetOnDuty(item)}
                                        variant="contained"
                                        disabled={
                                          salesManObj?.id !== item.id
                                            ? false
                                            : true
                                        }
                                        className="btn btn-primary ms-2 set-btn"
                                      >
                                        {t("SalesExecutive.setOnDuty")}
                                      </Button>
                                    </div>
                                  ) : (
                                    <label
                                      className="form-check-label tcolor-msg"
                                      htmlFor="flexSwitchCheckDefault"
                                    >
                                      {t("SalesExecutive.inactive")}
                                    </label>
                                  )}
                                </div>
                              </td>

                              <td>
                                <button
                                  className="btn text-Color"
                                  onClick={() => handelEdit(item.id)}
                                >
                                  <CiEdit size={25} />
                                </button>
                              </td>

                              <td>
                                <button
                                  className="btn text-Color"
                                  onClick={() => HandleDelete(item.id)}
                                >
                                  <RiDeleteBin5Line size={25} />
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        ))}
                    </table>
                  </InfiniteScroll>
                </div>
              ) : (
                // </div>
                <NoOnlineOrderItem orderStatus={"No Executive Data"} />
              )}
            </div>
          </div>
        </div>
      )}

      {show && (
        <ErrorBoundary>
          <SalesExModal
            isModelVisible={show}
            isEdit={isEdit}
            data={editData}
            setshow={setshow}
            setSalesExPostRes={setSalesExPostRes}
            salesExecutiveCreationSuccess={salesExecutiveCreationSuccess}
            setPopUpMessage={setPopUpMessage}
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
    </MainContentArea>
  );
};
export default SalesExecutive;
