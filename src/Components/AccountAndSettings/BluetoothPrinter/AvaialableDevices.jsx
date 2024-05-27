import React from "react";
import { IoIosLink } from "react-icons/io";
import { IconContext } from "react-icons";

const AvaialableDevices = ({ printerName, printerId, pairHandler }) => {
  return (
    <div className="d-flex justify-content-between align-items-center mb-3">
      <div className="deviceNameContainer d-flex flex-column">
        <p>{printerName}</p>
        <span>{printerId}</span>
      </div>
      <div
        className="pairContainer d-flex align-items-center"
        onClick={pairHandler}
      >
        <IconContext.Provider
          value={{ color: "var(--light-blue-color)", size: "20px" }}
        >
          <IoIosLink />
        </IconContext.Provider>
        <span>Pair</span>
      </div>
    </div>
  );
};

export default AvaialableDevices;
