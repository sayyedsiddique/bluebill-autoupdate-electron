import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BiSearch } from "react-icons/bi";
import "./OnlineOrderPage.css";
import DisplayOrdersItem from "../../Components/OnlineOrders/DisplayOrdersItem/DisplayOrdersItem";
import MainContentArea from "../MainContentArea/MainContentArea";
import OnlineOrderBtnCollection from "../../Components/UI/Molecules/OnlineOrderBtnCollection/OnlineOrderBtnCollection";
import { getOnlineOrder } from "../../Redux/OnlineOrderSlice/onlineOrderSlice";
import { useTranslation } from "react-i18next";
import { MenuItem, Pagination, Select } from "@mui/material";
import { pageSizeForPag } from "../../Containts/Values";
import CachedIcon from '@mui/icons-material/Cached';
import ReloadButton from "../../Components/ReloadButton/ReloadButton";
import { handleReload } from "../../utils/constantFunctions";

let userToken = localStorage.getItem("userToken");
const OnlineOrderPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const onlineOrderData = useSelector(
    (state) => state.onlineOrder.onlineOrderData
  );
  const isOnline = useSelector((state) => state.checkInternet.isOnline);
  const [search, setsearch] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showHideStatus, setShowHideStatus] = useState(false);
  const [status, setStatus] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [isReloading, setIsReloading] = useState(false);

  const allOrderStatus = searchParams.get("status");

  // Axios Config Object
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + userToken,
    },
  };

  useEffect(() => {
    window.addEventListener("resize", function () {
      const windowWidth = window.innerWidth;
      if (windowWidth <= 950) {
        setShowHideStatus(true);
      } else {
        setShowHideStatus(false);
      }
    });

    // Set the initial status value from URL parameter
    setStatus(allOrderStatus || "Pending");
  }, []);

  //**** Online Order Staus Handler ***** //
  const onlineOrderHandler = (status) => {
    console.log("status ", status);
    navigate("?status=" + status);

    // dispatch(getOnlineOrder(status, pageNumber, pageSizeForPag));
  };

  // to change order stutus
  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    onlineOrderHandler(e.target.value);
  };

  // Initially Calling Pending Order Data and after call on order Status
  useEffect(() => {
    if (allOrderStatus) {
      dispatch(getOnlineOrder(allOrderStatus, pageNumber, pageSizeForPag));
    } else {
      dispatch(getOnlineOrder("Pending", pageNumber, pageSizeForPag)); // Default status
    }
  }, [allOrderStatus, dispatch]);

  const paginationHandler = (e, p) => {
    console.log("paginationHandler... ", e, p);
    dispatch(getOnlineOrder(allOrderStatus, p, pageSizeForPag));
    setPageNumber(p);
  };


  return (
    <MainContentArea>
      <div className="table-cartbox">
        <div style={{ marginLeft: "2rem" }}>
          <ReloadButton
            isReloading={isReloading}
            reloadHandler={() =>
              handleReload(
                isReloading,
                setIsReloading,
                () => dispatch(getOnlineOrder(allOrderStatus, pageNumber, pageSizeForPag))
              )
            }
          />
        </div>
        {/* <div className="container mb-4"> */}
        <div
          className={
            showHideStatus === true
              ? "row gap-2 "
              : "d-flex justify-content-between align-items-center flex-wrap  mb-2"
          }
        >
          <div className="table-heading">
            <h3>{t("allOnlineOrder.onlineOrders")}</h3>
          </div>
          <div
            // className={`col-xl-7 col-md-12  status-show`}
            className={`status-show`}
            style={{ lineHeight: "45px" }}
          >
            {/* this buttons displayed on desktop screen */}
            <OnlineOrderBtnCollection
              onPendingHalder={() => onlineOrderHandler("Pending")}
              onAcceptedHandler={() => onlineOrderHandler("Accepted")}
              onInProgressHandler={() => onlineOrderHandler("In-Progress")}
              onDispatchHandler={() => onlineOrderHandler("Dispatch")}
              onDeliveredHandler={() => onlineOrderHandler("Delivered")}
              onRejectedHandler={() => onlineOrderHandler("Rejected")}
            />
          </div>
          <div className="search-container d-flex align-items-center">
            <input
              type="search"
              className="form-control"
              placeholder={t("allOnlineOrder.CustomerName")}
              aria-label="Search"
              value={search}
              onChange={(e) => setsearch(e.target.value)}
            />
            <BiSearch className="searchIcon" />

          </div>
        </div>

        {/* </div> */}

        <div className="col-8 status-hide-dropdown">
          <Select
            value={status}
            onChange={(e) => {
              handleStatusChange(e);
            }}
            className="status-show-list"
            displayEmpty
          >
            <MenuItem value="" disabled>
              {t("allOnlineOrder.SelectStatus")}
            </MenuItem>
            <MenuItem value="Pending">{t("allOnlineOrder.Pending")}</MenuItem>
            <MenuItem value="Accepted">{t("allOnlineOrder.Accepted")}</MenuItem>
            <MenuItem value="In-Progress">
              {t("allOnlineOrder.InProgress")}
            </MenuItem>
            <MenuItem value="Dispatch">{t("allOnlineOrder.Dispatch")}</MenuItem>
            <MenuItem value="Delivered">
              {t("allOnlineOrder.Delivered")}
            </MenuItem>
            <MenuItem value="Rejected">
              {t("allOnlineOrder.Cancelled")}
            </MenuItem>
          </Select>
        </div>

        <div className="status-container">
          <DisplayOrdersItem isLoading={isLoading} search={search} />
        </div>
        {isOnline && onlineOrderData?.totalCount > 0 && (
          <Pagination
            count={Math.ceil(onlineOrderData?.totalCount / 5)}
            // color="primary"
            onChange={paginationHandler}
          />
        )}

      </div>
    </MainContentArea>
  );
};

export default OnlineOrderPage;
