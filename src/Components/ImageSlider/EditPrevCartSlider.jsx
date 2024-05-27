import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import EditSliderLeftAndRightButtons from "./EditSliderLeftAndRightButtons";
import "./PrevCardProductSlider.css";
import PrevSliderLeftAndRightButtons from "./PrevSliderLeftAndRightButtons";
import { DEFAULT_IMAGE } from "../../Containts/Values";

const EditPrevCartSlider = (props) => {
  const {
    productImagesArray,
    productActiveImage,
    defualtProduct,
    defaultImgIndex,
    defualtImgHandler,
    editProductImagesArray,
    isOnline,
  } = props;

  const [imageIndex, setImageIndex] = useState(0);
  useEffect(() => {
    console.log("productImagesArray ", productImagesArray);
  }, [productImagesArray]);
  console.log("editProductImagesArray", editProductImagesArray);

  useEffect(() => {
    console.log("productActiveImage... ", productActiveImage);
  }, [productActiveImage]);

  return (
    <div
      id="carouselExampleControls"
      className="carousel slide"
      data-bs-ride="carousel"
    >
      {productImagesArray === null ? (
        <div className="carousel-inner text-center">
          {editProductImagesArray && editProductImagesArray.length >= 1 ? (
            editProductImagesArray.map((item, index) => {
              return (
                <>
                  <div
                    className={
                      index === 0 ? "carousel-item active" : "carousel-item"
                    }
                  >
                    <img
                      src={item?.imageUrl}
                      key={index}
                      alt="not found"
                      id="product-preview"
                    />
                    <div className="mt-2">
                      {/* {console.log("slider index ", index)} */}
                      <Button
                        variant="contained"
                        style={{
                          background: "var(--button-bg-color)",
                          color: "var(--button-color)",
                          display: `${
                            defaultImgIndex === index ? "none" : "inline-block"
                          }`,
                          marginBottom: "1rem",
                        }}
                        onClick={() => defualtImgHandler(index)}
                      >
                        Set Default
                      </Button>
                    </div>
                  </div>
                  <PrevSliderLeftAndRightButtons />
                </>
              );
            })
          ) : (
            <div className={"carousel-item active"}>
              {/* <img
              src={productActiveImage ? productActiveImage : defualtProduct}
              //   key={product_default}
              alt="not found"
              id="product-preview"
            /> */}
            </div>
          )}
        </div>
      ) : null}
      {editProductImagesArray === null ? (
        <>
          <div className="carousel-inner text-center">
            {productImagesArray && productImagesArray.length > 1 ? (
              productImagesArray.map((item, index) => {
                return (
                  <>
                    <div
                      className={
                        index === 0 ? "carousel-item active" : "carousel-item"
                      }
                    >
                      <img
                        src={URL.createObjectURL(item)}
                        key={index}
                        alt="not found"
                        id="product-preview"
                      />
                      {/* <div className="mt-2">
            {console.log("slider index ", index)}
            <Button
              variant="contained"
              style={{
                background: "var(--main-bg-color)",
                display: `${defaultImgIndex === index ? "none" : "inline-block"}`,
              }}
              onClick={() => defualtImgHandler(index)}
            >
              Set Default
            </Button>
          </div> */}
                    </div>
                    <EditSliderLeftAndRightButtons />
                  </>
                );
              })
            ) : (
              <>
                {/* {editProductImagesArray ===null && productImagesArray.length===0 ?null: */}
                <div className={"carousel-item active"}>
                  <img
                    src={
                      productActiveImage ? productActiveImage : defualtProduct
                    }
                    //   key={product_default}
                    alt="yahi hai"
                    id="product-preview"
                  />
                </div>
                {/* } */}
              </>
            )}
          </div>
        </>
      ) : (
        <div className={"carousel-item active"}>
          <img
            src={
              isOnline
                ? productActiveImage
                : productActiveImage?.length > 0
                ? `/${productActiveImage?.split("/public/")[1]}`
                : DEFAULT_IMAGE
            }
            //   key={product_default}
            alt="not found"
            id="product-preview"
          />
        </div>
      )}
    </div>
  );
};

export default EditPrevCartSlider;
