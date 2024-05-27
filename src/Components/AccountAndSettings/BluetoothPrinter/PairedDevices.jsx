import React from "react";
import { IoPrintOutline } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";
import { IconContext } from "react-icons";
import { Padding } from "@mui/icons-material";

const PairedDevices = ({ printerName, printerId, pairHandler }) => {
  return (
    <div className="d-flex justify-content-between align-items-center">
      <div className="deviceNameContainer d-flex align-items-center">
        <IconContext.Provider
          value={{
            color: "var(--success-green-color)",
            size: "30px",
            style: { marginRight: "5px", color: "#57cd58" },
          }}
        >
          <FaCheckCircle />
        </IconContext.Provider>

        <div className="d-flex  flex-column">
          <p>{printerName}</p>
          <p className="printerId">{printerId}</p>
        </div>
      </div>
      <div
        className="pairContainer d-flex align-items-center justify-content-center"
        onClick={pairHandler}
      >
        <IconContext.Provider
          value={{ color: "var(--light-blue-color)", size: "20px" }}
        >
          <IoPrintOutline />
        </IconContext.Provider>
        <span>Test Print</span>
      </div>
    </div>
  );
};

export default PairedDevices;
