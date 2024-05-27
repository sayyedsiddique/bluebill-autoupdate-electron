import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { STORE_CURRENCY } from "../../Containts/Values";
import MainContentArea from "../MainContentArea/MainContentArea";
import "./ProductDetailsPage.css";
import { useDispatch, useSelector } from "react-redux";
import { DEFAULT_IMAGE } from "../../Containts/Values";
import { useTranslation } from "react-i18next";
import { getSingleProductData } from "../../Redux/Product/productSlice";
import { Button } from "@mui/material";


const ProductDetailsPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const singleProductData = useSelector((state) => state.product.singleProduct)

  const [searchParams] = useSearchParams();
  const prodId = searchParams.get("productId");

  const [product, setproduct] = useState([]);
  const [image, setImage] = useState([]);
  console.log("image", image);

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


  // to get data from api
  useEffect(() => {
    dispatch(getSingleProductData(prodId))
  }, [])

  // to set data from api
  useEffect(() => {
    setproduct(singleProductData)
    setImage(singleProductData?.imageUrl)
  }, [singleProductData])

  const handleImgChange = (img) => {
    setImage(img);
  };

  return (
    <MainContentArea scroll={'auto'}>
      <div className="proDeatails-main-container cardBox">
        <div className="productDeatils-back-btn" style={{ textAlign: "right" }}>
          <Button
            variant="contained"
            style={{ background: "#e3e2e2", color: "dimgray" }}
            onClick={() => navigate(-1)}
          >
            {t("allOnlineOrder.Back")}
          </Button>
        </div>
        <div className="proDetails-container">
          <div className="left-side">
            <div className="default-img">
              <img
                className="mainImg"
                src={image ?? DEFAULT_IMAGE}
                width="500"
                height="400"
                alt=""
              />
              <div className="scrollimg mt-2">
                {product.imagesList?.map(({ imageUrl }, index) => (
                  <div className="imglist" key={index}>
                    <img
                      style={{ marginTop: "5px", padding: '3px', backgroundColor: image && image === imageUrl ? "var(--main-bg-color)" : 'white' }}
                      onMouseOver={() => handleImgChange(imageUrl)}
                      onClick={() => handleImgChange(imageUrl)}
                      src={imageUrl}
                      width="80"
                      height="80"
                      alt=""
                    />
                  </div>
                ))}
              </div>
            </div>

          </div>
          <div className="right-side">
            <div className="product-heading">
              <h2>{product.productName}</h2>
              {/* <p>{product.notes}</p> */}
            </div>

            <div className="productDetails-amount">
              <div className="pricingDeatisls">
                <h6>PRICE</h6>
                <h2 className="mt-2">
                  {defaultLanguage === "ar" ||
                    defaultLanguage === "عربي"
                    ? <>
                      {product.sellingPrice}
                      {CurrencySymbol}
                    </>
                    :
                    <>
                      {CurrencySymbol}
                      {product.sellingPrice}
                    </>
                  }
                </h2>
              </div>
              <div className="QuantityDetails text-center">
                <h6>QUANTITY</h6>
                <h6 className="mt-3">
                  {product.quantity} </h6>
              </div>
            </div>
            <div className="ProductDetails-Description">
              <div className="Product-description">
                <h6 style={{ fontWeight: "600" }}>DESCRIPTION</h6>
                <p>{product.notes}</p>
              </div>
              <div className="product-details">
                <h6 style={{ fontWeight: "600" }}>DETAILS</h6>
                {product.productName && <p>product : {product.productName}</p>}
                {product.productId && <p>Product Id : {product.productId}</p>}
                {product.categoryName && <p>Category : {product.categoryName}</p>}
                {product.brandName && <p>Brand : {product.brandName}</p>}
                {product.discountName && <p>Discount : {product.discountName}</p>}
                {product.taxName && <p>Tax : {product.taxName}</p>}
                {product.unitName && <p>Unit : {product.unitName}</p>}

              </div>
            </div>

          </div>
        </div>
      </div>

    </MainContentArea>
  );
};

export default ProductDetailsPage;
