import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BiMerge } from "react-icons/bi";
import { CiEdit } from "react-icons/ci";
import { IoIosMove } from "react-icons/io";
import { MdCallSplit } from "react-icons/md";
import "./TableOrderDetails.css";
import moment from "moment";
import { trimHandler } from "../../utils/constantFunctions";

const TableOrderDetails = ({ tableOrderDetailsvalue, tableOrderEditHandler , selectedProductList }) => {
  const { t } = useTranslation();
  //   console.log("tableOrderDetailsvalue... ", tableOrderDetailsvalue);


  return (
    <div className="table-section overflow-auto">
      <div className="order-details-section d-flex justify-content-between align-items-center">
        <div className="order-details">
          <h4>{t("Tables.orderDetails")}</h4>
        </div>
        <div className="options-details">
          <div className="first-details-option" onClick={() => tableOrderEditHandler()}>
            <p>
              <CiEdit />
              {t("Tables.edit")}
            </p>
            <p>
              <MdCallSplit />
              {t("Tables.split")}
            </p>
          </div>
          <div className="second-details-option">
            <p>
              <BiMerge />
              {t("Tables.merge")}
            </p>
            <p>
              <IoIosMove />
              {t("Tables.move")}
            </p>
          </div>
        </div>
      </div>
      <hr />
      <div className="order-number">
        <table className="table">
          <tr>
            <td> {t("Tables.orderNo")}</td>
            <td>: {tableOrderDetailsvalue.orderNo}</td>
          </tr>
          <tr>
            <td> {t("Tables.status")}</td>:
            <span>
              {" "}
              {tableOrderDetailsvalue.status
                ? tableOrderDetailsvalue.status
                : "Pending"}
            </span>
          </tr>
          <tr>
            <td> {t("Tables.waiter")}</td>
            <td>: {tableOrderDetailsvalue.waiterName}</td>
          </tr>
          <tr>
            <td> {t("Tables.dateAndTime")}</td>
            <td>
              :{" "}
              {tableOrderDetailsvalue.startDate &&
                moment(tableOrderDetailsvalue?.startDate).format("llll")}
            </td>
          </tr>
        </table>
        <h4> {t("Tables.kotHistory")}</h4>
      </div>
      <hr />
      <div className="order-details-section">
        <table className="table">
          <thead className="table-secondary">
            <tr>
              <th>{t("Tables.srNo")}</th>
              <th>{t("Tables.itemName")}</th>
              <th>{t("Tables.quantity")}</th>
              <th>{t("Tables.status")}</th>
            </tr>
          </thead>
          {selectedProductList &&
            selectedProductList?.map((item, index) => {
              return (
                <tbody>
                  <tr>
                    <td>{index + 1}</td>
                    <td>
                      {trimHandler(item.productName, 15)}{" "}
                      <span>
                        {item.productName?.length >= 15 ? "..." : null}
                      </span>{" "}
                    </td>
                    <td>{item.prQuantity}</td>
                    <td>{item.Status ? item.Status : "Pending"}</td>
                  </tr>
                </tbody>
              );
            })}
        </table>
        {/* <div className="table-list d-flex justify-content-between">
          <h6>{t("Tables.SrNo")}</h6>
          <h6>{t("Tables.ItemName")}</h6>
          <h6>{t("Tables.Quantity")}</h6>
          <h6>{t("Tables.Status")}</h6>
        </div>
        {selectedProductList &&
          selectedProductList?.map((item) => {
            return (
              <div className="table-list">
                <>
                  <p>1</p>
                  <p>
                    {trimHandler(item.productName, 15)}{" "}
                    <span>{item.productName?.length >= 15 ? "..." : null}</span>{" "}
                  </p>
                  <p>{item.prQuantity}</p>
                  <p>{item.Status ? item.Status : "Pending"}</p>
                </>
              </div>
            );
          })} */}
      </div>
    </div>
  );
};

export default TableOrderDetails;
