import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { KotCancellationReasons } from "../../Containts/Values";
import { useTranslation } from "react-i18next";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { Button } from "@mui/material";

const KotCancellationModal = ({
  isModelVisible,
  setShow,
  kotCancelReasonHandler,
  kotCancelReason,
  kotCancelletionConfirmHandler,
}) => {
  const { t } = useTranslation();
  return (
    <div>
      <Modal
        size="xl"
        style={{ maxWidth: "700px", width: "100%" }}
        isOpen={isModelVisible}
        toggle={() => setShow(!isModelVisible)}
      >
        <ModalHeader
          toggle={() => setShow(!isModelVisible)}
          className="popup-modal"
        >
          {t("Kot Cancellation Reason")}
        </ModalHeader>
        <ModalBody className="popup-moda">
          <div>
            <FormControl>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={kotCancelReason}
                onChange={(e) => kotCancelReasonHandler(e)}
              >
                {KotCancellationReasons &&
                  KotCancellationReasons?.map((item) => {
                    return (
                      <FormControlLabel
                        value={item?.name}
                        control={<Radio />}
                        label={item?.name}
                      />
                    );
                  })}
              </RadioGroup>
            </FormControl>
            {/* <ul>
              {KotCancellationReasons &&
                KotCancellationReasons?.map((item) => {
                  return <li>{item?.name}</li>;
                })}
            </ul> */}
            <textarea
              className="p-3"
              name="kot_cancellation_note"
              id=""
              cols="80"
              rows="5"
              placeholder="Write your reason here..."
            ></textarea>
          </div>
          <Button
            variant="contained"
            onClick={kotCancelletionConfirmHandler}
            style={{
              backgroundColor: "var(--main-bg-color)",
              color: "var(--white-color)",
              marginTop: 5,
              marginBottom: 5,
            }}
          >
            {t("Confirm")}
          </Button>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default KotCancellationModal;
