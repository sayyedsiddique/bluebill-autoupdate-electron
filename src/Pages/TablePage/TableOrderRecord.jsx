import React, { useEffect, useState } from "react";
import "./TableOrderRecord.css";
import moment from "moment";
import { STORE_CURRENCY } from "../../Containts/Values";
import { useSelector } from "react-redux";

const TableOrderRecord = ({
  selectedProductList,
  tableOrderRecordValue,
  totalPriceDetails,
}) => {
  //   console.log("data", tableOrderRecordValue);

  // const [selectedProductList, setSelectedProductList] = useState([]);
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

  return (
    <>
      <div className="table-small-box overflow-auto">
        <h3># {tableOrderRecordValue?.orderId}</h3>
        <p>
          {`${selectedProductList?.length} Items`} |{""}{" "}
          {defaultLanguage === "ar" || defaultLanguage === "عربي" ? (
            <span>
              {(
                totalPriceDetails?.subTotalValue +
                Number(
                  totalPriceDetails?.totalTaxValue
                    ? totalPriceDetails?.totalTaxValue
                    : 0
                ) -
                Number(
                  totalPriceDetails?.productDiscount
                    ? totalPriceDetails?.productDiscount
                    : 0
                )
              ).toFixed(2)}
              {CurrencySymbol}
            </span>
          ) : (
            <span>
              {CurrencySymbol}
              {(
                totalPriceDetails?.subTotalValue +
                Number(
                  totalPriceDetails?.totalTaxValue
                    ? totalPriceDetails?.totalTaxValue
                    : 0
                ) -
                Number(
                  totalPriceDetails?.productDiscount
                    ? totalPriceDetails?.productDiscount
                    : 0
                )
              ).toFixed(2)}
            </span>
          )}
        </p>
        <p>
          {tableOrderRecordValue?.startDate &&
            moment(tableOrderRecordValue?.startDate).format("llll")}
        </p>
      </div>
    </>
  );
};

export default TableOrderRecord;
