import React, { useState } from "react";
import Splash from "./Splash.png";
import PhoneInput from "react-phone-input-2";
import { Amplify, Auth } from "aws-amplify";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";
import { AwsConfig } from "../../Containts/Values";
import { Button } from "@mui/material";

const ForgotPassword = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setemail] = useState("");
  const [phone, setPhone] = useState("");
  const [isEmail, setIsEmail] = useState(true);
  const [blankUserName, setblankUserName] = useState("");
  const [error, setError] = useState({ email: "", phone: "" });

  Amplify.configure(AwsConfig(isEmail));


  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[1-9]\d{10,14}$/;
    return phoneRegex.test(phone);
  };

  const validation = () => {
    let isValid = true;

    if (isEmail) {
      if (!phone || !validatePhone(phone)) {
        setError({
          ...error,
          phone: !phone ? "Please enter a phone number" : "Please enter a valid phone number",
        });
        isValid = false;
      } else {
        setError({ ...error, phone: "" });
      }
    } else {
      if (!email || !validateEmail(email)) {
        setError({
          ...error,
          email: !email ? "Please enter an email" : "Please enter a valid email",
        });
        isValid = false;
      } else {
        setError({ ...error, email: "" });
      }
    }

    return isValid;
  };
  

  const handleEmailChange = (e) => {
    setemail(e.target.value);
    setError({ ...error, email: "" });
  };

  const handlePhoneChange = (phone) => {
    setPhone(phone);
    setError({ ...error, phone: "" });
  };

  // for forgot the password or email
  const forgotPasswordHandler = async (event) => {
    event.preventDefault();

    const isValidate = validation();
    if (!isValidate) {
      return;
    }

    // if (
    //   (email === "" && isEmail === false) ||
    //   (phone === "" && isEmail === true)
    // ) {
    //   setblankUserName("Please enter username");
    //   return;
    // }
    setIsLoading(true);
    try {
      let userNm = isEmail === true ? "+" + phone : email.toLowerCase();
      await Auth.forgotPassword(userNm);
      setIsLoading(false);
      props.navigate("/forgotpasswordverification", {
        state: {
          userName: userNm,
        },
      });
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      setblankUserName(error.message);
    }
  };
   
  // for change loagin 
  const loginChange = () => {
    setIsEmail(!isEmail);
    localStorage.setItem("isPhone", !isEmail);
    setError({  email: "", phone: "" }); // Reset error messages
  };

  return (
    <section className="fup-login-section">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="fup-login-wrapper">
          <div className="fup-login-head">Forgot your password?</div>
          <div className="login-img-container text-center mb-5">
            <img src={Splash} alt="blueBill logo" />
          </div>
          <form>
            {isEmail ? (
              <PhoneInput
                country={"in"}
                containerStyle={{
                  backgroundColor: "var(--white-color)",
                  width: "100%",
                  borderRadius: 5,
                }}
                enableSearch
                disableSearchIcon
                countryCodeEditable={false}
                value={phone}
                onChange={handlePhoneChange}
                // onChange={(phone) => setPhone(phone)}
                inputStyle={{ height: 45, marginBottom: 13, width: "100%" }}
              />
            ) : (
              <div className="field">
                <span className="control has-icons-left has-icons-right">
                  <input
                    type="email"
                    className="input-field"
                    style={{ marginBottom: 0 }}
                    aria-describedby="emailHelp"
                    placeholder="Enter email"
                    value={email}
                    onChange={handleEmailChange}
                    // onChange={(e) => setemail(e.target.value)}
                  />
                  <span className="icon is-small is-left"></span>
                </span>
              </div>
            )}

            {error.email && (
              <p
                style={{
                  color: "var(--red-color)",
                  marginTop: "10px",
                  marginBottom: 0,
                }}
              >
                {error.email}
              </p>
            )}
            {error.phone && (
              <p
                style={{
                  color: "var(--red-color)",
                  marginTop: "10px",
                  marginBottom: 0,
                }}
              >
                {error.phone}
              </p>
            )}
             {blankUserName ? (
              <p
                style={{
                  color: "var(--red-color)",
                  marginTop: "10px",
                  marginBottom: 0,
                }}
              >
                {blankUserName}
              </p>
            ) : null}
            <br/>

            {/* {blankUserName ? (
              <p
                style={{
                  color: "var(--red-color)",
                  marginTop: "10px",
                  marginBottom: 0,
                }}
              >
                {blankUserName}
              </p>
            ) : null}
            <br></br> */}
            <span
              className="fup-login-changer"
              style={{ color: "var(--light-blue-color)" }}
              onClick={() => loginChange()}
            >
              {isEmail === true
                ? "Set password via email"
                : "Set password via phone"}
            </span>
          </form>
          <div className="field" style={{ marginTop: 10 }}>
            <p className="control">
              <Button
                variant="contained"
                onClick={forgotPasswordHandler}
                style={{
                  backgroundColor: "var(--button-bg-color)",
                  color: "var(--button-color)",
                  marginTop: 10,
                  fontsize: " 22px",
                  width: "100%",
                }}
              >
                Submit
              </Button>
            </p>
            <p className="fup-fp-bottom-text">
              Please enter the email address OR phone associated
              <br /> with your account and we'll send confirmation code.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default ForgotPassword;
