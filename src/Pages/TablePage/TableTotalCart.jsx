import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BsFillPrinterFill } from "react-icons/bs";
import { RiDeleteBin5Line } from "react-icons/ri";
import Button from "@mui/material/Button";
import "./TableTotalCart.css";
import { STORE_CURRENCY } from "../../Containts/Values";
import { useSelector } from "react-redux";

const TableTotalCart = ({
  tableTotalCartvalue,
  openCheckout,
  setOpenCheckout,
  confirmHandler,
  cancelTableOrderHandler,
  remainingTotalAmount,
  setSplitAmountTotalPrice,
  splitAmountTotalPrice,
  paymentMethod,
  inputError,
}) => {
  const { t } = useTranslation();
  // console.log("inputError... ", inputError === "" ? "green" : "gray");
  console.log(
    "tableTotalCartvalueCAL... ",
    (
      tableTotalCartvalue.subTotalValue +
      tableTotalCartvalue.totalTaxValue -
      tableTotalCartvalue.productDiscount
    ).toFixed(2)
  );
  console.log("splitAmountTotalPrice", splitAmountTotalPrice);
  const defaultLang = useSelector((state) => state.language.language);
  const [defaultLanguage, setDefaultLanguage] = useState(defaultLang?.name);
  const CurrencySymbol = localStorage.getItem("StoreCurrency");

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

  // console.log(
  //   "zero",
  //   remainingTotalAmount - splitAmountTotalPrice === 0 ||
  //     remainingTotalAmount - splitAmountTotalPrice < 0
  //     ? "true"
  //     : "false"
  // );

  const completeHandle = () => {
    setOpenCheckout(true);
  };

  return (
    <div className="table-total-Cart">
      <div className="table-subtotal">
        <span> {t("Tables.subtotal")}</span>
        <span> {t("Tables.tax")}</span>
        {/* <span> {t("Tables.charges")}</span> */}
        <span> {t("Tables.discount")}</span>
      </div>
      <div className="table-subtotal">
        <span>
          {defaultLanguage === "ar" || defaultLanguage === "عربي" ? (
            <>
              {tableTotalCartvalue &&
                tableTotalCartvalue.subTotalValue !== undefined && (
                  <>
                    {tableTotalCartvalue.subTotalValue.toFixed(2)}
                    {CurrencySymbol}
                  </>
                )}
            </>
          ) : (
            <>
              {tableTotalCartvalue &&
                tableTotalCartvalue.subTotalValue !== undefined && (
                  <>
                    {CurrencySymbol}
                    {tableTotalCartvalue.subTotalValue.toFixed(2)}
                  </>
                )}
            </>
          )}
        </span>

        {/* <span>
          {defaultLanguage === "ar" || defaultLanguage === "عربي"
            ? <span>{tableTotalCartvalue.productTax}{CurrencySymbol}</span>
            : <span>{CurrencySymbol}{tableTotalCartvalue.productTax}</span>
          }
        </span> */}
        <span>
          {defaultLanguage === "ar" || defaultLanguage === "عربي" ? (
            <>
              {tableTotalCartvalue &&
                tableTotalCartvalue.totalTaxValue !== undefined && (
                  <>
                    {tableTotalCartvalue.totalTaxValue.toFixed(2)}
                    {CurrencySymbol}
                  </>
                )}
            </>
          ) : (
            <>
              {tableTotalCartvalue &&
                tableTotalCartvalue.totalTaxValue !== undefined && (
                  <>
                    {CurrencySymbol}
                    {tableTotalCartvalue.totalTaxValue.toFixed(2)}
                  </>
                )}
            </>
          )}
        </span>

        <span>
          {defaultLanguage === "ar" || defaultLanguage === "عربي" ? (
            <>
              {tableTotalCartvalue &&
                tableTotalCartvalue.productDiscount !== undefined && (
                  <>
                    {tableTotalCartvalue.productDiscount.toFixed(2)}
                    {CurrencySymbol}
                  </>
                )}
            </>
          ) : (
            <>
              {tableTotalCartvalue &&
                tableTotalCartvalue.productDiscount !== undefined && (
                  <>
                    {CurrencySymbol}
                    {tableTotalCartvalue.productDiscount.toFixed(2)}
                  </>
                )}
            </>
          )}
        </span>
      </div>
      <hr style={{ color: "white" }} />
      <div className="table-subtotal">
        <span> {t("Tables.item")}</span>
        <span> {t("Tables.quantity")}</span>
        <span> {t("Tables.total")}</span>
      </div>
      <div className="table-subtotal">
        <span>{tableTotalCartvalue?.productCount}</span>
        <span>{tableTotalCartvalue?.totalQuantity}</span>
        <span
          style={{
            fontSize: "1.5rem",
          }}
        >
          {defaultLanguage === "ar" || defaultLanguage === "عربي" ? (
            <span>
              {(
                tableTotalCartvalue.subTotalValue +
                tableTotalCartvalue.totalTaxValue -
                tableTotalCartvalue.productDiscount
              ).toFixed(2)}
              {CurrencySymbol}
            </span>
          ) : (
            <span>
              {CurrencySymbol}
              {(
                tableTotalCartvalue.subTotalValue +
                Number(
                  tableTotalCartvalue.totalTaxValue
                    ? tableTotalCartvalue.totalTaxValue
                    : 0
                ) -
                Number(
                  tableTotalCartvalue.productDiscount
                    ? tableTotalCartvalue.productDiscount
                    : 0
                )
              ).toFixed(2)}
            </span>
          )}
        </span>
      </div>

      <div className="Table-subtotal-btn">
        {openCheckout !== true ? (
          <>
            <Button
              className="Table-subtotal-secondry-btn"
              style={{
                backgroundColor: "var(--bs-red)",
              }}
              type="button"
              variant="contained"
              onClick={cancelTableOrderHandler}
            >
              <RiDeleteBin5Line size={15} style={{ margin: 5 }} />
              {t("Tables.cancel")}
            </Button>

            <Button
              className="Table-subtotal-complete-btn"
              style={{
                width: "100%",
                backgroundColor: "var(--bs-green)",
              }}
              type="button"
              variant="contained"
              class="btn btn-lg btn-primary"
              onClick={completeHandle}
            >
              {t("Tables.complete")}
            </Button>
          </>
        ) : (
          <>
            {" "}
            <Button
              className="Table-subtotal-complete-btn"
              style={{
                width: "100%",
                backgroundColor:
                  (paymentMethod?.value === "Split" ||
                    paymentMethod?.value === "Cash") &&
                  (paymentMethod?.value === "Cash" ||
                    remainingTotalAmount - splitAmountTotalPrice === 0) &&
                  inputError === ""
                    ? "var(--bs-green)"
                    : "var(--gray-color)",

                color:
                  (paymentMethod?.value === "Split" ||
                    paymentMethod?.value === "Cash") &&
                  (paymentMethod?.value === "Cash" ||
                    remainingTotalAmount - splitAmountTotalPrice === 0) &&
                  inputError === ""
                    ? "var(--bs-white)"
                    : "var(--light-black-color)",
              }}
              type="button"
              variant="contained"
              class="btn btn-lg btn-primary"
              onClick={() => confirmHandler()}
              disabled={
                (paymentMethod?.value === "Split" ||
                  paymentMethod?.value === "Cash") &&
                (paymentMethod?.value === "Cash" ||
                  remainingTotalAmount - splitAmountTotalPrice === 0) &&
                inputError === ""
                  ? false
                  : true
              }
            >
              {t("Tables.confirm")}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default TableTotalCart;
