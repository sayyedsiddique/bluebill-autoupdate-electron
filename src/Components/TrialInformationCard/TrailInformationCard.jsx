import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import "./TrailInformationCard.css";
import { FiStar } from "react-icons/fi";
import SubscriptionPlanModal from "./SubscriptionPlanModal";
import { DEFAULT_IMAGE, retrieveObj } from "../../Containts/Values";
import { Modal, ModalBody } from "reactstrap";
import { useSelector } from "react-redux";
import ThreeDotLoader from "../LoadingSpinner/ThreeDotLoader";
import { useTranslation } from "react-i18next";

const TrailInformationCard = ({ storeName }) => {
  const { t } = useTranslation();
  // const [modalOpen, setModalOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [processingModalOpen, setProcessingModalOpen] = useState(false);
  console.log("processingModalOpen... ", processingModalOpen)
  const [storeImg, setStoreImg] = useState("");
  // const [storeName, setStoreName] = useState("");
  const paymentDetailsLoading = useSelector(
    (state) => state.subscriptionPayment.loading
  );
  console.log("paymentDetailsLoading... ", paymentDetailsLoading);
  const subscriptionPaymentLoading = useSelector(
    (state) => state.subscriptionPayment.loading
  );
  console.log("subscriptionPaymentLoading... ", subscriptionPaymentLoading);
  const generateLicenseLoading = useSelector(
    (state) => state.license.generateLicenseLoading
  );
  console.log("generateLicenseLoading... ", generateLicenseLoading);
  const machineCreationLoading = useSelector((state) => state.license.machineCreationLaoding);
  console.log("machineCreationLoading... ", machineCreationLoading);
  const storingLicenseDetailsLoading = useSelector(
    (state) => state.license.generateLicenseLoading
  );
  console.log("storingLicenseDetailsLoading... ", storingLicenseDetailsLoading);
  const updatingPlanLoading = useSelector(
    (state) => state.subscriptionPlan.loading
  );
  console.log("updatingPlanLoading... ", updatingPlanLoading);

  useEffect(() => {
    retrieveObj("storeInfo").then((info) => {
      if (info !== null) {
        setStoreImg(info && info[0]?.imageUrl);
        // setStoreName(info && info[0]?.storeName);
      }
    });
  }, [localStorage.getItem('storeInfo')]);

  // const toggleModal = () => {
  //   setModalOpen(!modalOpen);
  // };

  const handleUpgrade = () => {
    setModalOpen(true);
  };
  return (
    <>
      <div className=" trail-card">
        <div className="trail-information-card">
          <div className="logo-container d-flex">
            <img
              src={storeImg ? storeImg : DEFAULT_IMAGE}
              height={40}
              width={40}
            />
          </div>
          <div className="info-container">
            <div className="resturant-name">
              <h6>{storeName}</h6>
              <p style={{ fontSize: "14px" }}> {t("trailNotification.freeTrialPlan")}</p>
            </div>
          </div>
        </div>
        <div className="upgrade-button">
          <button style={{ width: "100%" }} onClick={handleUpgrade}>
            <FiStar className="star-icon" />
            {t("trailNotification.Upgrade")}
          </button>
        </div>
      </div>
      <SubscriptionPlanModal
        isModelVisible={modalOpen}
        setShow={setModalOpen}
        setProcessingModalOpen={setProcessingModalOpen}
      />
      <Modal
        size="lg"
        isOpen={processingModalOpen}
        fade={false}
        toggle={() => setProcessingModalOpen(!processingModalOpen)}
        className="modal-dialog-centered modal-lg"
        style={{
          maxWidth: "750px",
          width: "90vw",
        }}
      >
        <ModalBody style={{ padding: "0.5rem" }}>
          <div className="progress d-flex flex-column justify-content-center align-items-center h-auto">
            <h2 className="pb-3">Setup Processing</h2>
            {paymentDetailsLoading && (
              <h5 className="d-inline-flex">
                Your payment processing
                <ThreeDotLoader />
              </h5>
            )}
            {subscriptionPaymentLoading && (
              <h5 className="d-inline-flex">
                Storing your details on the server
                <ThreeDotLoader />
              </h5>
            )}
            {generateLicenseLoading && (
              <h5 className="d-inline-flex">
                Generating license
                <ThreeDotLoader />
              </h5>
            )}
            {machineCreationLoading && (
              <h5 className="d-inline-flex">
                Creating machine
                <ThreeDotLoader />
              </h5>
            )}
            {storingLicenseDetailsLoading && (
              <h5 className="d-inline-flex">
                Storing license details
                <ThreeDotLoader />
              </h5>
            )}
            {updatingPlanLoading && (
              <h5 className="d-inline-flex">
                Updating plan details
                <ThreeDotLoader />
              </h5>
            )}
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default TrailInformationCard;
