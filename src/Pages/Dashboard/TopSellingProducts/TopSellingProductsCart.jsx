import React from "react";
import "./TopSellingProductsCart.css";
import { DEFAULT_IMAGE } from "../../../Containts/Values";


const TopSellingProductsCart = ({ productDetails, index }) => {
  console.log("productDetails... ", productDetails);
  return (
    <div>
      {/* {topSellingProductList?.map((product, index) => ( */}
      <div key={index} className="topSelling-product-item-main-section">
        <div className="topSelling-product-item-main-container d-flex justify-content-between align-items-center mb-2 ">
          <div className="d-flex  align-items-center">
            <img
              src={
                productDetails?.imageUrl
                  ? productDetails?.imageUrl
                  : DEFAULT_IMAGE
              }
              alt=""
              width="50"
              height="50"
              style={{ borderRadius: "10px" }}
            />
            <div className="" style={{ marginLeft: "1rem", }}>
              <span className="topSelling-product-item-list ">
                {productDetails?.productId}
              </span>
              <h6 className="topSelling-product-item">
                {productDetails?.productName}
              </h6>
            </div>
          </div>
          <div className=" text-center" style={{ fontSize: "14px", color: "var(--text-color)" }}>
            <span>{productDetails?.currencyName}</span>
            <span>{productDetails?.salesPrice}</span>
          </div>
        </div>
      </div>
      {/* ))} */}
    </div>
  );
};

export default TopSellingProductsCart;
