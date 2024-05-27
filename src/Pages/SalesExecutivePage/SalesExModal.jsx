import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import {
  SERVER_URL,
  STORE_Id,
  UPSERT_SALESEXECUTIVE,
  getUTCDate,
} from "../../Containts/Values";
import { AddSalesExecutive, addSalesExecutive, getSalesExecutiveList, updateSalesExecutive } from "../../Redux/SalesExecutive/SalesExecutiveSlice";
import { useTranslation } from "react-i18next";
import { Button, InputLabel, TextField } from "@mui/material";

let userToken = localStorage.getItem("userToken");

const SalesExModal = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  console.log("props... ", props?.data)
  const salesExecutiveApi = window.salesExecutiveApi;
  const isOnline = useSelector((state) => state.checkInternet.isOnline);
  const [salesExName, setSalesExName] = useState(props?.data?.name);
  const [Id] = useState(props?.data?.id);
  const modalHeader = props.isEdit ? t("SalesExecutive.editSalesExecutiveName") : t("SalesExecutive.addSalesExecutiveName");
  const [error, setError] = useState("");
  const [toggle, setToggle] = useState(
    props?.data?.activated === "Y" || props?.data?.activated === 1 ? true : false
  );
  console.log("toggle", toggle);
  const [isSync, setIsSync] = useState(
    props?.data?.isSync ? props?.data?.isSync : 0
  );
  const validate = () => {
    if (salesExName === undefined || salesExName === "") {
      setError("Please enter name");
      return false;
    }
    return true;
  };
  const AddData = () => {
    let val = validate();
    if (val) {
      if (isOnline) {
        const postData = {
          activated: toggle ? "Y" : "N",
          id: Id ? Id : 0,
          name: salesExName,
        };
        console.log("postData", postData);
        dispatch(addSalesExecutive(postData, props?.salesExecutiveCreationSuccess, props?.setPopUpMessage));

      } else {
        // for sqlite database
        const postSchemaData = {
          activated: toggle ? 1 : 0,
          id: Id ? Id : getUTCDate(),
          name: salesExName,
          isSync: isSync,
          storeId: STORE_Id,
          isDeleted: 0
        };

        // add and update sales executive into sqlite database
        const result = props?.data
          ? salesExecutiveApi?.salesExecutiveDB?.updateSalesExecutive(
            postSchemaData
          )
          : salesExecutiveApi?.salesExecutiveDB?.insertSalesExecutive(
            postSchemaData
          );
        props?.setSalesExPostRes(result);
        props.setshow(false);
      }
    }
  };

  // to close popup modal
  const handlePopupClose = () => {
    props.setshow(false)
  }

  // to get data from input field
  const handleInput = (e) => {
    let value = e.target.value.replace(/^[^a-zA-Z]+/, '');
    setSalesExName(value);
    setError("");

  };
  return (
    <div>
      <Modal
        size="small"
        isOpen={props.isModelVisible}
        toggle={() => props.setshow(!props.isModelVisible)}
      >
        <ModalHeader toggle={() => props.setshow(!props.isModelVisible)} className="popup-modal">
          {modalHeader}
        </ModalHeader>
        <ModalBody className="popup-modal">
          <form action="">
            <InputLabel className="requiredstar">
              {t("SalesExecutive.salesExecutiveName")}
            </InputLabel>
            <TextField
              type="text"
              size="small"
              name="salesExFieldName"
              placeholder={t("SalesExecutive.enterSalesExecutiveName")}
              className="form-control"
              value={salesExName}
              onChange={handleInput}
              inputProps={{ maxLength: 50 }}
            />
            {error ? <span className="text-danger">{error}</span> : null}

            <div className="mt-2 form-check form-switch SE-toggle">
              <input
                className="form-check-input SE-toggleModal "
                type="checkbox"
                id="flexSwitchCheckDefault"
                checked={toggle}
                onClick={() => setToggle(!toggle)}
              />

              {toggle ? (
                <div>
                  <label
                    className="form-check-label tcolor"
                    htmlFor="flexSwitchCheckDefault"
                  >
                    {t("SalesExecutive.active")}
                  </label>
                </div>
              ) : (
                <label
                  className="form-check-label tcolor-msg"
                  htmlFor="flexSwitchCheckDefault"
                >
                  {t("SalesExecutive.inactive")}
                </label>
              )}
            </div>
          </form>

          <Button
            className="mt-4"
            variant="contained"
            style={{ backgroundColor: "var(--button-bg-color)", color: "var(--button-color)" }}
            onClick={() => AddData()}
          >
            {t("SalesExecutive.submit")}
          </Button>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default SalesExModal;
