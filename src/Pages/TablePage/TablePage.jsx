import React, { useEffect, useState } from "react";
import TableModal from "./TableModal";
import MainContentArea from "../MainContentArea/MainContentArea";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin5Line } from "react-icons/ri";
import InfiniteScroll from "react-infinite-scroll-component";
import moment from "moment";
import { logDOM } from "@testing-library/react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { BiSearch } from "react-icons/bi";
import { TiArrowSortedDown } from "react-icons/ti";
import { getSortArrow, handleReload, showPopupHandleClick, sortTableDataHandler } from "../../utils/constantFunctions";
import { deleteTableById, getTableList } from "../../Redux/Table/tableSlice";
import AlertpopUP from "../../utils/AlertPopUP";
import { useNavigate } from "react-router-dom";
import SubscriptionPlanModal from "../../Components/TrialInformationCard/SubscriptionPlanModal";
import useLicenseValidation from "../../hooks/useLicenseValidation";
import RocketImage from "../../assets/images/RocketIcon.png"
import CachedIcon from '@mui/icons-material/Cached';
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";
import ReloadButton from "../../Components/ReloadButton/ReloadButton";

const TablePage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const tableApi = window.tableApi;
  const floorApi = window.floorApi;
  const isOnline = useSelector((state) => state.checkInternet.isOnline);
  const tableListData = useSelector((state) => state.table.tableData)
  console.log("tableListData... ", tableListData)
  const isLoaded = useSelector((state) => state.table.loading);
  // Calling custom hook
  const isLicenseValidate = useLicenseValidation();
  console.log("isLicenseValidatefloor", isLicenseValidate);
  const [modalOpen, setModalOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [table, setTable] = useState([]);
  const [tableList, setTablesList] = useState([]);
  const [editData, setEditData] = useState(null);
  console.log("tableList", tableList);
  const [tablePostRes, setTablePostRes] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState("descending");
  console.log("sortOrder", sortOrder);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // for popup
  const [apiError, setApiError] = useState("");
  const [popUpMessage, setPopUpMessage] = useState("")
  const [isEdit, setIsEdit] = useState(false);
  const [isReloading, setIsReloading] = useState(false);

  // if server api data will come then we store in state here
  useEffect(() => {
    tableListData?.length > 0 && setTablesList(tableListData);
    setIsLoading(isLoaded);
  }, [tableListData, isLoaded])

  useEffect(() => {
    if (isOnline) {
      // call server api here
      dispatch(getTableList())
    } else {
      const tableDataList = tableApi?.tableDB?.getTableList();
      tableDataList && setTablesList(tableDataList);
      console.log("tableDataList... ", tableDataList);
    }
  }, [tablePostRes]);

  const handleEdit = (tableDetails) => {
    setEditData(tableDetails);
    setShow(true);
    setIsEdit(true);
  };

  const handleDelete = (tableId) => {
    const selectedTable = tableList?.find((item) => item?.tableId === tableId);

    const deleteTablePayload = {
      ...selectedTable,
      isSync: 1,
    };

    if (isOnline) {
      // call server api here
      dispatch(deleteTableById(tableId, tableCreationSuccess, setPopUpMessage));
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

          // getting mapped floor details
          const selectedFloor = floorApi.floorDB?.getSingleFloorDetialsById(
            selectedTable?.floorId
          );
          // when table delete from the floor object i need to minus table count value by 1
          const floorUpdatePayload = {
            ...selectedFloor,
            tableCount: selectedFloor?.tableCount - 1,
          };

          // it's doing hard delete for now
          const deletedTableResult = tableApi?.tableDB?.deleteTableById(
            selectedTable?.tableId
          );

          //   when table delete successfully then it's run
          if (deletedTableResult?.changes === 1) {
            // here we updating floor tablecount value
            const updateFloorResult =
              floorApi.floorDB?.updateFloor(floorUpdatePayload);

            const tableDataList = tableApi?.tableDB?.getTableList();
            tableDataList && setTablesList(tableDataList);
            setIsLoading(false);
          }
        }
      });
    }
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
    setIsEdit(false);
  };

  const handleUpgrade = () => {
    setModalOpen(true);
  }

  const handleClose = () => {
    setShow(false);
    setEditData(null);
  };

  const ClosePopupHandler = () => {
    setIsPopupOpen(false);
  };

  const tableCreationSuccess = () => {
    showPopupHandleClick(
      setIsPopupOpen,
      3000,
      setApiError,
      navigate,
      "/TablePage"
    ); //for popUp msg
  }


  return isLoading ? (
    <LoadingSpinner />
  ) : (
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
                  () => dispatch(getTableList())
                )
              }
            />
          </div>
          <div className="header-container">
            <div className="table-heading">
              <h3>{t("TableDetails.tableList")}</h3>
            </div>
            <div className="search-container">
              <input
                type="search"
                className="form-control"
                placeholder={t("TableDetails.search")}
              />
              <BiSearch className="searchIcon" />
            </div>

            <div>
              <Stack spacing={2} direction="row">
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "var(--button-bg-color)",
                    color: "var(--button-color)",
                  }}
                  onClick={handleShow}
                >
                  {t("TableDetails.addTable")}
                </Button>
              </Stack>
            </div>
          </div>
          <TableModal
            show={show}
            setshow={setShow}
            handleClose={handleClose}
            editData={editData}
            setShow={setShow}
            setTablePostRes={setTablePostRes}
            tableCreationSuccess={tableCreationSuccess}
            setPopUpMessage={setPopUpMessage}
            isEdit={isEdit}
          />

          <div className="row">
            {/* <div className="card cardradius"> */}
            <div className="pt-0 my-3 card-body">
              <table className="table table-hover table-borderless">
                <thead className="table-secondary sticky-top">
                  <tr>
                    <th
                      onClick={() => setTablesList(sortTableDataHandler(tableList, sortOrder, setSortOrder))}
                      className="col-3 Name-cursor">{t("TableDetails.tableName")}{getSortArrow(sortOrder)}</th>
                    <th className="col-2">{t("TableDetails.capacity")}</th>
                    <th className="col-1">{t("TableDetails.date")}</th>
                    <th className="col-1">{t("TableDetails.edit")}</th>
                    <th className="col-1">{t("TableDetails.delete")}</th>
                  </tr>
                </thead>

                <tbody>
                  {tableList?.map((item, index) => (
                    <tr key={index}>
                      <td>{item.tableName}</td>
                      <td>{item.seatingCapacityCount}</td>
                      <td>{moment(item.createdDate).format("MMM DD, YYYY")}</td>
                      <td>
                        <button
                          className="btn text-Color"
                          onClick={() => handleEdit(item)}
                        >
                          <CiEdit size={25} />
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn text-Color"
                          onClick={() => handleDelete(item?.tableId)}
                        >
                          <RiDeleteBin5Line size={25} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* </div> */}
          </div>

        </div>
      </div>
      <AlertpopUP
        open={isPopupOpen}
        message={
          apiError?.length > 0 ? apiError : popUpMessage
        }
        severity={apiError?.length > 0 ? "error" : "success"}
        onClose={ClosePopupHandler}
      />


      <SubscriptionPlanModal
        isModelVisible={modalOpen}
        setShow={setModalOpen} />
    </MainContentArea>
  );
};

export default TablePage;
