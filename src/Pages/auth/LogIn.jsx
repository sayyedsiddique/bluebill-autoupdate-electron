import React, { useState, useEffect } from "react";
import { Amplify, Auth } from "aws-amplify";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import axios from "axios";
import { AwsConfig, SERVER_URL,storeObjInLocalStrg } from "../../Containts/Values";
import "./login.css";
import Splash from "./Splash.png";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { IconContext } from "react-icons";
import GoogleAuthLogin from "../../Components/GoogleAuth/GoogleAuthLogin";
import GoogleAuthLogout from "../../Components/GoogleAuth/GoogleAuthLogout";
import { gapi } from "gapi-script";
import SignInWithGoogle from "../../Components/GoogleAuth/SignInWithGoogle";
import { useDispatch, useSelector } from "react-redux";
import { authLoading, getUserInfo, getStoreInfo } from "../../Redux/authSlice/authSlice";

const ClientId =
  "466377967251-qf130ciqpffq77jdkmaru6s6ups69mgc.apps.googleusercontent.com";

const LogIn = () => {
  const dispatch=useDispatch()
  // const [isLoading, setIsLoading] = useState(false);
  let isLoading =useSelector((state)=>state.auth.loading)
  console.log("isLoading",isLoading)
  const [fields, setFields] = useState({ username: "", password: "", phone: "" });
  const [error, setError] = useState({ username: "", password: "", phone: "" });
  
  const [loginWithPhone, setLoginWithPhone] = useState(true);
  
  const navigate = useNavigate();
  
  Amplify.configure(
    AwsConfig(loginWithPhone)
  )

  // to hide and show password
  const [passShowHide, setPassShowHide] = useState(false);

  useEffect(() => {
    function start(){
      gapi.client.init({
        clientId: ClientId,
        scope: ""
      })
    }

    gapi.load("client:auth2", start)
  },[])

  const togglePassword = () => {
    setPassShowHide((prevState) => !prevState);
  };

  // for set values in input fields
  const inputHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFields({ ...fields, [name]: value });
    setError({ ...error, [name]: "" });
  };

  const phoneInputHandler = (value) => {
    setFields({ ...fields, phone: value });
    setError({ ...error, phone: "" });
  }

  // Api call of call user info
  const callUserInfo = async (userData) => {
    dispatch(getUserInfo(userData,SuccessInfoApi))
   

    // const userToken = userData.signInUserSession.idToken.jwtToken;

    // const config = {
    //   timeout: 10000,
    //   headers: {
    //     Accept: "application/json",
    //     "Content-Type": "application/json",
    //     Authorization: "Bearer " + userToken,
    //   },
    // };

    // try {
    //   let response = await axios.get(`${SERVER_URL}info/123`, config);

    //   var res = JSON.stringify(response.data);
      
    //   if (response.data !== null && response.data !== undefined) {
    //     storeObjInLocalStrg("storeUserInfo", response.data);
    //     checkUser(response.data, userData);
    //   }
    // } catch (error) {
    //   setIsLoading(false);
    //   window.location.reload();
    //   console.log(error);
    // }
  };

  const SuccessInfoApi=(data,userData)=>{
    storeObjInLocalStrg("storeUserInfo", data);
    checkUser(data, userData);
  }

  // for checking User exist or new
  const checkUser = async (customerInfo, cognitoUserInfo) => {
    if (customerInfo.status === "NEW_USER") {
      console.log("New user hai!")
      await localStorage.setItem(
        "tmpuserToken",
        cognitoUserInfo.signInUserSession.idToken.jwtToken
      );
      navigate("/storecreation");
      window.location.reload();
      // setIsLoading(false);
      dispatch(authLoading(false))
    } else if (customerInfo.status === "EXISTING_USER") {
    console.log("User Exist hai!")
      let token=cognitoUserInfo.signInUserSession.idToken.jwtToken;
      let storeId=customerInfo.stores[0]?.storeId;

      await localStorage.setItem("userToken",token);
      await localStorage.setItem("storeId",storeId);

      dispatch(getStoreInfo(token,storeId,handleResopnse))

      // const config = {
      //   headers: {
      //     Authorization: "Bearer " +  token,
      //   }
      // };

      // try {
      //       let response = await axios.get(`${SERVER_URL}store/getStore?storeId=${storeId}`, config);
      //       if (response.data !== null && response.data !== undefined) {
      //         storeObjInLocalStrg("storeInfo", response.data);
      //         await localStorage.setItem("StoreCurrency",  response.data[0].currencyName);
      //       }
      //     } catch (error) {
      //       alert(error.message);
      //     }
       
     
    
      // navigate("/");
      // window.location.reload();
    } else {
      window.location.reload();
      alert("Error from checkUser");
    }
  };


  const handleResopnse=()=>{
    dispatch(authLoading(true))   
     navigate("/");
      window.location.reload();
  }

  const loginChange = () => {
    setError({ ...error, username: "", phone: "" });
    setLoginWithPhone(!loginWithPhone);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[1-9]\d{10,14}$/;
    return phoneRegex.test(phone);
  };
  
  // for validations on input fields and show error massage
  const validation = () => {
    if (!fields.username && loginWithPhone === false) {
      setError({ ...error, username: "Please enter username" });
      return false;
    }  else if (loginWithPhone === false && !validateEmail(fields.username)) {
      setError({ ...error, username: "Please enter a valid email" });
      return false;
    }
    else if (!fields.phone && loginWithPhone === true) {
      setError({ ...error, phone: "Please enter phone number" });
      return false;
    }  else if (!validatePhone(fields.phone) && loginWithPhone === true) {
      setError({ ...error, phone: "Please enter a valid phone number" });
      return false;
    } 
    else if (!fields.password) {
      setError({ ...error, password: "Please enter password" });
      return false;
    }
    return true;
  };

  // for final submission of login
  const handleSubmit = async () => {
    const isValid = validation();

    if(isValid) {
    // setIsLoading(true);
    dispatch(authLoading(true))

      // AWS Cognito integration here
      try {
        let UserNm = loginWithPhone === true ? "+" + fields.phone : fields.username.toLowerCase();
        const user = await Auth.signIn(UserNm, fields.password);
        if (user !== null && user !== undefined) {
          storeObjInLocalStrg("cognitoUserInfo", user);
          localStorage.setItem("loggedIn", true);
          callUserInfo(user);
        }
       
      } catch (error) {
        if (error.message) {
          setError({ ...error, password : error.message});
          // setIsLoading(false);
          dispatch(authLoading(false))
          return;
        } else if (error.code === "NotAuthorizedException") {
          setError({ ...error, password : "Incorrect username or password." });
          // setIsLoading(false);
          dispatch(authLoading(false))
          return;
        }
      }
    }
  };

  const loginSuccessHandler = (credentialResponse) => {
    console.log(credentialResponse?.credential);
  }

  const loginErrorHandler = () => {
    console.log('Login Failed');
  }

  
  return (
    <section className="fup-login-section">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="fup-login-wrapper">
          <div className="fup-login-head">Log In</div>
          <div className="login-img-container text-center mb-5">
            <img src={Splash} alt="blueBill logo" />
          </div>
          <div>
            <div className="text-end colors">
              {loginWithPhone === true ? (
                <p style={{ margin: 8 }} onClick={() => loginChange()}>
                  Login with email
                </p>
              ) : (
                <p style={{ margin: 0 }} onClick={() => loginChange()}>
                  Login with phone
                </p>
              )}
            </div>
            <div className="field">
              <div className="control">
                {loginWithPhone ? (
                  <>
                  <PhoneInput
                    country={"in"}
                    value={fields.phone}
                    inputProps={{
                      name: 'phone',
                    }}
                    onChange={(phone) => phoneInputHandler(phone)}
                    containerStyle={{ height: 45, width: "100%" }}
                    inputStyle={{ height: 45, width: "100%" }}
                    countryCodeEditable={false}
                  />
                  {error.phone ? (
                      <span className="text-danger">{error.phone}</span>
                    ) : null}
                  </>
                ) : (
                  <>
                    <input
                      className="input-field "
                      type="text"
                      id="username"
                      aria-describedby="usernameHelp"
                      placeholder="Enter email"
                      value={fields.username}
                      name="username"
                      onChange={inputHandler}
                    />
                    {error.username ? (
                      <span className="text-danger">{error.username}</span>
                    ) : null}
                  </>
                )}
              </div>
            </div>

            <div className="field position-relative">
              <input
                className="input-field mt-4"
                type={passShowHide ? "text" : "password"}
                id="password"
                maxLength={16}
                placeholder="Password"
                value={fields.password}
                name="password"
                onChange={inputHandler}
              />
              <div className="position-absolute eye-containter">
                <button
                  className="eye-btn  bg-tranparent"
                  type="button"
                  onClick={() => togglePassword()}
                >
                  {passShowHide ? (
                    <IconContext.Provider value={{ size: "20px" }}>
                      <AiFillEye className="text-muted" />
                    </IconContext.Provider>
                  ) : (
                    <IconContext.Provider value={{ size: "20px" }}>
                      <AiFillEyeInvisible className="text-muted" />
                    </IconContext.Provider>
                  )}
                </button>
              </div>
              {error.password ? (
                <span className="text-danger">{error.password}</span>
              ) : null}
            </div>
            {/* <GoogleAuthLogin />
            <GoogleAuthLogout /> */}
            {/* <div className="signInDiv w-100 text-center">
              <SignInWithGoogle successHandler={loginSuccessHandler} ErrorHandler={loginErrorHandler} />
            </div> */}
            <button
              className="btn btn-primary login-btn mt-4"
              style={{
                background: "var(--main-bg-color)",
                color: "var(--white-color)",
                fontsize: " 22px",
                width: "100%",
              }}
              onClick={handleSubmit}
            >
              Login
            </button>

            <div className=" fup-login-btn-container">
              <div
                className="links-btn"
                style={{ marginTop: 15, cursor: "pointer" }}
              >
                <p className="control colors">
                  <span className="" onClick={() => navigate("/register")}>
                    New User
                  </span>
                </p>
              </div>
              <div
                className="field"
                style={{ marginTop: 15, cursor: "pointer" }}
              >
                <p className="control colors">
                  <span
                    type="link"
                    style={{
                      fontSize: 15,
                    }}
                    onClick={() => navigate("/forgotpassword")}
                  >
                    Forgot password?
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default LogIn;
