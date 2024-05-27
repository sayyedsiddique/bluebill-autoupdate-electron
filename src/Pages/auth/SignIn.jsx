import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Button, InputLabel, TextField } from "@mui/material";
import React, { useRef, useState } from "react";
import "./SignIn.css";
import { HiOutlineDevicePhoneMobile } from "react-icons/hi2";
import { HiOutlineMail } from "react-icons/hi";
import PhoneInput from "react-phone-input-2";
import { useNavigate } from "react-router-dom";
import CardWithTwoSection from "../../Components/RegistrationCard/CardWithTwoSection";
import UserUsingLaptopImg from "../../assets/images/PersonUsingLaptop.png";
import { useDispatch, useSelector } from "react-redux";
import { Amplify } from "aws-amplify";
import { authLoading, signInAuth } from "../../Redux/authSlice/authSlice";
import { AwsConfig, storeObjInLocalStrg } from "../../Containts/Values";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const [showPassword, seShowPassword] = useState(false); // to hide and show password
  let isLoading = useSelector((state) => state.auth.loading);
  const [isEmail, setIsEmail] = useState(true);

  const [fields, setFields] = useState({
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState({
    email: "",
    password: "",
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
    setError({ ...error, email: "", phone: "", password: "" });
    setIsEmail(!isEmail);
  };

  //   Sign up handler navigate to registration page
  const signUpHandler = () => {
    navigate("/register");
  };

  // Forgot user password handler to navigate user on forgot password page
  const forgotUserPassHandler = () => {
    navigate("/forgotpassword");
  };

  const showPasswordHandler = () => {
    seShowPassword(!showPassword);
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
      setError({ ...error, password: "Please enter 6 digit password" });
      passwordRef.current.focus();
      return false;
    }
    return true;
  };

// Enter key press form sumbission
  const handleFormSubmit = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  // for final submission of login
  const handleSubmit = async () => {
    const isValid = validation();
    if (isValid) {
      let UserNm =
        isEmail === true ? fields.email.toLowerCase() : "+" + fields.phone;
      dispatch(
        signInAuth(UserNm, fields.password, handleSetErr, handleNavigate, handleResponse)
      );
    }
  };

  const handleSetErr = (message) => {
    setError({ ...error, password: message });
  }

  const handleNavigate = (nav) => {
    navigate(nav);
  }
  //  foe final response
  const handleResponse = () => {
    navigate("/");
    window.location.reload();
  };

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <CardWithTwoSection>
          <div className="registration_leftside">
            {/* <h1>LEFT SIDE</h1> */}
            <img src="Images/PersonUsingLaptop.png" alt="signin leftside image" />
          </div>
          <div className="registration_right">
            <h1 className="heading_h1">Welcome back</h1>
            <h5 className="heading_h5">Sign in to your account</h5>

            <div className="login_with_container">
              <p className="pe-2">Sign in with</p>
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
                  inputRef={emailRef}
                  onChange={inputHandler}
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
                      {isEmail === true ? "Sign in with mobile" : "Sign in with email"}
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
                  name="phone"
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
                      {isEmail === true ? "Sign in with mobile" : "Sign in with email"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* <div className="text-end">
                <span className="colors me-1" onClick={registerWithHandler}>
                 {isEmail === true ?"Login with phone":"Login with email"}
                </span>
            </div> */}

            <div className="input_container">
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
                value={fields.password}
                type={showPassword ? "text" : "password"}
                InputProps={{
                  endAdornment: showPassword ? (
                    <VisibilityOff
                      style={{ cursor: "pointer", color: "var(--gray-color)" }}
                      position="end"
                      onClick={showPasswordHandler}
                    />
                  ) : (
                    <Visibility
                      style={{ cursor: "pointer", color: "var(--gray-color)" }}
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
            </div>

            <div
              className="forget_password text-right" ><p
                className="heading_para"
                style={{ display: "inline", float: "right", marginTop: '5px', marginBottom: "10px" }}
                onClick={() => navigate("/forgotpassword")}
              >
                Forget password?
              </p>
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
                Sign in
              </Button>
              <div className="orDIvider">
                <hr />
                <p>OR</p>
                <hr />
              </div>
              <div className="login_container">
                <p className="heading_para">
                  You don't have an account?{" "}
                  <span onClick={signUpHandler}>Sign up</span>
                </p>
              </div>
            </div>
          </div>
        </CardWithTwoSection>
      )}
    </>
  );
};

export default SignIn;
