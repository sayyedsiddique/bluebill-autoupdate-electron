import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import {
  addDiscountToMap,
  getDiscountlist,
  getMappedDiscountByProdutId,
} from "../../Redux/Discount/discountSlice";
import Select from "react-select";
import { CUSTOM_DROPDOWN_STYLE } from "../../utils/CustomeStyles";
import { STORE_CURRENCY, STORE_Id, getUTCDate, validDiscount } from "../../Containts/Values";
import { useTranslation } from "react-i18next";

const ApplyDiscountModal = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const discountApi = window.discountApi;
  const discountMappingApi = window.discountMappingApi;
  const isOnline = useSelector((state) => state.checkInternet.isOnline);
  const DiscountData = useSelector((state) => state.discount.discountData);
  const DiscountMapList = useSelector(
    (state) => state.discount.getSingleDiscount
  );
  const [discount, setDiscount] = useState([]);
  const [singleDiscount, setSingelDiscount] = useState("");
  const [discountPrice, setDiscountPrice] = useState(0);
  const [findDiscountobj, setFindDiscountObj] = useState([]);
  const [error, setError] = useState("");
  console.log("DiscountData", DiscountData);
  console.log("findDiscountobj", findDiscountobj);
  const [discountMappedListData, setDiscountMappedListData] = useState([]);

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


  // after apis response got we store that res in state
  useEffect(() => {
    DiscountData?.length > 0 && setDiscount(DiscountData);
    DiscountMapList?.length > 0 && setFindDiscountObj(DiscountMapList);
  }, [DiscountData, DiscountMapList]);

  // useEffect(() => {
  //   setFindDiscountObj(DiscountMapList);
  // }, [DiscountMapList]);

  // initially apis called here
  useEffect(() => {
    if (isOnline) {
      dispatch(getDiscountlist(0, 0, "", validDiscount));
      dispatch(getMappedDiscountByProdutId(props.singleProduct.productId));
    } else {
      const discountList = discountApi?.discountDB?.getAllDiscounts();
      setDiscount(discountList);
      const mappedDiscountList =
        discountMappingApi?.discountMappingDB?.getDiscountMappedList();
      mappedDiscountList && setFindDiscountObj(mappedDiscountList);
    }
  }, []);

  const handleDiscountCalculate = (e) => {
    setError("");
    let findObj = findDiscountobj.find((item) => {
      return e?.discountId === item.discountId;
    });
    if (!findObj) {
      console.log("e", e);
      setSingelDiscount(e);
      if (e != null) {
        if (e.isPercent === true) {
          setDiscountPrice(
            props.singleProduct.sellingPrice -
            (props.singleProduct.sellingPrice * e?.discountVal) / 100
          );
        } else {
          if (props.singleProduct.sellingPrice > e?.discountVal) {
            setDiscountPrice(props.singleProduct.sellingPrice - e?.discountVal);
          }
        }
      } else {
        setDiscountPrice(0);
      }
    } else {
      setError("Selected Discount already available on this product");
    }
  };

  const handleSubmit = () => {
    if (isOnline) {
      dispatch(
        addDiscountToMap(
          props.singleProduct.productId,
          singleDiscount.discountId
        )
      );
      console.log(singleDiscount.discountId);
      console.log(props.singleProduct.productId);
      props.setDiscountModal(false);
    } else {
      let payload = {
        discountId: singleDiscount?.discountId, //id
        productId: props.singleProduct.productId,
        storeId: STORE_Id,
        lastUpdate: getUTCDate(),
        isDeleted: 0,
        isSync: 0,
      };

      const result =
        payload &&
        discountMappingApi?.discountMappingDB?.insertDiscountMapping(payload);
      props.setDiscountModal(false);
    }
  };
  return (
    <>
      <Modal
        size="small"
        isOpen={props.discountModal}
        toggle={() => props.setDiscountModal(!props.discountModal)}
      >
        <ModalHeader toggle={() => props.setDiscountModal(!props.discountModal)} className="popup-modal">
          {t("Billing.selectDiscount")}
        </ModalHeader>
        <ModalBody className="popup-modal">
          <Select
            placeholder={t("Billing.selectDiscount")}
            getOptionLabel={(discount) => discount?.discountName}
            options={discount}
            style={{ width: 40 }}
            styles={CUSTOM_DROPDOWN_STYLE}
            onChange={(e) => {
              handleDiscountCalculate(e);
            }}
            isClearable

          />
          
          <h5 style={{ marginTop: 5 }}>{t("Billing.productName")}: {props.singleProduct.productName}</h5>
          <div className="subtotal">
            <div>
              <label>{t("Billing.sellingPrice")}</label>
              <br />
              {singleDiscount === null || singleDiscount === '' || error !== "" ?
                (defaultLanguage === "ar" || defaultLanguage === "عربي" ? (
                  <span>{props.singleProduct.sellingPrice}{CurrencySymbol}</span>
                ) : (
                  <span>{CurrencySymbol}{props.singleProduct.sellingPrice}</span>
                )) : (
                  <strike>
                    {defaultLanguage === "ar" || defaultLanguage === "عربي" ? (
                      <span>{props.singleProduct.sellingPrice}{CurrencySymbol}</span>
                    ) : (
                      <span>{CurrencySymbol}{props.singleProduct.sellingPrice}</span>
                    )}
                  </strike>
                )
              }
            </div>
            <div>
              <label>{t("Billing.afterDiscount")}</label>
              <br />
              {defaultLanguage === "ar" || defaultLanguage === "عربي"
                ? <span>{discountPrice}{CurrencySymbol}</span>
                : <span>{CurrencySymbol}{discountPrice}</span>
              }
            </div>
          </div>


          {error ? <span className="text-danger">{error} <br /></span> : null}
          {singleDiscount !== null && singleDiscount !== '' && error === "" ?

            <button
              className="btn mt-2 me-2 ANP-btn"
              style={{
                background: "var(--main-bg-color)",
                color: "var(--white-color)",
                fontsize: " 22px",
                border: " 2px solid  var(--main-bg-color)",
              }}
              onClick={handleSubmit}
            >
              {t("Billing.submit")}
            </button> : null
          }

        </ModalBody>
      </Modal>
    </>
  );
};

export default ApplyDiscountModal;
