import React, { useEffect, useState } from "react";
import axios from "axios";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin5Line } from "react-icons/ri";
import Swal from "sweetalert2";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";
import { GET_UNIT, SERVER_URL, UPSERT_UNIT, pageSizeForPag } from "../../Containts/Values";
import MainContentArea from "../MainContentArea/MainContentArea";
import UnitModal from "./UnitModal";
import "./UnitePage.css";
import NoOnlineOrderItem from "../../Components/OnlineOrders/NoOnlineOrderItem/NoOnlineOrderItem";
import { useDispatch, useSelector } from "react-redux";
import { addUnit, deleteUnit, getUnitList } from "../../Redux/Unit/unitSlice";
import { useTranslation } from "react-i18next";
import { Button, Pagination } from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";
import AlertpopUP from "../../utils/AlertPopUP";
import {
  apiFailureResponse,
  getSortArrow,
  handleReload,
  showPopupHandleClick,
  sortTableDataHandler,
} from "../../utils/constantFunctions";
import { useNavigate } from "react-router-dom";
import ErrorBoundary from "../../Components/ErrorBoundary/ErrorBoundary";
import { BiSearch } from "react-icons/bi";
import { TiArrowSortedDown } from "react-icons/ti";
import debounce from "lodash/debounce";
import SubscriptionPlanModal from "../../Components/TrialInformationCard/SubscriptionPlanModal";
import CachedIcon from '@mui/icons-material/Cached';
import ReloadButton from "../../Components/ReloadButton/ReloadButton";

let userToken = localStorage.getItem("userToken");
const Units = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const unitApi = window.unitApi;
  const UnitesData = useSelector((state) => state.unit.unitData);
  const isLoaded = useSelector((state) => state.unit.loading);
  console.log("isLoaded", isLoaded);
  const [isLoading, setIsLoading] = useState(false);
  const [show, setshow] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editData, seteditData] = useState(null);
  const [search, setsearch] = useState("");
  const [searchProduct, setSearchProduct] = useState([]);
  const [data, setdata] = useState([]);
  console.log("data... ", data);
  const isOnline = useSelector((state) => state.checkInternet.isOnline);
  const [unitPostRes, setUnitPostRes] = useState({});
  const [priceModalOpen, setPriceModalOpen] = useState(false)
  const [isReloading, setIsReloading] = useState(false);


  // State variables for infiniteScroll
  const [unitList, setUnitList] = useState([]);
  console.log("unitList..", unitList);


  // console.log("unitList", unitList);


  const [isPopupOpen, setIsPopupOpen] = useState(false); // for popup
  const [popUpMessage, setPopUpMessage] = useState("")
  const [apiError, setApiError] = useState("");
  const [sortOrder, setSortOrder] = useState("descending");
  console.log("sortOrder", sortOrder)
  const [pageNumber, setPageNumber] = useState(1);
  console.log("pageNumber... ", pageNumber);


  // apiError state empty after 3 second
  // and user redirect to /unit page
  useEffect(() => {
    if (apiError?.length > 0) {
      showPopupHandleClick(setIsPopupOpen, 3000, setApiError); //for popUp msg
    }

    console.log("popUpMessage...unit ", popUpMessage)
  }, [apiError?.length > 0, popUpMessage]);

  const handleClose = () => {
    setIsPopupOpen(false);
  };

  // after unit api call unitdata store into data state
  useEffect(() => {
    UnitesData?.unit?.length > 0 && setdata(UnitesData?.unit);
  }, [UnitesData?.unit]);

  // here we call unit api
  useEffect(() => {
    // fetchApi();
    if (isOnline) {
      dispatch(getUnitList(pageNumber, pageSizeForPag, ""));
    } else {
      const unitsData = unitApi && unitApi?.unitDB?.getUnits();
      setdata(unitsData);
      console.log("unitsData ", unitsData);
    }
  }, [isOnline, unitPostRes]);

  // useEffect(() => {
  //   // setdata(UnitesData);
  //   data?.length > 0 && setUnitList(data.slice(0, 5));
  // }, [data]);

  // for open edit unite modal
  const editUnit = (id) => {
    const selectedUnit = data.find((item) => {
      return item.unitId === id;
    });

    // get unit by id from sqlite database
    // const selectUnit = unitApi && unitApi?.unitDB?.getUnitById(parseInt(id));
    seteditData(selectedUnit);
    setshow(true);
    setIsEdit(true);
  };

  // for open add unit modal
  const handleAddUnit = () => {
    seteditData(null);
    setshow(true);
    setIsEdit(false);
  };

  //unit delete successfully popup
  const unitCreationSuccess = () => {
    showPopupHandleClick(
      setIsPopupOpen,
      3000,
      setApiError,
      navigate,
      "/Units"); //for popUp msg
    // console.log("unit deleted success");
  };

  // for delete unit
  const HandleDelete = async (id) => {
    const selectDelete = data.find((item) => {
      return item.unitId === id;
    });

    const deleteData = {
      unitName: selectDelete.unitName,
      isMeasurable: selectDelete.isMeasurable,
      lastUpdate: 0,
      unitId: selectDelete.unitId,
      isDeleted: 1,
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
          dispatch(deleteUnit(deleteData, unitCreationSuccess, setPopUpMessage));
          // axios
          //   .post(`${SERVER_URL}${UPSERT_UNIT}`, deleteData, {
          //     headers: { Authorization: `Bearer ${userToken} ` },
          //   })
          //   .then(({ data }) => {
          //     console.log(data);
          //     // fetchApi();
          //     dispatch(getUnitList(pageNumber, pageSizeForPag, ""));
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
          setIsLoading(true);
          const deletedUnit = unitApi?.unitDB?.updateUnitById(deleteData);
          deletedUnit?.changes && setIsLoading(false);
          // after unit deletedi called get all unit api
          const unitsData = deletedUnit?.changes && unitApi?.unitDB?.getUnits();
          setdata(unitsData);
        }
      });
    }
  };



  // Function to handle search input change
  const serachHander = debounce((e) => {
    const inputText = e.target.value;
    setsearch(inputText);
    dispatch(getUnitList(pageNumber, pageSizeForPag, inputText));
  }, 1000);

  const paginationHandler = (e, p) => {
    console.log("paginationHandler... ", e, p);
    if (isOnline) {
      dispatch(getUnitList(p, pageSizeForPag, ""));
    } else {
      const unitsData = unitApi?.unitDB?.getUnits();
      setdata(unitsData);
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
                  () => dispatch(getUnitList(pageNumber, pageSizeForPag, "", ""))
                )
              }
            />
          </div>
          <div className="header-container">
            <div className="table-heading">
              <h3>{t("UnitDetails.unitList")}</h3>
            </div>
            <div className="search-container">
              <input
                className="form-control"
                type="Search"
                placeholder={t("UnitDetails.search")}
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
                onClick={handleAddUnit}
              >
                {t("UnitDetails.addUnit")}
              </Button>
            </div>
          </div>
          {isLoaded ? (
            <LoadingSpinner />
          ) : (
            <div className="row">
              {data?.length > 0 && data[0] !== undefined ? (
                // <div className="card cardradius">
                <div className="card-body my-3 pt-0">

                  <table className="table table-hover table-borderless">
                    <thead className="table-secondary sticky-top">
                      <tr>
                        <th className="Name-cursor"
                          onClick={() => setdata(sortTableDataHandler(data, sortOrder, setSortOrder))}>
                          {t("UnitDetails.unit")}{getSortArrow(sortOrder)}</th>
                        <th className="text-center">
                          {t("UnitDetails.isMeasurable")}
                        </th>
                        <th className="text-center ">
                          {t("UnitDetails.edit")}
                        </th>
                        <th className="text-center">
                          {t("UnitDetails.delete")}
                        </th>
                      </tr>
                    </thead>

                    {data
                      ?.filter((item) =>
                        item.unitName.toLowerCase().includes(search)
                      )
                      ?.map(({ unitName, unitId, isMeasurable }, index) => (
                        <tbody key={index}>
                          <tr>
                            <td>{unitName}</td>

                            <td className="text-center">
                              {isMeasurable === true ? (
                                <span className="text-success">True</span>
                              ) : (
                                <span className="text-danger">False</span>
                              )}
                            </td>

                            <td className="text-center">
                              <button
                                className="btn text-Color"
                                onClick={() => editUnit(unitId)}
                              >
                                <CiEdit size={25} />
                              </button>
                            </td>

                            <td className="text-center">
                              <button
                                className="btn text-Color"
                                onClick={() => HandleDelete(unitId)}
                              >
                                <RiDeleteBin5Line size={25} />
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      ))}
                  </table>

                </div>
                // </div>
              ) : (
                <NoOnlineOrderItem orderStatus={"Units Data"} />
              )}
            </div>
          )}
          {console.log("totalUnit ", UnitesData?.totalUnit / 5)}
          {isOnline && UnitesData?.totalUnit > 0 && (
            <Pagination
              count={Math.ceil(UnitesData?.totalUnit / 5)}
              // color="primary"
              onChange={paginationHandler}
            />
          )}
        </div>
      </div>


      {show && (
        <ErrorBoundary>
          <UnitModal
            isModelVisible={show}
            isEdit={isEdit}
            unitData={editData}
            setshow={setshow}
            setUnitPostRes={setUnitPostRes}
            unitCreationSuccess={unitCreationSuccess}
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
        message={apiError?.length > 0 ? apiError : popUpMessage
          // "Unit deleted successfully!"
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
export default Units;
