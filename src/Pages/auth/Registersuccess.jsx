import { Auth } from "aws-amplify";
import React, { useState } from "react";
import OtpInput from "react-otp-input";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";
import Splash from "./Splash.png";
import { Button } from "@mui/material";
import { PopUp } from "../../utils/constantFunctions";

const RegisterSuccess = () => {
  const navigate=useNavigate()
  const [isLoading, setIsLoading] = useState(false);
  const Location = useLocation();
  const [Otp, setOtp] = useState("");
  const [errOtp,setErrOtp]=useState('')

  // const { signUpResponse } = Location.state;
  
  // for final submission of registeration success and validation of OTP length
  const handleSubmit = async () => {
    if (Otp.length < 6) {
      setErrOtp("please enter 6 Digit Otp recive on you");
      return;
    }
    setIsLoading(true)
    try {
      const Response = await Auth.confirmSignUp(Location?.state && Location?.state?.signUpResponse, Otp, {
        forceAliasCreation: true,
      });
      if (Response && Response === "SUCCESS") {
        setIsLoading(false)
        // Swal.fire("Registration Successful");
        PopUp(null,"Registration Successful",false,"OK",recall)
        // PopUp(null,"Please Select Sales Executive",false,"OK")
       
      } else {
        Swal.fire("please try again");
      }
    } catch (error) {
      setIsLoading(false)
     setErrOtp(error.message)
    }
  };
  
const recall=()=>{
  navigate('/signin')
}
  

  // set OTP
  const handleOtp=(otp)=>{
    setErrOtp('')
    setOtp(otp)
  }
  
  return (
   


<section className="fup-login-section">
        {isLoading?<LoadingSpinner/>:
      <div className="fup-login-wrapper">
        <div className="fup-login-head">Registration</div>
        <div className="fup-fp-img login-img-container text-center mb-5">
          <img src={Splash} alt="blueBill logo" />
        </div>

       
        
            <div className="field">
              <span className="control has-icons-left has-icons-right">
                <p className="mb-3 text-center">Please enter the OTP received on your email/phone.</p>
                <OtpInput
                 numInputs={6}
                containerStyle={{width:'auto'}}
                inputStyle={{ width: '70%',border:'1px solid gray',borderRadius:'20px',height:'60px',fontSize:'x-large'}}
                
                value={Otp}
                onChange={(otp)=>handleOtp(otp)}
                 separator={<span style={{width:8}}></span>}
                />{
                  errOtp?<span className="text-danger">{errOtp}</span>:null
                }
             
              </span>
            </div>
         
         
          <div className="field" style={{ marginTop: 40 }}>
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
                 Submit OTP
              </Button>
            </p>
            
          </div>
       
      </div>
      }
    </section>



   
  );
};
export default RegisterSuccess;
