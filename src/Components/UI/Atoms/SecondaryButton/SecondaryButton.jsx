import React from "react";
import "./SecondaryButton.css";

const SecondaryButton = (props) => {
  return (
    <div className="secondary_button_container">
      <button
        className={
          props.externalClass === "externalClass"
            ? "externalClass"
            : "secondary_btn"
        }
        onClick={props.onClick}
        disabled={props.disabled}
      >
        {props.children}
      </button>
    </div>
  );
};

export default SecondaryButton;
