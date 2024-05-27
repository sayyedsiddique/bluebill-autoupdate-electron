import React, { useEffect, useState } from "react";
import PaymentOption from "../PaymentOption/PaymentOption";
import { SelectedPaymentMode } from "../../utils/constantFunctions";
import { STORE_CURRENCY } from "../../Containts/Values";
import "./Checkout.css";
import { Button, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import PaymentOptionModal from "../PaymentOption/PaymentOptionModal";
import SplitPaymentCard from "../PaymentOption/SplitPaymentCard";
import { useSelector } from "react-redux";

const Checkout = ({
  setOpenCheckout,
  paymentOptionHandler,
  paymentMethod,
  errors,
  setErrors,
  totalPriceDetails,
  setSplitPaymentOptions,
  splitPaymentOptions,
  remainingTotalAmount,
  setSplitAmountTotalPrice,
  splitAmountTotalPrice,
  setInputError,
  inputError
}) => {
  const { t } = useTranslation();
  const [openPaymentOptionModal, setOpenPaymentOptionModal] = useState(false);
  const [openSplitModal, setOpenSplitModal] = useState(false);

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


  useEffect(() => { }, [remainingTotalAmount]);

  // calculate the split and total amount
  const calculateSplitTotalAmount = (arr, inputIndex) => {
    let newArr = [...arr];
    console.log("newArr... ", newArr);
    let updateRemainingTotalAmount = 0;
    if (splitPaymentOptions?.length > 0) {
      newArr?.map((item) => {
        updateRemainingTotalAmount += item?.amount;
      });

      setInputError("")
      if(updateRemainingTotalAmount > remainingTotalAmount){
        console.log("overvalueenter")
        setInputError("You have entered over value")
      }

      setSplitAmountTotalPrice(parseFloat(updateRemainingTotalAmount));
      console.log("remainingTotalAmount... ", remainingTotalAmount);
      console.log("updateRemainingTotalAmount... ", updateRemainingTotalAmount);
      console.log(
        "totalRemaining",
        remainingTotalAmount - updateRemainingTotalAmount
      );
    }
  };

  const backHandler = () => {
    // console.log("setOpenCheckout", setOpenCheckout);
    setOpenCheckout(false);
  };

  // handler to open payment option for split modal
  const addPaymentMethodHandler = () => {
    setOpenPaymentOptionModal(true);
  };

  // split card input handler
  const splitPaymentCardInputHandler = (e) => {
    let arr = [...splitPaymentOptions];
    const inputIndex = parseFloat(e.target.name);
    console.log("inputIndex ", inputIndex)
    console.log("arr... ", arr);
    const currentValue = e.target.value;
    let newArrObj
    if (
      currentValue === "" ||
      (!isNaN(currentValue) && parseFloat(currentValue))
    ) {
      newArrObj = arr[inputIndex].amount = Number(currentValue);
      console.log("newArrObj... ", newArrObj)
      calculateSplitTotalAmount(arr, inputIndex);
    }
    // }
    setSplitPaymentOptions(arr);
  };

  // split card close handler
  const splitCardCloseHandler = (index) => {
    let arr = [...splitPaymentOptions];
    arr.splice(index, 1);
    setSplitPaymentOptions(arr);
  };

  console.log("112",(Number(remainingTotalAmount) - Number(splitAmountTotalPrice)).toFixed(2))

  return (
    <>
      <div
        className="mb-2 d-flex justify-content-between align-items-center"
        style={{ textAlign: "right" }}
      >
        <h2>{t("Tables.paymentOptions")}</h2>
        <Button
          variant="contained"
          style={{
            background: "#e3e2e2",
            color: "dimgray",
          }}
          onClick={backHandler}
        >
          {t("Tables.back")}
        </Button>
      </div>
      <div className="payment-options-container">
        <div className="options-container">
          <PaymentOption
            paymentOptionHandler={paymentOptionHandler}
            paymentMethod={paymentMethod}
            errors={errors}
            setErrors={setErrors}
          />
        </div>
        <div className="amount-container">
          <h1>
            {defaultLanguage === "ar" || defaultLanguage === "عربي" ? (
              <h1>
                {(
                  totalPriceDetails &&
                  (totalPriceDetails.subTotalValue + Number(totalPriceDetails.totalTaxValue ? totalPriceDetails.totalTaxValue : 0) - Number(totalPriceDetails.productDiscount ? totalPriceDetails.productDiscount : 0)).toFixed(2)
                )}
                {CurrencySymbol}
              </h1>
            ) : (
              <h1>
                {CurrencySymbol}
                {(
                  totalPriceDetails &&
                  (totalPriceDetails.subTotalValue + Number(totalPriceDetails.totalTaxValue ? totalPriceDetails.totalTaxValue : 0) - Number(totalPriceDetails.productDiscount ? totalPriceDetails.productDiscount : 0)).toFixed(2)
                )}
              </h1>
            )}
          </h1>
          {/* it's only shown when payment option split is selected */}
          {paymentMethod?.value === "Split" &&
            splitPaymentOptions?.length === 0 && (
              <div className="">
                <Button
                  variant="contained"
                  style={{
                    background: "var(--main-bg-color)",
                    color: "white",
                  }}
                  onClick={addPaymentMethodHandler}
                >
                  {t("Tables.addPaymentMethod")}
                </Button>
              </div>
            )}

          <div className="mt-4 w-100">
            {splitPaymentOptions &&
              splitPaymentOptions?.map((item, index) => {
                return (
                  <>
                    {console.log("item... ", item)}
                    <SplitPaymentCard
                      cardIndex={index}
                      paymentMethod={item?.value}
                      amount={item?.amount}
                      closeHandler={splitCardCloseHandler}
                      splitPaymentCardInputHandler={
                        splitPaymentCardInputHandler
                      }
                      splitAmountTotalPrice={splitAmountTotalPrice}
                      remainingTotalAmount={remainingTotalAmount}
                      inputError={inputError}
                    />
                  </>
                );
              })}
            {splitPaymentOptions?.length > 0 && (
              <div className="mb-3 d-flex justify-content-between">
                <h4>{t("Tables.total")}</h4>
                <div className="w-50">
                  <TextField
                    style={{ backgroundColor: "var(--white-color)" }}
                    // label="Size"
                    // placeholder={t("AddNewProduct.stockLevelAlert")}
                    id="outlined-size-small"
                    size="small"
                    name="stockLevelAlert"
                    value={
                      splitPaymentOptions?.length > 0
                        ? (Number(remainingTotalAmount) - Number(splitAmountTotalPrice)).toFixed(2)
                        : parseFloat(totalPriceDetails?.subTotalValue).toFixed(2)
                    }
                    inputProps={{ maxLength: 4 }}
                    // onChange={productInputHanlder}
                    disabled
                  />
                  <p className="mt-1 mb-0">
                    {/* {t("Tables.balance")}: {STORE_CURRENCY}
                    {splitPaymentOptions?.length > 0
                      ? remainingTotalAmount - splitAmountTotalPrice
                      : parseInt(totalPriceDetails?.subTotalValue).toFixed(2)} */}
                    {defaultLanguage === "ar" || defaultLanguage === "عربي" ? (
                      <>
                        {splitPaymentOptions?.length > 0
                          ? (Number(remainingTotalAmount) - Number(splitAmountTotalPrice)).toFixed(2)
                          : parseFloat(totalPriceDetails?.subTotalValue).toFixed(2)}
                        {t("Tables.balance")}: {CurrencySymbol}

                      </>
                    ) : (
                      <>
                        {t("Tables.balance")}: {CurrencySymbol}
                        {splitPaymentOptions?.length > 0
                          ? (Number(remainingTotalAmount) - Number(splitAmountTotalPrice)).toFixed(2)
                          : parseFloat(totalPriceDetails?.subTotalValue).toFixed(2)}

                      </>
                    )}

                  </p>
                </div>
                <div className="">
                  <Button
                    variant="contained"
                    style={{
                      background: "var(--main-bg-color)",
                      color: "var(--white-color)",
                    }}
                    onClick={addPaymentMethodHandler}
                  >
                    {t("Tables.add")}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div >
      <PaymentOptionModal
        show={openPaymentOptionModal}
        setShow={setOpenPaymentOptionModal}
        setSplitPaymentOptions={setSplitPaymentOptions}
        splitPaymentOptions={splitPaymentOptions}
      />
    </>
  );
};

export default Checkout;


