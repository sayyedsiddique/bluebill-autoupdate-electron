import React from "react";
import { GoogleLogout } from "react-google-login";

const ClientId =
  "466377967251-qf130ciqpffq77jdkmaru6s6ups69mgc.apps.googleusercontent.com";

const GoogleAuthLogout = () => {
  const onSuccess = (res) => {
    console.log("Logout SUCCESSFULL");
  };

  return (
    <div>
      <GoogleLogout
        clientId={ClientId}
        buttonText="Logout"
        onLogoutSuccess={onSuccess}
      ></GoogleLogout>
    </div>
  );
};

export default GoogleAuthLogout;
