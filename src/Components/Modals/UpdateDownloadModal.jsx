import React from "react";
import { Modal, ModalBody } from "reactstrap";
import ThreeDotLoader from "../LoadingSpinner/ThreeDotLoader";
import { Button } from "@mui/material";
import CircularProgress, {
  CircularProgressProps,
} from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import "./UpdateDownloadModal.css";

function CircularProgressWithLabel(props) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="caption"
          component="div"
          color="text.secondary"
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

const UpdateDownloadModal = ({
  setModalOpen,
  modalOpen,
  updateMessage,
  updateNowHandler,
  quiteAndInstall,
}) => {
  console.log("updateMessage... ", updateMessage);
  return (
    <Modal
      size="sm"
      isOpen={modalOpen}
      fade={false}
      toggle={() => setModalOpen(!modalOpen)}
      className="modal-dialog-centered modal-lg"
      style={{
        maxWidth: "500px",
        width: "50vw",
      }}
    >
      <ModalBody style={{ padding: "1.5rem" }}>
        <div
          className="d-flex flex-column justify-content-center align-items-center gap-2"
          // style={{ height: "150px" }}
        >
          <h2 className="" style={{ marginBottom: "0", paddingBottom: "0" }}>
            Version {updateMessage?.version}
          </h2>
          <p>It takes only five minutes</p>
          {/* <h5 style={{ textAlign: "center" }}>{updateMessage?.message}</h5> */}
          {updateMessage?.downloadProgress > 0 && (
            <CircularProgressWithLabel
              size={60}
              thickness={4}
              value={Number(updateMessage?.downloadProgress)}
            />
          )}
          {!updateMessage?.message && (
            <Button
              variant="contained"
              style={{
                backgroundColor: "var(--button-bg-color)",
                color: "var(--button-color)",
              }}
              onClick={updateNowHandler}
            >
              Update Now
            </Button>
          )}
          {updateMessage?.downloadProgress === 100 && (
            <Button
              variant="contained"
              style={{
                backgroundColor: "var(--button-bg-color)",
                color: "var(--button-color)",
              }}
              onClick={quiteAndInstall}
            >
              Install Now
            </Button>
          )}
        </div>
      </ModalBody>
    </Modal>
  );
};

export default UpdateDownloadModal;
