import React, { useState } from "react";
import "./Storepage.css";
import StorePage from "./StorePage";
import SaveStoreAddress from "./SaveStoreAddress";
import StoreCreatorSummery from "./StoreCreatorPage";

const steps = ["Add Store Info", "Store Address Confirmation", "Store Summary"];

const StoreMainComponent = () => {
  const [activeStep, setActiveStep] = useState(0);

  const [fields, setFields] = useState({
    storeName: "",
    countryName: "",
    storeType: "",
    addressObj: "",
    address: "",
  });

  const [storeImageFile, setStoreImageFile] = useState([]);
  const [fullAddObj, setFullAddObj] = useState("");

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };



  const HandleStorPageData = (obj) => {
    // console.log("countryNameobj",obj.countryName);
    setFields({
      ...fields,
      storeName: obj.storeName,
      countryName: obj.countryName,
      storeType: obj.storeType,
      addressObj: obj.addressObj,
      address: obj.address,
    });
    setStoreImageFile(obj.img);
    handleNext();
  };
 

  const HandleSaveStoreAdd = (obj) => {
    setFullAddObj(obj);
    handleNext();
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <>
      {/* Render the page content based on the active step */}
      {activeStep === 0 && (
        <StorePage
          steps={steps}
          activeStep={activeStep}
          fields={fields}
          HandleStorPageData={HandleStorPageData}
          storeImageFile={storeImageFile}
        />
      )}
      {activeStep === 1 && (
        <SaveStoreAddress
          steps={steps}
          activeStep={activeStep}
          getBack={handleBack}
          addressObj={fields?.addressObj}
          address={fields?.address}
          storeImageFile={storeImageFile}
          HandleSaveStoreAdd={HandleSaveStoreAdd}
          countryName={fields?.countryName}
        />
      )}
      {activeStep === 2 && (
        <StoreCreatorSummery
          steps={steps}
          activeStep={activeStep}
          getBack={handleBack}
          storeObj={fields}
          addObj={fullAddObj}
          storeImageFile={storeImageFile}
        />
      )}
    </>
  );
};

export default StoreMainComponent;
