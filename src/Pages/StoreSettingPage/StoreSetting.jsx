import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";
import {
  DELETE_IMAGE,
  getTocken,
  retrieveObj,
  SERVER_URL,
  STOREDETAILS,
  STORE_Id,
  TimeConveter,
  UPLOAD_PROD_IMG,
} from "../../Containts/Values";
import { getstoreData } from "../../Redux/StoreSetting/storeSettingSlice";
import { apiConfig } from "../../utils/constantFunctions";
import MainContentArea from "../MainContentArea/MainContentArea";
import "./StoreSetting.css";

const StoreSettingScreen = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const navigete = useNavigate();
  const dispatch = useDispatch();
  const storeReduxData = useSelector((state) => state.storeSetting.storeData);
  console.log("storeReduxData", storeReduxData);
  const [storeData, setStoreData] = useState("");
  const [storeName, setStoreName] = useState("");

  const [openTime, setOpenTime] = useState("");
  const [closeTime, setCloseTime] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [imageFile, uploadImg] = useState([]);
  const [cognitoUserName, setCognitoUserName] = useState("");

  useEffect(() => {
    setIsLoaded(true);
    retrieveObj("cognitoUserInfo").then((cognito) => {
      setCognitoUserName(cognito.username);
      console.log(cognito);
    });
    // getStoreData();

    dispatch(getstoreData());
    setIsLoaded(false);
  }, []);

  useEffect(() => {
    setStoreData(storeReduxData[0]);
    let OpTime = storeReduxData[0]?.shopOpenTime
      ? Number.parseInt(storeReduxData[0]?.shopOpenTime)
      : 0;
    let ClTime = storeReduxData[0]?.shopCloseTime
      ? Number.parseInt(storeReduxData[0]?.shopCloseTime)
      : 0;
    setStoreName(storeReduxData[0]?.storeName);
    setOpenTime(OpTime);
    setCloseTime(ClTime);
    setImageUrl(storeReduxData[0]?.imageUrl);
  }, [storeReduxData]);

  // const getStoreData = async () => {
  //   setIsLoaded(true);
  //   let userToken = localStorage.getItem("userToken");
  //   const config = {
  //     timeout: 10000,
  //     headers: {
  //       Accept: "application/json",
  //       "Content-Type": "application/json",
  //       Authorization: "Bearer " + userToken,
  //     },
  //   };
  //   try {
  //     let response = await axios.get(`${SERVER_URL}${STOREDETAILS}`, config);
  //     console.log("storeData", JSON.stringify(response));
  //     if (response.data !== null && response.data !== undefined) {
  //       SetApiData(response);
  //     } else {
  //       setIsLoaded(false);
  //     }

  //     setIsLoaded(false);
  //   } catch (error) {
  //     setIsLoaded(false);
  //     alert(error.message);
  //   }
  // };

  // const SetApiData = (data) => {
  //   let OpTime = data.data[0]?.shopOpenTime
  //     ? Number.parseInt(data.data[0].shopOpenTime)
  //     : 0;
  //   let ClTime = data.data[0]?.shopCloseTime
  //     ? Number.parseInt(data.data[0].shopCloseTime)
  //     : 0;
  //   setStoreData(data.data[0]);
  //   setStoreName(data.data[0].storeName);
  //   setOpenTime(OpTime);
  //   setCloseTime(ClTime);
  //   setImageUrl(data.data[0].imageUrl);
  // };

  const HandleEdit = () => {
    navigete("/storeedit", {
      state: { editData: storeData },
    });
  };

  const handleDeleteImg = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonColor: "var(--light-blue-color)",
      cancelButtonColor: "var(--red-color)",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        var data = new FormData();

        data.append("imageId", 0);
        data.append("isStoreImage", 1);
        data.append("storeId", STORE_Id);
        data.append("imageName", imageUrl);
        data.append("userName", cognitoUserName);

        console.log("Img Delete Data", JSON.stringify(data));
        deleteImageFromServer(data);
      }
    });
  };

  const deleteImageFromServer = async (postData) => {
    //    loading need to be added
    // let config = apiConfig(`${SERVER_URL}${DELETE_IMAGE}`, "put");

    // console.log("config: " + JSON.stringify(config));

    try {
      let Response = await axios.put(`${SERVER_URL}${DELETE_IMAGE}`, postData);
      console.log("Response", Response);
      // getStoreData()
    } catch (error) {
      alert("error", error.message);
    }
  };

  const handleUploadImg = () => {
    let data = new FormData();

    let files = imageFile[0][0];
    console.log(files);

    data.append("file", files, files.name);
    data.append("storeId", STORE_Id);
    data.append("imageId", 0);
    data.append("productId", 0);
    data.append("storeName", storeName);
    data.append("isProductDefaultImage", 0);
    data.append("isStoreImage", 1);
    data.append("userName", cognitoUserName);
    data.append("updateImageName", "");

    console.log("upload from phone" + JSON.stringify(data));
    uploadeImageTOServer(data);
  };

  const uploadeImageTOServer = async (postData) => {
    // let config = apiConfig(`${SERVER_URL}${UPLOAD_PROD_IMG}`, "post", postData);

    // console.log("config: " + JSON.stringify(config));

    try {
      let Response = await axios.post(
        `${SERVER_URL}${UPLOAD_PROD_IMG}`,
        postData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${getTocken()}`,
          },
        }
      );
      console("Response", Response);
    } catch (error) {
      console.log("Error: ", error);
      alert("error", error.message);
    }
  };

  const imgFilehandler = (e) => {
    if (e.target.files.length !== 0) {
      uploadImg([e.target.files]);
    }
  };

  return (
    <MainContentArea>
      {isLoaded ? (
        <LoadingSpinner />
      ) : (

        <div className="cartMain">
          <div className=" detailsContainer">
            <div className="store-details col-lg-12 col-12 ">
              <div className="col-12 cart">
                <h4>Store</h4>
                <div
                  className="col-lg-12 col-12"
                  style={{ marginBottom: "10px" }}
                >
                  <label htmlFor="formControl" className="form-label">
                    Upload Image{" "}
                  </label>
                  <div className="col-6 img-file">
                    <input
                      type="file"
                      className="form-control img-input mb-4"
                      placeholder="Upload product Image"
                      onChange={imgFilehandler}
                    />
                  </div>
                  <hr />

                  <div style={{ marginBottom: "10px", width: "auto" }}>
                    <div style={{ marginBottom: "10px" }} className="img-box">
                      {imageFile.length > 0 ? (
                        <div>
                          <h2>Preview</h2>
                          <span>
                            <img
                              src={URL.createObjectURL(imageFile[0][0])}
                              height="200"
                              width="200"
                              alt="med1"
                            />
                          </span>
                        </div>
                      ) :
                        <img
                          src={imageUrl}
                          alt="store Image"
                          width="100%"
                          height="100%"
                          className="ImageContainer"
                        />
                      }
                    </div>
                    <span className="btn-container">
                      <button
                        className="btn btn-primary mb-1 del-btn"
                        onClick={handleDeleteImg}
                        style={{
                          background: " var(--main-bg-color)",
                          marginTop: "15px",
                          marginRight: "5px",
                        }}
                      >
                        delete Image
                      </button>
                      <button
                        className="btn btn-primary mb-1  changeImg-btn"
                        onClick={handleUploadImg}
                        style={{
                          background: " var(--main-bg-color)",
                          marginTop: "15px",
                        }}
                      >
                        Change Image
                      </button>
                    </span>
                  </div>
                </div>
                Store Id: {STORE_Id}
                <br />
                Store Name: {storeData && storeData.storeName}
                <br />
                GST Number: {storeData && storeData.gstNumber}
                <br />
                Currency: {storeData && storeData.currencyName}
                <br />
                Home Delivery :{" "}
                {storeData && storeData.homeDelivery ? "Available" : "Not available"}
                <br />
                Minimum order limit: {storeData && storeData.currencyName}{" "}
                {storeData && storeData.miniOrderLimit}
                <br />
                Free delivery within:{" "}
                {storeData && storeData.withInDistance
                  ? storeData.withInDistance
                  : "Not Set"}
                <br />
                Store opening time :
                {openTime ? TimeConveter(openTime) : "Not set"}
                <br />
                Store closing time :
                {closeTime ? TimeConveter(closeTime) : "Not set"}
                <br />
                Store close day :{" "}
                {storeData && storeData.shopCloseDay ? storeData.shopCloseDay : "Not Set"}
              </div>
              <div className="cart">
                <h4 className="label-font">Address</h4>
                Area :{" "}
                {storeData && storeData.address !== null ? storeData.address : "Not Set"}
                <br />
                City : {storeData && storeData.city !== null ? storeData.city : "Not Set"}
                <br />
                Pincode :{" "}
                {storeData && storeData.pinCode !== null ? storeData.pinCode : "Not Set"}
                <br />
                Latitude :{" "}
                {storeData && storeData?.latitude !== null ? storeData.latitude : 0}
                <br />
                Longitude :{" "}
                {storeData && storeData?.longitude !== null ? storeData.longitude : 0}
                <br />
              </div>
              <div className="cart">
                <h4 className="label-font">Contact</h4>
                Mobile :{" "}
                {storeData && storeData.mobileNumber !== null
                  ? storeData.mobileNumber
                  : "Not Set"}
                <br />
                Email Id :
                {storeData && storeData?.email !== null ? storeData.email : "Not Set"}
                <br />
                Customer ID :
                {storeData && storeData?.customerId !== null ? storeData.customerId : 0}
                <br />
              </div>
            </div>
            <div>
              <button
                className="btn btn-primary mb-1 editButton "
                onClick={HandleEdit}
                style={{
                  background: " var(--main-bg-color)",
                  marginTop: "15px",
                }}
              >
                Edit Details
              </button>
            </div>
          </div>
        </div>

      )}
    </MainContentArea>
  );
};

export default StoreSettingScreen;
