import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./OrderDetailsPage.css";
import MainContentArea from "../MainContentArea/MainContentArea";
import SecondaryButton from "../../Components/UI/Atoms/SecondaryButton/SecondaryButton";

import {
  getOnlineOrder,
  getOnlineOrderSingleProduct,
  postOnlineOrderAccept,
} from "../../Redux/OnlineOrderSlice/onlineOrderSlice";
import { Button, DialogContent } from "@mui/material";
import {
  DateFormateForTransaction,
  getUTCDate,
  PICKUPSTATUS_ENUM,
  retrieveObj,
  STATUS_ENUM,
  STORE_CURRENCY,
  STORE_Id,
} from "../../Containts/Values";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";
import moment from "moment";
import { useTranslation } from "react-i18next";
import {
  addSalesDetails,
  addTransaction,
  addTransactionNSalesDetails,
} from "../../Redux/Cart/cartSlice";

const OrderDetailsPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const params = useParams();
  const productID = params.productId;
  const dispatch = useDispatch();
  const history = useNavigate();

  const [UserName, setUserName] = useState("");
  const [noteValidate, setNoteValidate] = useState("");
  const onlineOrderProduct = useSelector(
    (state) => state.onlineOrder.onlineOrderProduct
  );
  console.log("onlineOrderProduct... ", onlineOrderProduct);
  // All order data
  const onlineOrderAllData = useSelector(
    (state) => state.onlineOrder.onlineOrderData
  );
  console.log("onlineOrderAllData... ", onlineOrderAllData);
  const isLoading = useSelector((state) => state.onlineOrder.loading);
  const [orderDetails, setOrderDetails] = useState([]);
  console.log("orderDetails... ", orderDetails);
  const [currentOrderStatusId, setcurrentOrderStatusId] = useState();
  const [upcomingOrderStatus, setUpcomingOrderStatus] = useState("");
  const [currentOrderStatus, setCurrentOrderStatus] = useState(
    location?.state?.orderStatus ? location?.state?.orderStatus : ""
  );
  const [orderStatusAcceptBtn, setorderStatusAcceptBtn] = useState(false);
  const defaultLang = useSelector((state) => state.language.language);
  const [defaultLanguage, setDefaultLanguage] = useState(defaultLang?.name);
  const CurrencySymbol = localStorage.getItem("StoreCurrency");
  const [comment, setcomment] = useState("");
  console.log("comment", comment);

  const handleNotes = (e) => {
    e.preventDefault();
    // setcomment(notes);
  };

  // console.log("notes :",notes);

  // if data not avalaible
  useEffect(() => {
    if (onlineOrderAllData?.orders?.length === 0) {
      history(`/online-order?status=${currentOrderStatus}`);
    }
  }, [onlineOrderAllData?.orders]);

  // call singe order details
  useEffect(() => {
    location?.state && dispatch(getOnlineOrder(location?.state?.orderStatus));
    dispatch(getOnlineOrderSingleProduct(params.productId));
  }, [productID]);

  useEffect(() => {
    retrieveObj("cognitoUserInfo").then((cognito) => {
      setUserName(cognito.username);
    });
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

  // Getting Customer details
  useEffect(() => {
    onlineOrderAllData?.orders?.length > 0 &&
      onlineOrderAllData?.orders?.map((item) => {
        if (item.orderId.toString() === productID) {
          setOrderDetails(item);
        }
      });
  }, [onlineOrderAllData?.orders]);

  // get status ID and status Name
  useEffect(() => {
    var orderStatusObj = orderDetails?.orderStatus;
    console.log("orderStatusObj ", orderStatusObj);
    if (orderStatusObj && orderStatusObj.length > 0) {
      let newOrderStatus = orderStatusObj[orderStatusObj?.length - 1]?.statusId;

      if (newOrderStatus === 5) {
        newOrderStatus = newOrderStatus;
        setorderStatusAcceptBtn(true);
        setcurrentOrderStatusId(Number(newOrderStatus));
      } else {
        newOrderStatus = newOrderStatus + 1;
        setcurrentOrderStatusId(Number(newOrderStatus));
      }

      if (orderDetails?.status === "Rejected") {
        let changeStatus =
          orderDetails.homeDelivery == true
            ? STATUS_ENUM[0]?.status
            : PICKUPSTATUS_ENUM[0]?.status;
        console.log("changeStatus ", changeStatus);
        setUpcomingOrderStatus(changeStatus);
      } else {
        let changeStatus =
          orderDetails.homeDelivery == true
            ? STATUS_ENUM[newOrderStatus]?.status
            : PICKUPSTATUS_ENUM[newOrderStatus]?.status;
        console.log("changeStatus ", changeStatus);
        setUpcomingOrderStatus(changeStatus);
      }
    }
  }, [orderDetails]);

  // for disable button on delivered and rejected order status
  useEffect(() => {
    if (currentOrderStatus === "Delivered") {
      setorderStatusAcceptBtn(true);
    }
    if (currentOrderStatus === "Rejected") {
      setorderStatusAcceptBtn(true);
    }
  }, [currentOrderStatus]);

  // to set  upcomming status on button click
  const orderStatusSuccess = (orderStatus) => {
    setCurrentOrderStatus(upcomingOrderStatus);
    if (orderStatus === "Ready To Pick") {
      let TransactionDetails = {
        paymentId: getUTCDate(),
        storeId: Number.parseInt(STORE_Id),
        transaction_typeName: "Sales", //TODO this value need to come dynemically
        modeOfPayment: "cash",
        mobileNumber: orderDetails?.phone,
        notes: null,
        discount: 0,
        totalAmount: orderDetails?.totalAmount,
        totalPayment: 0,
        totalBalance: Number.parseInt(orderDetails?.totalAmount),
        finaltotalAmount: Number.parseInt(orderDetails?.totalAmount),
        dateAdded: "2023-02-18T15:08:44.221Z",
        dateUpdated: "2023-02-18T15:08:44.221Z", //TODO check UTC date in string
        updatedBy: null,
        userName: UserName,
        customerId: Number.parseInt(orderDetails?.customerId),
        sales_executiveId: orderDetails?.sales_executiveId,
        currencyName: STORE_CURRENCY,
        isSync: 0,
        isDeleted: 0,
        clientLastUpdated: getUTCDate(),
        customerName: orderDetails?.name,
        salesExecutiveName: "",
      };

      // making sales details payload
      const salesDetailArr = [];
      let salesId = getUTCDate();
      onlineOrderProduct &&
        onlineOrderProduct?.map((item, index) => {
          console.log("item... ", item);
          const salesDetailsObj = {
            clientLastUpdated: getUTCDate(),
            currencyId: 0,
            currencyName: STORE_CURRENCY,
            discountValue: item?.discountVal,
            // "isMeasurable": true,
            lastUpdate: item?.lastUpdate,
            // "measurable": true,
            modeOfPayment: "cash", //or Refund
            // "paymentId": 0,
            productId: item?.productId,
            productName: item?.productName,
            // "productSize": "string",
            purchasingPrice: item?.purchasingPrice,
            salesDetailsId: salesId + index,
            salesPrice: item?.sellingPrice,
            salesQuantity: item?.prQuantity,
            salestotalAmount: item?.singleProTotal,
            taxValue: item?.taxValue,
            // "totalDiscount": 0,
            // "totalTax": 0,
            // "transactionRefId": "string",
            unitId: item?.unitId,
            unitName: item?.unitName,
          };
          salesDetailArr?.push(salesDetailsObj);
        });

      const transactionPayload = {
        // "addedBy": DateFormateForTransaction(new Date()), //"2023-02-18T15:08:44.221Z",
        // "changeAmtReturn": 0,
        clientLastUpdated: getUTCDate(),
        currencyName: STORE_CURRENCY,
        customerId: Number.parseInt(orderDetails?.customerId),
        customerName: orderDetails?.name,
        dateAdded: DateFormateForTransaction(new Date()),
        dateUpdated: DateFormateForTransaction(new Date()),
        discount: 0, // TODO why is not sending product discount value
        finaltotalAmount: Number.parseInt(orderDetails?.totalAmount),
        modeOfPayment: "cash", //or Refund
        notes: "",
        // "orderType": "string",
        paymentId: getUTCDate(),
        // "receivedAmount": 0,
        salesDetail: salesDetailArr,
        salesExecutiveName: "", // TODO
        sales_executiveId: 0, // TODO
        storeId: STORE_Id,
        totalAmount: 0, // TODO
        totalBalance: Number.parseInt(orderDetails?.totalAmount),
        totalPayment: 0, // TODO
        transaction_typeName: "Sales", //TODO this value need to come dynemicaly
        updatedBy: "",
        userName: UserName,
      };

      // dispatch(addTransaction(TransactionDetails, transactionSuccessRes));
      dispatch(
        addTransactionNSalesDetails(transactionPayload, transactionSuccessRes)
      );
    }
  };

  //  for reject order status
  const rejectOrderStatus = () => {
    setCurrentOrderStatus("Rejected");
  };

  //  handle for add notes
  const HandleAddNotes = (e) => {
    const value = e.target.value.replace(/[^A-Za-z ]/g, "");
    setcomment(value);
    setNoteValidate("");
  };

  //  call final api to accept order
  const changeStatusTo = async () => {
    if (comment === "") {
      setNoteValidate("Please write a note");
      return;
    }
    console.log("comment :", comment);
    const orderStatusObj = {
      status: upcomingOrderStatus,
      orderId: orderDetails?.orderId,
      typeName: "online",
      storeId: STORE_Id,
      // comments: comment,
      orderStatus: [
        {
          statusId: currentOrderStatusId,
          statusName: upcomingOrderStatus,
          comments: comment ? comment : "no comment added", // TODO commment should get from input field
        },
      ],
    };

    dispatch(
      postOnlineOrderAccept(
        orderStatusObj,
        upcomingOrderStatus,
        orderStatusSuccess
      )
    );
  };

  const transactionSuccessRes = (TransactionDetails) => {
    // let salesDetailsArr = [];

    // for (let index = 0; index < onlineOrderProduct.length; index++) {
    //   let SalesDetailsObj = {
    //     salesDetailsId: getUTCDate() + 1,
    //     paymentId: TransactionDetails.paymentId,
    //     productName: onlineOrderProduct[index]?.productName,
    //     productId: onlineOrderProduct[index]?.productId,
    //     salesQuantity: onlineOrderProduct[index]?.orderQuantity,
    //     purchasingPrice: onlineOrderProduct[index]?.purchasingPrice,
    //     salesPrice: onlineOrderProduct[index]?.sellingPrice,
    //     salestotalAmount:
    //       onlineOrderProduct[index].orderQuantity *
    //       onlineOrderProduct[index]?.sellingPrice,
    //     taxValue: 0,
    //     discountVal: 0,
    //     modeOfPayment: "cash", //or Refund
    //     currencyId: 0,
    //     currencyName: STORE_CURRENCY,
    //     isSync: 0,
    //     isDeleted: 0,
    //     clientLastUpdated: getUTCDate(),
    //   };

    //   salesDetailsArr.push(SalesDetailsObj);
    // }

    // dispatch(
    //   addSalesDetails(
    //     salesDetailsArr,
    //     TransactionDetails,
    //     handleSuccess,
    //     apiErr
    //   )
    // );
  };
  const handleSuccess = () => { };
  const apiErr = () => { };

  //  for reject order status
  const handleRejectOrder = async () => {
    if (comment === "") {
      setNoteValidate("Please write a note");
      return;
    }
    console.log("comment", comment);
    const orderStatusObj = {
      status: "Rejected",
      orderId: orderDetails?.orderId,
      typeName: "online",
      storeId: STORE_Id,
      // comments: comment,
      orderStatus: [
        {
          statusId: 0,
          statusName: "Rejected",
          comments: comment, // TODO commment should get from input field
        },
      ],
    };

    dispatch(
      postOnlineOrderAccept(orderStatusObj, "Rejected", rejectOrderStatus)
    );
  };

  return (
    <MainContentArea scroll={"auto"}>
      {/* {isLoading ? (
        <LoadingSpinner />
      ) : ( */}
        <div className="orderDetails-container p-2 w-100">
          <div className="order-info cardBox overflow-auto d-flex flex-column">
            <div className="mb-2" style={{ textAlign: "right" }}>
              <Button
                variant="contained"
                style={{ background: "#e3e2e2", color: "dimgray" }}
                onClick={() => history(-1)}
              >
                {t("AddNewProduct.Back")}
              </Button>
            </div>
            <div className="order-status my-2">
              <h5 className="d-flex flex-wrap card-text">
                {t("allOnlineOrder.OrderID")} :{" "}
                <p className="text-color">
                  {orderDetails && orderDetails?.orderId}
                </p>
              </h5>

              <h5 className="d-flex flex-wrap card-text">
                {t("allOnlineOrder.CurrentStatus")} :{" "}
                <p className="text-color">{currentOrderStatus}</p>
              </h5>
            </div>
            <div className="d-flex flex-wrap justify-content-between">
              <p className="card-text">
                {t("allOnlineOrder.OrderBookingTime")} :{" "}
                <span>
                  {moment(
                    orderDetails && orderDetails?.clientLastUpdated
                  ).format("llll")}
                </span>
              </p>
            </div>

            <hr />
            <div className="d-flex flex-wrap justify-content-between align-items-center">
              <h4
                className="card-subtitle items mb-1 ps-2"
                style={{ color: "var(--gray-color)" }}
              >
                {t("allOnlineOrder.Item")}
              </h4>
            </div>

            {onlineOrderProduct &&
              onlineOrderProduct?.map((item, index) => {
                // if (item?.orderId.toString() === productID)
                console.log("item... ", item);
                return (
                  <div key={index} className="mb-4">
                    <div className="d-flex flex-wrap g-0">
                      <div className="col-md-2 image p-2">
                        {item?.imagesList &&
                          item?.imagesList?.map((imageItem, index) => {
                            if (
                              index === 0 && imageItem?.imageUrl &&
                              imageItem?.productId === item?.productId
                            ) {
                              return (
                                <img
                                  style={{ hight: "10%" }}
                                  src={imageItem?.imageUrl}
                                  className="img-fluid rounded-start prodImg"
                                  alt="..."
                                />
                              );
                            }
                          })}
                        {/* <img
                          style={{ hight: "10%" }}
                          src={item?.imagesList[index]?.productId === item?.productId && item?.imagesList[index]?.imageUrl}
                          className="img-fluid rounded-start prodImg"
                          alt="..."
                        /> */}
                      </div>

                      <div className="col-md-5 ms-3 mt-2 orderDetails">
                        <h5
                          className="card-title fw-bolder"
                          style={{ marginRight: 10 }}
                        >
                          {item?.productName}
                        </h5>
                        <p className="card-text ">{item?.notes}</p>

                        <div className="d-flex align-items-baseline itemPrice">
                          <p className="card-text pe-2 font-bold">
                            {t("allOnlineOrder.ItemPrice")} :
                          </p>
                          <p className="font-bold">
                            {" "}
                            {/* {item.currencyName}
                              {item.sellingPrice} */}
                            {defaultLanguage === "ar" ||
                              defaultLanguage === "عربي" ? (
                              <>
                                {item.sellingPrice}
                                {CurrencySymbol}
                              </>
                            ) : (
                              <>
                                {CurrencySymbol}
                                {item.sellingPrice}
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    <hr />
                  </div>
                );
              })}

            <div className=" p-3 mb-4 customer_detail bg-transparent">
              <h3 className=" fw-bolder mb-4 col-12">
                {t("allOnlineOrder.Customerdetails")}
              </h3>

              <div className="item">
                <div className="logo-label">
                  <h6 className="lable fw-bolder">
                    {t("allOnlineOrder.Name")}{" "}
                  </h6>
                </div>
                <p>{orderDetails && orderDetails.name}</p>
              </div>
              <div className="item">
                <div className=" logo-label">
                  <h6 className="lable fw-bolder">
                    {t("allOnlineOrder.Mobile")}{" "}
                  </h6>
                </div>
                <p>{orderDetails && orderDetails.phone}</p>
              </div>
              <div className="item">
                <div className=" logo-label ">
                  <h6 className="lable fw-bolder me-4">
                    {t("allOnlineOrder.Address")}{" "}
                  </h6>
                </div>
                <p className="text-trim" title={orderDetails?.deliveryAddress}>
                  {orderDetails?.deliveryAddress === ""
                    ? "Address not available!"
                    : orderDetails?.deliveryAddress}
                </p>
              </div>
              <div className="item">
                <div className=" logo-label">
                  <h6 className="lable fw-bolder">
                    {t("allOnlineOrder.City")}{" "}
                  </h6>
                </div>
                <p>Beed</p>
              </div>
              <div className="item">
                <div className=" logo-label">
                  <h6 className="lable fw-bolder">
                    {t("allOnlineOrder.State")}{" "}
                  </h6>
                </div>
                <p>Maharashtra</p>
              </div>
              <div className="item">
                <div className=" logo-label">
                  <h6 className="lable fw-bolder">
                    {t("allOnlineOrder.Postcode")}{" "}
                  </h6>
                </div>
                <p>444302</p>
              </div>
              <div className="item">
                <div className=" logo-label">
                  <h6 className="lable fw-bolder">
                    {t("allOnlineOrder.Payment")}{" "}
                  </h6>
                </div>
                <p>COD</p>
              </div>
            </div>
          </div>

          <div className=" side-section cardBox overflow-auto">
            <div className="px-3 notes-card mt-2 bg-transparent">
              <div className=" d-flex flex-wrap justify-content-between">
                <h4
                  className="mb-2 col-8 requiredstar"
                  style={{ color: "var(--gray-color)" }}
                >
                  {t("allOnlineOrder.Notes")}
                </h4>
              </div>
              <span className="px-0">
                <input
                  className="form-control me-2"
                  placeholder={t("allOnlineOrder.Addordernoteshere")}
                  value={comment}
                  onChange={(e) => {
                    HandleAddNotes(e);
                  }}
                />
                {noteValidate ? (
                  <spam className="text-danger">
                    {noteValidate}
                    <br />
                  </spam>
                ) : null}

                <div className="row mb-1 onlinOrder-btn">
                  {upcomingOrderStatus && upcomingOrderStatus !== "Rejected" ? (
                    <div className="header mt-2">
                      <div>
                        <SecondaryButton
                          style={{ padding: "7px" }}
                          externalClass="externalClass"
                          onClick={handleRejectOrder}
                          disabled={orderStatusAcceptBtn}
                        >
                          {t("allOnlineOrder.RejectOrder")}
                        </SecondaryButton>
                      </div>

                      <div>
                        <Button
                          variant="contained"
                          className="top-btn externalClass"
                          style={{
                            background: "var(--button-bg-color)",
                            color: "var(--button-color)",
                          }}
                          onClick={changeStatusTo}
                          disabled={orderStatusAcceptBtn}
                        >
                          {upcomingOrderStatus &&
                            upcomingOrderStatus === "Accepted"
                            ? "Accept"
                            : upcomingOrderStatus}
                        </Button>
                      </div>
                    </div>
                  ) : null}
                </div>
              </span>
              <hr />
            </div>

            <div className=" p-3 grand-total bg-transparent">
              <div className="d-flex justify-content-between">
                <p className="fw-bolder">{t("allOnlineOrder.ItemTotal")}</p>
                <p className="font-bold">
                  {/* {orderDetails.currencyName}{orderDetails.totalAmount} */}
                  {defaultLanguage === "ar" || defaultLanguage === "عربي" ? (
                    <>
                      {orderDetails.totalAmount}
                      {CurrencySymbol}
                    </>
                  ) : (
                    <>
                      {CurrencySymbol}
                      {orderDetails.totalAmount}
                    </>
                  )}
                </p>
              </div>

              <div className="d-flex justify-content-between">
                <p className="fw-bolder">{t("allOnlineOrder.Delivery")}</p>
                <p className="text-success">{t("allOnlineOrder.free")}</p>
              </div>

              <div className="d-flex justify-content-between">
                <h6 className="fw-bolder">{t("allOnlineOrder.GrandTotal")}</h6>
                <h5 className="font-bold">
                  {/* {orderDetails.currencyName}{orderDetails.totalAmount} */}
                  {defaultLanguage === "ar" || defaultLanguage === "عربي" ? (
                    <>
                      {orderDetails.totalAmount}
                      {CurrencySymbol}
                    </>
                  ) : (
                    <>
                      {CurrencySymbol}
                      {orderDetails.totalAmount}
                    </>
                  )}
                </h5>
              </div>
              <hr />
            </div>
          </div>
        </div>
      {/* )} */}
    </MainContentArea>
  );
};
export default OrderDetailsPage;
