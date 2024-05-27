import React, { useState } from "react";
import Splash from "./Splash.png";
import PhoneInput from "react-phone-input-2";
import { Amplify, Auth } from "aws-amplify";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";
import { AwsConfig } from "../../Containts/Values";
import { Button } from "@mui/material";

const ResendOtpLink = (props) => {
  const[isLoading,setIsLoading]=useState(false)
  const [email, setemail] = useState("");
  const [phone, setPhone] = useState("");
  const [isEmail, setIsEmail] = useState(true);
  const [blankUserName, setblankUserName] = useState("");
  const navigate = useNavigate()

  Amplify.configure(AwsConfig(isEmail))

  // for Resend OTP with validation
  const ReSendOtpdHandler = async (event) => {
    event.preventDefault();
    if (
      (email === "" && isEmail === false) ||
      (phone === "" && isEmail === true)
    ) {
      setblankUserName("Please enter username");
      return;
    }
    setIsLoading(true)
    try {
      let userNm = isEmail===true? "+" + phone : email.toLowerCase();
       let responce=await Auth.resendSignUp(userNm);
         if(responce.data !== null){
          navigate("/otpscreen", {
            state: {
              signUpResponse: userNm,
             },
           });
         }
      
         setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.log(error);
      setblankUserName(error.message);
    }
  };

  // for login change 
  const loginChange = () => {
    setIsEmail(!isEmail);
  };

  return (
    <section className="fup-login-section">
        {isLoading?<LoadingSpinner/>:
      <div className="fup-login-wrapper">
        <div className="fup-login-head">Resend OTP</div>
        <div className="fup-fp-img login-img-container text-center mb-5">
          <img src={Splash} alt="blueBill logo" />
        </div>

        <form >
          {isEmail ? (
            <PhoneInput
              country={"in"}
              value={phone}
              containerStyle={{
                backgroundColor: "white",
                width: "100%",
                borderRadius: 5,
              }}
              enableSearch
              disableSearchIcon
              countryCodeEditable={false}
              onChange={(phone) => setPhone(phone)}
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
                  onChange={(e) => setemail(e.target.value)}
                />
                <span className="icon is-small is-left">
                </span>
              </span>
            </div>
          )}
          {blankUserName ? (
            <p style={{ color: "var(--red-color)", marginTop: "10px", marginBottom: 0 }}>
              {blankUserName}
            </p>
          ) : null}
          <br></br>
          <span
            className="fup-login-changer colors"
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
                onClick={ReSendOtpdHandler}
                style={{
                  backgroundColor: "var(--button-bg-color)",
                  color: "var(--button-color)",
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
      }
    </section>
  );
};

export default ResendOtpLink;
