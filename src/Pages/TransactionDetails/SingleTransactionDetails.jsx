import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";
import { DEFAULT_IMAGE, STORE_CURRENCY } from "../../Containts/Values";
import { singleTransaction } from "../../Redux/Transaction/TransactionSlice";
import MainContentArea from "../MainContentArea/MainContentArea";
import Button from "@mui/material/Button";

const SingleTransactionDetails = () => {
  const { t } = useTranslation();
  const isLoading = useSelector((state) => state.transaction.loading);
  const location = useLocation();
  const navigate = useNavigate();
  const paymentId = location.state.paymentId;
  const dispatch = useDispatch();
  const singleTransactionData = useSelector(
    (state) => state.transaction.singleTransactionData
  );

  const [total, setTotal] = useState(0);
  const [totalTax, setTotalTax] = useState(0)
  const [totalDiscount, setTotalDiscount] = useState(0)
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

  useEffect(() => {
    dispatch(singleTransaction(paymentId));
  }, [paymentId]);

  useEffect(() => {
    let total = 0;
    let tax = 0;
    let discont = 0;
    singleTransactionData?.map((item) => {
      total = total + item.salesQuantity * item.salesPrice;
      tax = tax + item.taxValue
      discont = discont + item.discountValue * item.salesQuantity
    });
    setTotal(total);
    setTotalTax(tax)
    setTotalDiscount(discont)
  }, [singleTransactionData]);

  console.log("singleTransactionData", singleTransactionData);

  return (
    <MainContentArea>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="table-cartbox">
          <div className=" singleTransactionBack d-flex justify-content-end mb-2">
            <Button
              variant="contained"
              style={{
                background: "#e3e2e2",
                color: "dimgray",
              }}
              onClick={() => navigate("/transaction")}
            >
              {t("Tables.back")}
            </Button>
          </div>
          <div className="card-body my-3 pt-0">
            <table className="table table-hover table-borderless">
              <thead className="table-secondary sticky-top" style={{ zIndex: 0 }}>
                <tr>
                  <th>{t("SingleTransaction.products")}</th>
                  <th>{t("SingleTransaction.quantity")}</th>
                  <th>{t("SingleTransaction.total")}</th>
                </tr>
              </thead>

              {singleTransactionData?.map(
                ({ productName, salesQuantity, salesPrice }, index) => (
                  <tbody key={index}>
                    <tr>
                      <td>
                        {" "}
                        <img
                          src={DEFAULT_IMAGE}
                          alt="product image"
                          width="50"
                          height="50"

                        />
                        <span className="ms-1">{productName}</span>
                      </td>
                      <td>
                        {defaultLanguage === "ar" ||
                          defaultLanguage === "عربي"
                          ? <td>
                            {salesPrice} x {salesQuantity}
                            {CurrencySymbol}
                          </td>
                          :
                          <td>
                            {CurrencySymbol}
                            {salesPrice} x {salesQuantity}
                          </td>
                        }
                      </td>
                      <td>
                        {defaultLanguage === "ar" ||
                          defaultLanguage === "عربي"
                          ? <td>
                            {salesPrice.toFixed(2) * salesQuantity}
                            {CurrencySymbol}
                          </td>
                          :
                          <td>
                            {CurrencySymbol}
                            {salesPrice.toFixed(2) * salesQuantity}
                          </td>
                        }
                      </td>
                    </tr>
                  </tbody>
                )
              )}
            </table>
            <div
              style={{
                display: "flex",
                flex: "wrap",
                justifyContent: "space-between",
              }}
            >
              <div style={{ marginLeft: 10 }} className="text-danger">
                {defaultLanguage === "ar" ||
                  defaultLanguage === "عربي"
                  ? <>
                    {totalTax}
                    {t("SingleTransaction.tax")} : {CurrencySymbol}
                  </>
                  :
                  <>
                    {t("SingleTransaction.tax")} : {CurrencySymbol}
                    {totalTax}
                  </>
                }
              </div>
              <div className="text-success">
                {defaultLanguage === "ar" ||
                  defaultLanguage === "عربي"
                  ? <>
                    {totalDiscount}
                    {t("SingleTransaction.discount")} : {CurrencySymbol}
                  </>
                  :
                  <>
                    {t("SingleTransaction.discount")} : {CurrencySymbol}
                    {totalDiscount}
                  </>
                }
              </div>
              <div style={{ marginRight: 15 }} className="text-Color">
                {defaultLanguage === "ar" ||
                  defaultLanguage === "عربي"
                  ? <>
                    {(total + totalTax - totalDiscount)}

                    {t("SingleTransaction.total")} : {CurrencySymbol}
                  </>
                  :
                  <>
                    {t("SingleTransaction.total")} : {CurrencySymbol}
                    {(total + totalTax - totalDiscount)}

                  </>
                }
              </div>
            </div>
          </div>
        </div>
      )}
    </MainContentArea>
  );
};

export default SingleTransactionDetails;
