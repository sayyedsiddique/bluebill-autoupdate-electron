import { Auth } from "aws-amplify";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";
import Splash from "./Splash.png";
import { Button } from "@mui/material";
import { PopUp } from "../../utils/constantFunctions";

const ForgotPassVarification = (props) => {
  // const [isLoaded,setIsLoaded]=useState(false)
  const [isLoading,setIsLoading]=useState(false)
  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [blankCode, setblankCode] = useState("");
  const [blankpassword, setblankpassword] = useState("");
  const [blankConfPswd, setblankConPswd] = useState("");

  const Location = useLocation();
  // const { userName } = Location.state;

  // for set password and OTP for verification
  const passwordVerificationHandler = async () => {
   
    if (verificationCode === "") {
      setblankCode("please enter Otp");
      return;
    } else if (password === "") {
      setblankpassword("please enter new password");
      return;
    } else if (confirmPassword === "") {
      setblankConPswd("please enter confirm password");
      return;
    } else if (password !== confirmPassword) {
      setblankConPswd("please enter correct password");
      return;
    }
    setIsLoading(true)
    try {
     let Response=await Auth.forgotPasswordSubmit(Location?.state && Location?.state?.userName, verificationCode, password);
     if(Response){
      setIsLoading(false)
      const recall=()=>{
        props.navigate("/")
      }
      PopUp(null,"Your password changed successfully",false,"OK",recall)
     
      }
      
    } catch (error) {
      setIsLoading(false)
      Swal.fire({
        title: error.message,
        confirmButtonColor: "var(--light-blue-color)",
      });
    }
  };
  return (
    <section className='fup-login-section'>
    {isLoading?<LoadingSpinner/>:
      <div className="fup-login-wrapper"
      >
        <div style={{ textAlign: "center" }}>
          <img src={Splash} alt="blueBill logo" />
        </div>
        <div
          style={{
            fontSize: 20,
            fontWeight: "bold",
            marginBottom: 10,
            color: "var(--main-bg-color)",
          }}
        >
          Set new passowrd
        </div>
        <div style={{ marginBottom: "0.5rem" }}>
          <p>
            Please enter the verification code sent to your email <br />
            address below, your email address and a new password.
          </p>
        </div>
        <div>
          <form >
            <div className="field">
              <div></div>
              <p className="control">
                <input
                  maxLength={6}
                  type="text"
                  className="input-field"
                  id="verificationcode"
                  aria-describedby="verificationCodeHelp"
                  placeholder="Enter verification code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                />
                {blankCode ? (
                  <span
                    style={{ color: "var(--red-color)", display: "flex", width: "100%" }}
                  >
                    {blankCode}
                  </span>
                ) : null}
              </p>
            </div>
            <div className="field">
              <p className="control has-icons-left">
                <input
                  maxLength={16}
                  className="input-field"
                  type="password"
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {blankpassword ? (
                  <span
                    style={{ color: "var(--red-color)", display: "flex", width: "100%" }}
                  >
                    {blankpassword}
                  </span>
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
                  type="password"
                  maxLength={16}
                  className="input-field"
                  id="newpassword"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {blankConfPswd ? (
                  <span
                    style={{ color: "var(--red-color)", display: "flex", width: "100%" }}
                  >
                    {blankConfPswd}
                  </span>
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
            </form>
            <div className="field">
              <p className="control">
                <Button
                              variant="contained"
                              onClick={passwordVerificationHandler}
                              style={{
                                backgroundColor: "var(--button-bg-color)",
                                color: "var(--button-color)",
                                marginTop:10,
                                fontsize: " 22px",
                                width: "100%",
                              }}
                            >
                              Submit
                            </Button>
              </p>
            </div>
          
        </div>
      </div>
    }
    </section>
  );
};
export default ForgotPassVarification;
