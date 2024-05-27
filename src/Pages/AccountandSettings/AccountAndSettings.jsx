import React, { useEffect, useState } from "react";
import "./AccountAndSettings.css";
import MainContentArea from "../MainContentArea/MainContentArea";
import Select from "react-select";
import { CUSTOM_DROPDOWN_STYLE } from "../../utils/CustomeStyles";
import { invoiceOptions } from "../../Containts/Values";
import { Modal, ModalDialog } from "react-bootstrap";
import pdf from "../../assets/invoice.pdf";
import ThermalSmallInvoice from "../../Components/Invoice/ThermalSmallInvoice";
import { ModalBody } from "reactstrap";
import { useTranslation } from "react-i18next";
import DemoInvoice from "../../Components/Invoice/DemoInvoice";
import { Button } from "@mui/material";
import BluetoothPrinter from "../../Components/AccountAndSettings/BluetoothPrinter/BluetoothPrinter";
import InvoiceSetting from "../../Components/AccountAndSettings/InvoiceSetting/InvoiceSetting";

const AccountAndSettings = () => {
  const { t } = useTranslation();
  // const [selectedInvoiceSize, setSelectedInvoiceSize] = useState([]);
  const [selectedInvoiceSize, setSelectedInvoiceSize] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  console.log("selectedInvoiceSize", selectedInvoiceSize);
  console.log("pdf", pdf);
  // const [invoiceSizes, setInvoiceSizes] = useState({});
  // console.log("invoiceSizes", invoiceSizes);
  const [selectedMenu, setSelectedMenu] = useState("InvoiceSetting");
  console.log("selectedMenu... ", selectedMenu);

  useEffect(() => {
    localStorage.setItem("InvoiceSizes", JSON.stringify(selectedInvoiceSize));
  }, [selectedInvoiceSize]);

  //   Menu select handler
  const selectMenuHanlder = (selectedMenuItem) => {
    setSelectedMenu(selectedMenuItem);
  };

  const handleButtonClick = () => {
    setModalOpen(true);
    console.log("pagesize", selectedInvoiceSize.height);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleInvoiceSizeChange = (selectedOption) => {
    setSelectedInvoiceSize(selectedOption);
  };

  const invoiceSizeOptions = invoiceOptions?.map((option) => ({
    value: option.id,
    label: option.invoiceName,
    height: option.height,
    width: option.width,
    fontSize: option.fontsize,
    // style: option.style
  }));
  // console.log("invoiceSizeOptions",invoiceSizeOptions);

  return (
    <MainContentArea>
      <div className="accountSettingMainContainer d-flex justify-content-between w-100 gap-1">
        <div className="accountMenuItemsContainer w-25">
          <ul>
            <li
              className={
                selectedMenu === "InvoiceSetting"
                  ? "accountMenuItems active"
                  : "accountMenuItems"
              }
              onClick={() => selectMenuHanlder("InvoiceSetting")}
            >
              {t("AccountAndSettings.posSetting")}
            </li>
            <li
              className={
                selectedMenu === "BluetoothPrinter"
                  ? "accountMenuItems active"
                  : "accountMenuItems"
              }
              onClick={() => selectMenuHanlder("BluetoothPrinter")}
            >
              {t("Bluetooth Printer")}
            </li>
          </ul>
        </div>
        <div className="cardBox p-4 w-75">
          {/* <div className="cardBox InvoiceFromContainer overflow-auto d-flex flex-column">
            <h6 style={{ marginBottom: "0" }}>
              {t("AccountAndSettings.invoiceSettings")}
            </h6>
            <hr />
            <form>
              <div className="InvoiceForm d-flex">
                <div className="Invoice-input col-md-5 mb-3">
                  <label>{t("AccountAndSettings.invoiceSize")}</label>
                  <Select
                    styles={CUSTOM_DROPDOWN_STYLE}
                    placeholder={t("AccountAndSettings.sizePlaceholder")}
                    options={invoiceSizeOptions}
                    onChange={handleInvoiceSizeChange}
                    isClearable
                  />
                </div>

                <div className="invoicePreviewBtn">
                  {selectedInvoiceSize && (
                    <Button
                      variant="contained"
                      style={{
                        padding: "10px",
                        backgroundColor: "var(--button-bg-color)",
                        color: "var(--button-color)",
                      }}
                      onClick={handleButtonClick}
                    >
                      {t("AccountAndSettings.preview")}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </div> */}
          {selectedMenu === "BluetoothPrinter" ? (
            <BluetoothPrinter />
          ) : (
            <InvoiceSetting />
          )}
        </div>
      </div>

      {isModalOpen && (
        <Modal show={isModalOpen} onHide={handleCloseModal}>
          <div
            className="modal-content setting-invoice-modal-container"
            style={{
              // minHeight: selectedInvoiceSize?.height || "200px",
              width: selectedInvoiceSize?.width || "200px",
              fontSize: selectedInvoiceSize?.fontSize
                ? selectedInvoiceSize?.fontSize
                : "12px",
            }}
          >
            <ModalBody
              dialogClassName="my-modal"
              // style={{
              //     width: selectedInvoiceSize?.width || "200px",
              //     height: selectedInvoiceSize?.height || "200px",
              // }}
            >
              <DemoInvoice
              // height={selectedInvoiceSize?.height || "200px"}
              // width={selectedInvoiceSize?.width || "200px"}
              />
            </ModalBody>
          </div>
        </Modal>
      )}
    </MainContentArea>
  );
};

export default AccountAndSettings;
