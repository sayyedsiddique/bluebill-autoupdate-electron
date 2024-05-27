import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { STORE_Id, getUTCDate } from "../../Containts/Values";
import { useDispatch, useSelector } from "react-redux";
import { InputLabel, TextField } from "@mui/material";
import { Button } from "@mui/material";
import { addFloor, updateFloorDetails } from "../../Redux/Floor/floorSlice";

const FloorModel = ({
  show,
  setShow,
  handleClose,
  editData,
  setFloorPostRes,
  floorCreationSuccess,
  setPopUpMessage,
  isEdit

}) => {
  const floorApi = window.floorApi;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isOnline = useSelector((state) => state.checkInternet.isOnline);
  const [fields, setFields] = useState({ name: "", location: "" });
  const [floorId, setFloorId] = useState(editData?.floorId);
  console.log("floorId... ", floorId);
  const [name, setName] = useState("");
  const modalHeader = isEdit
    ? t("FloorDetails.editFloor")
    : t("FloorDetails.addFloor");
  const [location, setLocation] = useState("");
  const [error, setError] = useState({ name: "", location: "" });

  // here we set floor value in fields object on floor edit
  useEffect(() => {
    if (editData) {
      setFields({ name: editData?.floorName, location: editData?.location });
      console.log("editData?.floorId ", editData?.floorId);
      setFloorId(editData?.floorId);
    }
  }, [editData]);

  // both input handler
  const inputHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFields({ ...fields, [name]: value });
    setError({ ...error, [name]: "" });
  };

  const validation = () => {
    if (fields?.name === undefined || fields?.name === "") {
      setError({ ...error, name: "Please enter floor name" });
      return false;
    } else if (fields?.name.length > 50) {
      setError({ ...error, name: "Maximum 50 characters allowed" });
      return false;
    } else if (fields?.location === undefined || fields?.location === "") {
      setError({ ...error, location: "Please enter location" });
      return false;
    } else if (fields?.location.length > 50) {
      setError({ ...error, location: "Maximum 50 characters allowed" });
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    const val = validation();
    if (val) {
      const floorPayload = {
        floorId: floorId ? floorId : getUTCDate(),
        floorName: fields?.name,
        location: fields?.location,
        tableCount: editData?.tableCount ? editData?.tableCount : 0,
        createdDate: editData?.createdDate
          ? editData?.createdDate
          : getUTCDate(),
        lastUpdate: getUTCDate(),
        isDeleted: 0,
        isSync: 0,
        storeId: STORE_Id,
      };
      console.log("floorPayload... ", floorPayload);

      if (isOnline) {
        // call server api here
        editData
          ? dispatch(updateFloorDetails(floorPayload, floorCreationSuccess, setPopUpMessage))
          : dispatch(addFloor(floorPayload, floorCreationSuccess, setPopUpMessage));
        setShow(false);
      } else {
        const floorResult = editData
          ? floorApi?.floorDB?.updateFloor(floorPayload)
          : floorApi?.floorDB?.insertFloor(floorPayload);
        console.log("floorResult... ", floorResult);
        if (floorResult?.changes === 1) {
          setFloorPostRes(floorResult);
          handleClose();
          setFields({ name: "", location: "" });
          setShow(false);
        }
      }
    }
  };

  const handleName = (e) => {
    setError({ ...error, name: "" });
    setName(e.target.value);
  };
  const handleLocation = (e) => {
    setError({ ...error, location: "" });
    setLocation(e.target.value);
  };

  return (
    <Modal size="small"
      isOpen={show}
      toggle={() => setShow(!show)}>
      <ModalHeader toggle={() => setShow(!show)} className="popup-modal">
        {/* {t("FloorDetails.addFloor")} */}
        {modalHeader}
      </ModalHeader>
      <ModalBody className="popup-modal">
        <form action="">
          <div className="mb-4">
            <InputLabel className="requiredstar">
              {t("FloorDetails.name")}
            </InputLabel>
            <TextField
              type="text"
              size="small"
              name="name"
              placeholder={t("FloorDetails.namePlaceholder")}
              className="form-control"
              value={fields?.name}
              onChange={inputHandler}
              inputProps={{ maxLength: 50 }}
            />
            {error.name && <span className="text-danger">{error.name}</span>}
          </div>
          <div className="mb-4">
            <InputLabel className="requiredstar">
              {t("FloorDetails.location")}
            </InputLabel>
            <TextField
              type="text"
              size="small"
              name="location"
              placeholder={t("FloorDetails.locationPlaceholder")}
              className="form-control"
              value={fields?.location}
              onChange={inputHandler}
              inputProps={{ maxLength: 50 }}
            />
            {error.location && (
              <span className="text-danger">{error.location}</span>
            )}
          </div>
        </form>

        <Button
          className="mt-2"
          variant="contained"
          style={{
            backgroundColor: "var(--button-bg-color)",
            color: "var(--button-color)",
          }}
          onClick={handleSubmit}
        >
          {t("FloorDetails.submit")}
        </Button>
      </ModalBody>
    </Modal>
  );
};

export default FloorModel;
