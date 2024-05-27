import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { STORE_Id, getUTCDate } from "../../Containts/Values";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { CUSTOM_DROPDOWN_STYLE } from "../../utils/CustomeStyles";
import { InputLabel, TextField, Button } from "@mui/material";
import { addTable, updateTable } from "../../Redux/Table/tableSlice";
import { getFloorList } from "../../Redux/Floor/floorSlice";

// {
//     floorId: 0,
//     floorName: "",
//     location: "",
//     tableCount: 0,
//     createdDate: 0,
//     lastUpdate: 0,
//     isDeleted: 0,
//     isSync: 0,
//     storeId: 0,
//   }

const TableModal = ({
  show,
  handleClose,
  editData,
  setShow,
  setTablePostRes,
  tableCreationSuccess,
  setPopUpMessage,
  isEdit
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const tableApi = window.tableApi;
  const floorApi = window.floorApi;
  const isOnline = useSelector((state) => state.checkInternet.isOnline);
  const floorData = useSelector((state) => state.floor.floorData);
  const [floorsList, setFloorsList] = useState([]);
  const [fields, setFields] = useState({
    tableName: "",
    capacity: "",
    floorValue: null,
  });
  const [tableId, setTableId] = useState(editData?.tableId);
  console.log("fields... ", fields);
  console.log("floorsList... ", floorsList);
  const [error, setError] = useState({
    tableName: "",
    capacity: "",
    floorValue: "",
  });
  const modalHeader = isEdit
    ? t("TableDetails.editTable")
    : t("TableDetails.addTable");

  console.log("editData... ", editData);
  //   when user wants to edit table then here we set the edit values in inputes
  useEffect(() => {
    // here we find mapped floor to this table
    const selectedFloor =
      floorsList &&
      floorsList?.filter((item) => item?.floorId === editData?.floorId)[0];
    console.log("selectedFloor... ", selectedFloor);
    editData &&
      setFields({
        tableName: editData?.tableName ? editData?.tableName : "",
        capacity: editData?.seatingCapacityCount
          ? editData?.seatingCapacityCount
          : "",
        floorValue: selectedFloor,
      });
    setTableId(editData?.tableId);
  }, [editData, floorsList]);

  // if server api data will come then we store in state here
  useEffect(() => {
    floorData?.length > 0 && setFloorsList(floorData);
  }, [floorData]);

  //   we call the floor list api
  useEffect(() => {
    if (isOnline) {
      // call server api here
      dispatch(getFloorList());
    } else {
      //   setIsLoading(true);
      const floorDataList = floorApi?.floorDB?.getFloorList();
      floorDataList && setFloorsList(floorDataList);
      //   setIsLoading(false);
    }
  }, []);

  //   input handler for input
  const inputHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    if (name === "capacity") {
      const validate = value.match(/^(\d*\.{0,1}\d{0,2}$)/);
      if (!validate) {
        setError({ ...error, [name]: "" });
        return;
      }
    }
    setFields({ ...fields, [name]: value });
    setError({ ...error, [name]: "" });
  };

  //   select floor handler
  const selectHadler = (e, name) => {
    console.log("e... ", e);
    setError({ ...error, [name]: "" });
    setFields({ ...fields, [name]: e });
  };

  //   form validation handler
  const validation = () => {
    if (fields?.floorValue === null) {
      setError({ ...error, floorValue: "Please select floor" });
      return false;
    } else if (fields?.tableName === undefined || fields?.tableName === "") {
      setError({ ...error, tableName: "Please enter Table name" });
      return false;
    } else if (fields?.tableName.length > 50) {
      setError({ ...error, tableName: "Maximum 50 characters allowed" });
      return false;
    } else if (fields?.capacity === undefined || fields?.capacity === "") {
      setError({ ...error, capacity: "Please enter seating capacity" });
      return false;
    } else if (fields?.capacity.length > 3) {
      setError({ ...error, capacity: "Seating capacity should be 3 digit" });
      return false;
    }
    return true;
  };

  //   submit button handler
  const AddTable = () => {
    let val = validation();
    if (val) {
      const tablePayload = {
        tableId: tableId ? tableId : getUTCDate(),
        floorId: fields?.floorValue?.floorId,
        tableName: fields?.tableName,
        seatingCapacityCount: Number(fields?.capacity),
        createdDate: editData?.createdDate
          ? editData?.createdDate
          : getUTCDate(),
        lastUpdate: editData?.createdDate
          ? editData?.createdDate
          : getUTCDate(),
        isDeleted: editData?.isDeleted ? editData?.isDeleted : 0,
        isSync: editData?.isSync ? editData?.isSync : 0,
        storeId: editData?.storeId ? editData?.storeId : STORE_Id,
      };

      console.log("tablePayload... ", tablePayload);
      if (isOnline) {
        // call server api here
        editData
          ? dispatch(updateTable(tablePayload, tableCreationSuccess, setPopUpMessage))
          : dispatch(addTable(tablePayload, tableCreationSuccess, setPopUpMessage));
        setShow(false);
      } else {
        let tableResult;

        if (!editData) {
          tableResult = tableApi?.tableDB?.insertTable(tablePayload);
          const floorObj = fields?.floorValue;
          const floorPayload = {
            ...floorObj,
            tableCount: floorObj?.tableCount + 1,
          };
          console.log("floorPayload... ", floorPayload);
          tableResult && floorApi?.floorDB?.updateFloor(floorPayload);
        } else {
          tableResult = tableApi?.tableDB?.updateTableById(tablePayload);
        }

        if (tableResult?.changes === 1) {
          tableResult && setTablePostRes(tableResult);
          handleClose();
          setFields({
            tableName: "",
            capacity: "",
            floorValue: "",
          });
          setShow(false);
        }
      }
    }
  };

  const modalCloseHandler = () => {
    handleClose();
    setFields({
      tableName: "",
      capacity: "",
      floorValue: "",
    });
  };

  return (
    <Modal isOpen={show}
      toggle={() => setShow(!show)}>
      <ModalHeader toggle={() => setShow(!show)} className="popup-modal">
        {/* {t("TableDetails.addTable")} */}
        {modalHeader}
      </ModalHeader>
      <ModalBody className="popup-modal">
        <div className="mb-3 purchase-order-input">
          <label>
            {t("TableDetails.selectFloor")}
            <span className="text-danger">*</span>
          </label>
          <Select
            name="floorValue"
            styles={CUSTOM_DROPDOWN_STYLE}
            value={!fields?.floorValue ? "" : fields?.floorValue}
            placeholder={t("TableDetails.selectFloor")}
            // inputRef={VendorListDataRef}
            onChange={(e) => selectHadler(e, "floorValue")}
            options={floorsList}
            getOptionLabel={(floorsList) => floorsList?.floorName}
            isClearable
          />

          {error.floorValue && (
            <span className="text-danger">{error.floorValue}</span>
          )}
        </div>
        <div className="mb-3 purchase-order-input">
          <InputLabel className="requiredstar">
            {t("TableDetails.tableName")}
          </InputLabel>

          <TextField
            type="text"
            size="small"
            placeholder={t("TableDetails.tableNamePlaceholder")}
            className="form-control"
            name="tableName"
            value={fields.tableName}
            onChange={inputHandler}
            inputProps={{ maxLength: 50 }}
          />
          {error.tableName && (
            <span className="text-danger">{error.tableName}</span>
          )}
        </div>
        <div className="mb-3 purchase-order-input">
          <InputLabel className="requiredstar">
            {t("TableDetails.capacity")}
          </InputLabel>

          <TextField
            type="text"
            size="small"
            placeholder={t("TableDetails.capacityPlaceholder")}
            className="form-control"
            maxLength={3}
            name="capacity"
            value={fields.capacity}
            onChange={inputHandler}
            inputProps={{ maxLength: 5 }}
          />
          {error.capacity && (
            <span className="text-danger">{error.capacity}</span>
          )}
        </div>
        <Button
          className="mt-3"
          variant="contained"
          style={{
            backgroundColor: "var(--button-bg-color)",
            color: "var(--button-color)",
          }}
          // onClick={handleSubmit}>
          onClick={AddTable}
        >
          {t("TableDetails.submit")}
        </Button>
      </ModalBody>
    </Modal>
  );
};

export default TableModal;
