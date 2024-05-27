import React from "react";
import "./PrimaryButton.css";

const PrimaryButton = (props) => {
  return (
    <div className="inline-btn">
      <button
        className={
          props.activeClass === "active" ? "btn-mar active" : "btn-mar"
        }
        onClick={props.onClick}
      >
        {props.children}
      </button>
    </div>
  );
};

export default PrimaryButton;
