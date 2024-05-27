import React from "react";
import "./TrialNotification.css";
import { useTranslation } from "react-i18next";

const TrialNotification = ({ isLicenseValidate, showModalHandler }) => {

  const { t } = useTranslation();

  return (
    <div className="trial-notification">
      <p>
        {t("trailNotification.ThereAre")}{" "}
        {isLicenseValidate?.LeftDays === 0 ? 1 : isLicenseValidate?.LeftDays}{" "}
        {isLicenseValidate?.LeftDays === 0 ? t("trailNotification.day") : t("trailNotification.days")} {t("trailNotification.leftOnYourTrail")}{" "}
        <span class="upgrade-link" onClick={showModalHandler}>
          {t("trailNotification.clickHereToUpgrade")}
        </span>
      </p>
    </div>
  );
};

export default TrialNotification;
