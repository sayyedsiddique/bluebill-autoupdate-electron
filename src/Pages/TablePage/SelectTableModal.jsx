import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { CUSTOM_DROPDOWN_STYLE } from "../../utils/CustomeStyles";
import Select from "react-select";
import { getSalesExecutiveList } from "../../Redux/SalesExecutive/SalesExecutiveSlice";
import { useTranslation } from "react-i18next";
import {
  GET_FLOOR_MAPPED_TABLE_LIST,
  GET_FLOOR_PLAN_TABLE_LIST_BY_FLOOR_ID,
  GET_TABLE_ORDER_TRANS_PRODUCT_LIST,
  SERVER_URL,
  STORE_CURRENCY,
  STORE_Id,
  getUTCDate,
} from "../../Containts/Values";
import { useNavigate } from "react-router-dom";
import "./SelectTableModal.css";
import { getFloorList } from "../../Redux/Floor/floorSlice";
import { getFloorMappedTableList } from "../../Redux/Table/tableSlice";
import { getTableOrderTransaction } from "../../Redux/TableOrder/TableOrderSlice";
import { getTableOrderTransProductsList } from "../../Redux/TableOrderProduct/TableOrderProductSlice";
import axios from "axios";
import { apiConfig } from "../../utils/constantFunctions";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";
import { getFloorPlanListByFloorId } from "../../Redux/FloorPlan/floorPlanSlice";
import { getDiscountlist } from "../../Redux/Discount/discountSlice";

const SelectTableModal = ({
  isModelVisible,
  setShow,
  handleClose,
  gettingSelectedTableValue,
  setTableOrderPostRes,
  runningTables,
  setSelectedTable,
  setSelectedProductList,
}) => {
  const tableApi = window.tableApi;
  const floorApi = window.floorApi;
  const tableOrderApi = window.tableOrderApi;
  const salesExecutiveApi = window.salesExecutiveApi;
  const floorPlanTablesApi = window.floorPlanTablesApi;
  const tableOrderTransProductsApi = window.tableOrderTransProductsApi;

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isOnline = useSelector((state) => state.checkInternet.isOnline);
  const SalesExecutiveData = useSelector(
    (state) => state.salesExecutive.SalesExecutiveData
  );
  const floorData = useSelector((state) => state.floor.floorData);
  const floorMappedTableList = useSelector(
    (state) => state.table.floorMappedTableList
  );
  console.log("floorData... ", floorData);
  const tableOrderProdList = useSelector(
    (state) => state.tableOrderProduct.tableOrderProductData
  );
  const floorPlanTableList = useSelector(
    (state) => state.floorPlan.floorPlanData
  );
  const floorLoading = useSelector((state) => state.floor.loading);
  const defaultLang = useSelector((state) => state.language.language);
  const [salesExecutiveList, setSalesExecutiveList] = useState([]);
  const [tableList, setTablesList] = useState([]);
  const [mappedTableListToFloor, setMappedTableListToFloor] = useState([]);
  const [floorsList, setFloorsList] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState({});
  console.log("selectedFloor... ", selectedFloor);
  const [selectedTableDetails, setSelectedTableDetails] = useState({});
  const [selectedSalesExecutive, setSelectedSalesExecutive] = useState(null);
  const [error, setError] = useState({
    waiter: "",
  });
  const [floorId, setFloorId] = useState(null);
  const getDiscountData = useSelector((state) => state.discount.discountData);
  console.log("getDiscountData... ", getDiscountData);
  const [discountDataList, setDiscountDataList] = useState([]);
  console.log("discountDataList... ", discountDataList);

  const [defaultLanguage, setDefaultLanguage] = useState(defaultLang?.name);
  // console.log("defaultLangR... ", defaultLang)
  console.log("defaultLangS... ", defaultLanguage);

  // getting local storage default language
  useEffect(() => {
    // const localStorageLang = localStorage.getItem("defaultLang");
    if (defaultLang?.name === "Arabic") {
      setDefaultLanguage("Arabic");
    } else if (defaultLang?.name === "English") {
      setDefaultLanguage("English");
    }
  }, [defaultLang]);

  // it store real api sales executive data
  useEffect(() => {
    //   sales executive is waiter
    SalesExecutiveData && setSalesExecutiveList(SalesExecutiveData);
    getDiscountData?.discount?.length > 0 &&
      setDiscountDataList(getDiscountData?.discount);
  }, [SalesExecutiveData, getDiscountData?.discount]);

  // Initially all list apis called here
  useEffect(() => {
    if (isOnline) {
      // call server api here
      dispatch(getSalesExecutiveList());
      dispatch(getFloorList());
      dispatch(getDiscountlist(0, 0, "", ""));
    } else {
      const tableDataList = tableApi?.tableDB?.getTableList();
      tableDataList && setTablesList(tableDataList);
      // console.log("tableDataList... ", tableDataList);

      const floorDataList = floorApi?.floorDB?.getFloorList();
      floorDataList && setFloorsList(floorDataList);
      //   intially first floor mapped tables displayed
      floorDataList && setSelectedFloor(floorDataList[0]);

      const floorMappedTableListData =
        floorDataList &&
        tableApi?.tableDB?.getFloorMappedTableList(floorDataList[0]?.floorId);
      floorMappedTableListData &&
        setMappedTableListToFloor(floorMappedTableListData);

      let modifiedMappedTableList = gettingFloorPlanTables(
        floorDataList[0]?.floorId,
        floorMappedTableListData
      );
      modifiedMappedTableList &&
        setMappedTableListToFloor(modifiedMappedTableList);
      // console.log("modifiedMappedTableList... ", modifiedMappedTableList);

      //   sales executive is waiter
      const salesExList =
        salesExecutiveApi?.salesExecutiveDB?.getAllSalesExecutive();
      salesExList && setSalesExecutiveList(salesExList);
    }
  }, [isOnline]);

  // floor mapped table list server api data stored in state here
  useEffect(() => {
    floorMappedTableList?.length > 0
      ? setMappedTableListToFloor(floorMappedTableList)
      : setMappedTableListToFloor([]);
    floorMappedTableList?.length > 0 &&
      gettingFloorPlanTables(floorData[0]?.floorId, floorMappedTableList);
    // setFloorId(floorData[0]?.floorId);
  }, [floorMappedTableList, floorData]);

  useEffect(() => {
    floorData?.length > 0 && setFloorsList(floorData);
    floorData && setSelectedFloor(floorData[0]);
    dispatch(getFloorMappedTableList(floorData[0]?.floorId));
  }, [floorData]);

  // getting floor plan table list under this handle
  const gettingFloorPlanTables = (floorId, floorMappedTableListData) => {
    console.log("floorMappedTableListData... ", floorMappedTableListData);
    if (isOnline) {
      // call server api here
      // dispatch(getFloorPlanListByFloorId(floorId))

      let config = apiConfig(
        `${SERVER_URL}${GET_FLOOR_PLAN_TABLE_LIST_BY_FLOOR_ID}?floorId=${floorId}`,
        "GET"
      );

      axios(config)
        .then((response) => {
          console.log("getFloorPlanListByFloorIdResponse... ", response);
          if (response?.status === 200) {
            let floorPlanList = response?.data;
            let modifiedMappedTableList = [];

            floorMappedTableListData &&
              floorMappedTableListData?.map((item) => {
                // Checking if there is a matching tableId in floorPlanTables
                const machingItem = floorPlanList?.find(
                  (item2) => item?.tableId === item2?.tableId
                );
                console.log("machingItem... ", machingItem);
                // If a match is found, push it to modifiedMappedTableList
                machingItem
                  ? modifiedMappedTableList.push(machingItem)
                  : modifiedMappedTableList.push(item);
              });

            console.log("modifiedMappedTableList... ", modifiedMappedTableList);
            modifiedMappedTableList &&
              setMappedTableListToFloor(modifiedMappedTableList);
          }
        })
        .catch((err) => {
          console.log("err", err);
        });
    } else {
      const floorPlanTables =
        floorPlanTablesApi?.floorPlanTablesDB?.getFloorPlanTableList(floorId);

      let modifiedMappedTableList = [];

      floorMappedTableListData &&
        floorMappedTableListData?.map((item) => {
          // Checking if there is a matching tableId in floorPlanTables
          const machingItem = floorPlanTables?.find(
            (item2) => item?.tableId === item2?.tableId
          );
          // If a match is found, push it to modifiedMappedTableList
          machingItem
            ? modifiedMappedTableList.push(machingItem)
            : modifiedMappedTableList.push(item);
        });

      return modifiedMappedTableList;
    }
  };

  //   floor select handler
  const floorSelectHandler = (floorDetails) => {
    // console.log("floorDetails... ", floorDetails);
    floorDetails && setSelectedFloor(floorDetails);
    // setFloorId(floorDetails?.floorId);

    if (isOnline) {
      // server api call here
      // dispatch(getFloorMappedTableList(floorDetails?.floorId));

      let config = apiConfig(
        `${SERVER_URL}${GET_FLOOR_MAPPED_TABLE_LIST}?floorId=${floorDetails?.floorId}`,
        "GET"
      );

      axios(config)
        .then((response) => {
          console.log("getFloorMappedTableListResponse... ", response);
          if (response?.status === 200) {
            let floorList = response?.data;
            gettingFloorPlanTables(floorDetails?.floorId, floorList);
          }
        })
        .catch((err) => {
          console.log("err", err);
        });
    } else {
      // calling this api to get mapped table list to floor by floor id
      const mappedTableListData =
        floorDetails &&
        tableApi?.tableDB?.getFloorMappedTableList(floorDetails?.floorId);

      let modifiedMappedTableList = gettingFloorPlanTables(
        floorDetails?.floorId,
        mappedTableListData
      );
      console.log("modifiedMappedTableList... ", modifiedMappedTableList);
      modifiedMappedTableList &&
        setMappedTableListToFloor(modifiedMappedTableList);
    }
  };

  //   sales executive is waiter
  const waiterSelectHandler = (waiterDetails) => {
    // console.log("waiterDetails... ", waiterDetails);
    waiterDetails && setSelectedSalesExecutive(waiterDetails);
    setError({ waiter: "" });
  };

  //   table select handler and it's also submit handle for this modal
  const tableSelectHandler = (tableDetails) => {
    // console.log("tableDetails... ", tableDetails);

    // here we are checking which table user select,
    // if running table select then we dont require to select waiter
    const runningTableSelected = runningTables.some(
      (item) => item?.tableId === tableDetails?.tableId
    );
    // console.log("runningTableSelected... ", runningTableSelected);
    // table can only able to select if waiter is selected
    if (!selectedSalesExecutive && runningTableSelected === false) {
      setError({ waiter: "Please first select the waiter" });
      return false;
    } else {
      //   tableDetails && setSelectedTable(tableDetails);
      //   gettingSelectedTableValue(tableDetails);

      const tableOrderPayload = {
        tableOrderId: getUTCDate(),
        tableId: tableDetails?.tableId,
        tableName: tableDetails?.tableName,
        tableSeatingCount: tableDetails?.seatingCapacityCount,
        waiterId: selectedSalesExecutive?.id,
        waiterName: selectedSalesExecutive?.name,
        productIds: "",
        orderId: getUTCDate(),
        orderNo: 1,
        category: "",
        startDate: getUTCDate(),
        subTotal: 0,
        taxAmount: 0,
        charges: 0,
        quantity: 0,
        finalTotal: 0,
        customerId: 0,
        discount: 0,
        userName: "",
        storeId: STORE_Id,
        isSync: 0,
        isDeleted: 0,
        // currencyName: STORE_CURRENCY,
      };

      console.log("tableOrderPayload... ", tableOrderPayload);

      // Here we checking selected table is running table or not if it is running table then i dont call api
      if (
        runningTables.some((item) => item?.tableId === tableDetails?.tableId)
      ) {
        const runningTableSelected = runningTables.find(
          (item) => item?.tableId === tableDetails?.tableId
        );
        console.log("runningTableSelected... ", runningTableSelected);

        // Selected table details store in local storage for temporary usage
        const selectedTableObj = {
          tableOrderId: runningTableSelected?.tableOrderId,
          tableName: runningTableSelected?.tableName,
          tableId: runningTableSelected?.tableId,
          waiterId: runningTableSelected?.waiterId,
          waiterName: runningTableSelected?.waiterName,
        };
        // console.log("runningTableSelected... ", runningTableSelected);

        localStorage.setItem("selectedTable", JSON.stringify(selectedTableObj));
        let tableOrderProdList;
        if (isOnline) {
          // calling server api here
          // dispatch(getTableOrderTransProductsList(runningTableSelected?.tableOrderId, gettingTableOrderProdRes));
          let config = apiConfig(
            `${SERVER_URL}${GET_TABLE_ORDER_TRANS_PRODUCT_LIST}?tableOrderId=${runningTableSelected?.tableOrderId}`,
            "GET"
          );
          axios(config)
            .then((response) => {
              console.log("TableOrderTransProductResponse... ", response);
              if (response?.status === 200) {
                response?.data?.data?.length > 0 &&
                  setSelectedProductList(response?.data?.data);
                // If selected table dont have any product then we navigate on billing page
                response?.data?.data?.length > 0
                  ? setSelectedTable(runningTableSelected)
                  : navigate("/cart");
                runningTableSelected && setShow(!isModelVisible);
              }
            })
            .catch((err) => {
              console.log("err", err);
            });
        } else {
          tableOrderProdList =
            runningTableSelected &&
            tableOrderTransProductsApi?.tableOrderTransProductsDB?.getTableOrderTransProductsList(
              runningTableSelected?.tableOrderId
            );
          console.log("tableOrderProdList... ", tableOrderProdList);
          tableOrderProdList && setSelectedProductList(tableOrderProdList);

          // If selected table dont have any product then we navigate on billing page
          tableOrderProdList?.length > 0
            ? setSelectedTable(runningTableSelected)
            : navigate("/cart");
          runningTableSelected && setShow(!isModelVisible);
        }
      } else {
        // const result =
        //   tableOrderPayload &&
        //   tableOrderApi?.tableOrderDB.insertTableOrder(tableOrderPayload);
        // result && setTableOrderPostRes(result);
        // console.log("result... ", result);
        // Selected table details store in local storage for temporary usage
        // if (result.changes === 1) {
        const selectedTableObj = {
          // tableOrderId: result?.lastInsertRowid,
          tableName: tableDetails?.tableName,
          tableId: tableDetails?.tableId,
          waiterId: selectedSalesExecutive?.id,
          waiterName: selectedSalesExecutive?.name,
        };
        // console.log("selectedTableObj... ", selectedTableObj);
        localStorage.setItem("selectedTable", JSON.stringify(selectedTableObj));
        setShow(!isModelVisible);
        navigate("/cart");
        // }
      }
    }
  };

  const gettingTableOrderProdRes = (response) => {
    console.log("response... ", response);
    return response;
  };

  // It's used for if selected lang is arabic then change floor paln table design according to that
  const addHyphenHandler = (item) => {
    const originalString = item;
    // Use a regular expression to match numerical values and insert a hyphen before each of them
    const modifiedString =
      originalString && originalString?.replace(/(-?\d+\.?\d*)/g, "-$1");
    console.log("modifiedString ", modifiedString);
    return modifiedString;
  };

  return floorLoading ? (
    <LoadingSpinner />
  ) : (
    <div className="select-table-modal-container">
      <div className="table modal-dialog">
        <Modal
          size="xl"
          isOpen={isModelVisible}
          toggle={() => setShow(!isModelVisible)}
          contentClassName="custom-modal-style"
        >
          <ModalHeader
            toggle={() => setShow(!isModelVisible)}
            className="popup-modal"
          >
            {t("Tables.selectTable")}
          </ModalHeader>
          <ModalBody className="popup-modal">
            <div className="mb-3 waiter-select-container">
              <label>
                {t("Tables.selectWaiter")}
                <span className="text-danger">*</span>
              </label>
              <Select
                name="waiterValue"
                styles={CUSTOM_DROPDOWN_STYLE}
                value={selectedSalesExecutive ? selectedSalesExecutive : null}
                placeholder={t("Tables.selectWaiter")}
                // inputRef={VendorListDataRef}
                onChange={(e) => waiterSelectHandler(e)}
                options={salesExecutiveList}
                getOptionLabel={(salesExecutiveList) =>
                  salesExecutiveList?.name
                }
                isClearable={true}
              />

              {error.waiter && (
                <span className="text-danger">{error.waiter}</span>
              )}
            </div>
            <div className="floor-table-modal-container d-flex">
              {floorsList && floorsList?.length > 0 && (
                <div className="floor-category-container cardBox">
                  <div className="product-categary-item left-cartBody">
                    <ul className="list-group list-group-flush">
                      {floorsList &&
                        floorsList?.map((item) => {
                          return (
                            <li
                              className={`list-group-item category-item  p-2 ${
                                selectedFloor?.floorId === item?.floorId
                                  ? "active"
                                  : ""
                              }`}
                              onClick={() => floorSelectHandler(item)}
                            >
                              {item?.floorName}
                            </li>
                          );
                        })}
                    </ul>
                  </div>
                </div>
              )}

              {/* here we displyed all tables */}
              <div className="table-modal-container">
                <ul>
                  {mappedTableListToFloor &&
                    mappedTableListToFloor?.map((item) => {
                      return (
                        <div
                          className={
                            runningTables?.some(
                              (runningTableItem) =>
                                runningTableItem?.tableId === item?.tableId
                            )
                              ? "table-card-box active"
                              : "table-card-box"
                          }
                          style={{
                            transform: item?.transform
                              ? `${
                                  defaultLanguage === "Arabic"
                                    ? `${addHyphenHandler(item?.transform)}`
                                    : item?.transform
                                }`
                              : "",
                            width: item?.width ? item?.width : "85px",
                            height: item?.height ? item?.height : "70px",
                            borderRadius: item?.borderRadius
                              ? item?.borderRadius
                              : "5px",
                          }}
                          onClick={() => tableSelectHandler(item)}
                        >
                          {console.log(
                            "item?.transform ",
                            addHyphenHandler(item?.transform)
                          )}
                          <li>{item?.tableName}</li>
                          <span>
                            {item?.seatingCapacityCount}{" "}
                            {item?.seatingCapacityCount > 1 ? "Seats" : "Seat"}
                          </span>
                        </div>
                      );
                    })}
                </ul>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div>
    </div>
  );
};

export default SelectTableModal;
