import React from "react";
import { GoogleLogin } from "react-google-login";

const ClientId =
  "466377967251-qf130ciqpffq77jdkmaru6s6ups69mgc.apps.googleusercontent.com";

const GoogleAuthLogin = () => {
  const onSuccess = (res) => {
    console.log("LOGIN SUCCESS! current user:", res.profileObj);
  };

  const onFaliure = (res) => {
    console.log("LOGIN FAILED! res:", res);
  };
  return (
    <div>
      <GoogleLogin
        clientId={ClientId}
        buttonText="Login"
        onSuccess={onSuccess}
        onFailure={onFaliure}
        cookiePolicy={"single_host_origin"}
      />
    </div>
  );
};

export default GoogleAuthLogin;
