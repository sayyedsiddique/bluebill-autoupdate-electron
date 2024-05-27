import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Button,
  InputLabel,
  TextField,
} from "@mui/material";
import React, { useRef, useState } from "react";
import "./SignIn.css";
import { useLocation, useNavigate } from "react-router-dom";
import CardWithTwoSection from "../../Components/RegistrationCard/CardWithTwoSection";
import ForgetPass2 from '../../assets/images/forgetpass2.jpg'
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";
import { PopUp } from "../../utils/constantFunctions";
import { SetNewPasswordAuth } from "../../Redux/authSlice/authSlice";

const ForgetPasswordVerification = () => {
  const navigate = useNavigate();
  const dispatch =useDispatch()
  const Location = useLocation();
  const isLoading=useSelector((state)=>state.auth.loading)

  const verificationRef=useRef(null)
  const passwordRef =useRef(null)
  const confirmPasswordRef =useRef(null)

  const [showPassword, seShowPassword] = useState(false);
  const [showConfirmPassword, seShowConfirmPassword] = useState(false);

  // to set input value
  const [fields, setFields] = useState({
   verification:"",
    password: "",
    confirmPassword: "",
  });

  // to set error
  const [error, setError] = useState({
    verification:"",
    password: "",
    confirmPassword: "",
  });

   // to set values in input fields
   const inputHandler = (e) => {
    console.log(e.target.value)
    const name = e.target.name;
    const value = e.target.value;
    setError({ ...error, [name]: "" });

    if (name === "verification") {
      let validate = value.match(/^(\d*\.{0,1}\d{0,2}$)/);
      if (validate) {
        setFields({ ...fields, [name]: value });
      }
    } else {
      setFields({ ...fields, [name]: value });
    }

  };

  const showPasswordHandler = () => {
    seShowPassword(!showPassword);
  };

  const confirmPasswordHandler = () => {
    seShowConfirmPassword(!showConfirmPassword)
  }

  const validation=()=>{
    if (fields.verification === "") {
      setError({...error,verification:"Please enter verification code"})
      verificationRef.current.focus();
      return false;
    }else if (fields.verification.length <6) {
      setError({...error,verification:"Please enter 6 digit verification code"})
      verificationRef.current.focus();
      return false;
    } else if (fields.password === "") {
      setError({...error,password:"Please enter new password"})
      passwordRef.current.focus();
      return false;
    }else if (fields.password.length < 6) {
      setError({ ...error, password: "Please enter minimum 6 characters" });
      passwordRef.current.focus();
      return false;
    } else if (fields.confirmPassword === "") {
      setError({...error,confirmPassword:"Please enter confirm password"})
      confirmPasswordRef.current.focus();
      return false;
    } else if (fields.password !== fields.confirmPassword) {
      setError({...error,confirmPassword:"please enter same password"})
      confirmPasswordRef.current.focus();
      return false;
    }
    return true;
  }

  // for set new user password
  const handleSubmit=()=>{
    const val=validation()
    if(val){
      dispatch(SetNewPasswordAuth(Location?.state && Location?.state?.userName, fields.verification, fields.password,handleErr,handleSuccess))
    }
  }
  // to set api error
  const handleErr=(err)=>{
    setError({...error,verification:err})
  }

  const handleSuccess=()=>{
    const recall=()=>{
    navigate("/signin")
    }
    PopUp(null,"Your password changed successfully",false,"OK",recall)
  }
  return (
    <>
    {isLoading?<LoadingSpinner/>:
    <CardWithTwoSection>
    <div className="registration_leftside">
      {/* <h1>LEFT SIDE</h1> */}
      <img
        src={"Images/forgetpass2.jpg"}
        alt=""
      />
    </div>
    <div className="registration_right">
      <h1 className="heading_h1">Set new password</h1>
      {/* <h5 className="heading_h5">Sign in to your account</h5> */}
      <p className="heading_para">
        Please enter the verification code sent to your email address below,
        your email address and a new password.
      </p>

      <div className="input_container mb-3">
        <InputLabel style={{ color: "var(--product-text-color)" }}>
          Verification code
          <span className="text-danger">*</span>
        </InputLabel>
        <TextField
          style={{ backgroundColor: "var( --light-gray-color)" }}
          placeholder={"Enter your verification code"}
          id="outlined-size-small"
          size="small"
          name="verification"
          value={fields.verification}
          inputRef={verificationRef}
          onChange={inputHandler}
          inputProps={{ maxLength: 6 }}
        />
        {error && error?.verification && (
            <span className="text-danger">{error?.verification}</span>
          )}
      </div>

      <div className="input_container mb-3">
          <InputLabel style={{ color: "var(--product-text-color)" }}>
            New password
            <span className="text-danger">*</span>
          </InputLabel>
          <TextField
            style={{ backgroundColor: "var( --light-gray-color)" }}
            placeholder={"Enter your password"}
            id="outlined-size-small"
            size="small"
            name="password"
            value={fields.password}
            type={ showPassword ? "text" : "password"}
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
            value={fields.confirmPassword}
            type={ showConfirmPassword ? "text" : "password"}
            InputProps={{
              endAdornment: showConfirmPassword ? (
                <VisibilityOff
                  style={{ cursor: "pointer", color: "var(--gray-color)" }}
                  position="end"
                  onClick={confirmPasswordHandler}
                />
              ) : (
                <Visibility
                  style={{ cursor: "pointer", color: "var(--gray-color)" }}
                  position="end"
                  onClick={confirmPasswordHandler}
                />
              ),
            }}
            inputRef={confirmPasswordRef}
            onChange={inputHandler}
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
      </div>
    </div>
  </CardWithTwoSection>
    }
    </>
  );
};

export default ForgetPasswordVerification;
