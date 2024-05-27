import React from "react";

const TopBuyersListCart = ({ customerDetails, index }) => {
    console.log("productDetails... ", customerDetails);
    return (
        <div>
            <div key={index} className="topSelling-product-item-main-section">
                <div className="topSelling-product-item-main-container d-flex justify-content-between align-items-center mb-2 ">
                    <div className="d-flex  align-items-center">
                        {/* <img
              src={
                productDetails?.imageUrl
                  ? productDetails?.imageUrl
                  : defaultImage
              }
              alt=""
              width="50"
              height="50"
              style={{ borderRadius: "10px" }}
            /> */}
                        <div className="" style={{ marginLeft: "1rem", }}>
                            <span className="topSelling-product-item-list ">
                                {customerDetails?.customerId}
                            </span>
                            <h6 className="topSelling-product-item">
                                {customerDetails?.customerName}
                            </h6>
                        </div>
                    </div>
                    <div className=" text-center" style={{ fontSize: "14px", color: "var(--text-color)" }}>
                        <span>{customerDetails?.currencyName}</span>
                        <span>{customerDetails?.finalTotalAmount}</span>
                    </div>
                </div>
            </div>
            {/* ))} */}
        </div>
    );
};

export default TopBuyersListCart;
