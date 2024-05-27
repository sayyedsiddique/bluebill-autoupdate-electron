import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import "./PrevCardProductSlider.css";
import PrevSliderLeftAndRightButtons from "./PrevSliderLeftAndRightButtons";

const PrevCardProductSlider = (props) => {
  const {
    productImagesArray,
    productActiveImage,
    defualtProduct,
    defaultImgIndex,
    defualtImgHandler,
    editProductImagesArray

  } = props;

  const [imageIndex, setImageIndex] = useState(0);
  // useEffect(() => {
  //   console.log("productImagesArray ", productImagesArray);
  // }, [productImagesArray]);



  useEffect(() => {
    console.log("productActiveImage... ", productActiveImage)
  }, [productActiveImage]);



  return (
    <div
      id="carouselExampleControls"
      className="carousel slide"
      data-bs-ride="carousel"
    >
      {/* {productImagesArray===null? */}
     
      <div className="carousel-inner text-center">
        
      {productImagesArray && productImagesArray.length > 1 ? (
  productImagesArray?.map((item, index) => {
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
                  <div className="mt-2">
                    {/* {console.log("slider index ", index)} */}
                    <Button
                      variant="contained"
                      style={{
                        background: "var(--button-bg-color)", color:"var(--button-color)",
                        display: `${defaultImgIndex === index ? "none" : "inline-block"}`,
                        marginBottom:"1rem"
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
            <img
              src={productActiveImage ? productActiveImage : defualtProduct}
              //   key={product_default}
              alt="not found"
              id="product-preview"
            />
          </div>
        )}
      </div>
     {/* :null} */}
      {/* {editProductImagesArray===null?
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
          <div className="mt-2">
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
          </div>
        </div>
        <PrevSliderLeftAndRightButtons />
      </>
    );
  })
 ) : (
  <div className={"carousel-item active"}>
    <img
      src={productActiveImage ? productActiveImage : defualtProduct}
      //   key={product_default}
      alt="not found"
      id="product-preview"
    />
  </div>
)}
 </div>
      </>  :null
    } */}

    </div>
  );
};

export default PrevCardProductSlider;










// {productImagesArray && productImagesArray.length > 1 ? (
//   productImagesArray.map((item, index) => {
//     return (
//       <>
//         <div
//           className={
//             index === 0 ? "carousel-item active" : "carousel-item"
//           }
//         >
//           <img
//             src={URL.createObjectURL(item)}
//             key={index}
//             alt="not found"
//             id="product-preview"
//           />
//           <div className="mt-2">
//             {console.log("slider index ", index)}
//             <Button
//               variant="contained"
//               style={{
//                 background: "var(--main-bg-color)",
//                 display: `${defaultImgIndex === index ? "none" : "inline-block"}`,
//               }}
//               onClick={() => defualtImgHandler(index)}
//             >
//               Set Default
//             </Button>
//           </div>
//         </div>
//         <PrevSliderLeftAndRightButtons />
//       </>
//     );
//   })
//  ) : (
//   <div className={"carousel-item active"}>
//     <img
//       src={productActiveImage ? productActiveImage : defualtProduct}
//       //   key={product_default}
//       alt="not found"
//       id="product-preview"
//     />
//   </div>
// )}