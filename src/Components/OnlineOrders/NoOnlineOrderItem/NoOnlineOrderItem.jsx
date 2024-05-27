import React from 'react';
import { Link } from 'react-router-dom';

import './NoOnlineOrderItem.css';
import NoOrderList from "../../../assets/images/noorderlist.jpg";
// import whatsapp from "../../../assets/images/SocialIcons/whatsapp.svg"
// import facebook from "../../../assets/images/SocialIcons/facebook.svg";
// import twitter from "../../../assets/images/SocialIcons/twitter.svg";
import { useTranslation } from "react-i18next";

const NoOnlineOrderItem = (props) => {
  const { t } = useTranslation();
    return (
        <div className="no_Order">
        <img src={NoOrderList} className="no_order_img" />
        <h3 className="pageHeading mb-0 text-center text-Color">
         {t("allOnlineOrder.noteOne")} {props.orderStatus}.
        </h3>
        {/* <div className="text-center mt-2 text-Color">
        {t("allOnlineOrder.noteTwo")}
        </div>
        <div className="socialIcons">
          <Link to="">
            <img src={whatsapp} width="35px" alt="social media icons" />
          </Link>

          <Link to="">
            <img src={facebook} width="35px" alt="social media icons" />
          </Link>

          <Link to="">
            <img src={twitter} width="35px" alt="social media icons" />
          </Link>
        </div> */}
      </div>
    );
};

export default NoOnlineOrderItem;