import React from "react";
import './CardWithTwoSection.css'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const CardWithTwoSection = (props) => {
  const navigate = useNavigate();

  return (
    <div className="two-section-card-main-container">
      <div className="card_container">
        <div className="icon-container ">
          <IoIosArrowRoundBack
            style={{
              fontSize: "2.5rem",
              cursor: "pointer",
              marginLeft: "-1rem"
            }}
            onClick={() => navigate("/")}
          />
        </div>
        {/* <div className="registration_leftside">
            {props.image}
        </div>
        <div className="registration_right">
            {props.form}
        </div> */}
        <div className=" d-flex card-container-left-right-side">
          {props?.children}
        </div>

      </div>

    </div>


  );
};

export default CardWithTwoSection;
