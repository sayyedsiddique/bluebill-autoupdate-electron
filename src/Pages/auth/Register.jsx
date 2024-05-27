import React, { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "./login.css";
import "react-phone-input-2/lib/style.css";
import { Amplify, Auth, Hub } from "aws-amplify";
import { useNavigate } from "react-router-dom";
import Splash from "./Splash.png";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";
import { AwsConfig } from "../../Containts/Values";
import SignInWithGoogle from "../../Components/GoogleAuth/SignInWithGoogle";
import jwt_decode from "jwt-decode";
import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth";
import { Button } from "@mui/material";


const Register = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isEmail, setIsEmail] = useState(true);
  const [emailBlank, setemailBlank] = useState("");
  const [userName, setuserName] = useState("");
  const [emailValidate, setemailValidate] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneBlank, setphoneBalnk] = useState("");
  const [phoneValidate, setPhoneValidate] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordBlank, setPasswordBlank] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPassBlank, setconfirmPassBlank] = useState("");
  const [user, setUser] = useState(null);

  // console.log("user ", user);

  useEffect(() => {
    let config = AwsConfig(isEmail);

    Amplify.configure(config);
  }, [isEmail]);

  // Sign in with google
  useEffect(() => {
    const unsubscribe = Hub.listen("auth", ({ payload: { event, data } }) => {
      switch (event) {
        case "signIn":
          setUser(data);
          break;
        case "signOut":
          setUser(null);
          break;
        case "customOAuthState":
        // setCustomState(data);
      }
    });

    Auth.currentAuthenticatedUser()
      .then((currentUser) => setUser(currentUser))
      .catch(() => console.log("Not signed in"));

    return unsubscribe;
  }, []);

  const handleErrorHidePswd = (e) => {
    setPasswordBlank("");
    setPassword(e.target.value);   
  }

  const handleErrorHidePswdconfrm = (e) => {
    setconfirmPassBlank("");
    setConfirmPassword(e.target.value)  
  }

  const validatePhone = (phone) => {
    const phoneRegex = /^[1-9]\d{10,14}$/;
    return phoneRegex.test(phone);
  };

  // final submissiion of login with validations
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (phoneValidate === false && isEmail === true) {
      setphoneBalnk("Please enter phone number");
      return;
    } else if (!validatePhone(phoneValidate) && isEmail === true) {
      setphoneBalnk("Please enter a valid phone number");
      return false;
    } 
    else if (emailValidate === false && isEmail === false) {
      setemailBlank("Please enter correct email id");
      return;
    } else if (password === "") {
      setPasswordBlank("Please enter Password");
      return;
    } else if (password.length < 6) {
      setPasswordBlank("Please enter minimum 6 characters");
      return;
    } else if (confirmPassword === "") {
      setconfirmPassBlank("Please enter correct password");
      return;
    } else if (password !== confirmPassword) {
      alert("Please enter Same password");
      return;
    }

    const phn = "+" + phone;
    const UserName = isEmail ? phn : userName.toLowerCase();
    console.log("UserName ", UserName);
    setIsLoading(true);
    try {
      const signUpResponse = await Auth.signUp({
        username: UserName,
        password,
        attributes: {
          email: isEmail ? "" : UserName,
          phone_number: isEmail ? phn : "",
        },
      });
      if (signUpResponse != null) {
        setIsLoading(false);
        navigate("/otpscreen", {
          state: {
            signUpResponse: signUpResponse.user.username,
          },
        });
      }
    } catch (error) {
      console.log("Error: " + JSON.stringify(error));
      setIsLoading(false);
      alert(error.message);
    }
  };

  // validations for email and phone number
  const validate = (text, type) => {
    var email =
      /^([a-zA-Z\d.-_]+)@([a-zA-Z\d-]+)\.([a-zA-Z]{2,8})(\.[a-zA-Z]{2,8})?$/;
    var num = /^\d{10,10}$/;

    if (type === "phone") {
      if (num.test(text)) {
        setPhoneValidate(true);
        setPhone(text);
        setphoneBalnk("");
      } else {
        setPhoneValidate(true);
        setphoneBalnk("");
        setPhone(text);
      }
    } else if (type === "email") {
      if (email.test(text)) {
        setemailValidate(true);
        setuserName(text);
        setemailBlank("");
      } else {
        setemailValidate(false);
        setemailBlank("");
        setuserName(text);
      }
    }
  };

  // for login change 
  const loginChnage = () => {
    setIsEmail(!isEmail);
  };

  const loginSuccessHandler = (credentialResponse) => {
    console.log(credentialResponse);
    const decoded = jwt_decode(credentialResponse?.credential);

    console.log("decoded ", decoded);

    // try {
    //   const signUpResponse = Auth.signUp({
    //     username: UserName,
    //     password,
    //     attributes: {
    //       email: isEmail ? "" : UserName,
    //       phone_number: isEmail ? phn : "",
    //     },
    //   });
    //   if (signUpResponse != null) {
    //     setIsLoading(false);
    //     navigate("/otpscreen", {
    //       state: {
    //         signUpResponse: signUpResponse.user.username,
    //       },
    //     });
    //   }
    // } catch (error) {
    //   console.log("Error: " + JSON.stringify(error));
    //   setIsLoading(false);
    //   alert(error.message);
    // }
  };

  const loginErrorHandler = () => {
    console.log("Login Failed");
  };

  return (
    <section className="fup-login-section">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="fup-login-wrapper">
          <div className="fup-login-head">Register</div>

          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <img src={Splash} alt="blueBill logo" />
          </div>

          <form >
            {isEmail ? (
              <div className="field ">
                <p className="control ">
                  <PhoneInput
                    country="in"
                    containerStyle={{ height: 45, width: "100%" }}
                    inputStyle={{ height: 45, width: "100%" }}
                    searchClass="search-class"
                    enableSearch
                    disableSearchIcon
                    countryCodeEditable={false}
                    value={phone}
                    onChange={(phone) => validate(phone, "phone")}
                  />
                </p>
                {phoneBlank ? (
                  <p
                    style={{
                      color: "var(--red-color)",
                      marginTop: "10px",
                      marginBottom: 0,
                    }}
                  >
                    {phoneBlank}
                  </p>
                ) : null}
              </div>
            ) : (
              <div className="field ">
                <p className="control m-0">
                  <input
                    style={{ width: "100%" }}
                    className="input-field"
                    type="text"
                    id="username"
                    aria-describedby="userNameHelp"
                    placeholder="Enter username"
                    value={userName}
                    onChange={(e) => validate(e.target.value, "email")}
                  />
                </p>
                {emailBlank ? (
                  <p
                    style={{
                      color: "var(--red-color)",
                      marginTop: "10px",
                      marginBottom: 0,
                    }}
                  >
                    {emailBlank}
                  </p>
                ) : null}
              </div>
            )}

            <div className="register">
              <p className="control colors">
                <span onClick={loginChnage}>
                  Register Using {isEmail ? " Email " : " Phone "}
                </span>
              </p>
            </div>
            <div className="field">
              <p className="control has-icons-left">
                <input
                  style={{ width: "100%" }}
                  className="input-field"
                  maxLength={16}
                  type="password"
                  id="password"
                  placeholder="Password"
                  value={password}
                  // onChange={(e) => setPassword(e.target.value)}
                  onChange={handleErrorHidePswd}
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-lock"></i>
                </span>
                {passwordBlank ? (
                  <p
                    style={{
                      color: "var(--red-color)",
                      marginTop: "10px",
                      marginBottom: 0,
                    }}
                  >
                    {passwordBlank}
                  </p>
                ) : null}
                {password ? (
                  <div style={{ marginLeft: 8 }}>
                    Password must have at least 6 character
                  </div>
                ) : password.length >= 6 ? (
                  <div
                    style={{
                      backgroundColor: "var(--green-color)",
                      height: 5,
                      width: 150,
                      margin: 10,
                    }}
                  ></div>
                ) : null}
                {password.length < 6 && password ? (
                  <div
                    style={{
                      backgroundColor: "var(--red-color)",
                      height: 5,
                      width: 150,
                      margin: 10,
                    }}
                  ></div>
                ) : password.length >= 6 ? (
                  <div
                    style={{
                      backgroundColor: "var(--green-color)",
                      height: 5,
                      width: 150,
                      margin: 10,
                    }}
                  ></div>
                ) : null}
              </p>
            </div>

            <div className="field">
              <p className="control has-icons-left">
                <input
                  style={{ width: "100%" }}
                  className="input-field"
                  maxLength={16}
                  type="password"
                  id="confirmpassword"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  // onChange={(e) => setConfirmPassword(e.target.value)}
                  onChange={handleErrorHidePswdconfrm}
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-lock"></i>
                </span>
                {confirmPassBlank ? (
                  <p
                    style={{
                      color: "var(--red-color)",
                      marginTop: "10px",
                      marginBottom: 0,
                    }}
                  >
                    {confirmPassBlank}
                  </p>
                ) : null}
                {confirmPassword && confirmPassword === password ? (
                  <div
                    style={{
                      margin: 10,
                      backgroundColor: "var(--green-color)",
                      height: 5,
                      width: 150,
                    }}
                  ></div>
                ) : null}
                {confirmPassword && confirmPassword !== password ? (
                  <div
                    style={{
                      margin: 10,
                      backgroundColor: "var(--red-color)",
                      height: 5,
                      width: 150,
                    }}
                  ></div>
                ) : null}
              </p>
            </div>
            <div className="field">
              <p className="control colors">
                <span onClick={() => navigate("/forgotpassword")}>
                  Forgot password?
                </span>
              </p>
            </div>
            </form>
            <div className="field">
              <p className="control">
                <Button
                variant="contained"
                onClick={handleSubmit}
                style={{
                  backgroundColor: "var(--button-bg-color)",
                  color: "var(--button-color)",
                  fontsize: " 22px",
                  width: "100%",
                }}
              >
                Register
              </Button>
              </p>
            </div>
         
          <div className="field fup-login-btn-container">
            <div className="field" style={{ marginTop: 15, cursor: "pointer" }}>
              <p className="control colors">
                <span
                  className=""
                  onClick={() => navigate("/resendverification")}
                >
                  Resend Otp
                </span>
              </p>
            </div>
            <div
              className="field"
              style={{
                marginTop: 15,
                cursor: "pointer",
                marginBlockEnd: -100,
              }}
            >
              <p className="control colors">
                <span
                  type="link"
                  style={{
                    fontSize: 15,
                  }}
                  onClick={() => navigate("/signin")}
                >
                  Sign in
                </span>
              </p>
            </div>
          </div>
        </div>
        // <div className="signInDiv w-100 text-center">
        //   <SignInWithGoogle
        //         successHandler={loginSuccessHandler}
        //         ErrorHandler={loginErrorHandler}
        //       />

        //   <button
        //     onClick={() =>
        //       Auth.federatedSignIn({ provider: "Google" })
        //     }
        //   >
        //     Open Google
        //   </button>
        // </div>
      )}
    </section>
  );
};

export default Register;
