import { Button } from "@mui/material";
import React from "react";
import "./HomePage.css";

const HomePage = () => {
  return (
    <div className="homePage_container">
      <nav>
        <div className=" pt-4 pb-4">
          <h2>LOGO</h2>
        </div>
      </nav>
      <section className="hero_section_container d-flex justify-content-between align-self-center">
        <div className="leftside_container">
          <h1>The global commerce</h1>
          <h1>platform, built for</h1>
          <h1 className="mb-4">performance</h1>

          <p>
            Effortlessly launch a stunning online store, attract and convert
            more customers.
          </p>

          <div className="mt-2" style={{ textAlign: "left" }}>
            <Button
              variant="contained"
              style={{
                backgroundColor: "var(--button-bg-color)",
                color: "var(--button-color)",
              }}
              //   onClick={submitHandler}
            >
              Sign in free
            </Button>
          </div>
        </div>
        <div className="rightside_container">
          <img src="https://i.postimg.cc/3Nb1rGkW/Screenshot-2023-05-09-at-3-26-23-PM.png" alt="" />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
