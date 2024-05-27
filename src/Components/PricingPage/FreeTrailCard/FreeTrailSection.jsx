import React from 'react'
import Button from "@mui/material/Button";
import "./FreeTrailSection.css";
import { useNavigate } from 'react-router-dom';

const FreeTrailSection = () => {
    const history = useNavigate();

    const signUpHandler = () => {
        history("/register");
      };
    return (
        <div>

            <div className="free-trail-container">
                <div className="trail-plan_inner">

                    <p className="trail-heading-h1 mb-2" style={{ fontSize: "1.5rem" }}>BUSINESS PLAN</p>
                    <h1 className="trail-heading-para">
                        Start Free Trail
                    </h1>

                </div>
                <div className='trailPlan-btn'>

                    <Button variant="contained"
                        style={{
                            Color: "var(--button-bg-color)",
                            backgroundColor: "white",
                            borderRadius: "2rem",
                            marginTop: "2rem"
                        }}
                        onClick={signUpHandler}
                    >
                        try free plan
                    </Button>
                </div>
            </div>

        </div>
    )
}

export default FreeTrailSection
