import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./MainContentArea.css";
import TrialNotification from "../../Components/TrialNotification/TrialNotification";
import { validateLicense } from "../../utils/constantFunctions";
import useLicenseValidation from "../../hooks/useLicenseValidation";
import SubscriptionPlanModal from "../../Components/TrialInformationCard/SubscriptionPlanModal";
import UpgradeNotificationCart from "../../Components/TrialNotification/UpgradeCart/UpgradeNotificationCart";

const MainContentArea = (props) => {
  const sidenavToggleState = useSelector(
    (state) => state.sidenavToggle.showMenu
  );
  const defaultLang = useSelector((state) => state.language.language);
  // console.log("defaultLang... ", defaultLang)
  const isLicenseValidate = useLicenseValidation();
  const isOnline = useSelector((state) => state.checkInternet.isOnline);
  const licenseDetailsData = useSelector(
    (state) => state.license.licenseDetails
  );
  // console.log("licenseDetailsData..7",licenseDetailsData);


  console.log("isLicenseValidate... ", isLicenseValidate);
  const [modalOpen, setModalOpen] = useState(false);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  //   Dashboard Container Class Change on menu toggle
  const mainContentAreaContainerClasses = sidenavToggleState
    ? "mainContentArea active"
    : "mainContentArea";

  const mainContentAreaContainerClassesAr = sidenavToggleState
    ? "mainContentArea-ar active"
    : "mainContentArea-ar";

  return (
    <div
      className={
        (defaultLang && defaultLang.name === "Arabic") ||
          defaultLang.name === "عربي"
          ? mainContentAreaContainerClassesAr
          : mainContentAreaContainerClasses
      }
      style={{ overflow: props.scroll ? `${props.scroll}` : "none" }}
    >
      {/* {isLicenseValidate?.licensePlan === "free" &&
        isLicenseValidate?.LeftDays >= 0 && (
          <TrialNotification
            isLicenseValidate={isLicenseValidate}
            showModalHandler={toggleModal}
          />
        )}

      {isOnline && ((isLicenseValidate?.licensePlan === "free" || !licenseDetailsData) ||
        (isLicenseValidate?.LeftDays <= 0 || !isLicenseValidate?.LeftDays)) ? (
        <UpgradeNotificationCart showModalHandler={toggleModal} />
      ) : null} */}



      {isLicenseValidate?.licensePlan === "free" &&
        isLicenseValidate?.LeftDays >= 0 ? (
        <TrialNotification
          isLicenseValidate={isLicenseValidate}
          showModalHandler={toggleModal}
        />
      ) : (
        isOnline && (
          <UpgradeNotificationCart showModalHandler={toggleModal} />
        )
      )}


      {props.children}
      <SubscriptionPlanModal
        handleClose={toggleModal}
        isModelVisible={modalOpen}
        setShow={setModalOpen}
      />
    </div>
  );
};

export default MainContentArea;
