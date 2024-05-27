import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Button, InputLabel, TextField } from "@mui/material";
import React, { useRef, useState } from "react";
import "./Registration.css";
import { HiOutlineDevicePhoneMobile } from "react-icons/hi2";
import { HiOutlineMail } from "react-icons/hi";
import PhoneInput from "react-phone-input-2";
import { useNavigate } from "react-router-dom";
import CardWithTwoSection from "../../Components/RegistrationCard/CardWithTwoSection";
// import UserUsingLaptopImg from "../../assets/images/person-using-laptop.png";
import { Amplify } from "aws-amplify";
import { AwsConfig } from "../../Containts/Values";
import { SignUpAuth } from "../../Redux/authSlice/authSlice";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";

const Registration = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoading = useSelector((state) => state.auth.loading);
  const [showPassword, seShowPassword] = useState(false);
  const [showConfirmPassword, seShowConfirmPassword] = useState(false);
  const [isEmail, setIsEmail] = useState(true);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef();

  // for change user pool Id
  Amplify.configure(AwsConfig(!isEmail));

  // to set input value
  const [fields, setFields] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // to set error
  const [error, setError] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

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
    setError({ ...error, email: "", phone: "", password: "" });
    setIsEmail(!isEmail);
  };

  //   Sign in handler navigate to login page
  const signInHandler = () => {
    navigate("/signin");
  };

  const showPasswordHandler = () => {
    seShowPassword(!showPassword);
  };

  const confirmPasswordHandler = () => {
    seShowConfirmPassword(!showConfirmPassword);
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
    } else if (!fields.password) {
      setError({ ...error, password: "Please enter password" });
      passwordRef.current.focus();
      return false;
    } else if (fields.password.length < 6) {
      setError({ ...error, password: "Please enter minimum 6 characters" });
      passwordRef.current.focus();
      return false;
    } else if (!fields.confirmPassword) {
      setError({ ...error, confirmPassword: "Please enter password" });
      confirmPasswordRef.current.focus();
      return false;
    } else if (fields.confirmPassword !== fields.password) {
      setError({ ...error, confirmPassword: "Please enter same password" });
      confirmPasswordRef.current.focus();
      return false;
    }
    return true;
  };

  // to set api error
  const handleSetErr = (err) => {
    isEmail === true
      ? setError({ ...error, email: err })
      : setError({ ...error, phone: err });
  };

  // after success response to navigate otp screen
  const handleSuccess = (userName) => {
    navigate("/otpscreen", {
      state: {
        signUpResponse: userName,
      },
    });
  };


  // Enter key press form sumbission
  const handleFormSubmit = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const val = validation();
    if (val) {
      let UserName =
        isEmail === true ? fields.email.toLowerCase() : "+" + fields.phone;
      dispatch(
        SignUpAuth(
          UserName,
          fields.password,
          isEmail,
          handleSetErr,
          handleSuccess
        )
      );
    }
  };

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <CardWithTwoSection>
          <>
            <div className="card_leftside">
              <img src="Images/PersonUsingLaptop.png" alt="" />
            </div>
            <div className="card_rightside">
              <h1 className="heading_h1">Create Account</h1>

              <div
                className="login_with_container"
              // onClick={registerWithHandler}
              >
                <p className="pe-2">Register with</p>
                {isEmail ? (
                  <HiOutlineMail size={25} />
                ) : (
                  <HiOutlineDevicePhoneMobile size={25} />
                )}
              </div>
              {isEmail ? (
                <div className="input_container">
                  <InputLabel style={{ color: "var(--product-text-color)" }}>
                    Email
                    <span className="text-danger">*</span>
                  </InputLabel>
                  <TextField
                    style={{ backgroundColor: "var( --light-gray-color)", marginBottom: "0.5rem" }}
                    placeholder={"Enter your email"}
                    id="outlined-size-small"
                    size="small"
                    name="email"
                    value={fields.email}
                    onChange={inputHandler}
                    inputRef={emailRef}
                    onKeyDown={handleFormSubmit}
                  />

                  <div className="d-flex flex-wrap justify-content-between">
                    <div>
                      {error && error?.email && (
                        <span className="text-danger">{error?.email}</span>
                      )}
                    </div>
                    <div className="text-end colors">
                      <span onClick={registerWithHandler}>
                        {isEmail === true ? "Register with mobile" : "Register with email"}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="input_container phone_container">
                  <InputLabel style={{ color: "var(--product-text-color)" }}>
                    Mobile no
                    <span className="text-danger">*</span>
                  </InputLabel>
                  <PhoneInput
                    country="in"
                    containerStyle={{ height: 45, width: "100%", marginBottom: "0.5rem" }}
                    inputStyle={{ height: 45, width: "100%" }}
                    searchClass="search-class"
                    enableSearch
                    disableSearchIcon
                    countryCodeEditable={false}
                    value={fields.phone}
                    onChange={(phone) => phoneInputHandler(phone)}
                    onKeyDown={handleFormSubmit}
                  />
                  <div className="d-flex flex-wrap justify-content-between">
                    <div>
                      {error && error?.phone && (
                        <span className="text-danger">{error?.phone}</span>
                      )}
                    </div>
                    <div className="text-end colors">
                      <span onClick={registerWithHandler}>
                        {isEmail === true ? "Register with mobile" : "Register with email"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* <div className="text-end colors me-1">
                <span onClick={registerWithHandler}>
                 {isEmail === true ?"Login with phone":"Login with email"}
                </span>
              </div> */}

              <div className="input_container mb-3">
                <InputLabel style={{ color: "var(--product-text-color)" }}>
                  Password
                  <span className="text-danger">*</span>
                </InputLabel>
                <TextField
                  style={{ backgroundColor: "var( --light-gray-color)" }}
                  placeholder={"Enter your password"}
                  id="outlined-size-small"
                  size="small"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={fields.password}
                  InputProps={{
                    endAdornment: showPassword ? (
                      <VisibilityOff
                        style={{
                          cursor: "pointer",
                          color: "var(--gray-color)",
                        }}
                        position="end"
                        onClick={showPasswordHandler}
                      />
                    ) : (
                      <Visibility
                        style={{
                          cursor: "pointer",
                          color: "var(--gray-color)",
                        }}
                        position="end"
                        onClick={showPasswordHandler}
                      />
                    ),
                  }}
                  inputRef={passwordRef}
                  onChange={inputHandler}
                  onKeyDown={handleFormSubmit}
                />
                {error && error?.password && (
                  <span className="text-danger">{error?.password}</span>
                )}
                {fields.password ? (
                  <div>
                    Password must have at least 6 character
                    <div
                      style={{
                        backgroundColor:
                          fields.password.length >= 6
                            ? "var(--green-color)"
                            : "var(--red-color)",
                        height: 5,
                        width: 150,
                      }}
                    ></div>
                  </div>
                ) : null}
              </div>
              <div className="input_container mb-3">
                <InputLabel style={{ color: "var(--product-text-color)" }}>
                  Confirm password
                  <span className="text-danger">*</span>
                </InputLabel>
                <TextField
                  style={{ backgroundColor: "var( --light-gray-color)" }}
                  placeholder={"Enter your password"}
                  id="outlined-size-small"
                  size="small"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={fields.confirmPassword}
                  InputProps={{
                    endAdornment: showConfirmPassword ? (
                      <VisibilityOff
                        style={{
                          cursor: "pointer",
                          color: "var(--gray-color)",
                        }}
                        position="end"
                        onClick={confirmPasswordHandler}
                      />
                    ) : (
                      <Visibility
                        style={{
                          cursor: "pointer",
                          color: "var(--gray-color)",
                        }}
                        position="end"
                        onClick={confirmPasswordHandler}
                      />
                    ),
                  }}
                  inputRef={confirmPasswordRef}
                  onChange={inputHandler}
                  onKeyDown={handleFormSubmit}
                />
                {error && error?.confirmPassword && (
                  <span className="text-danger">{error?.confirmPassword}</span>
                )}
                {fields.confirmPassword ? (
                  <div
                    style={{
                      marginLeft: 0,
                      margin: 5,
                      backgroundColor:
                        fields.confirmPassword === fields.password
                          ? "var(--green-color)"
                          : "var(--red-color)",
                      height: 5,
                      width: 150,
                    }}
                  ></div>
                ) : null}
              </div>
              <div className="forget_password text-right d-flex flex-wrap justify-content-between">
                <p
                  // className=" forget_password text-right"
                  className="heading_para"
                  style={{ display: "inline", float: "right", cursor: "pointer" }}
                  onClick={() => navigate("/forgotpassword")}
                >
                  Forget password?
                </p>
                <p
                  className="colors"
                  onClick={() => navigate("/resendverification")}
                >
                  Resend OTP</p>
              </div>
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
                  Register
                </Button>
                <div className="orDIvider">
                  <hr />
                  <p>OR</p>
                  <hr />
                </div>
                <div className="login_container">
                  <p className="heading_para">
                    Already a user? <span onClick={signInHandler}>Sign in</span>
                  </p>
                </div>
              </div>
            </div>
          </>
        </CardWithTwoSection>
      )}
    </>
  );
};

export default Registration;
