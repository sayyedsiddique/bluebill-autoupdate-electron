import React from "react";
import { useSearchParams } from "react-router-dom";

import PrimaryButton from "../../Atoms/PrimaryButton/PrimaryButton";
import "./OnlineOrderBtnCollection.css";
import { useTranslation } from "react-i18next";


const OnlineOrderBtnCollection = (props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const allOrderStatus = searchParams.get("status");

  const buttonActiveClass = allOrderStatus === "Pending" ? "active" : "";
  const acceptedActiveClass = allOrderStatus === "Accepted" ? "active" : "";
  const inProgressActiveClass = allOrderStatus === "In-Progress" ? "active" : "";
  const dispatchActiveClass = allOrderStatus === "Dispatch" ? "active" : "";
  const deliveredActiveClass = allOrderStatus === "Delivered" ? "active" : "";
  const rejectedActiveClass = allOrderStatus === "Rejected" ? "active" : "";

  const { t } = useTranslation();

  return (

    <div className=""
    // style={{display:"flex", width:"max-content"}}
    >
      <PrimaryButton
        type="button"
        onClick={props.onPendingHalder}
        activeClass={buttonActiveClass}
      >
        {t("allOnlineOrder.Pending")}
      </PrimaryButton>
      <PrimaryButton
        type="button"
        onClick={props.onAcceptedHandler}
        activeClass={acceptedActiveClass}
      >
        {t("allOnlineOrder.Accepted")}
      </PrimaryButton>
      <PrimaryButton
        type="button"
        onClick={props.onInProgressHandler}
        activeClass={inProgressActiveClass}
      >
        {t("allOnlineOrder.InProgress")}
      </PrimaryButton>
      <PrimaryButton
        type="button"
        onClick={props.onDispatchHandler}
        activeClass={dispatchActiveClass}
      >
        {t("allOnlineOrder.Dispatch")}
      </PrimaryButton>
      <PrimaryButton
        type="button"
        onClick={props.onDeliveredHandler}
        activeClass={deliveredActiveClass}
      >
        {t("allOnlineOrder.Delivered")}
      </PrimaryButton>
      <PrimaryButton
        type="button"
        onClick={props.onRejectedHandler}
        activeClass={rejectedActiveClass}
      >
        {t("allOnlineOrder.Cancelled")}
      </PrimaryButton>
    </div>
  );
};

export default OnlineOrderBtnCollection;
