import React, { useState } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { SERVER_URL, STORE_Id, getUTCDate } from "../../Containts/Values";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Button, InputLabel, TextField } from "@mui/material";
import { useDispatch } from "react-redux";
import { addCustomer, updateCustomer } from "../../Redux/Customer/customerSlice";
import AlertpopUP from "../../utils/AlertPopUP";
import axios from "axios";


let userToken = localStorage.getItem("userToken");

const CustomerModal = (props) => {
  const dispatch = useDispatch()
  const { t } = useTranslation();
  const customerApi = window.customerApi;
  const { fetchApi, isModelVisible, customerData, setshow, setCustomerPostRes } = props
  const isOnline = useSelector((state) => state.checkInternet.isOnline);
  const [customerName, setcustomerName] = useState(
    props?.customerData?.customerName
  );


  const [email, setemail] = useState(props?.customerData?.email);
  const [city, setcity] = useState(props?.customerData?.city);
  const [mobileNumber, setmobileNumber] = useState(
    props?.customerData?.mobileNumber
  );
  const [address, setAddress] = useState(props?.customerData?.address);
  const [country, setcountry] = useState(props?.customerData?.country);
  const [state, setState] = useState(props?.customerData?.state);
  const [customerId, setcustomerId] = useState(props?.customerData?.customerId);
  const [error, setError] = useState({ customerName: '', email: '', mobileNumber: '' });
  const modalHeader = props.isEdit ? t("CustomerDetails.editCustomer") : t("CustomerDetails.addCustomer");
  const [isSync, setIsSync] = useState(
    props?.customerData?.isSync ? props?.customerData?.isSync : 0
  );
  const [customerSuccesPopup, setCustomerSuccesPopup] = useState(false); // for popup

  const validate = () => {
    if (customerName === "" || customerName === undefined) {
      setError({ customerName: 'Please enter customer name' })
      return false;
      // } else if (email === '' || email === undefined) {
      //   setError({ email: 'Please enter email' })
      //   return false;
      // } else if (!validateEmail(email)) {
      //   setError({ email: 'Invalid email address' });
      //   return false;
    }
    else if (mobileNumber === '' || mobileNumber === undefined) {
      setError({ mobileNumber: 'Please enter mobile number' })
      return false;
    } else if (mobileNumber.length < 10 || mobileNumber.length > 15) {
      setError({ mobileNumber: 'Mobile number should be 10 digits' });
      return false;
    }
    return true;
  };

  // for add new customer
  const AddCustomers = () => {
    let val = validate();
    if (val) {
      const postData = {
        customerName: customerName,
        email: email ? email : "",
        customerId: customerId ? customerId : mobileNumber,
        mobileNumber: mobileNumber,
        address: address,
        city: city,
        state: state,
        country: country,
      };
      console.log("postData", postData);


      const postSchemaData = {
        customerName: customerName,
        email: email,
        customerId: customerId ? customerId : 0,
        mobileNumber: mobileNumber,
        address: address ? address : "",
        city: city ? city : "",
        state: state ? state : "",
        country: country ? country : "",
        isDeleted: props?.customerData ? props?.customerData?.isDeleted : 0,
        lastUpdate: getUTCDate(),
        storeId: STORE_Id,
        isSync: isSync,
        notes: props?.customerData ? props?.customerData?.notes : "",
        addedBy: props?.customerData ? props?.customerData?.addedBy : "",
        updatedBy: props?.customerData ? props?.customerData?.updatedBy : "",
      };

      if (isOnline) {
        props.customerData
          ? dispatch(updateCustomer(postData, props?.customerCreationSuccess, props?.setPopUpMessage))
          : dispatch(addCustomer(postData, props?.customerCreationSuccess, props?.setPopUpMessage));
        // axios
        //   .post(`${SERVER_URL}customer/upsertCustomer`, postData, {
        //     headers: { Authorization: `Bearer ${userToken} ` },
        //   })
        //   .then(({ data }) => {
        //     console.log(data);
        props.setshow(false);
        //   });
      } else {
        const result = props?.customerData
          ? customerApi?.customerDB?.updateCustomer(postSchemaData)
          : customerApi?.customerDB?.insertCustomer(postSchemaData);
        setCustomerPostRes && setCustomerPostRes(result)
        props.setshow(false);
      }



    }

  };
  // to close popup modal
  const handlePopupClose = () => {
    setCustomerSuccesPopup(true)
    props.setshow(false)
  }

  // to get data from input field
  const handleName = (e) => {
    let value = e.target.value.replace(/^[^a-zA-Z]+/, '');
    setcustomerName(value);
    setError({ ...error, customerName: '' })

  }



  const handleEmail = (e) => {
    setemail(e.target.value);
    setError({ ...error, email: '' });
  };

  const handleMobile = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 15);
    setmobileNumber(value);
    setError({ ...error, mobileNumber: '' });
  };

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleCity = (e) => {
    const value = e.target.value.replace(/[^A-Za-z ]/g, '');
    setcity(value);
  }

  const handleState = (e) => {
    const value = e.target.value.replace(/[^A-Za-z ]/g, '');
    setState(value);
  }

  const handleCountry = (e) => {
    const value = e.target.value.replace(/[^A-Za-z ]/g, '');
    setcountry(value);
  }




  const handleSaveCustomerSuccess = () => {
    setCustomerSuccesPopup(true);
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
          <AlertpopUP
            open={customerSuccesPopup}
            message="Custome saved successfully!"
            severity="success"
            onClose={handleSaveCustomerSuccess}
          />
        </ModalHeader>
        <ModalBody className="popup-modal">
          <form action="">
            <div className="mb-4">
              <InputLabel className="requiredstar"> {t("CustomerDetails.name")}</InputLabel>
              <TextField
                type="text"
                size="small"
                name="Name"
                placeholder={t("CustomerDetails.enterCustomerName")}
                className="form-control placeholder-fs"
                value={customerName}
                onChange={handleName}
                inputProps={{ maxLength: 50 }}
              />
              {error.customerName ? (
                <span className="text-danger">{error.customerName}</span>
              ) : null}
            </div>
            {/* <div className="mb-4">
              <label className="requiredstar"> {t("CustomerDetails.emailAddress")}</label>
              <TextField
                type="text"
                size="small"
                name="fieldemail"
                placeholder={t("CustomerDetails.enterCustomerEmail")}
                className="form-control placeholder-fs"
                value={email}
                onChange={handleEmail}
              // onChange={(e) => setemail(e.target.value)}
              />
              {error.email ? (<span className="text-danger error-fs">{error.email}</span>)
                : null}
            </div> */}
            <div className="mb-4">
              <InputLabel className="requiredstar">
                {" "}
                {t("CustomerDetails.mobileNumber")}
              </InputLabel>
              <TextField
                type="number"
                size="small"
                name="fieldMobileNo"
                placeholder={t("CustomerDetails.enterMobileNumber")}
                inputProps={{ maxLength: 13 }}
                className="form-control placeholder-fs"
                value={mobileNumber}
                onChange={handleMobile}
              />
              {error.mobileNumber ? (
                <span className="text-danger">{error.mobileNumber}</span>
              ) : null}
            </div>
            <div className="mb-4">
              <InputLabel> {t("CustomerDetails.address")}</InputLabel>
              <TextField
                type="text"
                size="small"
                name="fieldAddress"
                placeholder={t("CustomerDetails.enterAddress")}
                className="form-control placeholder-fs"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            {/* <div className="mb-4">
              <InputLabel> {t("CustomerDetails.city")}</InputLabel>
              <TextField
                type="text"
                size="small"
                name="fieldCity"
                placeholder={t("CustomerDetails.enterCity")}
                className="form-control placeholder-fs"
                value={city}
                onChange={handleCity}
              />
            </div>
            <div className="mb-4">
              <InputLabel> {t("CustomerDetails.state")}</InputLabel>
              <TextField
                type="text"
                size="small"
                name="fieldState"
                placeholder={t("CustomerDetails.enterState")}
                className="form-control placeholder-fs"
                value={state}
                onChange={handleState}
              />
            </div>
            <div className="mb-4">
              <InputLabel> {t("CustomerDetails.country")}</InputLabel>
              <TextField
                type="text"
                size="small"
                name="fieldCountry"
                placeholder={t("CustomerDetails.enterCountry")}
                className="form-control placeholder-fs"
                value={country}
                onChange={handleCountry}
              />
            </div> */}
          </form>

          <Button
            className="mt-4"
            variant="contained"
            style={{ backgroundColor: "var(--button-bg-color)", color: "var(--button-color)" }}
            onClick={() => AddCustomers()}
          >
            {t("CustomerDetails.submit")}
          </Button>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default CustomerModal;
