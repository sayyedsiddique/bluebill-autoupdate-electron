import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import React, { useEffect, useState } from 'react'
import { Button, TextField, InputLabel, MenuItem, } from "@mui/material";
import "./SubscriptionBillingModal.css";
import { ModalTitle } from 'react-bootstrap';
import Select from "react-select";
import SubscriptionPatmentDetails from './SubscriptionPaymentDetails/SubscriptionPaymentDetails';
import { CUSTOM_DROPDOWN_STYLE } from '../../../utils/CustomeStyles';
import { useSelector } from 'react-redux';
import { STORE_Id } from '../../../Containts/Values';


const SubscriptionBillingModal = (props) => {
  const storeDetailsApi = window.storeDetailsApi;
  const storeData = useSelector((state) => state.storeSetting.storeData);
  const [storeDetails, setStoreDetails] = useState({});
  console.log("storeDetails...",storeDetails);
  const [openModal, setOpenModal] = useState(false);

  const [fields, setFields] = useState({
    firstName: '',
    lastName: '',
    email: '',
    number: '',
    companyName: '',
    address1: '',
    city: '',
    zip: '',
    state: '',
    country: '',
    GSTIN: ''
  });
  console.log("BillingDetails", fields);

  const [error, setError] = useState({
    firstName: '',
    lastName: '',
    email: '',
    number: '',
  });


  const validation = () => {
    if (!fields.firstName) {
      setError({ ...error, firstName: 'Enter firstName' });
      return false;
    } else if (fields.lastName === undefined || fields.lastName === '') {
      setError({ ...error, lastName: 'Enter lastName' });
      return false;
    } else if (fields.email === undefined || fields.email === '') {
      setError({ ...error, email: 'Enter emailAddress' });
      return false;
    } else if (!validateEmail(fields.email)) {
      setError({ email: 'Invalid email address' });
      return false;
    } else if (fields.number === undefined || fields.number === '') {
      setError({ ...error, number: 'Enter number' });
      return false;
    }else if (fields.number.length < 10 || fields.number.length > 15) {
      setError({ number: 'Mobile number should be 10 digits' });
      return false;
    }
    return true;

  };

  // store details storing in state here
  useEffect(() => {
    storeData && storeData[0] && setStoreDetails(storeData[0]);
    const storeDetails = storeDetailsApi?.storeDetailsDB?.getStoreDetails(
      Number(STORE_Id)
    );
    setFields({
      firstName:storeDetails?.storeName,
      lastName:storeDetails?.storeName,
      email:storeDetails?.email,
      companyName:"",
      number:storeDetails?.mobileNumber,
      address1:storeDetails?.address,
      city:storeDetails?.city,
      zip:storeDetails?.pinCode,
      state:"",
      country:"",
      GSTIN:""
    })
    storeDetails && setStoreDetails(storeDetails);

  }, [storeData]);



  const billingInputHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setError({ ...error, [name]: "" });

    if (name === "number") {
      let Value = e.target.value.replace(/\D/g, "");
      setFields({ ...fields, [name]: Value });
    }else {
      setFields({ ...fields, [name]: value });
    }

  };

  const NextPaymentHandler = (event) => {
    event.preventDefault();
    const val = validation();
    if (val) {
      const jsonObj = {
        firstName: fields.firstName,
        lastName: fields.lastName,
        email: fields.email,
        number: fields.number,
        companyName: fields.companyName,
        address1: fields.address1,
        city: fields.city,
        zip: fields.zip,
        state: fields.state,
        country: fields.country,
        GSTIN: fields.GSTIN
      }
      console.log("BillingDetails",jsonObj);
      setOpenModal(true);
    }
  }


  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  return (
    <>
      <Modal size="md"
        isOpen={props.isModelVisible}
        toggle={() => props.setshow(!props.isModelVisible)}>
        <ModalHeader toggle={() => props.setshow(!props.isModelVisible)} className="popup-modal"
        // style={{ height: "85px" }}
        >
          <h5 className="title-content"
            style={{
              marginLeft: "6rem",
            }}
          >Add your Billing Address</h5>
        </ModalHeader>

        <ModalBody style={{ backgroundColor: "#f0f0f0" }}>
          <form class="container">
            <div className="row">
              <div className='d-flex' style={{ gap: "2px" }}>
                <div className="form-group">
                  <TextField
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="First Name"
                    value={fields.firstName}
                    onChange={billingInputHandler}
                  />
                  {error.firstName && <span className="text-danger">{error.firstName}</span>}
                </div>
                <div className="form-group">
                  <TextField
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Last Name"
                    value={fields.lastName}
                    onChange={billingInputHandler}

                  />
                  {error.lastName && <span className="text-danger">{error.lastName}</span>}
                </div>
              </div>

              <div className="form-group">
                <TextField
                  fullWidth
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  value={fields.email}
                  onChange={billingInputHandler}
                />
                {error.email && <span className="text-danger">{error.email}</span>}
              </div>
              <div className="form-group">
                <TextField
                  fullWidth
                  // type="number"
                  id="number"
                  name="number"
                  placeholder="Phone number"
                  value={fields?.number}
                  inputProps={{ maxLength: 13 }}
                  onChange={billingInputHandler}

                />
                {error?.number && <span className="text-danger">{error?.number}</span>}
              </div>
              <div className="form-group">
                <TextField
                  fullWidth
                  type="text"
                  id="companyName"
                  name="companyName"
                  placeholder="Company Name (Optional)"
                  value={fields.companyName}
                  onChange={billingInputHandler}
                />
              </div>
              <div className="form-group">
                <TextField
                  fullWidth
                  type="text"
                  id="address1"
                  name="address1"
                  placeholder="Address"
                  value={fields.address1}
                  onChange={billingInputHandler}

                />
              </div>
              {/* <div className="form-group">
                <TextField
                  fullWidth
                  type="text"
                  id="address2"
                  name="address2"
                  placeholder="Address 2(Optional)"
                />
              </div>
              <div className="form-group">
                <TextField
                  fullWidth
                  type="text"
                  id="address3"
                  name="address3"
                  placeholder="Address 3(Optional)"
                />
              </div> */}

              <div className="lower" style={{ gap: "2px" }}>
                <div className="form-group">
                  <TextField
                    fullWidth
                    type="text"
                    id="city"
                    name="city"
                    placeholder="City(Optional)"
                    value={fields.city}
                    onChange={billingInputHandler}
                  />
                </div>
                <div className="form-group">
                  <TextField
                    fullWidth
                    type="text"
                    id="zip"
                    name="zip"
                    placeholder="Zip(Optional)"
                    value={fields.zip}
                    onChange={billingInputHandler}
                  />
                </div>
              </div>

              <div className='form-group' style={{ display: 'flex', gap: '2px', width: '100%' }}>
                <div style={{ flex: 1 }}>
                  <TextField className='select-input'
                    fullWidth
                    variant="outlined"
                    placeholder="State"
                    name="state"
                    value={fields.state}
                    onChange={billingInputHandler}

                  />
                </div>
                <div style={{ flex: 1 }}>
                  <TextField className='select-input'
                    fullWidth
                    variant="outlined"
                    placeholder="Country"
                    name="country"
                    value={fields.country}
                    onChange={billingInputHandler}

                  />
                </div>
              </div>

              <div className="form-group">
                <TextField
                  fullWidth
                  type="text"
                  placeholder="GSTIN"
                  name='GSTIN'
                  value={fields.GSTIN}
                  onChange={billingInputHandler}
                />
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
              onClick={NextPaymentHandler}

            >
              Next
            </Button>
          </div>
        </ModalBody>
      </Modal>
      <SubscriptionPatmentDetails
        isModelVisible={openModal}
        setshow={setOpenModal} />

    </>
  )
}

export default SubscriptionBillingModal
