import React, { useEffect, useRef, useState } from "react";
import MainContentArea from "../MainContentArea/MainContentArea";
import Select from "react-select";
import { CUSTOM_DROPDOWN_STYLE } from "../../utils/CustomeStyles";
import "./TablesManagement.css";
import SelectTableModal from "./SelectTableModal";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import TableItemCart from "./TableOrderRecord";
import TableDetails from "./TableOrderDetails";
import TableProductItem from "./TableOrderProductItem";
import TableTotalCart from "./TableTotalCart";
import { getProductList } from "../../Redux/Product/productSlice";
import Checkout from "../../Components/TableMngt/Checkout";
import { useNavigate } from "react-router-dom";
import {
  COGNITO_USER_INFO,
  DateFormateForTransaction,
  GET_TABLE_ORDER_TRANS_PRODUCT_LIST,
  SERVER_URL,
  STORE_CURRENCY,
  STORE_Id,
  getUTCDate,
} from "../../Containts/Values";
import { addSalesDetails, addTransaction, addTransactionNSalesDetails } from "../../Redux/Cart/cartSlice";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { Button } from "@mui/material";
import ThermalSmallInvoice from "../../Components/Invoice/ThermalSmallInvoice";
import TableOrderProductItem from "./TableOrderProductItem";
import { BsFillPrinterFill } from "react-icons/bs";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import Swal from "sweetalert2";
import CartProductItem from "../CartPage/CartProductItem";
import {
  addTableOrderTrans,
  getTableOrderTransaction,
} from "../../Redux/TableOrder/TableOrderSlice";
import {
  addTableOrderTransProduct,
  getTableOrderTransProductsList,
} from "../../Redux/TableOrderProduct/TableOrderProductSlice";
import { apiConfig } from "../../utils/constantFunctions";
import axios from "axios";
import { addSplitPayment } from "../../Redux/SplitPayment/SplitPaymentSlice";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";
import TableThermalInvoice from "./TableThermalInvoice";
import { getDiscountlist } from "../../Redux/Discount/discountSlice";
// import ReactToPrint from "react-to-print";

const TablesManagement = () => {
  const tableOrderApi = window.tableOrderApi;
  const productApi = window.productApi;
  const transactionPaymentApi = window.transactionPaymentApi;
  const splitPaymentTransactionApi = window.splitPaymentTransactionApi;
  const tableOrderTransProductsApi = window.tableOrderTransProductsApi;

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const isOnline = useSelector((state) => state.checkInternet.isOnline);
  const productData = useSelector((state) => state.product.productData);
  const tableOrderList = useSelector(
    (state) => state.tableOrder.tableOrderData
  );
  console.log("tableOrderList... ", tableOrderList);
  const tableOrderProdList = useSelector(
    (state) => state.tableOrderProduct.tableOrderProductData
  );
  const transLoading = useSelector((state) => state.cart.loading);
  const splitPaymentLoading = useSelector(
    (state) => state.splitPayment.loading
  );
  const tableOrderProductLoading = useSelector(
    (state) => state.tableOrderProduct.loading
  );
  const tableOrderLoading = useSelector((state) => state.tableOrder.loading);
  const [show, setShow] = useState(true);
  const [selectedTable, setSelectedTable] = useState(null);
  console.log("selectedTable... ", selectedTable);
  const [runningTables, setRunningTables] = useState([]);
  // console.log("selectedTable... ", selectedTable);
  console.log("runningTables... ", runningTables);
  const [tableOrderPostRes, setTableOrderPostRes] = useState({});
  const [selectedProductList, setSelectedProductList] = useState([]);
  console.log("selectedProductList... ", selectedProductList);
  const [totalPriceDetails, setTotalPriceDetails] = useState({});
  console.log("totalPriceDetails", totalPriceDetails);
  const [openCheckout, setOpenCheckout] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  console.log("paymentMethod... ", paymentMethod);
  const [saveTransDetails, setSaveTransDetails] = useState();
  console.log("saveTransDetails0012",saveTransDetails);
  const [errors, setErrors] = useState({
    paymentOption: "",
  });
  // console.log("errors... ", errors);
  const [splitPaymentOptions, setSplitPaymentOptions] = useState([]);
  const [remainingTotalAmount, setRemainingTotalAmount] = useState(0);
  const [splitAmountTotalPrice, setSplitAmountTotalPrice] = useState(0);
  console.log("splitAmountTotalPrice", splitAmountTotalPrice);
  const [inputError, setInputError] = useState("")
  const [transactionLoading, setTransactionLoading] = useState(false);

  // If table available in local store then first remove it
  useEffect(() => {
    // table remove handler
    const tableRemoveHandler = () => {
      console.log("ClearTableDetails");
      localStorage.removeItem("selectedTable");
    };
    tableRemoveHandler();
  }, []);

  // when table order list api data will come we stored into this runningTables state
  useEffect(() => {
    tableOrderList?.length > 0 && setRunningTables(tableOrderList);
    tableOrderProdList && setSelectedProductList(tableOrderProdList);
  }, [tableOrderList, tableOrderProdList]);

  //   getting running tables details
  useEffect(() => {
    if (isOnline) {
      // Call server api here
      dispatch(getTableOrderTransaction());
    } else {
      const tableSelected = tableOrderApi?.tableOrderDB.getTableOrders();
      tableSelected && setRunningTables(tableSelected);
    }
  }, [tableOrderPostRes]);

  // when we getting selected table details after that
  //  we calling table order product list api
  useEffect(() => {
    if (isOnline) {
      let config = apiConfig(
        `${SERVER_URL}${GET_TABLE_ORDER_TRANS_PRODUCT_LIST}?tableOrderId=${selectedTable?.tableOrderId}`,
        "GET"
      );
      axios(config)
        .then((response) => {
          console.log("TableOrderTransProductResponse... ", response);
          if (response?.status === 200) {
            let tableOrderProdList = response?.data?.data;
            console.log("tableOrderProdList", tableOrderProdList);
            response?.data?.data?.length > 0 &&
              setSelectedProductList(response?.data?.data);

            //   calculating total price,quantity,subTotal value
            let priceObj = {
              subTotalValue: 0,
              totalTaxValue: 0,
              productDiscount: 0,
              totalQuantity: 0,
              productCount: tableOrderProdList?.length || 0,
            };
            const totalPriceValue =
              tableOrderProdList &&
              tableOrderProdList?.reduce(
                (acc, item) => {
                  acc.subTotalValue += item?.singleProTotal || 0;
                  acc.totalTaxValue += item?.taxValue || 0;
                  acc.productDiscount += item?.productDiscount || 0;
                  acc.totalQuantity += item?.prQuantity || 0;
                  return acc;
                },
                { ...priceObj }
              );
            // console.log("totalPriceValue... ", totalPriceValue)
            totalPriceValue && setTotalPriceDetails(totalPriceValue);
            totalPriceValue &&
              setRemainingTotalAmount(
                (
                  totalPriceValue?.subTotalValue +
                  totalPriceValue?.totalTaxValue -
                  totalPriceValue?.productDiscount
                )?.toFixed(2)
              );
            tableOrderProdList && setSelectedProductList(tableOrderProdList);
          }
        })
        .catch((err) => {
          console.log("err", err);
        });
    } else {
      const tableOrderProdList =
        selectedTable &&
        tableOrderTransProductsApi?.tableOrderTransProductsDB?.getTableOrderTransProductsList(
          selectedTable?.tableOrderId
        );

      tableOrderProdList && setSelectedProductList(tableOrderProdList);
      console.log("tableOrderProdList... ", tableOrderProdList);

      //   Parsing product list from string to real array of objects value
      const billingProductList =
        selectedTable?.productIds && JSON.parse(selectedTable?.productIds);
      // console.log("billingProductList... ", billingProductList);

      //   calculating total price,quantity,subTotal value
      let priceObj = {
        subTotalValue: 0,
        totalTaxValue: 0,
        totalQuantity: 0,
        productCount: tableOrderProdList?.length || 0,
      };
      const totalPriceValue =
        tableOrderProdList &&
        tableOrderProdList?.reduce(
          (acc, item) => {
            acc.subTotalValue += item?.singleProTotal || 0;
            acc.totalTaxValue += item?.taxValue || 0;
            acc.totalQuantity += item?.prQuantity || 0;
            return acc;
          },
          { ...priceObj }
        );
      totalPriceValue && setTotalPriceDetails(totalPriceValue);
      totalPriceValue &&
        setRemainingTotalAmount(
          (
            totalPriceValue?.subTotalValue + totalPriceValue?.totalTaxValue
          )?.toFixed(2)
        );
      tableOrderProdList && setSelectedProductList(tableOrderProdList);
    }
  }, [selectedTable]);

  //   table select handler
  const selectTableHandler = () => {
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
  };

  const gettingSelectedTableValue = (tableData) => {
    // console.log("tableData... ", tableData);
    tableData && setSelectedTable(tableData);
  };

  // order edit handler
  const tableOrderEditHandler = () => {
    navigate("/cart", {
      state: {
        selectedProductList,
        totalPriceDetails,
        tableOrderId: selectedTable?.tableOrderId,
      },
    });
  };

  const paymentOptionHandler = (paymentMethod) => {
    if (paymentMethod?.value !== "Split") {
      setSplitPaymentOptions([]);
    }
    paymentMethod && setPaymentMethod(paymentMethod);

    // console.log("paymentOption clicked ", paymentMethod);
  };

  // update table order value isDelete by 1
  // for deleting table order after completed transaction
  const updateTableOrderDetails = () => {
    const tableOrderPayload = {
      ...selectedTable,
      isDeleted: 1,
    };

    // if user is going to cancel table order then
    // we doing soft delete of that table order products
    for (let i = 0; i < selectedProductList.length; i++) {
      const productDetails = selectedProductList[i];

      const payloadObj = {
        ...productDetails,
        isDeleted: 1,
      };

      if (isOnline) {
        // server api call here
        dispatch(addTableOrderTransProduct(payloadObj));
      } else {
        // soft deleting table order product
        tableOrderTransProductsApi?.tableOrderTransProductsDB?.updateTableOrderSignleProd(
          payloadObj
        );
      }
    }

    if (isOnline) {
      // server api call here
      dispatch(addTableOrderTrans(tableOrderPayload));
    } else {
      const result =
        tableOrderPayload &&
        tableOrderApi?.tableOrderDB.updateTableOrder(tableOrderPayload);
      // console.log("result... ", result);
    }

    localStorage.removeItem("selectedTable");
  };

  const validation = () => {
    if (paymentMethod === null) {
      setErrors({ ...errors, paymentOption: "Please select payment option" });
      return false;
    }

    return true;
  };

  const confirmHandler = () => {
    // console.log("confirm ");
    const val = validation();

    let finalAmount =
      totalPriceDetails?.subTotalValue + totalPriceDetails?.totalTaxValue;
    // console.log("COGNITO_USER_INFO... ", COGNITO_USER_INFO?.username);
    let TransactionDetails = {
      paymentId: getUTCDate(),
      storeId: STORE_Id,
      transaction_typeName: "Sales", //TODO this value need to come dynemicaly
      modeOfPayment: paymentMethod?.value,
      mobileNumber: "", //customer.mobileNumber ? customer.mobileNumber : "",
      notes: "",
      discount: 0, //Number.parseInt(flatDiscount), this temporary
      totalAmount: totalPriceDetails?.subTotalValue,
      totalPayment: 0,
      totalBalance: finalAmount?.toFixed(2),
      finaltotalAmount: finalAmount?.toFixed(2),
      dateAdded: DateFormateForTransaction(new Date()), //"2023-02-18T15:08:44.221Z",
      dateUpdated: DateFormateForTransaction(new Date()), //"2023-02-18T15:08:44.221Z", //TODO check UTC date in string
      updatedBy: "",
      userName: COGNITO_USER_INFO?.username,
      customerId: Number.parseInt(selectedTable?.customerId),
      sales_executiveId: Number.parseInt(selectedTable?.waiterId),
      currencyName: STORE_CURRENCY,
      isSync: 0,
      isDeleted: 0,
      clientLastUpdated: getUTCDate(),
      customerName: selectedTable && selectedTable?.customerName,
      salesExecutiveName: selectedTable && selectedTable?.waiterName,
      productName: selectedTable && selectedProductList[0].productName,
      productId: selectedTable && selectedProductList[0].productId,
      salesQuantity: selectedTable && selectedProductList[0].prQuantity,
      purchasingPrice: selectedTable && selectedProductList[0].purchasingPrice,
      salesPrice: selectedTable && selectedProductList[0].sellingPrice,
      salestotalAmount: selectedTable && selectedProductList[0].singleProTotal,
      taxValue:
        selectedTable && selectedProductList[0].taxPercent
          ? selectedTable && selectedProductList[0].taxPercent
          : 0,
    };
    // console.log("TransactionDetails... ", TransactionDetails);


    const salesDetailArr = []
    let salesId = getUTCDate();
    selectedProductList && selectedProductList?.map((item, index) => {
      console.log("item... ", item)
      const salesDetailsObj = {
        "clientLastUpdated": getUTCDate(),
        "currencyId": 0,
        "currencyName": STORE_CURRENCY,
        "discountValue": item?.discountVal ? item?.discountVal : 0,
        // "isMeasurable": true,
        "lastUpdate": item?.lastUpdate,
        // "measurable": true,
        "modeOfPayment": paymentMethod?.value,
        // "paymentId": 0,
        "productId": item?.productId,
        "productName": item?.productName,
        // "productSize": "string",
        "purchasingPrice": item?.purchasingPrice,
        "salesDetailsId": salesId + index,
        "salesPrice": item?.sellingPrice,
        "salesQuantity": item?.prQuantity,
        "salestotalAmount": item?.singleProTotal,
        "taxValue": item?.taxValue,
        // "totalDiscount": 0,
        // "totalTax": 0,
        // "transactionRefId": "string",
        "unitId": item?.unitId ? item?.unitId : 0,
        "unitName": item?.unitName ? item?.unitName : ""
      }
      salesDetailArr?.push(salesDetailsObj)

    })

    const transactionPayload = {
      // "addedBy": DateFormateForTransaction(new Date()), //"2023-02-18T15:08:44.221Z",
      // "changeAmtReturn": 0,
      "clientLastUpdated": getUTCDate(),
      "currencyName": STORE_CURRENCY,
      "customerId": Number.parseInt(selectedTable?.customerId),
      "customerName": selectedTable && selectedTable?.customerName,
      "dateAdded": DateFormateForTransaction(new Date()),
      "dateUpdated": DateFormateForTransaction(new Date()),
      "discount": 0, //TODO
      "finaltotalAmount": finalAmount?.toFixed(2),
      "modeOfPayment": paymentMethod?.value,
      "notes": "",
      // "orderType": "string",
      paymentId: getUTCDate(),
      // "receivedAmount": 0,
      "salesDetail": salesDetailArr,
      "salesExecutiveName": selectedTable && selectedTable?.waiterName,
      "sales_executiveId": Number.parseInt(selectedTable?.waiterId),
      "storeId": STORE_Id,
      "totalAmount": totalPriceDetails?.subTotalValue,
      "totalBalance": finalAmount?.toFixed(2),
      "totalPayment": 0,
      "transaction_typeName": "Sales", //TODO this value need to come dynemicaly
      "updatedBy": "",
      "userName": COGNITO_USER_INFO?.username,
      isSync: 0,
      isDeleted: 0,
      mobileNumber: selectedTable.mobileNumber ? selectedTable.mobileNumber : "",
    }

    if (val) {
      if (isOnline) {
        if (finalAmount != 0) {
          // dispatch(addTransaction(TransactionDetails, transactionSuccessRes));
          dispatch(addTransactionNSalesDetails(transactionPayload, transactionSuccessRes));
        }
      } else {
        // calling insert transaction sqlite api
        const result =
          transactionPaymentApi?.transactionPaymentDB?.insertTransactionPayment(
            transactionPayload
          );
        // if transaction complete then we called transaction details api
        if (result.changes === 1) {
          const singleTransactionPaymentDetails =
            transactionPaymentApi?.transactionPaymentDB?.getSingleTransactionPaymentDetails(
              result.lastInsertRowid
            );

          for (let i = 0; i < splitPaymentOptions.length; i++) {
            const splitPaymentOptionsDetails = splitPaymentOptions[i];

            const splitPaymentTransactionObj = {
              splitPaymentId: getUTCDate(),
              tableOrderId: selectedTable?.tableOrderId,
              paymentId: result.lastInsertRowid,
              paymentDate: getUTCDate(),
              paymentMode: splitPaymentOptionsDetails?.value,
              amount: splitPaymentOptionsDetails?.amount,
              totalAmount: finalAmount?.toFixed(2),
              note: "",
              isSplit: 0,
              storeId: STORE_Id,
              isSync: 0,
              isDeleted: 0,
            };
            console.log(
              "splitPaymentTransactionObj... ",
              splitPaymentTransactionObj
            );

            splitPaymentTransactionObj &&
              splitPaymentTransactionApi?.splitPaymentTransactionDB?.insertSplitTransaction(
                splitPaymentTransactionObj
              );
          }
          setShowConfirmModal(true);
          updateTableOrderDetails();
          singleTransactionPaymentDetails &&
            handleSuccess(singleTransactionPaymentDetails);
        }
      }
    }
  };

  const handleCloseModal = () => {
    setShowConfirmModal(false);
  };

  const backToTableHandler = () => {
    setShowConfirmModal(false);
    setOpenCheckout(false);
    setTotalPriceDetails({});
    setPaymentMethod(null);
    setSelectedTable(null);
    setRunningTables([]);
    // setSelectedProductList([]);
    setShow(true);
  };

  // under this function we called add split payment server api and sale details api
  const transactionSuccessRes = (TransactionDetails) => {
    // let salesDetailsArr = [];
    // let salesId = getUTCDate();
    // for (let index = 0; index < selectedProductList.length; index++) {
    //   let SalesDetailsObj = {
    //     salesDetailsId: salesId + index,
    //     paymentId: TransactionDetails.paymentId,
    //     productName: selectedProductList[index].productName,
    //     productId: selectedProductList[index].productId,
    //     salesQuantity: selectedProductList[index].prQuantity,
    //     purchasingPrice: selectedProductList[index].purchasingPrice,
    //     salesPrice: selectedProductList[index].sellingPrice,
    //     salestotalAmount: selectedProductList[index].singleProTotal,
    //     taxValue: selectedProductList[index].taxValue
    //       ? selectedProductList[index].taxValue
    //       : 0,
    //     discountValue: selectedProductList[index].totalProdDiscount
    //       ? selectedProductList[index].totalProdDiscount
    //       : 0,
    //     modeOfPayment: paymentMethod.value, //or Refund
    //     currencyId: 0,
    //     currencyName: STORE_CURRENCY,
    //     isSync: 0,
    //     isDeleted: 0,
    //     clientLastUpdated: getUTCDate(),
    //   };
    //   salesDetailsArr.push(SalesDetailsObj);
    // }

    let finalAmount =
      totalPriceDetails?.subTotalValue + totalPriceDetails?.totalTaxValue;

    // Split payment server api call function
    if (splitPaymentOptions?.length > 0) {
      for (let i = 0; i < splitPaymentOptions.length; i++) {
        const splitPaymentOptionsDetails = splitPaymentOptions[i];

        const splitPaymentTransactionObj = {
          splitPaymentId: getUTCDate(),
          tableOrderId: selectedTable?.tableOrderId,
          paymentId: TransactionDetails.paymentId,
          paymentDate: getUTCDate(),
          paymentMode: splitPaymentOptionsDetails?.value,
          amount: splitPaymentOptionsDetails?.amount,
          totalAmount: finalAmount?.toFixed(2),
          note: "",
          isSplit: 0,
          storeId: STORE_Id,
          isSync: 0,
          isDeleted: 0,
        };
        console.log(
          "splitPaymentTransactionObj... ",
          splitPaymentTransactionObj
        );

        dispatch(addSplitPayment(splitPaymentTransactionObj));
      }
    }

    // Updating table order product transction after transaction api called
    for (let i = 0; i < selectedProductList.length; i++) {
      const productDetails = selectedProductList[i];

      const payloadObj = {
        ...productDetails,
        isDeleted: 1,
      };

      if (isOnline) {
        // server api call here
        dispatch(addTableOrderTransProduct(payloadObj));
      } else {
        // soft deleting table order product
        tableOrderTransProductsApi?.tableOrderTransProductsDB?.updateTableOrderSignleProd(
          payloadObj
        );
      }
    }

    const tableOrderPayload = {
      ...selectedTable,
      isDeleted: 1,
    };

    // Updating table order transction after transaction api called
    if (isOnline) {
      // server api call here
      dispatch(addTableOrderTrans(tableOrderPayload));
    } else {
      const result =
        tableOrderPayload &&
        tableOrderApi?.tableOrderDB.updateTableOrder(tableOrderPayload);
      // console.log("result... ", result);
    }
    localStorage.removeItem("selectedTable");

    // dispatch(
    //   addSalesDetails(
    //     salesDetailsArr,
    //     TransactionDetails,
    //     handleSuccess
    //     // setApiError
    //   )
    // );
    handleSuccess(TransactionDetails)
    console.log("TransactionDetails0012",TransactionDetails);
    setShowConfirmModal(true);
  };

  // This handler call after transaction api giving 200 res
  const handleSuccess = (TransactionDetails) => {
    setSaveTransDetails(TransactionDetails);
  };

  // cancel table order handler
  const cancelTableOrderHandler = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this order?",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((data) => {
      if (data.isConfirmed) {
        const tableOrderPayload = {
          ...selectedTable,
          isDeleted: 1,
        };

        // if user is going to cancel table order then
        // we doing soft delete of that table order products
        for (let i = 0; i < selectedProductList.length; i++) {
          const productDetails = selectedProductList[i];

          const tableOrderProductPayload = {
            ...productDetails,
            isDeleted: 1,
          };

          if (isOnline) {
            // server api call here
            dispatch(addTableOrderTransProduct(tableOrderProductPayload));
          } else {
            tableOrderTransProductsApi?.tableOrderTransProductsDB?.updateTableOrderSignleProd(
              tableOrderProductPayload
            );
          }
        }

        if (isOnline) {
          // server api call here
          dispatch(addTableOrderTrans(tableOrderPayload));
          backToTableHandler();
        } else {
          tableOrderPayload &&
            tableOrderApi?.tableOrderDB?.updateTableOrder(tableOrderPayload);
          backToTableHandler();
        }
      }
    });
  };

  return transLoading | splitPaymentLoading | tableOrderLoading ? (
    <LoadingSpinner />
  ) : (
    <MainContentArea scroll={"auto"}>
      <div className="table-cart-main">
        {openCheckout ? (
          <div className="overflow-auto table-left-dev cardBox d-flex flex-column">
            <div className=" table-left-cartBody">
              <Checkout
                setOpenCheckout={setOpenCheckout}
                paymentOptionHandler={paymentOptionHandler}
                paymentMethod={paymentMethod}
                errors={errors}
                setErrors={setErrors}
                totalPriceDetails={totalPriceDetails}
                setSplitPaymentOptions={setSplitPaymentOptions}
                splitPaymentOptions={splitPaymentOptions}
                remainingTotalAmount={remainingTotalAmount}
                setSplitAmountTotalPrice={setSplitAmountTotalPrice}
                splitAmountTotalPrice={splitAmountTotalPrice}
                setInputError={setInputError}
                inputError={inputError}
              />
            </div>
          </div>
        ) : (
          <div className="overflow-auto table-left-dev cardBox d-flex flex-column">
            <div className=" table-left-cartBody">
              <div className=" table-header">
                <div className="mb-3 header-btn">
                  <Button
                    style={{
                      backgroundColor: "var(--main-bg-color)",
                    }}
                    variant="contained"
                    onClick={selectTableHandler}
                  >
                    {t("Tables.selectTable")}
                  </Button>
                </div>

                {/* here we show selected table details */}
                {selectedTable ? (
                  <div className="selected-table-details-container">
                    {t("Tables.table")}: {selectedTable?.tableName}{" "}
                    <div className="seats-container">
                      <ul className="m-0 d-flex">
                        <li>
                          {selectedTable?.seatingCapacityCount > 1
                            ? "Seats"
                            : "Seat"}
                        </li>
                        <li className="table-occupid">
                          {t("Tables.occupied")}
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div></div>
                )}

                {/* for new order */}
                <div className="mb-3 header-btn">
                  {/* <Button
                    style={{
                      backgroundColor: "var(--main-bg-color)",
                    }}
                    variant="contained"
                    // onClick={handlePutOnHold}
                  >
                    {t("Tables.newOrder")}
                  </Button> */}
                </div>
              </div>
              <hr />
              <div className="Table-item-cart d-flex justify-content-between ">
                {selectedTable ? (
                  <>
                    {" "}
                    <TableItemCart
                      selectedProductList={selectedProductList}
                      tableOrderRecordValue={selectedTable}
                      totalPriceDetails={totalPriceDetails}
                    />
                    <div className="vertical-line"></div>
                    <TableDetails
                      tableOrderDetailsvalue={selectedTable}
                      tableOrderEditHandler={tableOrderEditHandler}
                      selectedProductList={selectedProductList}
                    />
                  </>
                ) : (
                  <div></div>
                )}
              </div>
            </div>
          </div>
        )}

        {selectedTable ? (
          <>
            <div className="table-right-dev cardBox">
              <div className="table-right-cartBody">
                {selectedProductList &&
                  selectedProductList?.map((item) => {
                    return <TableOrderProductItem productDetails={item} />;
                  })}
              </div>
              <TableTotalCart
                tableTotalCartvalue={totalPriceDetails}
                selectedProductList={selectedProductList}
                openCheckout={openCheckout}
                setOpenCheckout={setOpenCheckout}
                confirmHandler={confirmHandler}
                cancelTableOrderHandler={cancelTableOrderHandler}
                remainingTotalAmount={remainingTotalAmount}
                setSplitAmountTotalPrice={setSplitAmountTotalPrice}
                splitAmountTotalPrice={splitAmountTotalPrice}
                paymentMethod={paymentMethod}
                inputError={inputError}
              />
            </div>
          </>
        ) : (
          <div></div>
        )}
      </div>

      {showConfirmModal && (
        <TableThermalInvoice
          selectedTable={selectedTable}
          totalPriceDetails={totalPriceDetails}
          handleCloseModal={handleCloseModal}
          backToTableHandler={backToTableHandler}
          showConfirmModal={showConfirmModal}
          selectedProductList={selectedProductList}
          saveTransDetails={saveTransDetails}
        />
      )}

      <SelectTableModal
        isModelVisible={show}
        setShow={setShow}
        handleClose={handleClose}
        gettingSelectedTableValue={gettingSelectedTableValue}
        setTableOrderPostRes={setTableOrderPostRes}
        runningTables={runningTables}
        setSelectedTable={setSelectedTable}
        setSelectedProductList={setSelectedProductList}
      />
    </MainContentArea>
  );
};

export default TablesManagement;
