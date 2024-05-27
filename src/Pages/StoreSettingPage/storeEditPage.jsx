import axios from "axios";
import React, { useState } from "react";
import './storeEditPage.css';
import { useLocation, useNavigate } from "react-router-dom";
import { ADDSTORE, getUTCDate, SERVER_URL, STORE_Id, TimeConveter } from "../../Containts/Values";
import MainContentArea from "../MainContentArea/MainContentArea";
import ChangeAddressPage from "./changeAddressPage";

import { getToken } from "../../utils/constantFunctions";

import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import LoadingSpinner from "../../Components/LoadingSpinner/LoadingSpinner";
import Swal from "sweetalert2";
import Select from 'react-select';
import { CUSTOM_DROPDOWN_STYLE } from "../../utils/CustomeStyles";


const weekDays = [
  { id: "1", value: "Monday" },
  { id: "2", value: "Tuesday" },
  { id: "3", value: "Wednesday" },
  { id: "4", value: "Thursday" },
  { id: "5", value: "Friday" },
  { id: "6", value: "Saturday" },
  { id: "7", value: "Sunday" },
];
const StoreEditPage = () => {
  const navigate=useNavigate()
  const location = useLocation();
  const { editData } = location.state;
  const [isLoaded,setIsLoaded]=useState(false)
  const [error, setError] = useState({ storeName: "", address: "", city: "" });
  const [storeName, setStoreName] = useState(editData?.storeName);
  const [gstNumber, setGstNumber] = useState(editData?.gstNumber);
  const [miniOrdLimit, setMiniOrdLimit] = useState(editData?.miniOrderLimit);
  const [deliveryCharge, setDeliveryCharge] = useState(
    editData?.deliveryCharges
  );
  const [withInDistance, setWithInDistance] = useState(
    editData?.withInDistance
  );

  let findCloseDay=weekDays.find((item)=>{
    return item.value===editData?.shopCloseDay
  })
  const [storeClose, setStoreClose] = useState(findCloseDay);
  const [address, setAddress] = useState(editData?.address);
  const [city, setCity] = useState(editData?.city);
  const [lat, setLat] = useState(editData?.latitude);
  const [lon, setLon] = useState(editData?.longitude);
  const [pinCode, setPinCode] = useState(editData?.pinCode);
  const [mobile, setMobile] = useState(editData?.mobileNumber);
  const [email, setEmail] = useState(editData?.email);
  const [homeDelivery, setHomeDelivery] = useState(editData?.homeDelivery);
  const [mapVisible, setMapVisible] = useState(false);
  const [shopOpenTime, setShopOpenTime] = useState(
    new Date(parseInt(editData?.shopOpenTime)).getTime()
  );
  const [shopCloseTime, setShopCloseTime] = useState(
    new Date(parseInt(editData?.shopCloseTime)).getTime()
  );


  //   const [distanceValue, setDistance] = useState("");
  //   const [info, setInfo] = useState("");
  //   const [infoBackground, setInfoBackground] = useState("");
  //   const [disable, setDisable] = useState("");
  //   const [disableBackground, setDisableBackground] = useState("");
  console.log('shopOpenTime', shopOpenTime);
  console.log('shopOpenTime', editData?.shopOpenTime);

  console.log("address", address);
  console.log(editData);
  console.log("shopCloseDay", storeClose);



  const saveMapAddreObj = (addressObj, address) => {
    console.log("addressObj", addressObj);
    setAddress(address);
    setCity(addressObj.city);
    setLat(addressObj.lat);
    setLon(addressObj.lng);
    setPinCode(addressObj.pinCode);
  };

  // const handlekmButton=()=> {
  //     if (info == "#000000") {

  //         setInfo("#00529B")
  //         setDistance("KM")
  //         setInfoBackground("#004A66")
  //         setDisable("#000000")
  //         setDisableBackground("#ffffff")

  //     }
  // }
  // const handleMilesButton=()=> {
  //     if (info == "#00529B") {
  //         setInfo("#000000")
  //         setDistance("MILES")
  //         setInfoBackground("#ffffff")
  //         setDisable("#00529B")
  //         setDisableBackground("#004A66" )

  //     }
  // }

  const validation = () => {
    if (storeName==='' ) {
      setError({ ...error, storeName: "Please enter store name" });
      return false;
    } else if (address==='') {
      setError({ ...error, address: "Please enter please inter area" });
      return false;
    } else if (city==='') {
      setError({ ...error, city: "Please enter city" });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {

    const val = validation();
    if(val){
      setIsLoaded(true)
    let postData = {
      storeId: STORE_Id,
      storeName: storeName,
      gstNumber: gstNumber,
      address: address,
      city: city,
      pinCode: pinCode,
      latitude: lat,
      longitude: lon,
      mobileNumber: mobile,
      email: email,
      customerId: editData?.customerId,
      currencyName: editData?.currencyName,
      homeDelivery: homeDelivery,
      miniOrderLimit: miniOrdLimit,
      deliveryCharges: deliveryCharge,
      shopOpenTime: shopOpenTime,
      shopCloseTime: shopCloseTime,
      shopCloseDay: storeClose?.value,
      withInDistance: withInDistance,
      lastUpdate: getUTCDate(),
    };

    console.log("##Post  Data", postData);
    try {
      let Response = await axios.post(`${SERVER_URL}${ADDSTORE}`, postData, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      if(Response.data!==null){
        console.log(Response.data);
        setIsLoaded(false)
        Swal.fire({
          icon: "success",
          title: "store saved successfully!",
        }).then((res) => {
          if (res?.isConfirmed) {
            navigate('/storesetting')
          }
        });
      }
    } catch (error) {
      setIsLoaded(false)
      console.log('error',error.message)
     }
    }
  };

  const handleSetAddress = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setAddress(value)
    
    setError({ ...error, [name]: "" });
  };

  const handleSetCity = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setCity(value)
    
    setError({ ...error, [name]: "" });
  };

  const handleStoreName = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setStoreName(value)
    
    setError({ ...error, [name]: "" });
  };
  return (
    <MainContentArea>
      {isLoaded?<LoadingSpinner/>:
      <div className="page-scroll">
      {mapVisible ? (
        <ChangeAddressPage
          lat={lat}
          lon={lon}
          add={address}
          saveMapAddreObj={saveMapAddreObj}
          setMapVisible={setMapVisible}
          setAddress={setAddress}
          setCity={setCity}
        />
      ) : (
        <div>
          <div className="store-EditDetails">
          <div className="cart cart-container">
            <h3 className="headings">Store Information</h3>

            Store Id : {STORE_Id}
            <br />
            <div className="row">
              <div className="col-5  mb-4">
                <label htmlFor="formControl" className="form-label required">
                  Store Name :
                </label>
                <input
                  type="text"
                  className="form-control input-fields"
                  placeholder="Store Name"
                  name="storeName"
                  value={storeName}
                  onChange={handleStoreName}
                />
                {error.storeName ? (
                      <span className="text-danger">{error.storeName}</span>
                    ) : null}
              </div>
            </div>
            <div className="row">
              <div className="col-5">
                <label htmlFor="formControl" className="form-label">
                  Gst Number :
                </label>
                <input
                  type="text"
                  className="form-control mb-4 input-fields"
                  placeholder="GST Number"
                  value={gstNumber}
                  onChange={(e) => {
                    setGstNumber(e.target.value);
                  }}
                />
              </div> 
            </div>
            <div className="row ">
            <div className="col-5"style={{marginLeft:'3px'}}>
                <label  className="form-label">
                Currency :
                </label>
                {editData?.currencyName}
              </div> 
            </div>
            <div className="row">
              <div className="form-check-reverse form-switch ps-3 ">
                <label className="form-check-label fs-5 headings">Home Delivery</label>
                <input
                  className="form-check-input btn-lg ms-3 toggle-btn"
                  type="checkbox"
                  checked={homeDelivery}
                  onClick={() => setHomeDelivery(!homeDelivery)}
                />

                {homeDelivery ? (
                  <div className="row mt-3">
                    <div className="row">
                      <div className="col-5">
                        <label htmlFor="formControl" className="form-label">
                          Minimum Order Limit:
                        </label>
                        <input
                          type="text"
                          className="form-control mb-4 input-fields"
                          placeholder="Minimum Order Limit"
                          value={miniOrdLimit}
                          onChange={(e) => {
                            setMiniOrdLimit(e.target.value);
                          }}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-5">
                        <label htmlFor="formControl" className="form-label">
                          Delivery Charge:
                        </label>
                        <input
                          type="text"
                          className="form-control mb-4 input-fields"
                          placeholder="Delivery Charge"
                          value={deliveryCharge}
                          onChange={(e) => {
                            setDeliveryCharge(e.target.value);
                          }}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-5">
                        <label htmlFor="formControl" className="form-label">
                          Free Delivery within:
                        </label>
                        <input
                          type="text"
                          className="form-control mb-4 input-fields"
                          placeholder="Delivery Charge"
                          value={withInDistance}
                          onChange={(e) => {
                            setWithInDistance(e.target.value);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ):null }
              </div>
            </div>
            <div className="row">
              <div className="col-5"style={{marginBottom:'15px'}}>
                <label htmlFor="formControl" className="form-label">
                  Store Open Time:
                </label><br/>
                <LocalizationProvider dateAdapter={AdapterDayjs}>

                  <TimePicker className="time-picker"
                    value={shopOpenTime}
                    onChange={(newValue) => {
                      setShopOpenTime(new Date(newValue).getTime());
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </div>
            </div>
            <div className="row">
              <div className="col-5"style={{marginBottom:'15px'}}>
                <label htmlFor="formControl" className="form-label">
                  Store Close Time:
                </label><br/>
                <LocalizationProvider dateAdapter={AdapterDayjs}>

                  <TimePicker className="time-picker"
                    value={shopCloseTime}
                    onChange={(newValue) => {
                      setShopCloseTime(new Date(newValue).getTime());
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </div>
            </div>
            <div className="row">
              <div className="col-5">
                <label htmlFor="formControl" className="form-label">
                  Store Close day
                </label>
               
                <Select
                  // placeholder={<div className="select-tax">Select brand</div>}
                  placeholder="Select day"
                  getOptionLabel={(weekDays) =>
                    weekDays?.value
                  }
                  options={weekDays}
                  styles={CUSTOM_DROPDOWN_STYLE}
                  // value={storeClose}
                  onChange={(e) => {
                    setStoreClose(e);
                  }}
                  isClearable
                />
              </div>
              <n />
            </div>
          </div>
          <div className="cart cart-container">
            <h3 className="headings">Address</h3>
            <div className="row">
              <div className="col-5  mb-4">
                <label htmlFor="formControl" className="form-label required">
                  Area:
                </label>
                <input
                  type="text"
                  className="form-control input-fields"
                  placeholder="Area"
                  name="address"
                  value={address}
                  onChange={handleSetAddress}
                />
                 {error.address ? (
                      <span className="text-danger">{error.address}</span>
                    ) : null}
              </div>
            </div>
            <div className="row">
              <div className="col-5 mb-4">
                <label htmlFor="formControl" className="form-label required">
                  City:
                </label>
                <input
                  type="text"
                  className="form-control  input-fields"
                  placeholder="City"
                  name="city"
                  value={city}
                  onChange={handleSetCity}
                />
                 {error.city ? (
                      <span className="text-danger">{error.city}</span>
                    ) : null}
              </div>
            </div>
            <div className="row">
              <div className="col-5">
                <label htmlFor="formControl" className="form-label">
                  Latitude :
                </label>
                {lat}
              </div>
            </div>
            <div className="row">
              <div className="col-5">
                <label htmlFor="formControl" className="form-label">
                  Latitude :
                </label>
                {lon}
              </div>
            </div>

            <span
              onClick={() => setMapVisible(true)}
              style={{ textDecoration: "underline", color: "var(--light-blue-color)",cursor:'pointer' }}
            >
              {" "}
              Change address
            </span>
          </div>
          <div className="cart cart-container">
            <h3 className="headings">Contact</h3>
            <div className="row">
              <div className="col-5">
                <label htmlFor="formControl" className="form-label">
                  Mobile:
                </label>
                <input
                  type="text"
                  className="form-control mb-4 input-fields"
                  placeholder="Mpbile"
                  value={mobile}
                  disabled
                  onChange={(e) => {
                    setMobile(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-5">
                <label htmlFor="formControl" className="form-label">
                  Email:
                </label>
                <input
                  type="text"
                  className="form-control mb-4 input-fields"
                  placeholder="Email"
                  value={email}
                  disabled
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-5">
                <label htmlFor="formControl" className="form-label">
                  Customer ID :
                </label>
                {editData?.customerId}
              </div>
            </div>
          </div>
          </div>
          <div>
            <button
              className="btn btn-primary mb-1 editButton "
              onClick={handleSubmit}
              style={{ background: " var(--main-bg-color)", marginTop: "15px" }}
            >
              Save Changed
            </button>
          </div>
          
        </div>
      )}
      </div>}
    </MainContentArea>
  );
};

export default StoreEditPage;
