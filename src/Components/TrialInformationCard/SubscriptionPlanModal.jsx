import React, { useEffect, useState } from "react";
import "./SubscriptionPlanModal.css";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import SubscriptionCard from "./SubscriptionCard";
import Switch from "@mui/material/Switch";
import SubscriptionPaymentModal from "./SubscriptionPayment/SubscriptionPaymentModal";
import { subscriptionPlanDetails } from "../../Containts/Values";
import { useDispatch, useSelector } from "react-redux";
import { getSubscriptionPlanDetailsList } from "../../Redux/SubscriptionPlanSlice/SubscriptionPlanSlice";

const SubscriptionPlanModal = ({ isModelVisible, setShow, setProcessingModalOpen }) => {
  const dispatch = useDispatch()
  const subscriptionPlanDetailsList  = useSelector((state) => state.subscriptionPlan.subscriptionPlanDetails)
  console.log("subscriptionPlanDetailsList... ", subscriptionPlanDetailsList)
  const [toggle, setToggle] = useState(true);
  const [openPaymentModal, setOpenPaymentModal] = useState(false)
  const [selectedPlanDetails, setSelectedPlanDetails] = useState({
    planName: "",
    planPrice: 0
  })
  console.log("isModelVisible... ", isModelVisible)


  // getting subscription plan detials from server
  useEffect(() => {
    isModelVisible && dispatch(getSubscriptionPlanDetailsList())
  }, [isModelVisible])


  const handleToggle = () => {
    setToggle(!toggle);
  };

  const planHanlder = (planType) => {
    console.log("planType... ", planType);
  };

  const getStartBtnHandler = (planDetails) => {
    setOpenPaymentModal(true);
    planDetails && setSelectedPlanDetails(planDetails)
  };
  


  return (
    <Modal
      fullscreen
      isOpen={isModelVisible}
      toggle={() => setShow(!isModelVisible)}
    >
      <ModalHeader
        toggle={() => setShow(!isModelVisible)}
        className="popup-modal"
        style={{
          backgroundColor: "#000000e6",
          color: "white",
        }}
      >
        Subscription
      </ModalHeader>
      <ModalBody style={{ backgroundColor: "#f0f0f0" }}>
        <>
          <div className="plan-container">
            <div className="row">
              {/* <div className="col-lg-12"> */}
              <div className="title-box text-center">
                <h2 className="title-heading mt-4">
                  Find the right plan of your business
                </h2>
                <p className="text-muted f-17 mt-3 mb-2">
                  Everything you ned to sell online, mobile and at retail
                </p>
                <span>Monthly</span>
                <Switch
                  checked={toggle}
                  onChange={handleToggle}
                  color="primary"
                />
                <span>Annually</span>
              </div>
            </div>
          </div>

          <div className="subscription-cart-container d-flex justify-content-center">
            {subscriptionPlanDetailsList && subscriptionPlanDetailsList?.map((item) => {
              return             <div className="pricing-box mt-4">
              <SubscriptionCard
                cardTitle={item?.planName}
                cardPrice={item?.afterDiscountPrice}
                toggle={toggle}
                cardPriceDiscount={item?.beforeDiscountPrice}
                cardButtonText="Get Start"
                cardCharges="Charges"
                cardAddons="Addons"
                cardFeatures="Features"
                planHanlder={planHanlder}
                setPlanModalShow={setShow}
                getStartBtnHandler={getStartBtnHandler}
                disabled={item?.disabled}
                beforeDiscountMonthlyPrice={item?.beforeDiscountPriceMonthly}
                afterDiscountPriceMonthly={item?.afterDiscountPriceMonthly}
              />
            </div>
            })}

            {/* <div className="pricing-box mt-4">
              <SubscriptionCard
                cardTitle="FREE"
                cardPrice="7999"
                toggle={toggle}
                cardPriceDiscount="9998"
                cardButtonText="Get Start"
                cardCharges="Charges"
                cardAddons="Addons"
                cardFeatures="Features"
                planHanlder={planHanlder}
                setPlanModalShow={setShow}
                getStartBtnHandler={getStartBtnHandler}
              />
            </div>

            <div className="pricing-box mt-4">
              <SubscriptionCard
                cardTitle="LIFE TIME"
                cardPrice="1200"
                toggle={toggle}
                cardFeaturedText="Featured"
                cardPriceDiscount="1520"
                cardButtonText="Get Start"
                cardCharges="Charges"
                cardAddons="Addons"
                cardFeatures="Features"
                planHanlder={planHanlder}
                setPlanModalShow={setShow}
                getStartBtnHandler={getStartBtnHandler}
              />
            </div>

            {/* <div className="col-lg-4"> */}
            {/* <div className="pricing-box mt-4">
              <SubscriptionCard
                cardTitle="ULTIMATE"
                cardPrice="8975"
                toggle={toggle}
                cardPriceDiscount="9525"
                cardButtonText="Get Start"
                cardCharges="Charges"
                cardAddons="Addons"
                cardFeatures="Features"
                planHanlder={planHanlder}
                setPlanModalShow={setShow}
                getStartBtnHandler={getStartBtnHandler}
              />
            </div> */}
            {/* </div> */}
          </div>

          <SubscriptionPaymentModal
            isModelVisible={openPaymentModal}
            setShow={setOpenPaymentModal}
            setPlanModalShow={setShow}
            selectedPlanDetails={selectedPlanDetails}
            setProcessingModalOpen={setProcessingModalOpen}
          />
        </>
      </ModalBody>
    </Modal>
  );
};

export default SubscriptionPlanModal;
