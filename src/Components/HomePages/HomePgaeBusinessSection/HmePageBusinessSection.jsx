import React from 'react'
import Button from "@mui/material/Button";
import "./HomePageBusinessSection.css";
import dashboradImage from "../../../assets/images/bluebillDashboradImage.png";

const HmePageBusinessSection = ({signUpHandler}) => {
    return (
        <div className='busniess-content'>
            <div className='business-heading'>

                <h2 data-aos="fade-up"
                    data-aos-anchor-placement="top-bottom">Run Your Business With Blue Bill <br />Software</h2>

                <div data-aos="fade-up"
                    data-aos-anchor-placement="top-bottom" className='start-btn'>
                    <Button variant="contained"
                            style={{
                                Color: "var(--button-bg-color)",
                                backgroundColor: "white",
                                borderRadius: "2rem",
                                marginTop: "2rem"
                            }}
                            onClick={signUpHandler}
                        >
                            Sign up for free
                        </Button>

                </div>

            </div>


            <div data-aos="fade-up"
                data-aos-anchor-placement="top-bottom" className='business-img'>
                <img src={dashboradImage} 
                width="450" height="300" />


            </div>
            

        </div>
    )
}

export default HmePageBusinessSection
