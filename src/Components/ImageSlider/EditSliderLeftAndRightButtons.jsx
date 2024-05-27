import React from "react";
import { IconContext } from "react-icons";
import { MdOutlineExpandLess } from "react-icons/md";

const EditSliderLeftAndRightButtons = () => {
    return (
        <div className="sliderButtons" id="carouselExampleControls"
        data-bs-ride="carousel">
          <button
            className="prevCard_slider_prev_btn"
            type="button"
            data-bs-target="#carouselExampleControls"
            data-bs-slide="prev"
          >
            <IconContext.Provider value={{ color: "black", size: "50px" }}>
              <div>
                <MdOutlineExpandLess style={{ transform: "rotate(-90deg)" }} />
              </div>
            </IconContext.Provider>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="prevCard_slider_next_btn"
            type="button"
            data-bs-target="#carouselExampleControls"
            data-bs-slide="next"
          >
            <IconContext.Provider value={{ color: "black", size: "50px" }}>
              <div>
                <MdOutlineExpandLess style={{ transform: "rotate(90deg)" }} />
              </div>
            </IconContext.Provider>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      );
};

export default EditSliderLeftAndRightButtons;