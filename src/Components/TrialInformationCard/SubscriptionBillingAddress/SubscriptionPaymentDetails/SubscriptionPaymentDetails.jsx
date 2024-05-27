import React, { useState } from 'react'
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import { Button, InputAdornment, TextField } from "@mui/material";
import { IoMdInformationCircle } from "react-icons/io";
import "./SubscriptionPaymentDetails.css";

const SubscriptionPaymentDetails = (props) => {

  const [fields, setFields] = useState({
    cardNumber: '',
    expiry: "",
    cvv: '',

  });
  console.log("paymentDetalis", fields);

  const [error, setError] = useState({
    cardNumber: '',
    expiry: "",
    cvv: '',

  });


  const validation = () => {
    if (!fields.cardNumber) {
      setError({ ...error, cardNumber: 'Enter cardNumber' });
      return false;
    } else if (fields.cardNumber.length < 16) {
      setError({ ...error, cardNumber: 'Card number should be 16 digits' });
      return false;
    } else if (!fields.expiry) {
      setError({ ...error, expiry: 'Enter expiry' });
      return false;
    } else if (!fields.cvv) {
      setError({ ...error, cvv: 'Enter CVV' });
      return false;
    } else if (fields.cvv.length < 4) {
      setError({ ...error, cvv: 'CVV should be 4 digits' });
      return false;
    }
    
    return true; 
  };
  


  const paymentDetailHnadler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setError({ ...error, [name]: "" });

    if (name === "cardNumber" ||
      name === "expiry" ||
      name === "CVV") {
      let Value = e.target.value.replace(/\D/g, "");
      setFields({ ...fields, [name]: Value });
    } else {
      setFields({ ...fields, [name]: value });
    }

  }

  const proceedHandler = (event) => {
    event.preventDefault();
    const val = validation();
    if (val) {
      const jsonObj = {
        cardNumber: fields.cardNumber,
        expiry: fields.expiry,
        cvv: fields.cvv,

      }
      console.log("pymentDetails", jsonObj);
    }
  }

  return (
    <div>
      <Modal size="md"
        isOpen={props.isModelVisible}
        toggle={() => props.setshow(!props.isModelVisible)}>
        <ModalHeader toggle={() => props.setshow(!props.isModelVisible)} className="popup-modal"

        >
          <h5 className="title-content"
            style={{
              marginLeft: "6rem",

            }}
          >Add your Payment Details</h5>
        </ModalHeader>
        <ModalBody style={{ backgroundColor: "#f0f0f0" }}>
          <>
            <form class="container">
              <div className="row">
                <div className="form-group">
                  <TextField
                    // type="number"
                    id="number"
                    name="cardNumber"
                    placeholder="Card Number"
                    value={fields.cardNumber}
                    inputProps={{ maxLength: 16 }}
                    required
                    onChange={paymentDetailHnadler}
                  />
                  {error.cardNumber && <span className="text-danger">{error.cardNumber}</span>}
                </div>
                <div className='d-flex' style={{ gap: "2px" }}>
                  <div className="form-group">
                    <TextField
                      // type="number"
                      id="expiry"
                      name="expiry"
                      placeholder="Expiry"
                      value={fields.expiry}
                      inputProps={{ maxLength: 6 }}
                      required
                      onChange={paymentDetailHnadler}
                    />
                    {error.expiry && <span className="text-danger">{error.expiry}</span>}
                  </div>
                  <div className="form-group">
                    <TextField
                      // type="number"
                      id="cvv"
                      name="cvv"
                      placeholder="CVV"
                      required
                      value={fields.cvv}
                      inputProps={{ maxLength: 4 }}
                      onChange={paymentDetailHnadler}
                    // InputProps={{
                    //   endAdornment: (
                    //     <InputAdornment position="end">
                    //       <IoMdInformationCircle />
                    //     </InputAdornment>
                    //   ),
                    // }}
                    />
                    {error.cvv && <span className="text-danger">{error.cvv}</span>}
                  </div>
                </div>

                <div className='description-content'>
                  <p>I authorize EzyGen Technology Solutions Private Limited to
                    save this payment method and automatically charge this payment
                    method whenever a subscription is associated with it</p>
                </div>


              </div>
            </form>
            <div className="text-center">
              <Button
                variant="contained"
                style={{
                  backgroundColor: "var(--button-bg-color)",
                  color: "var(--button-color)",
                  width: "250px",
                  fontSize: "1.1rem",
                  letterSpacing: "1px",
                }}

                onClick={proceedHandler}
              >
                Proceed to Review
              </Button>
            </div>
          </>
        </ModalBody>
      </Modal>


    </div>
  )
}

export default SubscriptionPaymentDetails
