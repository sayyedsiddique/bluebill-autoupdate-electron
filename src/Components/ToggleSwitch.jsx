import axios from "axios";
import moment from "moment";
import React from "react";
import { useState } from "react";
import {
  getUTCDate,
  SERVER_URL,
  STORE_Id,
  UPSERT_PRODUCT,
} from "../Containts/Values";
import "./ToggleSwitch.css";
import Swal from "sweetalert2";
import AddQuantityOfProductModal from "../Pages/AddProduct/AddQuantityOfProductModal";
import { useDispatch } from "react-redux";
import { addProduct, getProductList } from "../Redux/Product/productSlice";
import { Button, InputLabel } from "@mui/material";
import Switch from "@mui/material/Switch";
import { useTranslation } from "react-i18next";
import { addInventoryProduct } from "../Redux/InventoryManage/InventoryManageSlice";

const ToggleSwitch = (props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const label = { inputProps: { "aria-label": "Switch demo" } };
  const [isModelVisible, setModelVisible] = useState(false);
  console.log("name007", props?.togglevalue);
  // console.log("productId008",props?.item.productId);


  const toggle = () => {
    // his want to add inventory
    if (
      props?.item?.inventoryManage === 1 &&
      props?.item?.quantity < 1 &&
      props?.togglevalue === false
    ) {
      // Show alert for adding quantity
      Swal.fire({
        title: "You need to have quantity.",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then((result) => {
        if (result.isConfirmed) {
          setModelVisible(true);
        }
      });
    } else if (props?.togglevalue === true &&
      props?.item?.inventoryManage === 1) {
      // Show alert for removing quantity
      Swal.fire({
        title: "Do you want to remove quantity?",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then((result) => {
        if (result.isConfirmed) {
          handleSubmit();
        }
      });

    }
  };


  const productUploadImageHandler = () => { };

  const productCreationSuccess = () => {
    dispatch(getProductList(1, 5, ""));
    setModelVisible(false);
    // setName(!props?.togglevalue);
  };


  const handleSubmit = () => {
    let payload = {
      ...props?.item,
      lastUpdate: getUTCDate(),
      inventoryManage: !props?.togglevalue ? 1 : 0,
    }

    console.log("payload", payload);
    console.log("props.item.productId", props.item.productId);

    // let postData = {
    //   purchasingPrice: purchasingPrice,
    //   currencyId: 0,
    //   lastUpdate: getUTCDate(),
    //   categoryId: props.item?.categoryId,
    //   inventoryManage: !props?.togglevalue && quantity ? "1" : "0",
    //   maxRetailPrice: props.item?.maxRetailPrice,
    //   stockLevelAlert: props.item?.stockLevelAlert,
    //   brandId: props.item?.brandId,
    //   updatedBy: props.item?.updatedBy,
    //   productId: props.item?.productId,
    //   subCategoryId: props.item?.subCategoryId,
    //   sellingPrice: props.item?.sellingPrice,
    //   active: props.item?.active,
    //   barCode: props.item?.barCode,
    //   quantity: Number(quantity),
    //   priceIncludeTax: props.item?.priceIncludeTax,
    //   notes: notes,
    //   // notes: props.item?.notes,
    //   storeId: props.item?.storeId,
    //   productName: props.item?.productName,
    //   unitId: props.item?.unitId,
    //   addedBy: props.item?.addedBy,
    //   isDeleted: props.item?.isDeleted,
    //   // discountName: selProductDiscount && selProductDiscount,
    //   // taxName:  selProductTax && selProductTax,
    //   expiryDate: props.item?.expiryDate,
    // };

    dispatch(
      addProduct(
        payload,
        false,
        false,
        STORE_Id,
        // imageFile,
        // defaultImgIndex,
        // cognitoUserName,
        // storeName,
        productCreationSuccess,
        productUploadImageHandler
      )
    );

  };

  let labelText = props?.togglevalue ? t("AllProduct.Instock") : t("AllProduct.outofstock");
  if (props.item?.quantity === 0 && props.item?.stockLevelAlert === 0) {
    labelText = t("AllProduct.outofstock")
  } else if (props?.item?.quantity > 0 && props?.item?.quantity <= props?.item?.stockLevelAlert) {
    labelText = "Low Stock";
  }


  // let labelText = props?.togglevalue ? t("AllProduct.Instock") : t("AllProduct.outofstock");

  // if (props.item?.quantity > 0 && props.item?.quantity === props.item?.stockLevelAlert) {
  //   labelText = "Low Stock";
  // }

  return (
    <>

      <div className="form-check form-switch d-flex flex-column justify-content-center align-items-center">
        {/* <div className="d-flex flex-column"> */}
        <div>
          <input
            type="checkbox"
            className={
              props?.togglevalue
                ? "form-check-input tgl-btn"
                : "form-check-input"
            }
            id={
              props?.togglevalue
                ? "flexSwitchCheckChecked"
                : "flexSwitchCheckDefault"
            }
            checked={props?.togglevalue}
            onChange={toggle}
            disabled={
              props.item?.inventoryManage === 0 &&
              props.item?.quantity === 0 &&
              props?.togglevalue === true
            }
          />
        </div>

        <label
          className={
            props.item?.quantity === 0 && props.item?.stockLevelAlert === 0
              ? "form-check-label tcolor-msg"
              : props?.togglevalue
                ? "form-check-label tcolor"
                : "form-check-label tcolor-msg"
          }



          htmlFor={
            props?.togglevalue
              ? "flexSwitchCheckChecked"
              : "flexSwitchCheckDefault"
          }
        >
          {/* {props?.togglevalue ? t("AllProduct.Instock") : t("AllProduct.outofstock")} */}

          {labelText}
        </label>
        {/* </div> */}
      </div>


      {isModelVisible && (
        <AddQuantityOfProductModal
          isModelVisible={isModelVisible}
          setshow={setModelVisible}
          productDetails={props?.item}
        />
      )}
    </>

  );
};

export default ToggleSwitch;

