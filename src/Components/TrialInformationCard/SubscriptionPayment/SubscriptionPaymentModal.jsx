import React, { useState } from "react";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import "./SubscriptionPaymentModal.css";
import SubscriptionBillingModal from "../SubscriptionBillingAddress/SubscriptionBillingModal";
import {
  CREATE_ORDER,
  GET_PAYMENT,
  SERVER_URL,
  STORE_CURRENCY,
  getUTCDate,
} from "../../../Containts/Values";
import axios from "axios";
import { useEffect } from "react";
import { getStoreDetailsFromLocalStorage } from "../../../utils/constantFunctions";
import { useDispatch } from "react-redux";
import { addPaymentDetails } from "../../../Redux/SubscriptionPaymentSlice/SubscriptionPaymentSlice";
import { generateToken } from "../../../Redux/LicenseSlice/licenseSlice";
import AlertpopUP from "../../../utils/AlertPopUP";
// import { ModalTitle } from 'react-bootstrap';

const SubscriptionPaymentModal = ({
  isModelVisible,
  setShow,
  setPlanModalShow,
  selectedPlanDetails,
  setProcessingModalOpen,
}) => {
  const dispatch = useDispatch();
  const deviceFingerPrint = window.getDeviceFingerPrint;
  const [openModal, setOpenModal] = useState(false);
  console.log("showPopUp", openModal);

  const [isPopupOpen, setIsPopupOpen] = useState(false); // for popup
  console.log("isPopupOpen... ", isPopupOpen);
  const [popUpMessage, setPopUpMessage] = useState("");
  console.log("popUpMessage... ", popUpMessage);
  const [storeDetials, setStoreDetials] = useState();
  console.log("storeDetials... ", storeDetials);
  const [cognitoUserId, setCognitoUserId] = useState();
  // console.log("cognitoUserId... ", cognitoUserId)

  useEffect(() => {
    const storeDetailsData = getStoreDetailsFromLocalStorage("storeInfo");
    storeDetailsData && setStoreDetials(storeDetailsData[0]);
    const cognitoUserDetails = getStoreDetailsFromLocalStorage("storeUserInfo");
    cognitoUserDetails && setCognitoUserId(cognitoUserDetails?.userId);
  }, []);

  // alert popup close handler
  const handleClose = () => {
    setIsPopupOpen(false);
  };

  const PayWithCardHandler = () => {
    setOpenModal(true);
  };

  const razorpaySuccessResHandler = (planName) => {
    let planNameLikeSchema = planName === "LIFE TIME" ? "lifeTime" : "free";
    async function fetchData() {
      // You can await here
      const fingerPrinter = await deviceFingerPrint?.getMachineId();
      console.log("fingerPrinter... ", fingerPrinter);
      setProcessingModalOpen(true);
      // generating license here after complete successfully transaction
      dispatch(
        generateToken(
          storeDetials?.storeId,
          planNameLikeSchema,
          fingerPrinter,
          setProcessingModalOpen
        )
      );
    }
    fetchData();

    setOpenModal(false);
    setShow(false);
    setPlanModalShow(false);
  };

  const payWithRazorPayHandler = async (e) => {
    const order = await axios.post(`${SERVER_URL}${CREATE_ORDER}`, {
      amount: selectedPlanDetails?.planPrice,
      currencyCode: "INR",
    });
    console.log("responseOrder... ", order?.data);
    console.log("cognitoUserId... ", cognitoUserId);

    // let config = apiConfig(`${SERVER_URL}${GET_PAYMENT}?userId=${userId}`, "GET");
    const responsePayment = await axios.get(
      `${SERVER_URL}${GET_PAYMENT}?userId=${cognitoUserId}`
    );
    console.log("responsePayment... ", responsePayment);
    const paymentDetails = responsePayment?.data?.data[0];

    console.log("paymentDetails.... ", paymentDetails);
    // paymentDetails?.planName !== selectedPlanDetails?.planName && order?.data?.status === "created"
    if (!paymentDetails) {
      var options = {
        key: "rzp_test_REwSQmqwa8eY0q", // Enter the Key ID generated from the Dashboard
        amount: order?.data?.data?.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: order?.data?.data?.currency,
        name: "BlueBill POS", //your business name
        description: "Test Transaction",
        image: "https://example.com/your_logo",
        order_id: order?.data?.data?.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        handler: function (response) {
          console.log("RazorPayResponse... ", response);

          const payload = {
            amount: selectedPlanDetails?.planPrice,
            currency: order?.data?.data?.currency,
            dateTime: getUTCDate(),
            email: storeDetials?.email,
            methodPayment: "string",
            mobileNo: storeDetials?.mobileNumber,
            paymentId: response?.razorpay_payment_id,
            storeId: storeDetials?.storeId,
            orderId: response.razorpay_order_id,
            planName: selectedPlanDetails?.planName,
            signaturedId: response.razorpay_signature,
            userId: cognitoUserId,
          };

          if (response?.razorpay_payment_id) {
            // Payment transaction details storing on our server through this addPaymentDetails api
            payload &&
              dispatch(addPaymentDetails(payload, razorpaySuccessResHandler));
          }
          // alert(response.razorpay_payment_id);
          // alert(response.razorpay_order_id);
          // alert(response.razorpay_signature);
        },
        prefill: {
          //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
          name: "", //your customer's name
          email: storeDetials?.email,
          contact: storeDetials?.mobileNumber, //Provide the customer's phone number for better conversion rates
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };
      var rzp1 = new window.Razorpay(options);
      // rzp1.on("payment.failed", function (response) {
      //   console.log("response.... ", response)
      //   alert(response.error.code);
      //   alert(response.error.description);
      //   alert(response.error.source);
      //   alert(response.error.step);
      //   alert(response.error.reason);
      //   alert(response.error.metadata.order_id);
      //   alert(response.error.metadata.payment_id);
      // });
      rzp1.open();
      // e.preventDefault();
    } else {
      // setIsPopupOpen(true);
      setPopUpMessage("Already you have this plan");
    }
  };

  return (
    <div>
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
          <div className="payment-cart cardBox p-3">
            <div className="">
              <h2>Payment Request</h2>
              <div className="d-flex justify-content-between">
                <p>PLAN</p>
                <p>{selectedPlanDetails?.planName}</p>
              </div>
              <div className="d-flex justify-content-between">
                <h6>Lite-Prorated Charges</h6>
                {selectedPlanDetails?.planName === "LIFE TIME" ? (
                  <p>{selectedPlanDetails?.planPrice}</p>
                ) : (
                  <strike
                    style={{ opacity: "50%" }}
                  >{`${STORE_CURRENCY}${selectedPlanDetails?.planPrice}`}</strike>
                )}
              </div>
              <hr />
            </div>
            <div className="">
              <div className="d-flex justify-content-between">
                <h5>Total</h5>
                {selectedPlanDetails?.planName === "LIFE TIME" ? (
                  <p>{selectedPlanDetails?.planPrice}</p>
                ) : (
                  <strike
                    style={{ fontSize: "1.2rem" }}
                  >{`${STORE_CURRENCY}${selectedPlanDetails?.planPrice}`}</strike>
                )}
              </div>
              <div className="payOptions mb-3 mt-2">
                <div className="payOption1 p-2 d-flex justify-content-between flex-wrap">
                  <div className="">
                    <h6>PAY WITH CREDIT/DEBIT CARDS</h6>
                    <p>Powerd by Chargebee</p>
                  </div>
                  <Button
                    className="paynow-btn"
                    onClick={PayWithCardHandler}
                    variant="contained"
                    style={{
                      backgroundColor: "var(--button-bg-color)",
                      color: "var(--button-color)",
                      margin: "10px",
                    }}
                  >
                    Pay Now
                  </Button>
                </div>

                <div className="payOption2 p-2 d-flex justify-content-between flex-wrap">
                  <div className="">
                    <h6>PAY WITH UPI/NETBANKING/WALLETS etc.</h6>
                    <p>Powerd by Razorpy</p>
                  </div>

                  <Button
                    className="paynow-btn"
                    variant="contained"
                    style={{
                      backgroundColor: "var(--button-bg-color)",
                      color: "var(--button-color)",
                      margin: "10px",
                    }}
                    onClick={(e) => payWithRazorPayHandler(e)}
                  >
                    Pay Now
                  </Button>
                </div>
              </div>

              <p
                style={{
                  margintop: "1rem",
                  textAlign: "center",
                  opacity: "50%",
                }}
              >
                For any Queries,Please Contact
              </p>
            </div>
          </div>
        </ModalBody>
        <AlertpopUP
          open={isPopupOpen}
          message={popUpMessage}
          severity={"error"}
          onClose={handleClose}
        />
      </Modal>

      <SubscriptionBillingModal
        isModelVisible={openModal}
        setshow={setOpenModal}
      />
    </div>
  );
};

export default SubscriptionPaymentModal;
