import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "./DashboardPage.css";
import whatsapp from "../../assets/images/SocialIcons/whatsapp.png";
import facebook from "../../assets/images/SocialIcons/facebook.png";
import twitter from "../../assets/images/SocialIcons/twitter.png";
import MainContentArea from "../MainContentArea/MainContentArea";
import {
  CurrencySymbol,
  retrieveObj,
  Periods,
  storeObjInLocalStrg,
  getUTCDate,
  STORE_Id,
  startOfMonth,
} from "../../Containts/Values";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  getTransactionAmountByPeriod,
  getTransactionByDate,
  getTransactionByMonth,
} from "../../Redux/Transaction/TransactionSlice";
import moment from "moment";
import Select from "react-select";
import { CUSTOM_DROPDOWN_STYLE } from "../../utils/CustomeStyles";
import {
  Chart as ChartJS,
  CategoryScale, // x aixs
  LinearScale, // y axis
  PointElement,
  LineElement,
  // Title,
  // Tooltip,
  // Legend,
  // Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { MONTHS, MonthsByDays } from "../../utils/constantFunctions";
import TrialNotification from "../../Components/TrialNotification/TrialNotification";
import { getTopSellingProduct } from "../../Redux/Product/productSlice";
import TopSellingProductsCart from "./TopSellingProducts/TopSellingProductsCart";
import { FaBoxOpen } from "react-icons/fa";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";
import { getTopBuyers } from "../../Redux/Customer/customerSlice";
import { MdPeople } from "react-icons/md";
import DatePicker from "react-datepicker";
import { Button } from "@mui/material";
import TopBuyersListCart from "./TopSellingProducts/TopBuyers/TopBuyersListCart";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
  // Title,
  // Tooltip,
  // Legend,
  // Filler
);

const DashboardPage = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const transactionPaymentApi = window.transactionPaymentApi;

  const defaultLang = useSelector((state) => state?.language?.language);
  const [defaultLanguage, setDefaultLanguage] = useState(defaultLang?.name);
  const CurrencySymbol = localStorage.getItem("StoreCurrency");
  const isOnline = useSelector((state) => state.checkInternet.isOnline);
  const TransactionData = useSelector(
    (state) => state.transaction.transactionData
  );
  const TransactionLoading = useSelector((state) => state.transaction.loading);
  const topSellingProductList = useSelector(
    (state) => state.product.topSellingProduct
  );
  const topSellingProductListLoading = useSelector(
    (state) => state.product.loading
  );
  const topBuyersDataList = useSelector(
    (state) => state.customer.topBuyersData
  );
  console.log("topBuyersDataList... ", topBuyersDataList);
  const transactionAmountByPeriod = useSelector(
    (state) => state.transaction.transactionAmountByPeriod
  );

  const [currentMonthTotal, setCurrentMonthTotal] = useState(0);

  console.log("currentMonthTotal :", currentMonthTotal);

  const [selectedMonth, setSelectedMonth] = useState(MonthsByDays[1]);
  console.log("selectedMonth... ", selectedMonth);
  const [transAmountPeriodValue, setTransAmountPeriodValue] = useState();
  console.log("transAmountPeriodValue... ", transAmountPeriodValue);

  // state variables for monthly transactions
  const [monthTransactionData, setMonthTransactionData] = useState([]);
  console.log("monthTransactionData... ", monthTransactionData);

  const [startDate, setStartDate] = useState("");
  console.log("startDate... ", startDate);
  const [endDate, setEndDate] = useState("");
  console.log("endDate..", endDate);

  const [showCustomDate, setShowCustomDate] = useState(false);
  const [chartData, setCartData] = useState({});
  const [options, setOptions] = useState({});

  // let chartData = {};
  // let options = {};
  // Chart data making here
  // useEffect(() => {
  //   const displayedDates = {};
  //   const totalAmountByDate = {};

  //   monthTransactionData &&
  //     monthTransactionData?.map((data) => {
  //       // const date = moment(data.clientLastUpdated).format("DD/MM/YYYY");
  //       const date =
  //         selectedMonth?.name === "today"
  //           ? moment(data.clientLastUpdated).format("HH:mm:ss")
  //           : moment(data.clientLastUpdated).format("DD/MM/YYYY");
  //       console.log("date... ", date);

  //       if (displayedDates[date]) {
  //         totalAmountByDate[date] += data?.finaltotalAmount;
  //         return;
  //       }

  //       displayedDates[date] = true;
  //       totalAmountByDate[date] = data?.finaltotalAmount;
  //     });

  //   console.log("totalAmountByDateKey... ", totalAmountByDate);
  //   console.log("displayedDates... ", displayedDates);
  //   console.log(
  //     "totalAmountByDateKey... ",
  //     Object.keys(totalAmountByDate).sort()
  //   );
  //   console.log(
  //     "totalAmountByDateValues... ",
  //     Object.values(totalAmountByDate)
  //   );

  //   //for monthly transactions chart
  //   let chartData = {
  //     labels: Object.keys(totalAmountByDate).sort(),
  //     // labels: ["May 12", "May 13", "May 14", "May 15", "May 16", "May 17", "May 18"],

  //     datasets: [
  //       {
  //         // label: "Month Transactions",
  //         // label: t("Dashboard.monthTransactions"),
  //         data: Object.values(totalAmountByDate),
  //         // fill: true,
  //         backgroundColor: "transparent",
  //         borderColor: "#62e359", // "#f26c6d",
  //         pointBorderWidth: "4",
  //         pointBorderColor: "transparent",
  //         tension: 0.5,
  //         responsive: true,
  //       },
  //     ],

  //     // datasets: [{
  //     //   data: [8, 7.8, 6, 8, 7, 5, 6, ],
  //     //   backgroundColor: "transparent",
  //     //   borderColor: "#f26c6d",
  //     //   pointBorderColor: "transparent",
  //     //   pointBorderWidth: 4,
  //     //   tension: 0.5
  //     // }]
  //   };

  //   let options = {
  //     plugins: {
  //       legend: false,
  //     },
  //   };

  //   chartData && setCartData(chartData);
  //   options && setOptions(options);
  // }, [monthTransactionData]);

  // getting finalTotalAmount through getTransactionByMonth api
  useEffect(() => {
    let SelectedDate = "";
    retrieveObj("dasboardTransactionPeriod").then((data) => {
      console.log("dasboardTransactionPeriod... ", data);
      if (isOnline) {
        if (data !== null) {
          setTransAmountPeriodValue(data);
          const startDate = data?.value; // it's UTC time
          const endDate = getUTCDate();
          console.log(
            "startDate ",
            moment(startDate).format("DD/MM/YYYY"),
            " endDate ",
            moment(endDate).format("DD/MM/YYYY")
          );
          // dispatch(getTransactionAmountByPeriod(startDate, endDate, STORE_Id));
          dispatch(
            getTransactionByMonth(
              moment(startDate).format("DD/MM/YYYY"),
              // moment(selectedOption?.name === "Today" ? endDate : getUTCDate()).format(
              //   "DD/MM/YYYY"
              // ),
              moment(endDate).format("DD/MM/YYYY"),
              1,
              5,
              ""
            )
          );
        } else {
          setTransAmountPeriodValue(MonthsByDays[1]);
          const startDate = MonthsByDays[1]?.value; // it's UTC time
          const endDate = getUTCDate();
          // dispatch(getTransactionAmountByPeriod(startDate, endDate, STORE_Id));
          dispatch(
            getTransactionByMonth(
              moment(startDate).format("DD/MM/YYYY"),
              // moment(selectedOption?.name === "Today" ? endDate : getUTCDate()).format(
              //   "DD/MM/YYYY"
              // ),
              moment(endDate).format("DD/MM/YYYY"),
              1,
              5,
              ""
            )
          );
        }
      } else {
        SelectedDate = MonthsByDays[1]?.value;
        console.log("SelectedDate... ", SelectedDate);
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
        transactionPaymentList &&
          setMonthTransactionData(transactionPaymentList);
      }
    });
  }, [isOnline]);

  // to set current active month
  // useEffect(() => {
  //   const currentMonth = moment().month();
  //   console.log("currentMonth... ", currentMonth);
  //   getReportByMonth(currentMonth);
  // }, []);

  //to get report data from api
  // accepting time in integer
  const getReportByMonth = (timeValue) => {
    console.log("timeValue... ", timeValue);
    if (isOnline) {
      const firstDayOfMonth = moment()
        .month(timeValue - 1)
        .startOf("month")
        .format("DD/MM/YYYY");
      const lastDayOfMonth = moment()
        .month(timeValue - 1)
        .endOf("month")
        .format("DD/MM/YYYY");
      dispatch(
        getTransactionByMonth(firstDayOfMonth, lastDayOfMonth, 1, 5, "")
      );
      // dispatch(getTransactionByDate())
      setSelectedMonth(MonthsByDays[timeValue - 1]);
    } else {
      const payload = {
        // startDate: moment(e?.value).format("DD/MM/YYYY"),
        // endDate: moment(getUTCDate()).format("DD/MM/YYYY"),
        startDate: getUTCDate(),
        endDate: timeValue,
      };
      const transactionPaymentList =
        transactionPaymentApi?.transactionPaymentDB?.getTransactionPaymentByMonth(
          payload
        );
      console.log("transactionPaymentList... ", transactionPaymentList);
      transactionPaymentList && setMonthTransactionData(transactionPaymentList);
    }

    // getTransaction finalTotalAmount api
    // const startDate = month; // it's UTC time
    // const endDate = getUTCDate();
    // dispatch(getTransactionAmountByPeriod(startDate, endDate, STORE_Id));
  };

  // calling get top selling product list api
  useEffect(() => {
    dispatch(getTopSellingProduct());
    const startDate = getUTCDate();
    const endStart = getUTCDate(startOfMonth(new Date()));
    // console.log("startOfMonth ", getUTCDate(startOfMonth(new Date())))
    dispatch(getTopBuyers(startDate, endStart));
  }, []);

  useEffect(() => {
    TransactionData?.paymentTransaction &&
      setMonthTransactionData(TransactionData?.paymentTransaction);
  }, [TransactionData?.paymentTransaction]);

  useEffect(() => {
    if (monthTransactionData?.length > 0) {
      const total = monthTransactionData?.reduce(
        (acc, cur) => acc + cur?.finaltotalAmount,
        0
      );
      setCurrentMonthTotal(total);
    } else {
      setCurrentMonthTotal(0);
    }

    // getTransaction finalTotalAmount api
    // transactionAmountByPeriod &&
    //   setCurrentMonthTotal(transactionAmountByPeriod?.finalTotalAmount);
  }, [monthTransactionData, transactionAmountByPeriod]);

  //for select month
  const handleMonthChange = (selectedOption) => {
    console.log("selectedOption ", selectedOption);
    // getTransaction finalTotalAmount api
    storeObjInLocalStrg("dasboardTransactionPeriod", selectedOption);
    // setTransAmountPeriodValue(selectedOption);
    if (selectedOption?.name === "Custom") {
      setShowCustomDate(true);
    } else {
      setShowCustomDate(false);
    }
    setSelectedMonth(selectedOption);
    getReportByMonth(selectedOption?.value);

    if (isOnline) {
      if (selectedOption !== null) {
        dispatch(
          getTransactionByMonth(
            moment(selectedOption?.value).format("DD/MM/YYYY"),
            moment(
              selectedOption?.name === "Today"
                ? selectedOption?.value
                : getUTCDate()
            ).format("DD/MM/YYYY"),
            1,
            5,
            ""
          )
        );
        setSelectedMonth(selectedOption);
      }
    } else {
      const payload = {
        // startDate: moment(e?.value).format("DD/MM/YYYY"),
        // endDate: moment(getUTCDate()).format("DD/MM/YYYY"),
        startDate: getUTCDate(),
        endDate: selectedOption?.value,
      };
      const transactionPaymentList =
        transactionPaymentApi?.transactionPaymentDB?.getTransactionPaymentByMonth(
          payload
        );
      console.log("transactionPaymentList... ", transactionPaymentList);
      transactionPaymentList && setMonthTransactionData(transactionPaymentList);
    }
  };

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

  // to call final api
  const handleSubmit = () => {
    let SDate = moment(startDate).format("DD/MM/YYYY");
    let EndDate = moment(endDate).format("DD/MM/YYYY");
    console.log("startDate", SDate);

    if (isOnline) {
      dispatch(getTransactionByDate(SDate, EndDate));
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

  return TransactionLoading || topSellingProductListLoading ? (
    <LoadingSpinner />
  ) : (
    <MainContentArea scroll="auto">
      {/* <TrialNotification/> */}

      {/* <div className="overHeadingBox ">
        <h4 className="dashHeading">{t("Dashboard.overview")}</h4>
      </div> */}

      <div className="dashboard-container">
        <div className="dashborad-scroll">
          <div className="row overviewContainer ">
            <div className="col-md-6 mb-md-3 mb-sm-3 mb-lg-0 overviewBox">
              <h4 className="text-heading">{t("Dashboard.cardOneHeading")}</h4>
              <p className="text-des light-black-color">
                {t("Dashboard.cardOneDescription")}.
              </p>
              <div className="storeLink">
                <a href="https://tinyurl.com/almathaq" target={"_blank"}>
                  tinyurl.com/almathaq
                </a>
              </div>
              <div className="storeSocialMedia d-flex align-items-center">
                <div className="socialIcons text-label">
                  <h4 className="m-0 text-Color">
                    {t("Dashboard.cardOneShareVia")}
                  </h4>
                </div>
                <div className="social_icons_container d-flex">
                  <div className="socialIcons">
                    <Link to="">
                      <img
                        src={whatsapp}
                        width="35px"
                        alt="social media icons"
                      />
                    </Link>
                  </div>
                  <div className="socialIcons">
                    <Link to="">
                      <img
                        src={facebook}
                        width="35px"
                        alt="social media icons"
                      />
                    </Link>
                  </div>
                  <div className="socialIcons">
                    <Link to="">
                      <img
                        src={twitter}
                        width="35px"
                        alt="social media icons"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-5 mb-md-3 mb-sm-3 mb-lg-0 overviewBox">
              <h4 className="totalSales text-heading text-uppercase m-0">
                {t("Dashboard.cardTwoHeading")}
              </h4>

              <Select
                placeholder={t("Transaction.selectMonth")}
                getOptionLabel={(option) => option?.name}
                options={MonthsByDays}
                style={{ width: 40 }}
                styles={CUSTOM_DROPDOWN_STYLE}
                value={selectedMonth}
                onChange={(e) => {
                  handleMonthChange(e);
                }}
                isClearable
              />
              <div className="buttonDiv">
                {showCustomDate && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      marginTop: "0.5rem",
                      gap: "5px",
                    }}
                  >
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
              <h1 className="totalAmount mt-2 ">
                {defaultLanguage === "ar" || defaultLanguage === "عربي" ? (
                  <>
                    {t("Dashboard.cardTwoPrice", {
                      totalPrice: currentMonthTotal?.toFixed(2),
                    })}
                    {CurrencySymbol}
                  </>
                ) : (
                  <>
                    {CurrencySymbol}
                    {t("Dashboard.cardTwoPrice", {
                      totalPrice: currentMonthTotal?.toFixed(2),
                    })}
                  </>
                )}
              </h1>
            </div>
            {/* <div className="col-lg-3 col-md-6 mb-md-3 mb-sm-3 mb-lg-0 overviewBox">
              <h4 className="storeView text-uppercase m-0">
                {t("Dashboard.cardThreeHeading")}
              </h4>
              <h1 className="totalAmount mt-2 ">
                {" "}
                {t("Dashboard.cardThreeNumber", { totalStoreView: 17 })}
              </h1>
            </div> */}
          </div>

          <div className="card cardradius Chart-overviewBox">
            {/* <Line data={chartData} options={options} /> */}
          </div>
        </div>

        <div className="right-side-main-container">
          <div className="top-selling-product">
            <div className="righ-side-container">
              <div className=" right-side-header d-flex">
                <FaBoxOpen style={{ width: "30px", height: "30px" }} />
                <h5>{t("Dashboard.topSellinghProducts")}</h5>
              </div>
              {/* <hr /> */}
              <div>
                {topSellingProductList &&
                  topSellingProductList?.map((item, index) => {
                    return (
                      <TopSellingProductsCart
                        productDetails={item}
                        index={index}
                      />
                    );
                  })}
              </div>
            </div>
          </div>
          <div className="top-selling-product">
            <div className="righ-side-container">
              <div className=" right-side-header d-flex">
                <MdPeople style={{ width: "30px", height: "30px" }} />
                <h5>{t("Dashboard.customerOfTheMonth")}</h5>
              </div>
              {/* <hr /> */}
              <div>
                {topBuyersDataList &&
                  topBuyersDataList?.map((item, index) => {
                    return (
                      <TopBuyersListCart customerDetails={item} index={index} />
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainContentArea>
  );
};

export default DashboardPage;
