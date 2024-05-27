import React from 'react'
import "./UpgradeNotificationCart.css";
import { FiStar } from 'react-icons/fi';
import RocketImage from "../../../assets/images/RocketIcon.png"
import { useTranslation } from 'react-i18next';




const UpgradeNotificationCart = ({ showModalHandler }) => {
    const { t } = useTranslation();
    return (
        <>

            <div className='upgradeNotification-container'>
                <div className="upgrade-notification">
                    <div className='d-flex align-items-center' style={{ gap: "1rem" }}>
                        <img src={RocketImage}
                            alt=''
                            height="50px"
                            width="50px"
                        />
                        <p style={{ fontSize: "20px" }}>{t("trailNotification.UpgradeToUnlockThisFeature")}</p>

                    </div>

                    <div className="upgradeNotificaation-button">
                        <button style={{ width: "100%" }}
                            onClick={showModalHandler}
                        >
                            <FiStar className="star-icon" />
                            {t("trailNotification.Upgrade")}
                        </button>
                    </div>
                </div>

            </div>


        </>


    )
}

export default UpgradeNotificationCart
