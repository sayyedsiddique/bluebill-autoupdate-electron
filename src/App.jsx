import React, { useEffect, useState } from "react";
import Routing from "./Routes/index";
import { useDispatch, useSelector } from "react-redux";
import { setInternetValue } from "./Redux/CheckInternet/CheckInternet";
import { KeyGenAccountId, STORE_Id } from "./Containts/Values";
import {
  generateToken,
  generateTokenOnly,
  getCurrenUTCTime,
  getLicenseDetails,
  getMachineDetails,
  validateLicenseKey,
} from "./Redux/LicenseSlice/licenseSlice";
import { validateLicense } from "./utils/constantFunctions";
import AlertpopUP from "./utils/AlertPopUP";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Auth } from "aws-amplify";
import { Modal, ModalBody } from "reactstrap";
import LoadingSpinner from "./Components/LoadingSpinner/LoadingSpinner";
import ThreeDotLoader from "./Components/LoadingSpinner/ThreeDotLoader";

function App() {
  const [networkStatus, setNetworkStatus] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const deviceFingerPrint = window.getDeviceFingerPrint;

  const isOnline = useSelector((state) => state.checkInternet.isOnline);
  console.log("isOnline ", isOnline);
  const machineDetails = useSelector((state) => state.license.machineDetails);
  console.log("machineDetails", machineDetails);


  const licenseDetailsData = useSelector(
    (state) => state.license.licenseDetails
  );
  console.log("licenseDetailsData... ", licenseDetailsData);
  const [licenseDetails, setLicenseDetails] = useState();
  console.log("licenseDetails... ", licenseDetails);
  const [modalOpen, setModalOpen] = useState(false);

  const handleLogOut = async () => {
    // setIsLoaded(true);
    try {
      await Auth.signOut();
      // props.auth(false)
      // localStorage.clear();
      localStorage.removeItem("userToken");
      localStorage.removeItem("loggedIn");
      navigate("/");
      window.location.reload();
      // setIsLoaded(false);
    } catch (error) {
      alert(error.message);
    }
  };


  useEffect(() => {
    // let fingerPrinter;
    async function fetchData() {
      // Check if machineDetails has value
      if (!machineDetails) {
        console.log("MAC Machine details are not available yet.");
        return;
      }

      // You can await here
      let fingerPrinter = await deviceFingerPrint?.getMachineId();
      console.log("fingerPrinter... ", fingerPrinter?.fingerPrint);
      console.log(
        "fingerPrinterM... ",
        machineDetails?.attributes?.fingerprint
      );

      if (
        fingerPrinter?.fingerPrint &&
        machineDetails?.attributes?.fingerprint === fingerPrinter?.fingerPrint
      ) {
        console.log("MAC User login into same machine");
      } else {
        console.log("MAC User not login into same machine");
        Swal.fire({
          title: "Alert",
          text: "You are logged in on a different machine",
          showCancelButton: false,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, logout it!",
          allowOutsideClick: false,
        }).then((data) => {
          if (data.isConfirmed) {
            // Here we deleting all sqlite data
            if (isOnline) {
              handleLogOut();
            } else {
              // deleteAllSqliteDataApi?.deleteAllSqliteDataHandler();
              handleLogOut();
            }
          }
        });
      }
    }
    // console.log("fingerPrinter... ", fingerPrinter);
    fetchData();
  }, [machineDetails]);

  useEffect(() => {
    let machineId = deviceFingerPrint?.getMachineId();
    console.log("machineId... ", machineId);
  }, []);
  // Storing license details in state and calling valid license details keygen api
  useEffect(() => {
    licenseDetailsData && setLicenseDetails(licenseDetailsData);
    // console.log("licenseDetailsData... ", licenseDetailsData)
    const payload = {
      licenseKey: licenseDetailsData?.licensekey,
    };
    payload?.licenseKey && dispatch(validateLicenseKey(payload));
  }, [licenseDetailsData]);

  // Calling get machine details api
  useEffect(() => {
    // Getting machine details
    if (!machineDetails) {
      licenseDetailsData?.machineId &&
        dispatch(getMachineDetails(licenseDetailsData?.machineId));
    }
  }, [licenseDetailsData]);

  // Getting License details from server
  useEffect(() => {
    let storeId = STORE_Id;
    console.log("storeId... ", storeId);
    storeId && dispatch(getLicenseDetails(storeId));
    storeId && dispatch(getCurrenUTCTime());
  }, []);

  useEffect(() => {
    // debugger
    console.log("normalchala");
    // first time it goes into else condition because isOfflineOnly value doesn't have
    if (licenseDetails?.isOfflineOnly === 0) {
      console.log("onlineChala");
      window.addEventListener("online", function (e) {
        // TODO for offline license user add new flag isOfflineOnly
        setNetworkStatus(true);
        dispatch(setInternetValue(true));
      });
    } else {
      console.log("offlineChala");
      window.addEventListener("offline", function (e) {
        setNetworkStatus(false);
        dispatch(setInternetValue(false));
      });
    }
  }, [licenseDetails?.isOfflineOnly]);

  // life time user has completely offline functionality
  useEffect(() => {
    if (licenseDetailsData?.isOfflineOnly === 1) {
      // it means user has offline feature
      setNetworkStatus(false);
      dispatch(setInternetValue(false));
    } else {
      setNetworkStatus(true);
      dispatch(setInternetValue(true));
    }
  }, [licenseDetailsData]);

  return (
    <React.Fragment>
      <Routing />
    </React.Fragment>
  );
}

export default App;
