import React from 'react';
import "./HomePageLastSection.css";
import Button from "@mui/material/Button";

const HomePageLastSection = () => {
    return (
        <div className="last-container">
            <h1 style={{marginBottom:"2rem"}}>
                Ready to Automate your business operations ?
                <br />
                Try our powerful ERP software today and
                <br />
                experience the growth !
            </h1>
            <div className="last-btn">
            <Button variant="contained"
                        style={{
                            backgroundColor: "white",
                            color: "#000",
                            borderRadius: "2rem",
                            marginTop: "2rem",
                            fontSize:"1.5rem"
                        }}
                    // onClick={signInhandler}
                    >
                     Sign up for free
                    </Button>
            </div>
        </div>
    );
};

export default HomePageLastSection;
