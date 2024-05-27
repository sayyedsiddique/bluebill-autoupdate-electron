
import { Button, InputLabel, TextField } from "@mui/material";
import React, { useRef, useState } from "react";
import "./SignIn.css";
import { HiOutlineDevicePhoneMobile } from "react-icons/hi2";
import { HiOutlineMail } from "react-icons/hi";
import PhoneInput from "react-phone-input-2";
import { useNavigate } from "react-router-dom";
import CardWithTwoSection from "../../Components/RegistrationCard/CardWithTwoSection";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";
import { ForgotPassAuth, ReSendOtpAuth } from "../../Redux/authSlice/authSlice";
import { Amplify } from "aws-amplify";
import { AwsConfig } from "../../Containts/Values";
import OTPImg from '../../assets/images/OTPImg.jpg'

const ResentOtpPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const emailRef = useRef(null);
  const isLoading = useSelector((state) => state.auth.loading);
  const [isEmail, setIsEmail] = useState(true);

  const [fields, setFields] = useState({
    email: "",
    phone: "",
  });

  const [error, setError] = useState({
    email: "",
    phone: "",
  });

  // for change user pool Id
  Amplify.configure(AwsConfig(!isEmail));

  // to set values in input fields
  const inputHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFields({ ...fields, [name]: value });
    setError({ ...error, [name]: "" });
  };

  // to set values in input fields
  const phoneInputHandler = (value) => {
    setFields({ ...fields, phone: value });
    setError({ ...error, phone: "" });
  };

  //   Register with Email or Mobile handle
  const registerWithHandler = () => {
    setError({ ...error, email: "", phone: "" });
    setIsEmail(!isEmail);
  };

  // for validations on input fields and show error massage
  const validation = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(fields.email);

    const phoneRegex = /^[1-9]\d{10,14}$/;
    const isPhoneValid = phoneRegex.test(fields.phone);
    if (!fields.email && isEmail === true) {
      setError({ ...error, email: "Please enter email" });
      emailRef.current.focus();
      return false;
    } else if (isEmail === true && !isEmailValid) {
      setError({ ...error, email: "Please enter a valid email" });
      emailRef.current.focus();
      return false;
    } else if (!fields.phone && isEmail === false) {
      setError({ ...error, phone: "Please enter phone number" });
      return false;
    } else if (!isPhoneValid && isEmail === false) {
      setError({ ...error, phone: "Please enter a valid phone number" });
      return false;
    }
    return true;
  };

  // for calling api
  const handleSubmit = () => {
    let val = validation();
    if (val) {
      let UserName =
        isEmail === true ? fields.email.toLowerCase() : "+" + fields.phone;
      dispatch(ReSendOtpAuth(UserName, handleErr, handleSuccess));
    }
  };

  // to set api error
  const handleErr = (err) => {
    isEmail === true
      ? setError({ ...error, email: err })
      : setError({ ...error, phone: err });
  };

  // after succes response
  const handleSuccess = (userName) => {
    navigate("/otpscreen", {
      state: {
        signUpResponse: userName,
      },
    });
  };

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <CardWithTwoSection>
          <div className="registration_leftside">
            <img
              src={
                OTPImg
                  ? OTPImg
                  : "https://i.postimg.cc/CMkVh93D/forgetpass1.jpg"
              }
              alt="forgot password image"
            />
          </div>
          <div className="registration_right">
            <h1 className="heading_h1">Resend OTP</h1>
            <div className="login_with_container" >
              <p className="pe-2">Send OTP on</p>
              {isEmail ? (
                <HiOutlineMail size={25} />
              ) : (
                <HiOutlineDevicePhoneMobile size={25} />
              )}
            </div>
            {isEmail ? (
              <div className="input_container mb-3">
                <InputLabel style={{ color: "var(--product-text-color)" }}>
                  Email
                  <span className="text-danger">*</span>
                </InputLabel>
                <TextField
                  style={{ backgroundColor: "var( --light-gray-color)", marginBottom:"0.5rem" }}
                  placeholder={"Enter your email"}
                  id="outlined-size-small"
                  size="small"
                  name="email"
                  value={fields.email}
                  inputRef={emailRef}
                  onChange={inputHandler}
                />

                <div className="d-flex flex-wrap justify-content-between">
                  <div>
                  {error && error?.email && (
                    <span className="text-danger">{error?.email}</span>
                  )}
                  </div>
                  <div className="text-end colors">
                    <span onClick={registerWithHandler}>
                    {isEmail === true ?"Send OTP on mobile":"Send OTP on email"}
                    </span>
                  </div>
                </div>

              </div>
            ) : (
              <div className="input_container phone_container mb-3">
                <InputLabel style={{ color: "var(--product-text-color)" }}>
                  Mobile no
                  <span className="text-danger">*</span>
                </InputLabel>
                <PhoneInput
                  country="in"
                  containerStyle={{ height: 45, width: "100%", marginBottom:"0.5rem" }}
                  inputStyle={{ height: 45, width: "100%" }}
                  searchClass="search-class"
                  enableSearch
                  disableSearchIcon
                  countryCodeEditable={false}
                  name="phone"
                  value={fields.phone}
                  onChange={(phone) => phoneInputHandler(phone)}
                />

                <div className="d-flex flex-wrap justify-content-between">
                  <div>
                  {error.phone ? (
                    <span className="text-danger">{error.phone}</span>
                  ) : null}
                  </div>
                  <div className="text-end colors">
                    <span onClick={registerWithHandler}>
                    {isEmail === true ?"Send OTP on mobile":"Send OTP on email"}
                    </span>
                  </div>
                </div>

              </div>
            )}

            <div className="mt-2" style={{ textAlign: "right" }}>
              <Button
                variant="contained"
                style={{
                  backgroundColor: "var(--button-bg-color)",
                  color: "var(--button-color)",
                  width: "100%",
                  fontSize: "1.1rem",
                  letterSpacing: "1px",
                }}
                onClick={handleSubmit}
              >
                Submit
              </Button>
              <div className="login_container" style={{ marginTop: "2rem" }}>
                <p
                  className="heading_para"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/signin")}
                >
                  <BiArrowBack /> Go back to sign in page
                </p>
              </div>
            </div>
          </div>
        </CardWithTwoSection>
      )}
    </>
  );
};

export default ResentOtpPage;
