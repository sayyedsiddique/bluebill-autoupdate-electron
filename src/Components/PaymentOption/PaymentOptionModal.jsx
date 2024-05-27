import React, { useEffect, useState } from "react";
import Select from "react-select";
import { CUSTOM_DROPDOWN_STYLE } from "../../utils/CustomeStyles";
import { useTranslation } from "react-i18next";
import { PaymentOptionsWithoutSplit } from "../../utils/constantFunctions";
import { Modal, ModalBody, ModalHeader } from "reactstrap";

const PaymentOptionModal = ({
  show,
  setShow,
  setSplitPaymentOptions,
  splitPaymentOptions,
}) => {
  const { t } = useTranslation();

  const selectSplitOptionHandler = (e) => {
    console.log("eee... ", e)
    console.log("eee... ", splitPaymentOptions)
    setSplitPaymentOptions([...splitPaymentOptions, e]);
    setShow(false)
  };

  console.log("PaymentOptionsWithoutSplit... ", PaymentOptionsWithoutSplit)

  return (
    <Modal size="small" isOpen={show} toggle={() => setShow(!show)}>
      <ModalHeader className="popup-modal">
        {t("Tables.selectPaymentMethod")}
      </ModalHeader>
      <ModalBody className="popup-modal">
        <Select
          name="splitPayment"
          styles={CUSTOM_DROPDOWN_STYLE}
          //   value={selectedSalesExecutive ? selectedSalesExecutive : null}
          placeholder=
          {t("Tables.selectPaymentMethod")}
          // inputRef={VendorListDataRef}
          onChange={(e) => selectSplitOptionHandler(e)}
          options={PaymentOptionsWithoutSplit}
          getOptionLabel={(PaymentOptionsWithoutSplit) =>
            PaymentOptionsWithoutSplit?.value
          }
          isClearable={true}
        />
      </ModalBody>
    </Modal>
  );
};

export default PaymentOptionModal;
