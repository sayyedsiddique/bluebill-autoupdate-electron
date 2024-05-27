
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { STORE_CURRENCY, DEFAULT_LANGUAGE } from "../../Containts/Values";
import { handleTrim, trimHandler } from "../../utils/constantFunctions";

const TableOrderProductItem = ({ productDetails }) => {
  const defaultLang = useSelector((state) => state.language.language);
  const [defaultLanguage, setDefaultLanguage] = useState(defaultLang?.name);
  const CurrencySymbol = (localStorage.getItem("StoreCurrency"));

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
    productDetails && (
      <div className="table-product-item-main-container">
        <div className="product-item-list">
          <h6>
            {handleTrim(productDetails?.productName)}
          </h6>
        </div>
        <div className="">
          {defaultLanguage === "ar" || defaultLanguage === "عربي"
            ? <span>{(productDetails?.sellingPrice).toFixed(2)}{CurrencySymbol}</span>
            : <span>{CurrencySymbol}{(productDetails?.sellingPrice).toFixed(2)}</span>
          }
        </div>

        <span className="product-item-quantity">
          x {productDetails?.prQuantity}
        </span>
        <div className="">
          {defaultLanguage !== "ar" || defaultLanguage !== "عربي"
            ? <span style={{ width: "4rem" }}>{CurrencySymbol}{(productDetails?.singleProTotal).toFixed(2)}</span>
            : <span>{(productDetails?.singleProTotal).toFixed(2)}{CurrencySymbol}</span>
          }
        </div>

      </div>
    )
  );
};
export default TableOrderProductItem;
