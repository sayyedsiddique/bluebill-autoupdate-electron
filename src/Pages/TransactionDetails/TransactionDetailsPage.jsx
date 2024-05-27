import Select from "react-select";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUTCDate,
  retrieveObj,
  storeObjInLocalStrg,
  STORE_CURRENCY,
  pageSizeForPag,
} from "../../Containts/Values";
import {
  getTransactionByDate,
  getTransactionByMonth,
} from "../../Redux/Transaction/TransactionSlice";
import { CUSTOM_DROPDOWN_STYLE, switchStyles } from "../../utils/CustomeStyles";
import MainContentArea from "../MainContentArea/MainContentArea";
import "./Transaction.css";
import ReactToPrint from "react-to-print";
import { Button, Pagination, Switch } from "@mui/material";
import { BsFillPrinterFill } from "react-icons/bs";
import { MdPictureAsPdf } from "react-icons/md";
import jsPDF from "jspdf";
import "jspdf-autotable";
import DatePicker from "react-datepicker";
import moment from "moment/moment";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";
import NoOnlineOrderItem from "../../Components/OnlineOrders/NoOnlineOrderItem/NoOnlineOrderItem";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import { BiSearch } from "react-icons/bi";
import { MonthsByDays, handleReload } from "../../utils/constantFunctions";
import CachedIcon from '@mui/icons-material/Cached';
import ReloadButton from "../../Components/ReloadButton/ReloadButton";
import { getSalesExecutiveList } from "../../Redux/SalesExecutive/SalesExecutiveSlice";

const TransactionDetailsPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const transactionPaymentApi = window.transactionPaymentApi;
  const salesExecutiveApi = window.salesExecutiveApi;
  const isLoading = useSelector((state) => state.transaction.loading);
  const TransactionData = useSelector(
    (state) => state.transaction.transactionData
  );
  const SalesExecutiveData = useSelector(
    (state) => state.salesExecutive.SalesExecutiveData
  );
  console.log("SalesExecutiveData0010", SalesExecutiveData);
  const isOnline = useSelector((state) => state.checkInternet.isOnline);
  console.log("TransactionData... ", TransactionData);

  //   salesExecutiveName
  // : 
  // "Admin"

  const defaultLang = useSelector((state) => state.language.language);
  const [defaultLanguage, setDefaultLanguage] = useState(defaultLang?.name);
  const CurrencySymbol = localStorage.getItem("StoreCurrency");
  const [isReloading, setIsReloading] = useState(false);
  const [startDate, setStartDate] = useState("");
  console.log("startDate... ", startDate);
  const [endDate, setEndDate] = useState("");
  const [byMonth, setByMonth] = useState(MonthsByDays[1]);
  console.log("byMonth... ", byMonth);
  const [searchProduct, setSearchProduct] = useState("");
  const [emptyString, setEmptyString] = useState(
    "transaction please select date"
  );
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedsalesExecutive, setSelectedsalesExecutive] = useState("All");
  const [salesExecutiveList, setSalesExecutiveList] = useState([]);
  console.log("salesExecutiveList", salesExecutiveList);

  const dispatch = useDispatch();
  const componentRef = useRef();
  const Month = [
    {
      id: 0,
      name: t("Transaction.today"),
      value: getUTCDate() - 0 * 86400000,
    },
    {
      id: 1,
      name: t("Transaction.last7Days"),
      value: getUTCDate() - 7 * 86400000,
    },
    {
      id: 2,
      name: t("Transaction.last30Days"),
      value: getUTCDate() - 30 * 86400000,
    },
    {
      id: 3,
      name: t("Transaction.last3Month"),
      value: getUTCDate() - 90 * 86400000,
    },
    {
      id: 4,
      name: t("Transaction.last6Month"),
      value: getUTCDate() - 180 * 86400000,
    },
  ];

  const [transactionData, setTransactionData] = useState([]);
  console.log("transactionData... ", transactionData)






  const [showCustomDate, setShowCustomDate] = useState(false);
  console.log("showCustomDate", showCustomDate);
  // Variables for infiniteScroll
  // const [transactionList, setTransactionList] = useState("");
  // const [dataLength, setDataLength] = useState(10);
  // const [hasMore, setHasMore] = useState(true);

  const columns = [
    { title: "Customer Name", field: "customerName" },
    { title: "Date", field: "clientLastUpdated", type: "numeric" },
    { title: "Served By", field: "salesExecutiveName" },
    { title: "Payment Type", field: "modeOfPayment" },
    { title: "Total", field: "finaltotalAmount", type: "numeric" },
  ];

  // set transaction data
  useEffect(() => {
    TransactionData?.paymentTransaction?.length > 0 &&
      setTransactionData(TransactionData?.paymentTransaction);
    // TransactionData?.paymentTransaction &&
    //   setTransactionList(TransactionData?.paymentTransaction?.slice(0, 10));
  }, [TransactionData?.paymentTransaction]);

  // set default transaction data
  useEffect(() => {
    let SelectedDate = "";
    retrieveObj("SelectedTransactionDate").then((data) => {
      if (isOnline) {
        if (data !== null) {
          setByMonth(data);
          SelectedDate = data.value;
          console.log("SelectedDateIF... ", SelectedDate);
          dispatch(
            getTransactionByMonth(
              moment(SelectedDate).format("DD/MM/YYYY"), // start date
              moment(getUTCDate()).format("DD/MM/YYYY"), // end date
              pageNumber,
              pageSizeForPag,
              ""
            )
          );
        } else {
          setByMonth(MonthsByDays[1]);
          SelectedDate = getUTCDate() - 7 * 86400000;
          console.log("SelectedDateELSE", MonthsByDays[0]);
          dispatch(
            getTransactionByMonth(
              moment(SelectedDate).format("DD/MM/YYYY"), // start date
              moment(getUTCDate()).format("DD/MM/YYYY"), // end date
              pageNumber,
              pageSizeForPag,
              ""
            )
          );
        }
      } else {
        SelectedDate = getUTCDate() - 7 * 86400000;
        const payload = {
          // startDate: data
          //   ? moment(data.value).format("DD/MM/YYYY")
          //   : moment(SelectedDate).format("DD/MM/YYYY"),
          // endDate: moment(getUTCDate()).format("DD/MM/YYYY"),
          startDate: getUTCDate(),
          endDate: data ? data?.value : SelectedDate,
        };
        const transactionPaymentList =
          transactionPaymentApi?.transactionPaymentDB?.getTransactionPaymentByMonth(
            payload
          );
        console.log("transactionPaymentList... ", transactionPaymentList);
        setTransactionData(transactionPaymentList);
        // setTransactionList(transactionPaymentList.slice(0, 10));
      }
    });
  }, [isOnline]);

  useEffect(() => {
    defaultLang && setDefaultLanguage(defaultLang?.name);
  }, [defaultLang?.name]);

  // getting local storage default language
  useEffect(() => {
    const localStorageLang = localStorage.getItem("defaultLang");
    if (localStorageLang === "ar") {
      setDefaultLanguage("Arabic");
    } else if (localStorageLang === "en") {
      setDefaultLanguage("English");
    }
  }, [localStorage.getItem("defaultLang")]);

  // to select date from drop down
  const handleSelectMonth = (e) => {
    console.log("handleSelectMonth ", e);
    if (e?.name === "Custom") {
      setShowCustomDate(true);
    } else {
      setShowCustomDate(false);
    }
    setByMonth(e);
    storeObjInLocalStrg("SelectedTransactionDate", e);
    setTransactionData("");

    if (isOnline) {
      if (e !== null) {
        dispatch(
          getTransactionByMonth(
            moment(e?.value).format("DD/MM/YYYY"),
            moment(e?.name === "Today" ? e?.value : getUTCDate()).format(
              "DD/MM/YYYY"
            ),
            pageNumber,
            pageSizeForPag,
            ""
          )
        );
        setEmptyString(`${t("Transaction.transactionInLast")} ${e?.name}`);
      }
    } else {
      const payload = {
        // startDate: moment(e?.value).format("DD/MM/YYYY"),
        // endDate: moment(getUTCDate()).format("DD/MM/YYYY"),
        startDate: getUTCDate(),
        endDate: e?.value
      };
      const transactionPaymentList =
        transactionPaymentApi?.transactionPaymentDB?.getTransactionPaymentByMonth(
          payload
        );
      console.log("transactionPaymentList... ", transactionPaymentList);
      setTransactionData(transactionPaymentList);
      // setTransactionList(transactionPaymentList.slice(0, 10));
    }
  };

  // to download transaction pdf
  const downloadPDFHandler = () => {
    // Default export is a4 paper, portrait, using millimeters for units
    const doc = new jsPDF();
    console.log("PDF chala");

    doc.text("Transactions Details", 20, 10);
    doc.autoTable({
      columnStyles: { europe: { halign: "center" } }, // European countries centered
      columns: columns?.map((item) => ({ ...item, dataKey: item.field })),
      body: transactionData?.map((item) => ({
        ...item,
        clientLastUpdated: moment(item.clientLastUpdated).format("DD/MM/YYYY"),
        customerName: item.customerName ? item.customerName : "Guest",
      })),
    });

    doc.save("Transactions details.pdf");
  };

  // to call final api
  const handleSubmit = () => {
    let SDate = moment(startDate).format("DD/MM/YYYY");
    let EndDate = moment(endDate).format("DD/MM/YYYY");
    console.log("startDate", SDate);

    if (isOnline) {
      dispatch(
        getTransactionByMonth(SDate, EndDate, pageNumber, pageSizeForPag, "")
      );
    } else {
      const payload = {
        startDate: SDate,
        endDate: EndDate,

      };
      const transactionPaymentList =
        transactionPaymentApi?.transactionPaymentDB?.getTransactionPaymentByDate(
          payload
        );
    }
  };


  useEffect(() => {
    setSalesExecutiveList(SalesExecutiveData);
  }, [SalesExecutiveData]);


  // call getSalesExecutiveList api..
  useEffect(() => {
    if (isOnline) {
      dispatch(getSalesExecutiveList());
    } else {
      const salesExList =
        salesExecutiveApi?.salesExecutiveDB?.getAllSalesExecutive();
      setSalesExecutiveList(salesExList);
    }

  }, []);

  const salesExecutiveSelectHandler = (salesDetails) => {
    console.log("salesDetails", salesDetails);
    setSelectedsalesExecutive(salesDetails)
    dispatch(getTransactionByMonth(startDate, endDate, pageNumber, pageSizeForPag, salesDetails?.id));

  }


  const paginationHandler = (e, p) => {
    console.log("paginationHandler... ", e, p);
    let SDate =
      byMonth?.value && byMonth?.value
        ? moment(byMonth?.value).format("DD/MM/YYYY")
        : moment(startDate).format("DD/MM/YYYY");
    let EndDate = moment(getUTCDate()).format("DD/MM/YYYY");
    if (isOnline) {
      dispatch(getTransactionByMonth(SDate, EndDate, p, pageSizeForPag, ""));
    } else {
      const payload = {
        startDate: moment(byMonth?.value).format("DD/MM/YYYY"),
        endDate: moment(getUTCDate()).format("DD/MM/YYYY"),
      };
      const transactionPaymentList =
        transactionPaymentApi?.transactionPaymentDB?.getTransactionPaymentByMonth(
          payload
        );
      setTransactionData(transactionPaymentList);
    }
    setPageNumber(p);
  };

  return (
    <MainContentArea>

      <div className="main-container">
        <div className="table-cartbox">
          <div className="printerPDF-button text-Color pointer d-flex align-items-center justify-content-end">
            <ReactToPrint
              trigger={() => (
                <BsFillPrinterFill size={30} style={{ margin: 5 }} />
              )}
              content={() => componentRef.current}
              pageStyle="print"
              documentTitle="Transaction Details"
              bodyClass="printer"
              onAfterPrint={() => console.log("document printed!")}
            />

            <MdPictureAsPdf
              size={30}
              style={{ margin: 5 }}
              onClick={downloadPDFHandler}
            />

            <div>
              <ReloadButton
                isReloading={isReloading}
                reloadHandler={() =>
                  handleReload(
                    isReloading,
                    setIsReloading,
                    () => dispatch(getTransactionByMonth(startDate, endDate, pageNumber, pageSizeForPag, "")),
                    dispatch(getSalesExecutiveList()),
                  )
                }
              />
            </div>
          </div>
          <div className="">
            {/* <div className="card cardradius" style={{ marginTop: 5 }}> */}

            <div
              className="header-container transaction-container"
              style={{ margin: 0, marginTop: 10 }}
            >
              <div className="table-heading">
                <h3>{t("Transaction.transactionList")}</h3>
              </div>
              <div className="search-container">
                <input
                  className="form-control "
                  type="search"
                  placeholder={t("Transaction.search")}
                  aria-label="Search"
                  value={searchProduct}
                  onChange={(e) => setSearchProduct(e.target.value)}
                />
                <BiSearch className="searchIcon" />
              </div>
              {/* <div className="text-Color">
                <label>{t("Transaction.selectCustomDate")}</label>
                <Switch
                  sx={{ ...switchStyles }}
                  checked={showCustomDate}
                  onChange={() => setShowCustomDate(!showCustomDate)}
                />
              </div> */}
              <div className="d-flex align-items-center flex-wrap" style={{ gap: "10px" }}>
                <div className="buttonDiv">
                  {showCustomDate && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                      <div style={{ width: 150, marginRight: 10 }}>
                        <DatePicker
                          placeholderText={t("Transaction.startDate")}
                          // minDate={sDate}
                          className="form-control"
                          selected={startDate}
                          dateFormat="d/MM/yyyy"
                          style={{ marginRight: 5 }}
                          onChange={(date) => setStartDate(date)}
                        />
                      </div>
                      <div style={{ width: 150 }}>
                        <DatePicker
                          placeholderText={t("Transaction.endDate")}
                          // minDate={sDate}
                          className="form-control"
                          selected={endDate}
                          dateFormat="d/MM/yyyy"
                          onChange={(date) => setEndDate(date)}
                        />
                      </div>
                      {startDate && (
                        <div style={{ marginLeft: 5, marginRight: 10 }}>
                          <Button
                            variant="contained"
                            style={{
                              backgroundColor: "var(--button-bg-color)",
                              color: "var(--button-color)",
                            }}
                            onClick={handleSubmit}
                          >
                            {t("Transaction.find")}
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="month-Select">
                  <Select
                    placeholder={t("Transaction.selectMonth")}
                    getOptionLabel={(MonthsByDays) => MonthsByDays?.name}
                    options={MonthsByDays}
                    style={{ width: 40 }}
                    styles={CUSTOM_DROPDOWN_STYLE}
                    value={byMonth}
                    onChange={(e) => {
                      handleSelectMonth(e);
                    }}
                    isClearable
                  />
                </div>
                <div className="salesExsecutive-dropdownList" >
                  <Select
                    styles={CUSTOM_DROPDOWN_STYLE}
                    placeholder={t("Transaction.selectSalesExecutive")}
                    options={salesExecutiveList}
                    value={selectedsalesExecutive ? selectedsalesExecutive : null}
                    getOptionLabel={(salesExecutiveList) =>
                      salesExecutiveList?.name
                    }
                    onChange={(e) => salesExecutiveSelectHandler(e)}
                    isClearable
                  />
                </div>
              </div>
            </div>
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <div className="row tansaction-container">
                {transactionData.length !== 0 ? (
                  <div ref={componentRef} className="card-body my-3 pt-0">
                    {/* <InfiniteScroll
                      dataLength={transactionList.length}
                      next={fetchMoreData}
                      hasMore={hasMore}
                      height={400}
                      loader={
                        transactionList.length > 15 ? (
                          <p className="text-Color">loading...</p>
                        ) : null
                      }
                    > */}
                    <table className="table table-hover table-borderless">
                      <thead
                        className="table-secondary sticky-top"
                        style={{ zIndex: 0 }}
                      >
                        <tr>
                          <th>{t("Transaction.customer")}</th>
                          <th>{t("Transaction.paymentId")}</th>
                          <th>{t("Transaction.date")}</th>
                          <th>{t("Transaction.servedBy")}</th>
                          <th>{t("Transaction.paymentType")}</th>
                          <th>{t("Transaction.total")}</th>
                        </tr>
                      </thead>

                      {transactionData
                        ?.filter((item) =>
                          item?.paymentId
                            ?.toString()
                            .toLowerCase()
                            ?.includes(searchProduct)
                        )
                        ?.map(
                          (
                            {
                              customerName,
                              clientLastUpdated,
                              salesExecutiveName,
                              modeOfPayment,
                              finaltotalAmount,
                              paymentId,
                            },
                            index
                          ) => (
                            <tbody key={index}>
                              <tr
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  navigate("/transactionDetails", {
                                    state: { paymentId: paymentId },
                                  })
                                }
                              >
                                <td>
                                  {customerName ? customerName : "Guest"}
                                </td>
                                <td>{paymentId}</td>
                                <td>
                                  {moment(clientLastUpdated).format(
                                    "DD/MM/YYYY"
                                  )}
                                </td>
                                <td>
                                  {salesExecutiveName
                                    ? salesExecutiveName
                                    : "Not Set"}
                                </td>
                                <td>{modeOfPayment}</td>
                                <td>
                                  {defaultLanguage === "ar" ||
                                    defaultLanguage === "عربي" ? (
                                    <span>
                                      {finaltotalAmount.toFixed(2)}
                                      {CurrencySymbol}
                                    </span>
                                  ) : (
                                    <span>
                                      {CurrencySymbol}
                                      {finaltotalAmount.toFixed(2)}
                                    </span>
                                  )}
                                </td>
                              </tr>
                            </tbody>
                          )
                        )}
                    </table>
                    {/* </InfiniteScroll> */}
                  </div>
                ) : (
                  <NoOnlineOrderItem orderStatus={t(emptyString)} />
                )}
              </div>
            )}
            {/* </div> */}
            {isOnline && TransactionData?.totalCount > 0 && (
              <Pagination
                count={Math.ceil(TransactionData?.totalCount / 5)}
                // color="primary"
                onChange={paginationHandler}
              />
            )}
          </div>
        </div>
      </div>

    </MainContentArea>
  );
};

export default TransactionDetailsPage;
