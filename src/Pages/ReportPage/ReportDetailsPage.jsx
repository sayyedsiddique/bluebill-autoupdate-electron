import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";
import "./ReportPage.css";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { BsFillPrinterFill } from "react-icons/bs";
import { MdPictureAsPdf } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import ReactToPrint from "react-to-print";
import { STORE_CURRENCY, CURRENCY_SYMBOL, getUTCDate } from "../../Containts/Values";
import MainContentArea from "../MainContentArea/MainContentArea";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { BiSearch } from "react-icons/bi";
import Button from "@mui/material/Button";
import { getTransactionListByDate, getTransactionListByDay } from "../../Redux/Transaction/TransactionSlice";

const ReportDetailsPage = () => {
  const { t } = useTranslation();

  const location = useLocation();
  const dispatch = useDispatch();
  const reportData = location?.state?.reportData;
  // console.log("reportData",reportData);
  const selectedDate = location?.state?.selectedDate;
  const defaultLang = useSelector((state) => state.language.language);
  const getTransactionListByDayData = useSelector(
    (state) => state.transaction.getTransactionListByDay
  );

  console.log("getTransactionListByDayData", getTransactionListByDayData);

  const [defaultLanguage, setDefaultLanguage] = useState(defaultLang?.name);
  const CurrencySymbol = (localStorage.getItem("StoreCurrency"));


  const navigate = useNavigate();
  const componentRef = useRef();

  console.log("selectedDate :", selectedDate);

  const selectedData = reportData?.filter(
    (item) =>
      moment(item.clientLastUpdated).format("DD/MM/YYYY") === selectedDate
  );


  const columns = [
    { title: "Customer Name", field: "customerName" },
    { title: "Date", field: "clientLastUpdated", type: "numeric" },
    { title: "Payment Id", field: "paymentId", type: "numeric" },
    { title: "Payment Type", field: "modeOfPayment" },
    { title: "Total", field: "finaltotalAmount", type: "numeric" },
  ];

  const [search, setSearch] = useState([]);

  // Variables for infiniteScroll
  const [reportList, setReportList] = useState([]);
  console.log('reportList', reportList);
  const [dataLength, setDataLength] = useState(10);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setReportList(selectedData?.slice(0, 10))
  }, []);

  // we call getTransactionListByDay api ...
  useEffect(() => {
    dispatch(getTransactionListByDay(moment(selectedDate?.transactionDate).format('DD/MM/YYYY')))
    console.log("selectedDate?.transactionDate", selectedDate?.transactionDate);
  }, []);


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


  const downloadPDFHandler = () => {
    // Default export is a4 paper, portrait, using millimeters for units
    const doc = new jsPDF();
    console.log("transaction PDF Report");

    doc.text("Report Transactions Details", 20, 10);
    doc.autoTable({
      columnStyles: { europe: { halign: "center" } }, // European countries centered
      columns: columns?.map((item) => ({ ...item, dataKey: item.field })),
      // use selectedData instead of reportData
      body: selectedData?.map((item) => ({
        ...item,
        clientLastUpdated: moment(item.clientLastUpdated).format("DD/MM/YYYY"),
        customerName: item.customerName ? item.customerName : "Guest",
      })),

    });

    doc.save("Report Transactions Details.pdf");
  };

  // Infinite scroll handler
  const fetchMoreData = () => {
    if (reportList.length >= selectedData.length) {
      setHasMore(false);
    }
    setTimeout(() => {
      setReportList(reportList.concat(selectedData.slice(dataLength, dataLength + 10)));
    }, 500);
    setDataLength((prev) => prev + 10);
  };

  return (
    <MainContentArea>
      <div className="cardBox overflow-auto">
        <div className="header-container m-4">

          <h3 className="ps-2">{t("Report.transactionsReportDetails")}</h3>

          <div className="">
            <Button
              variant="contained"
              style={{
                background: "#e3e2e2",
                color: "dimgray",
              }}
              onClick={() => navigate("/Report")}
            >
              {t("Tables.back")}
            </Button>
          </div>
        </div>
        <div ref={componentRef} className="card-body m-3 pt-0 text-Color">
          <div className="d-flex justify-content-between mb-3">
            <div className="search-container">
              <input
                className="form-control "
                type="search"
                placeholder={t("Report.search")}
                aria-label="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <BiSearch className="searchIcon" />
            </div>
            <div className="pointer">
              <ReactToPrint
                trigger={() => (
                  <BsFillPrinterFill size={30} style={{ margin: 5 }} />
                )}
                content={() => componentRef.current}
                pageStyle="print"
                documentTitle="Transactions Report Details"
                bodyClass="printer"
                onAfterPrint={() => console.log("document printed!")}
              />

              <MdPictureAsPdf
                size={30}
                style={{ margin: 5 }}
                onClick={downloadPDFHandler}
              />
            </div>
          </div>

          <div>
            <InfiniteScroll
              dataLength={reportList?.length}
              next={fetchMoreData}
              hasMore={hasMore}
              height={400}
              loader={reportList?.length > 12 ? <p>loading...</p> : null}
            >
              <table className="table table-hover">
                <thead className="table-secondary sticky-top">
                  <tr>
                    <th>{t("Report.customer")}</th>
                    <th>{t("Report.date")}</th>
                    <th>{t("Report.total")}</th>
                    <th>{t("Report.paymentMode")}</th>
                    <th>{t("Report.paymentId")}</th>
                    <th>{t("Report.viewOrder")}</th>
                  </tr>
                </thead>
                <tbody>
                  {getTransactionListByDayData?.data?.paymentTransaction
                    ?.filter(
                      (item) =>
                        item?.customerName?.toLowerCase().includes(search) ||
                        item?.paymentId?.toString().includes(search)
                    )
                    ?.map(
                      (
                        {
                          customerName,
                          clientLastUpdated,
                          finaltotalAmount,
                          modeOfPayment,
                          paymentId,
                        },
                        index
                      ) => (
                        <tr key={index}>
                          <td>{customerName ? customerName : "Guest"}</td>
                          <td>
                            {moment(clientLastUpdated).format("DD/MM/YYYY")}
                          </td>
                          <td>
                            {defaultLanguage === "ar" ||
                              defaultLanguage === "عربي"
                              ? <td>
                                {/* {finaltotalAmount.toFixed(2)} */}
                                {Number.isInteger(finaltotalAmount) ? finaltotalAmount : finaltotalAmount.toFixed(2)}
                                {CurrencySymbol}
                              </td>
                              :
                              <td>
                                {CurrencySymbol}
                                {/* {finaltotalAmount.toFixed(2)} */}
                                {Number.isInteger(finaltotalAmount) ? finaltotalAmount : finaltotalAmount.toFixed(2)}
                              </td>
                            }
                          </td>
                          <td>{modeOfPayment}</td>
                          <td>{paymentId}</td>
                          <td>
                            <span
                              className="link-select"
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                navigate("/singleReportDetails", {
                                  state: { paymentId: paymentId },
                                })
                              }
                            >
                              {t("Report.viewOrder")}
                            </span>
                          </td>
                        </tr>
                      )
                    )}
                </tbody>
              </table>
            </InfiniteScroll>
          </div>
        </div>
      </div>
    </MainContentArea>
  );
};

export default ReportDetailsPage;

