import { Button } from "@mui/material";
import React, { useState } from "react";
import "./SignIn.css";
import { useLocation, useNavigate } from "react-router-dom";
import CardWithTwoSection from "../../Components/RegistrationCard/CardWithTwoSection";
import OtpInput from "react-otp-input";
// import OTPImg from "../../assets/images/OTPImg.jpg";
import { useDispatch, useSelector } from "react-redux";
import { ConfirmSignUpAuth } from "../../Redux/authSlice/authSlice";
import { PopUp } from "../../utils/constantFunctions";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";

const OtpPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const Location = useLocation();
  const isLoading = useSelector((state) => state.auth.loading);

  const [Otp, setOtp] = useState("");
  const [errOtp, setErrOtp] = useState("");

  // to set OTP input value
  const handleOtp = (otp) => {
    setErrOtp("");
    let validate = otp.match(/^(\d*\.{0,1}\d{0,2}$)/);
    if (validate) {
      setOtp(otp);
    }
  };

  const validation = () => {
    if (Otp === "") {
      setErrOtp("Please enter verification code");
      return false;
    } else if (Otp.length < 6) {
      setErrOtp("Please enter 6 digit verification code");
      return false;
    }
    return true;
  };

  // for set new user password
  const handleSubmit = () => {
    const val = validation();
    if (val) {
      dispatch(
        ConfirmSignUpAuth(
          Location?.state && Location?.state?.signUpResponse,
          Otp,
          handleErr,
          handleSuccess
        )
      );
    }
  };

  // to set api error
  const handleErr = (err) => {
    setErrOtp(err);
  };

  const handleSuccess = () => {
    const recall = () => {
      navigate("/signin");
    };
    PopUp(null, "Your account create successfully", false, "OK", recall);
  };

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <CardWithTwoSection>
          <div className="registration_leftside">
            <img src="Images/OTPImg.jpg" alt="signin leftside image" />
          </div>
          <div className="registration_right">
            <h1 className="heading_h1">Verification</h1>
            <div className="heading_h5">
              <h5>Please enter the OTP received on your email/phone.</h5>
              <span style={{ fontSize: "1rem" }}>
                Enter the OTP received on your email : <strong>{Location?.state?.signUpResponse}</strong>
              </span>
            </div>

            <div className="input_container mb-3">
              <OtpInput
                numInputs={6}
                containerStyle={{ width: "auto" }}
                inputStyle={{
                  width: "70%",
                  border: "1px solid gray",
                  borderRadius: "5px",
                  height: "60px",
                  fontSize: "x-large",
                }}
                value={Otp}
                onChange={(otp) => handleOtp(otp)}
                separator={<span style={{ width: 8 }}></span>}
              />
              {errOtp ? <span className="text-danger">{errOtp}</span> : null}
            </div>

            <div className="mt-2 d-flex" style={{ textAlign: "right", gap: "1rem" }}>
              <Button
                className="btn me-2 UB-btn"
                style={{
                  width: "100%",
                  background: "var(--white-color)",
                  color: " var(--main-bg-color)",
                  fontSize: "1.1rem",
                  letterSpacing: "1px",
                  border: " 2px solid  var(--main-bg-color)",

                }}
                onClick={() => navigate("/register")}
              >
                Back
              </Button>

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
                Submit OTP
              </Button>


            </div>
          </div>
        </CardWithTwoSection>
      )}
    </>
  );
};

export default OtpPage;
