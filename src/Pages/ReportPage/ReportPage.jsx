import Select from "react-select";
import React, { useEffect, useRef, useState } from "react";
import { CUSTOM_DROPDOWN_STYLE } from "../../utils/CustomeStyles";
import MainContentArea from "../MainContentArea/MainContentArea";
import "./ReportPage.css";
import { Button, InputLabel, Switch } from "@mui/material";
import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from "react-redux";
import {
  getUTCDate,
  retrieveObj,
  storeObjInLocalStrg,
  STORE_CURRENCY,
} from "../../Containts/Values";
import moment from "moment";
import {
  getTotalTransactionByMonth,
  getTransactionByDate,
  getTransactionByMonth,
} from "../../Redux/Transaction/TransactionSlice";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import NoOnlineOrderItem from "../../Components/OnlineOrders/NoOnlineOrderItem/NoOnlineOrderItem";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";
import { MdPictureAsPdf } from "react-icons/md";
import { BsFillPrinterFill } from "react-icons/bs";
import ReactToPrint from "react-to-print";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { switchStyles } from "../../utils/CustomeStyles";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import CachedIcon from '@mui/icons-material/Cached';
import ReloadButton from "../../Components/ReloadButton/ReloadButton";
import { handleReload } from "../../utils/constantFunctions";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const options = {
  plugins: {
    legend: false,
  },
  // scales: {
  //   x: {
  //     grid: {
  //       display: false
  //     }
  //   },
  //   y: {
  //     min: 2,
  //     max: 10,
  //     ticks: {
  //       stepSize: 2,
  //       callback: (value) => value + "K"
  //     },
  //     grid: {
  //       borderDash: [10]
  //     }
  //   }
  // }
};

const ReportPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const chartRef = useRef();
  const transactionPaymentApi = window.transactionPaymentApi;
  const isOnline = useSelector((state) => state.checkInternet.isOnline);

  const TransactionData = useSelector(
    (state) => state.transaction.transactionData
  );
  // console.log("TransactionData... ", TransactionData);

  const getTotalTransactionByMonthData = useSelector(
    (state) => state.transaction.getTotalTransactionByMonth
  );
  console.log("getTotalTransactionByMonthData", getTotalTransactionByMonthData);

  const dispatch = useDispatch();
  const componentRef = useRef();

  const Month = [
    { id: 1, name: "January", value: 1 },
    { id: 2, name: "February", value: 2 },
    { id: 3, name: "March", value: 3 },
    { id: 4, name: "April", value: 4 },
    { id: 5, name: "May", value: 5 },
    { id: 6, name: "June", value: 6 },
    { id: 7, name: "July", value: 7 },
    { id: 8, name: "August", value: 8 },
    { id: 9, name: "September", value: 9 },
    { id: 10, name: "October", value: 10 },
    { id: 11, name: "November", value: 11 },
    { id: 12, name: "December", value: 12 },
  ];

  const [reportData, setReportData] = useState([]);
  console.log("reportData", reportData);
  const [totalTransactionByMonthList, setTotalTransactionByMonthList] = useState([])
  console.log("totalTransactionByMonthList...", totalTransactionByMonthList);
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const isLoading = useSelector((state) => state.transaction.loading);
  const defaultLang = useSelector((state) => state.language.language);
  const [defaultLanguage, setDefaultLanguage] = useState(defaultLang?.name);
  const CurrencySymbol = localStorage.getItem("StoreCurrency");
  const [chartData, setChartData] = useState(null);
  const [isReloading, setIsReloading] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState("");

  const columns = [
    { title: "Date", field: "clientLastUpdated", type: "numeric" },
    { title: "Total", field: "finaltotalAmount", type: "numeric" },
  ];

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

  // Setting report data into state
  useEffect(() => {
    setReportData(TransactionData?.paymentTransaction);
  }, [TransactionData?.paymentTransaction]);


  // Setting TotalTransactionByMonthList data into state
  useEffect(() => {
    setTotalTransactionByMonthList(getTotalTransactionByMonthData);
  }, [getTotalTransactionByMonthData]);


  // Initially calling api in handleSelectMonth
  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = Month[currentDate.getMonth()];

    let SelectMonth;
    retrieveObj("MonthlyReport").then((data) => {
      SelectMonth = data;
      setSelectedMonth(SelectMonth ? SelectMonth : currentMonth); // set current month as default
      handleSelectMonth(SelectMonth ? SelectMonth : currentMonth);
    });
  }, [isOnline]);

  // to get report data by month
  const getReportByMonth = (month) => {
    const firstDayOfMonth = moment()
      .month(month - 1)
      .startOf("month")
      .format("DD/MM/YYYY");
    const lastDayOfMonth = moment()
      .month(month - 1)
      .endOf("month")
      .format("DD/MM/YYYY");

    if (isOnline) {
      // dispatch(getTransactionByMonth(firstDayOfMonth, lastDayOfMonth));
      dispatch(getTotalTransactionByMonth(firstDayOfMonth, lastDayOfMonth))
    } else {
      const payload = {
        startDate: firstDayOfMonth,
        endDate: lastDayOfMonth,
      };
      const transactionPaymentList =
        transactionPaymentApi?.transactionPaymentDB?.getTransactionPaymentByMonth(
          payload
        );
      console.log("transactionPaymentList... ", transactionPaymentList);
      transactionPaymentList && setReportData(transactionPaymentList);
    }
  };

  // on select drop down value
  const handleSelectMonth = (e) => {
    setSelectedMonth(e);
    storeObjInLocalStrg("MonthlyReport", e);
    if (e !== null) {
      getReportByMonth(e.value);
    }
  };

  const handleSubmit = () => {
    let StartDate = moment(startDate).format("DD/MM/YYYY");
    let EndDate = moment(endDate).format("DD/MM/YYYY");
    console.log("startDate", StartDate);
    console.log("endDate", EndDate);
    dispatch(getTransactionByDate(StartDate, EndDate));
  };

  const displayedDates = {};
  const totalAmountByDate = {};

  // to add and show to value of same date
  reportData?.forEach((data) => {
    const date = moment(data.clientLastUpdated).format("DD/MM/YYYY");

    if (displayedDates[date]) {
      totalAmountByDate[date] += data.finaltotalAmount;
      return;
    }

    displayedDates[date] = true;
    totalAmountByDate[date] = data.finaltotalAmount;
  });

  useEffect(() => {
    if (totalAmountByDate) {
      const data = {
        labels: Object.keys(totalAmountByDate),
        datasets: [
          {
            // label: "Report Transaction Chart",
            // label: t("Report.reportTransactionChart"),
            data: Object.values(totalAmountByDate),
            // fill: true,
            backgroundColor: "transparent",
            borderColor: "#62e359", // "#f26c6d",
            pointBorderWidth: "4",
            pointBorderColor: "transparent",
            tension: 0.5,
            responsive: true,
          },
        ],
      };
      setChartData(data);
    }
  }, [JSON.stringify(totalAmountByDate)]);

  // to download pdf
  const downloadPDFHandler = () => {
    // Default export is a4 paper, portrait, using millimeters for units
    const doc = new jsPDF();
    console.log("PDF report");

    doc.text("Report Transactions Details", 20, 10);
    doc.autoTable({
      columnStyles: { europe: { halign: "center" } }, // European countries centered
      columns: columns?.map((item) => ({ ...item, dataKey: item.field })),
      // body:reportData
      body: reportData?.map((item) => ({
        ...item,
        clientLastUpdated: moment(item.clientLastUpdated).format("DD/MM/YYYY"),
      })),
    });

    doc.save("Report Transactions details.pdf");
  };


  return (
    <MainContentArea scroll={"auto"}>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="main-container">
          <div className="table-cartbox">

            <div className="row">
              <div className="toggle-container mb-3"
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "0.5rem",
                  justifyContent: "space-between"
                }}
              >
                <div className="d-flex align-items-center">
                  <InputLabel style={{ color: "var(--button-bg-color)" }}>
                    {t("Report.showChart")}
                  </InputLabel>
                  <Switch
                    sx={{ ...switchStyles }}
                    checked={showChart}
                    onChange={() => setShowChart(!showChart)}
                  />
                </div>

                <div>
                  <ReloadButton
                    isReloading={isReloading}
                    reloadHandler={() =>
                      handleReload(
                        isReloading,
                        setIsReloading,
                        () => dispatch(getTotalTransactionByMonth(startDate, endDate))
                      )
                    }
                  />
                </div>
              </div>

              {showChart ? (
                <div
                // className="card cardradius "
                >
                  <div className="report-chart">
                    <Line data={chartData} options={options} />
                  </div>
                </div>
              ) : (
                <div className="">
                  <div className="reportDashboard d-flex flex-wrap justify-content-between pt-3">
                    <div className="d-flex flex-wrap">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginLeft: "0.5rem",
                        }}
                      >
                        <label className="text-Color">
                          {t("Report.selectCustomDate")}
                        </label>
                        <Switch
                          sx={{ ...switchStyles }}
                          checked={showCustomDate}
                          onChange={() => setShowCustomDate(!showCustomDate)}
                        />
                      </div>

                      {showCustomDate ? (
                        <div className="customDate-container d-flex">
                          <div className="report-datePicker">
                            <div
                              className="date"
                              style={{ width: 150, margin: "0.5rem" }}
                            >
                              <DatePicker
                                placeholderText={t("Report.startDate")}
                                className="form-control datePicker-input"
                                selected={startDate}
                                maxDate={new Date()} // Disable dates after today
                                dateFormat="d/MM/yyyy"
                                style={{ marginRight: 5 }}
                                onChange={(date) => setStartDate(date)}
                              />
                            </div>

                            <div
                              className="date"
                              style={{ width: 150, margin: "0.5rem" }}
                            >
                              <DatePicker
                                placeholderText={t("Report.endDate")}
                                className="form-control datePicker-input"
                                selected={endDate}
                                maxDate={new Date()} // Disable dates after today
                                dateFormat="d/MM/yyyy"
                                onChange={(date) => setEndDate(date)}
                              />
                            </div>
                          </div>

                          {startDate && (
                            <div
                              className="datePicker-btn"
                              style={{ margin: "0.5rem" }}
                            >
                              <Button
                                variant="contained"
                                style={{ background: "var(--main-bg-color)" }}
                                onClick={handleSubmit}
                              >
                                {t("Report.getReport")}
                              </Button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="buttonDiv">
                          <div className="month-selector">
                            <Select
                              placeholder={t("Report.selectMonth")}
                              getOptionLabel={(Month) => Month?.name}
                              options={Month}
                              style={{ width: 40 }}
                              styles={CUSTOM_DROPDOWN_STYLE}
                              value={selectedMonth}
                              onChange={(e) => {
                                handleSelectMonth(e);
                              }}
                              isClearable
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="printerPDF-btn text-Color pointer">
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
                  <div className="row report-container">
                    {totalTransactionByMonthList?.data && totalTransactionByMonthList?.data?.length !== 0 ? (
                      <div ref={componentRef} className="card-body my-3 pt-0">
                        <table className="table table-hover">
                          <thead
                            className="table-secondary sticky-top"
                            style={{ zIndex: 0 }}
                          >
                            <tr className="justify-content-between">
                              <th>{t("Report.date")}</th>
                              <th>{t("Report.total")}</th>
                              <th>{t("Report.details")}</th>
                            </tr>
                          </thead>

                          {totalTransactionByMonthList?.data?.map((date, index) => (
                            <tbody key={index}>
                              <tr>
                                {/* <td>{date}</td> */}
                                <td>{moment(date?.transactionDate).format('DD/MM/YYYY')}</td>
                                <td>
                                  {defaultLanguage === "ar" ||
                                    defaultLanguage === "عربي" ? (
                                    <span>
                                      {/* {totalAmountByDate[date].toFixed(2)}
                                      {Number.isInteger(totalAmountByDate[date])
                                        ? totalAmountByDate[date]
                                        : totalAmountByDate[date].toFixed(2)}
                                      {CurrencySymbol} */}
                                      {parseFloat(date.totalAmountPerDay).toFixed(2)}
                                      {CurrencySymbol}
                                    </span>
                                  ) : (
                                    <span>
                                      {CurrencySymbol}
                                      {parseFloat(date.totalAmountPerDay).toFixed(2)}
                                      {/* {CurrencySymbol}
                                      {Number.isInteger(totalAmountByDate[date])
                                        ? totalAmountByDate[date]
                                        : totalAmountByDate[date].toFixed(2)}
                                      {totalAmountByDate[date].toFixed(2)} */}
                                    </span>
                                  )}
                                </td>
                                <td>
                                  <span
                                    className="link-select"
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                      navigate("/reportDetails", {
                                        state: {
                                          reportData: totalTransactionByMonthList?.data,
                                          selectedDate: date,
                                        },
                                      })
                                    }
                                  >
                                    {t("Report.details")}
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          ))}
                        </table>
                      </div>
                    ) : (
                      <NoOnlineOrderItem
                        orderStatus={t("Report.emptyPageNote")}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </MainContentArea>
  );
};

export default ReportPage;
