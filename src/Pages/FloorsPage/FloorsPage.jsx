import React, { useEffect, useState } from "react";
import "./FloorsPage.css";
import MainContentArea from "../MainContentArea/MainContentArea";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";
import FloorModel from "./FloorModel";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin5Line } from "react-icons/ri";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";
import { InputLabel, TextField } from "@mui/material";
import MovableSelecto from "../../Components/MovableSelecto/MovableSelecto";
import { getUTCDate } from "../../Containts/Values";
import { BiSearch } from "react-icons/bi";
import { TiArrowSortedDown } from "react-icons/ti";
import {
  getSortArrow,
  handleReload,
  showPopupHandleClick,
  sortTableDataHandler,
} from "../../utils/constantFunctions";
import { deleteFloor, getFloorList } from "../../Redux/Floor/floorSlice";
import { useNavigate } from "react-router-dom";
import AlertpopUP from "../../utils/AlertPopUP";
import { getFloorMappedTableList } from "../../Redux/Table/tableSlice";
import {
  addFloorPlan,
  deleteFloorPlanTableById,
  getFloorPlanListByFloorId,
} from "../../Redux/FloorPlan/floorPlanSlice";
import useLicenseValidation from "../../hooks/useLicenseValidation";
import SubscriptionPlanModal from "../../Components/TrialInformationCard/SubscriptionPlanModal";
import RocketImage from "../../assets/images/RocketIcon.png"
import CachedIcon from '@mui/icons-material/Cached';
import ReloadButton from "../../Components/ReloadButton/ReloadButton";

const FloorsPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const floorApi = window.floorApi;
  const tableApi = window.tableApi;
  const floorPlanTablesApi = window.floorPlanTablesApi;

  const isOnline = useSelector((state) => state.checkInternet.isOnline);
  console.log("isOnline... ", isOnline)
  const floorData = useSelector((state) => state.floor.floorData);
  const floorLoading = useSelector((state) => state.floor.loading);
  console.log("floorData ", floorData);
  // console.log("floorLoading... ", floorLoading);
  const floorMappedTableList = useSelector(
    (state) => state.table.floorMappedTableList
  );

  // Calling custom hook
  const isLicenseValidate = useLicenseValidation();
  console.log("isLicenseValidatefloor", isLicenseValidate);

  const floorPlanList = useSelector((state) => state.floorPlan.floorPlanData);
  console.log("floorPlanList... ", floorPlanList);
  const [modalOpen, setModalOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [openFloorPlan, setOpenFloorPlan] = useState(false);
  const [floorsList, setFloorsList] = useState([]);
  const [editData, setEditData] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const [floorPostRes, setFloorPostRes] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [tableList, setTablesList] = useState([]);
  const [isReloading, setIsReloading] = useState(false);

  const [sortOrder, setSortOrder] = useState("descending");
  const [isPopupOpen, setIsPopupOpen] = useState(false); // for popup
  const [apiError, setApiError] = useState("");
  const [popUpMessage, setPopUpMessage] = useState("");

  const [selectedTables, setSelectedTables] = useState([]);
  const [movableValues, setMovableValues] = useState({
    scalable: true,
    resizable: true,
    warpable: false,
  });

  // stored elements value with table value for further referrences
  useEffect(() => {
    if (selectedTables?.length > 0) {
      localStorage.setItem("floorPlanTables", JSON.stringify(selectedTables));
    }
  }, [selectedTables]);

  // if server api data will come then we store in state here
  useEffect(() => {
    floorData?.length > 0 && setFloorsList(floorData);
    setIsLoading(floorLoading);
  }, [floorData, floorLoading]);

  //   Here we calling floor list api
  useEffect(() => {
    if (isOnline) {
      // call server api here
      dispatch(getFloorList());
    } else {
      setIsLoading(true);
      const floorDataList = floorApi?.floorDB?.getFloorList();
      floorDataList && setFloorsList(floorDataList);
      setIsLoading(false);
      // const tableDataList = tableApi?.tableDB?.getTableList();
      // tableDataList && setTablesList(tableDataList);
    }
  }, [isOnline, floorPostRes,]); //  After updating floor we call floor list api again

  // when we got floorMappedTableList from server we stored that data into setTablesList state
  useEffect(() => {
    floorMappedTableList?.length > 0 && setTablesList(floorMappedTableList);
    floorPlanList?.length > 0 && setSelectedTables(floorPlanList);
  }, [floorMappedTableList, floorPlanList]);

  const handleEdit = (floor) => {
    console.log("floor... ", floor);
    setEditData(floor);
    setShow(true);
    setIsEdit(true)
  };

  //   delete floor handler
  const handleDelete = (floorId) => {
    const selectedFloor =
      floorsList && floorsList?.find((item) => item?.floorId === floorId);

    const deleteFloorPayload = {
      ...selectedFloor,
      isDeleted: 1,
    };
    if (isOnline) {
      // call server api here
      dispatch(
        deleteFloor(deleteFloorPayload, floorCreationSuccess, setPopUpMessage)
      );
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
          // it's doing hard delete for now
          const deletedFloorResult = floorApi?.floorDB?.deleteFloorById(
            selectedFloor?.floorId
          );
          if (deletedFloorResult?.changes === 1) {
            const floorDataList = floorApi?.floorDB?.getFloorList();
            floorDataList && setFloorsList(floorDataList);
            setIsLoading(false);
          }
        }
      });
    }
    console.log("deleteFloorPayload.. ", deleteFloorPayload);
  };

  const handleShow = () => {
    // for show the popupMessege for upgrade plan
    // if (isLicenseValidate?.licensePlan === "free") {
    //   Swal.fire({
    //     title: "Access Denied",
    //     html: "<span style='color: white'>Upgrade to unlock this feature</span>",
    //     iconHtml: `<img src="${RocketImage}" width="100" height="100">`,
    //     confirmButtonText: "Upgrade Plan",
    //     showCloseButton: true,
    //     closeButtonHtml: '<span style="color:#ffffffb5;">&times;</span>',
    //     customClass: {
    //       icon: 'no-border',
    //       confirmButton: 'custom-button-class',
    //       popup: 'custom-popup-class',
    //       title: 'title-color',
    //     },
    //     confirmButtonColor: "",
    //     cancelButtonText: "Cancel",
    //   }).then((result) => {
    //     if (result.isConfirmed) {
    //       handleUpgrade();
    //     }
    //   });
    // } else {

    // }

    setShow(true);
    setEditData(null);
    setIsEdit(false)

  };

  // for open subscription modal
  const handleUpgrade = () => {
    setModalOpen(true);
  }




  const handleClose = () => {
    setShow(false);
    setEditData(null);
  };

  const openFloorPlanHandler = (floorId) => {
    setOpenFloorPlan(true);

    if (isOnline) {
      // calling server apis here
      dispatch(getFloorMappedTableList(floorId));
      dispatch(getFloorPlanListByFloorId(floorId));
    } else {
      const tableDataList = tableApi?.tableDB?.getFloorMappedTableList(floorId);
      tableDataList && setTablesList(tableDataList);
      // taking stored element values when user open floor plan
      // const tableValues = JSON.parse(localStorage.getItem("floorPlanTables"));
      // tableValues?.length > 0 && setSelectedTables(tableValues);
      const floorPlanTables =
        floorPlanTablesApi?.floorPlanTablesDB?.getFloorPlanTableList(floorId);
      floorPlanTables && setSelectedTables(floorPlanTables);
    }
  };

  const closeFloorPlanHandler = () => {
    setOpenFloorPlan(false);
  };

  // Select table from table list handler
  const setHandler = (tableDetails) => {
    console.log("tableDetails... ", tableDetails);

    const floorPlanPayload = {
      floorPlanId: getUTCDate(),
      floorId: tableDetails?.floorId,
      tableId: tableDetails?.tableId,
      isDeleted: 0,
      isSync: 0,
      lastUpdate: getUTCDate(),
      storeId: tableDetails?.storeId,
      tableName: tableDetails?.tableName,
      transform: "",
      width: 0,
      seatingCapacityCount: tableDetails?.seatingCapacityCount,
      borderRadius: "",
      height: 0,
    };

    if (isOnline) {
      // here we calling server api for adding floor plan on server
      dispatch(addFloorPlan(floorPlanPayload));
    } else {
      tableDetails &&
        floorPlanTablesApi?.floorPlanTablesDB?.insertFloorPlanTable(
          floorPlanPayload
        );
    }
    setSelectedTables([...selectedTables, tableDetails]);
  };

  // Reset table on floor plan design
  const resetHandler = (resetFloorPlanId, floorPlanIndex) => {
    let arr = [...selectedTables];
    console.log("resetFloorPlanId ", resetFloorPlanId);
    console.log("floorPlanIndex... ", floorPlanIndex);
    let floorPlanRemoveEle = arr[Number(floorPlanIndex)];
    console.log("floorPlanRemoveEle... ", floorPlanRemoveEle);

    if (arr?.some((item) => item?.floorPlanId === resetFloorPlanId)) {
      if (isOnline) {
        // here we calling server api for deleting floor plan on server
        dispatch(deleteFloorPlanTableById(resetFloorPlanId));
      } else {
        floorPlanRemoveEle &&
          floorPlanTablesApi?.floorPlanTablesDB?.deleteFloorPlanTableById(
            resetFloorPlanId
          );
      }
    }
    arr.splice(floorPlanIndex, 1); // Remove one element at the found index

    // removing local storage data if they removed last table
    if (resetFloorPlanId === 0) {
      localStorage.setItem("floorPlanTables", JSON.stringify(arr));
    }
    console.log("arr... ", arr);
    setSelectedTables(arr);
  };

  const resetFilterHandler = (tableDetails) => {
    console.log("tableDetails... ", tableDetails)
    let deletingFloorPlanId;
    let floorPlanIndex;

    selectedTables?.filter((item, index) => {
      if (item?.tableId === tableDetails?.tableId) {
        // console.log("item... ", item);
        // console.log("index... ", index);
        // deletingFloorPlanId = item?.floorPlanId
        // floorPlanIndex = index
        resetHandler(item?.floorPlanId, index)
      }
    });
  };

  const ClosePopupHandler = () => {
    setIsPopupOpen(false);
  };

  const floorCreationSuccess = () => {
    showPopupHandleClick(
      setIsPopupOpen,
      3000,
      setApiError,
      navigate,
      "/floor-dashboard"
    ); //for popUp msg
  };


  return isLoading ? (
    <LoadingSpinner />
  ) : (
    <MainContentArea scroll={"auto"}>
      <div className="main-container">
        <div className="table-cartbox">
          <div>
            <ReloadButton
              isReloading={isReloading}
              reloadHandler={() =>
                handleReload(
                  isReloading,
                  setIsReloading,
                  () => dispatch(getFloorList())
                )
              }
            />
          </div>
          <div className="header-container">
            <div className="table-heading">
              <h3>{t("FloorDetails.floorList")}</h3>
            </div>
            <div className="search-container">
              <input
                type="search"
                className="form-control"
                placeholder={t("FloorDetails.search")}
              />
              <BiSearch className="searchIcon" />
            </div>

            <div>
              <Stack spacing={2} direction="row">
                {/* <Button
                variant="contained"
                style={{
                  backgroundColor: "var(--button-bg-color)",
                  color: "var(--button-color)",
                }}
                onClick={openFloorPlanHandler}
              >
                {t("FloorDetails.floorPlan")}
              </Button> */}
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "var(--button-bg-color)",
                    color: "var(--button-color)",
                  }}
                  onClick={handleShow}
                >
                  {t("FloorDetails.addFloor")}
                </Button>
              </Stack>
            </div>
          </div>
          <FloorModel
            show={show}
            setShow={setShow}
            handleClose={handleClose}
            editData={editData}
            setFloorPostRes={setFloorPostRes}
            floorCreationSuccess={floorCreationSuccess}
            setPopUpMessage={setPopUpMessage}
            isEdit={isEdit}
          />

          {/* Floor plan model  */}
          {openFloorPlan ? (
            <div className="floor-plan-conainer">
              <div className="floor-plan-header">
                <div className="floor-plan-close">
                  <h1 className="" onClick={closeFloorPlanHandler}>
                    X
                  </h1>
                </div>
                <div className="floor-plan-header-title">
                  <h1>{t("FloorDetails.editFloorPlan")}</h1>
                </div>
              </div>

              <div className="gap-2 inner-floor-plan-containe d-flex justify-content-between">
                <div className="table-list-container">
                  {tableList &&
                    tableList?.map((item, index) => {
                      return (
                        <div className="table-card">
                          <div className="table-card-details">
                            <span>{item?.tableName}</span>
                            {/* {console.log("floorPlanId ", selectedTables?.filter((item2) => item2?.tableId === item?.tableId)[0]?.floorPlanId)} */}
                            <span
                              className={
                                selectedTables.some(
                                  (selectedItem) =>
                                    selectedItem?.tableName === item?.tableName
                                )
                                  ? "reset-reset-btn"
                                  : "set-reset-btn"
                              }
                              onClick={() =>
                                selectedTables.some(
                                  (selectedItem) =>
                                    selectedItem?.tableName === item?.tableName
                                )
                                  ? resetFilterHandler(item)
                                  : setHandler(item)
                              }
                            >
                              {selectedTables.some(
                                (selectedItem) =>
                                  selectedItem?.tableName === item?.tableName
                              )
                                ? "Reset"
                                : "Set"}
                            </span>
                          </div>
                          {t("FloorDetails.noOfSeats")}{" "}
                          {item?.seatingCapacityCount}
                        </div>
                      );
                    })}
                </div>
                {/* main floor plan  */}
                <div className="floor-plan-main-container">
                  <div className="size-container d-flex">
                    <div className="size">
                      <InputLabel
                        style={{ color: "var(--product-text-color)" }}
                      >
                        {t("FloorDetails.width")}
                      </InputLabel>
                      <TextField
                        style={{ backgroundColor: "var( --light-gray-color)" }}
                        // placeholder={t("AddNewProduct.productName")}
                        id="outlined-size-small"
                        size="small"
                        name="width-size"
                      // onChange={productInputHanlder}
                      />
                    </div>
                    <div className="size">
                      <InputLabel
                        style={{ color: "var(--product-text-color)" }}
                      >
                        {t("FloorDetails.height")}
                      </InputLabel>
                      <TextField
                        style={{ backgroundColor: "var( --light-gray-color)" }}
                        // placeholder={t("AddNewProduct.productName")}
                        id="outlined-size-small"
                        size="small"
                        name="height-size"
                      // onChange={productInputHanlder}
                      />
                    </div>
                  </div>
                  {/* Floor plan all things under this */}
                  <div className="floor-plan-main-area d-flex">
                    <MovableSelecto
                      selectedTables={selectedTables}
                      setSelectedTables={setSelectedTables}
                      movableValues={movableValues}
                      resetHandler={resetHandler}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="row">
              {/* <div className="card cardradius"> */}
              <div className="pt-0 my-3 card-body">
                <table className="table table-hover table-borderless">
                  <thead className="table-secondary sticky-top">
                    <tr>
                      <th
                        onClick={() =>
                          setFloorsList(
                            sortTableDataHandler(
                              floorsList,
                              sortOrder,
                              setSortOrder
                            )
                          )
                        }
                        className="col-3 Name-cursor"
                      >
                        {t("FloorDetails.name")}
                        {getSortArrow(sortOrder)}
                      </th>
                      <th className="col-3">{t("FloorDetails.location")}</th>
                      <th className="col">{t("FloorDetails.tableCount")}</th>
                      <th className="col">{t("FloorDetails.date")}</th>
                      <th className="col">{t("FloorDetails.floorPlan")}</th>
                      <th className="col">{t("FloorDetails.edit")}</th>
                      <th className="col">{t("FloorDetails.delete")}</th>
                    </tr>
                  </thead>

                  <tbody>
                    {floorsList?.map((floor, index) => (
                      <tr key={index}>
                        <td>{floor.floorName}</td>
                        <td>{floor.location}</td>
                        <td>{floor.tableCount}</td>
                        <td>{moment(floor.date).format("MMM DD, YYYY")}</td>
                        <td style={{ width: "100px" }}>
                          <div>
                            <Button
                              className="btn me-2 UB-btn"
                              style={{
                                marginLeft: 5,
                                background: "var(--white-color)",
                                color: " var(--main-bg-color)",
                                fontsize: "12px",
                                border: " 2px solid  var(--main-bg-color)",
                                padding: "3px 5px",
                              }}
                              onClick={() =>
                                openFloorPlanHandler(floor?.floorId)
                              }
                            >
                              {t("FloorDetails.floorPlan")}
                            </Button>
                          </div>
                        </td>
                        <td>
                          <button
                            className="btn text-Color"
                            onClick={() => handleEdit(floor)}
                          >
                            <CiEdit size={25} />
                          </button>
                        </td>
                        <td>
                          <button
                            className="btn text-Color"
                            onClick={() => handleDelete(floor?.floorId)}
                          >
                            <RiDeleteBin5Line size={25} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            // </div>
          )}
        </div>
      </div>

      <AlertpopUP
        open={isPopupOpen}
        message={apiError?.length > 0 ? apiError : popUpMessage}
        severity={apiError?.length > 0 ? "error" : "success"}
        onClose={ClosePopupHandler}
      />


      <SubscriptionPlanModal
        isModelVisible={modalOpen}
        setShow={setModalOpen} />
    </MainContentArea>
  );
};

export default FloorsPage;
