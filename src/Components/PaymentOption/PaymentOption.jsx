import React, { useState } from "react";
import { SelectedPaymentMode } from "../../utils/constantFunctions";
import "./PaymentOption.css";

const PaymentOption = ({
  paymentOptionHandler,
  paymentMethod,
  errors,
  setErrors,
}) => {

  const paymentSelectHandler = (item) => {
    paymentOptionHandler(item)
    setErrors({...errors, paymentOption: ""})
  }

  return (
    <div className="payment-option-container">
      <ul className="mb-0 ps-0">
        {SelectedPaymentMode &&
          SelectedPaymentMode?.map((item) => {
            return (
              // <li
              //   className={`list-group-item category-item custom-border p-2 ${false ? "active" : ""
              //     }`}
              // //   onClick={() => floorSelectHandler(item)}
              // >
              //   {item?.value}
              // </li>

              <li
                key={item.value}
                className={`list-group-item category-item custom-border p-2 ${
                  item?.value === paymentMethod?.value ? "active" : ""
                }`}
                onClick={() => paymentSelectHandler(item)}
              >
                {item.value}
              </li>
            );
          })}
      </ul>
      {errors?.paymentOption ? <span className="text-danger">{errors?.paymentOption}</span> : null}
    </div>
  );
};

export default PaymentOption;
