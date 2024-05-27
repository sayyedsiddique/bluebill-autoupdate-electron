import React, { useEffect, useState } from "react";
import { Button, Checkbox } from "@mui/material";
import { FcCheckmark } from "react-icons/fc";
import {
  CURRENCY_SYMBOL,
  STORE_CURRENCY,
  SubscriptionAddonsList,
  SubscriptionChargesList,
  SubscriptionFeatureList,
} from "../../Containts/Values";
import SubscriptionFeatures from "./SubscriptionFeatures";
import SubscriptionAddons from "./SubscriptionAddons";
import SubscriptionCharges from "./SubscriptionCharges";
import SubscriptionPaymentModal from "./SubscriptionPayment/SubscriptionPaymentModal";


const SubscriptionCard = ({
  cardTitle,
  cardPrice,
  toggle,
  cardFeaturedText,
  cardPriceDiscount,
  cardCharges,
  cardAddons,
  cardFeatures,
  cardButtonText,
  planHanlder,
  setPlanModalShow,
  getStartBtnHandler,
  disabled,
  beforeDiscountMonthlyPrice,
  afterDiscountPriceMonthly
}) => {
 
  const [openModal, setOpenModal] = useState(false);
  // console.log("STORE_CURRENCY", CurrencySymbol);




  // convert object into array..........
  const FeaturesData = Object.values(SubscriptionFeatureList);
  console.log("FeatureData..", FeaturesData);

  const addonsData = Object.values(SubscriptionAddonsList);
  console.log("addonsData..", addonsData);

  const ChargesData = Object.values(SubscriptionChargesList);
  console.log("ChargesData...", ChargesData);

  return (
    <div>
      <i className="mdi mdi-account h1"></i>
      <h2 className="subscription-card-title f-20 text-center fw-bold mb-3">
        {cardTitle}
      </h2>

      <div className="pricing-plan mt-4 text-center">
        {cardFeaturedText && (
          <div className="pricing-badge">
            <span className="badge">{cardFeaturedText}</span>
          </div>
        )}

        <h2 className="text-muted d-flex flex-column">
          <s className="discount-amount text-danger">
            {" "}
            {toggle ? `${STORE_CURRENCY}${cardPriceDiscount}` : `${STORE_CURRENCY}${beforeDiscountMonthlyPrice}`}
          </s>
          {cardTitle === "FREE" ? (
            <strike className="plan pl-3 text-dark">
              {toggle ? `${STORE_CURRENCY}${cardPrice}` : `${STORE_CURRENCY}${afterDiscountPriceMonthly}`}
            </strike>
          ) : (
            <span className="plan pl-3 text-dark">
              {toggle ? `${STORE_CURRENCY}${cardPrice}` : `${STORE_CURRENCY}${afterDiscountPriceMonthly}`}
            </span>
          )}
        </h2>
        <p className="text-muted mb-0">{toggle ? "Per Annual" : "Per Month"}</p>
      </div>
      {/* <div>
        <button
          className="mt-4"
          variant="contained"
          style={{
            backgroundColor: cardTitle === "FREE" ? "grey" : "var(--button-bg-color)",
            color: "var(--button-color)",
            width: "100%",
            fontSize: "1.2rem",
            borderRadius: "10px",
            border: "none",
            paddingTop: "0.6rem",
            paddingBottom: "0.6rem",
          }}
          onClick={getStartBtnHandler}
          disabled={cardTitle === "FREE"}
        >
          {cardButtonText}
        </button>
      </div> */}

      {/* subcriptionFeaturesContent.......... */}

      {/* <div className="mt-4 pt-2"> */}
      <p className="heading-title mb-2 f-18">{cardFeatures}</p>
      <SubscriptionFeatures
       FeaturesData={FeaturesData} 
      />
      {/* </div> */}

      {/* subcriptionAddonsContent........... */}

      {/* <div className="mt-4 pt-2"> */}
      <h6 className=" heading-title mb-2 f-18">{cardAddons}</h6>
      <SubscriptionAddons
       addonsData={addonsData}
      />
      {/* </div> */}

      {/* subcriptionChargesContent........... */}

      <div className="mt-4 pt-2">
        <h6 className="heading-title mb-2 f-18">{cardCharges}</h6>
        <SubscriptionCharges
         ChargesData={ChargesData} 
        />
      </div>

      <div>
        <button
          className="mt-4"
          variant="contained"
          style={{
            backgroundColor: cardTitle === "FREE" ? "var(--gray-color)" : "var(--button-bg-color)",
            color: "var(--button-color)",
            width: "100%",
            fontSize: "1.2rem",
            borderRadius: "10px",
            border: "none",
            paddingTop: "0.6rem",
            paddingBottom: "0.6rem",
          }}
          disabled={cardTitle === "FREE" ? disabled : false}
          onClick={() => getStartBtnHandler({planName: cardTitle, planPrice: cardPrice})}
        >
          {cardButtonText}
        </button>

      </div>
    </div>
  );
};

export default SubscriptionCard;
