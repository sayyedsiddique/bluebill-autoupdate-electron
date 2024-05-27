import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import "./DisplayOrdersItem.css";
import NoOnlineOrderItem from "../NoOnlineOrderItem/NoOnlineOrderItem";
import LoadingSpinner from "../../LoadingSpinner/LoadingSpinner";
import { TbTruckDelivery } from "react-icons/tb";
import { FaWalking } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import { getOnlineOrder } from "../../../Redux/OnlineOrderSlice/onlineOrderSlice";
import { pageSizeForPag } from "../../../Containts/Values";
import debounce from "lodash/debounce";
import { Pagination } from "@mui/material";

const DisplayOrdersItem = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const allOrderStatus = searchParams.get("status");

  const defaultLang = useSelector((state) => state.language.language);
  const [defaultLanguage, setDefaultLanguage] = useState(defaultLang?.name);
  const CurrencySymbol = localStorage.getItem("StoreCurrency");
  const [search, setsearch] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const { t } = useTranslation();
  const isOnline = useSelector((state) => state.checkInternet.isOnline);

  const onlineOrderData = useSelector(
    (state) => state.onlineOrder.onlineOrderData
  );
  console.log("onlineOrderData... ", onlineOrderData);

  const isLoading = useSelector((state) => state.onlineOrder.loading);

  useEffect(() => {
    defaultLang && setDefaultLanguage(defaultLang?.name);
  }, [defaultLang?.name]);

  useEffect(() => {
    // fetchApi();
    dispatch(getOnlineOrder(pageNumber, pageSizeForPag, ""));
  }, []);

  // getting local storage default language
  useEffect(() => {
    const localStorageLang = localStorage.getItem("defaultLang");
    if (localStorageLang === "ar") {
      setDefaultLanguage("Arabic");
    } else if (localStorageLang === "en") {
      setDefaultLanguage("English");
    }
  }, [localStorage.getItem("defaultLang")]);

  // No Order available Screen
  if (onlineOrderData?.orders?.length === 0) {
    return props.isLoading ? (
      <LoadingSpinner />
    ) : (
      <NoOnlineOrderItem orderStatus={allOrderStatus} />
    );
  }

  const orderItemHandler = (orderId) => {
    navigate(`/online-order/${orderId}`, {
      state: { orderStatus: allOrderStatus },
    });
  };

  return (
    <div className="row">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        // <div className="card cardradius">
        <div className="card-body my-3 pt-0 ">
          <table className="table table-hover table-borderless">
            <thead className="table-secondary sticky-top">
              <tr className="card-order">
                <th className="dnon">{t("allOnlineOrder.OrderId")}</th>
                <th className="dnon">{t("allOnlineOrder.Date")}</th>
                <th>{t("allOnlineOrder.Customer")}</th>
                <th>{t("allOnlineOrder.Delivery")}</th>
                <th>{t("allOnlineOrder.Amount")}</th>
              </tr>
            </thead>

            {onlineOrderData?.orders
              ?.filter(
                (item) =>
                  item?.name?.toLowerCase().includes(props?.search) ||
                  item?.orderId?.toString().includes(props?.search)
              )
              .map(
                ({
                  orderId,
                  dateReport,
                  name,
                  homeDelivery,
                  totalAmount,
                  currencyName,
                }) => (
                  <tbody className="table-body">
                    <tr
                      onClick={() => orderItemHandler(orderId)}
                      style={{ cursor: "pointer" }}
                    >
                      <td className="dnon">{orderId}</td>
                      {/* <td className="dnon">{dateReport}</td> */}
                      <td className="dnon">
                        {moment(dateReport).format("DD/MM/YYYY")}
                      </td>
                      <td>{name}</td>
                      <td className="ps-5">
                        {homeDelivery ? (
                          <TbTruckDelivery />
                        ) : (
                          <FaWalking size={20} />
                        )}
                      </td>
                      <td>
                        {defaultLanguage === "ar" ||
                        defaultLanguage === "عربي" ? (
                          <td>
                            {totalAmount}
                            {CurrencySymbol}
                          </td>
                        ) : (
                          <td>
                            {CurrencySymbol}
                            {totalAmount}
                          </td>
                        )}
                      </td>
                    </tr>
                  </tbody>
                )
              )}
          </table>
        </div>
        // </div>
      )}
    </div>
  );
};

export default DisplayOrdersItem;
