import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { HashRouter } from 'react-router-dom';
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from '@react-oauth/google';

import "./index.css";
import App from "./App";
// import { store2 } from "./Redux/store2";
// import store1 from "./Store/store1";
import { Amplify } from "aws-amplify";
import config from "./config";
import store from "./Redux/rootReducer";
import { AwsConfig, ClientId } from "./Containts/Values";

import "./services/i18n";

// Amplify.configure({
// 	Auth:{
// 		mandatorySignId:true,
// 		region:config.cognito.REGION,
// 		userPoolId:config.cognito.USER_POOL_ID,
// 		userPoolWebClientId:config.cognito.APP_CLIENT_ID
// 	}
// });

Amplify.configure(AwsConfig());

ReactDOM.render(
  <HashRouter>
  <GoogleOAuthProvider clientId={ClientId}>
    <Provider store={store}>
      <Suspense fallback="loading">
        <App />
      </Suspense>
    </Provider>
    </GoogleOAuthProvider>
  </HashRouter>,
  document.getElementById("root")
);
