import React, { useState } from "react";
import "./Home.css";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import {
  InputAdornment,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  TextField,
} from "@mui/material";
import { CiMobile3 } from "react-icons/ci";
import { useStyles } from "../../utils/CustomeStyles";
import { IoIosPeople } from "react-icons/io";
import {
  IoHome,
  IoLogoAppleAppstore,
  IoLogoGooglePlaystore,
} from "react-icons/io5";
import { BiSearch } from "react-icons/bi";
import { IconContext } from "react-icons";
import { RxDotFilled } from "react-icons/rx";
import { BsYoutube } from "react-icons/bs";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea } from "@mui/material";
import { FaTelegramPlane } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { SiSpeedtest } from "react-icons/si";
import { TbFileAnalytics } from "react-icons/tb";
import { AiOutlineShop } from "react-icons/ai";
import indianFlag from "../../assets/images/india-flag-icon.png";
import logoIcon from "../../assets/images/logo.png";
import logoIconWithBlackCircle from "../../assets/images/logo-black-circle.png";
import HomeNavBar from "../../Components/HomePages/NavBar/HomeNavBar";
import HomePageFirstSection from "../../Components/HomePages/HomePageFirstSection/HomePageFirstSection";
import HomePgaeFeatures from "../../Components/HomePages/HomePageSecondSection/HomePgaeFeatures";
import HomePageThirdSection from "../../Components/HomePages/HomePageThirdSection/HomePageThirdSection";
import HomePageCardSection from "../../Components/HomePages/HomePageCardSection/HomePageCardSection";
import HomePageIntegrationSection from "../../Components/HomePages/HomePageIntegrationSection/HomePageIntegrationSection";
import HomePageBrandSection from "../../Components/HomePages/HomePageBrandsSection/HomePageBrandSection";
import HomePageCustomerSlider from "../../Components/HomePages/HomePageCustomerSlider/HomePageCustomerSlider";
import HmePageBusinessSection from "../../Components/HomePages/HomePgaeBusinessSection/HmePageBusinessSection";
import HomePageAskQuestionSection from "../../Components/HomePages/HomePageAskQuestions/HomePageAskQuestionSection";
import HomePageLastSection from "../../Components/HomePages/HomePageLastSection/HomePageLastSection";
import FooterSection from "../../Components/HomePages/HomePageFooterSection/FooterSection";
import PlanPostercart from "../../Components/HomePages/PlanPosterCard/PlanPostercart";

const pages = [
  "How it works",
  "Price & Commission",
  "Shipping & Return",
  "Grow Business",
];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

const steps = [
  "Create account",
  "List products",
  "Collect orders",
  "Receive Payments",
];

const Home = () => {
  const classes = useStyles();
  const history = useNavigate();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // start selling handler
  const signUpHandler = () => {
    history("/register");
  };

  // signin/login handler
  const signInhandler = () => {
    history("/signin");
  };

  return (
    <>
      <section>
        <div className="homeContainer">

          <div>
            <HomeNavBar
              signUpHandler={signUpHandler}
              signInhandler={signInhandler} />
          </div>


          {/* home slider */}
          <div className="hero_section_container">

            <HomePageFirstSection
              signUpHandler={signUpHandler} />

            {/* <nav className="nav_container">
          <div className="logo_container"> */}
            {/* <h2 style={{ color: "var(--white-color)" }}>LOGO</h2> */}
            {/* <img src={logoIcon} alt="" />
          </div>
        </nav> */}

            {/* <div className="slider d-flex justify-content-between align-items-center"> */}
            {/* Right Side of hero section */}
            {/* <div className="sliderLeftside">
            <h1 className="text-white mb-0">The global commerce</h1>
            <h1 className="text-white mb-0">platform, built for</h1>
            <h1 className="text-white mb-4">performance</h1>

            <p className="leftside_decs text-white">
              Effortlessly launch a stunning online store, attract and convert
              more customers.
            </p>

            <div className="buttons_container">
              <div
                className="signin_btn_container"
                style={{ textAlign: "left", marginBottom: "2rem" }}
              >
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "var(--button-bg-color)",
                    color: "var(--button-color)",
                    paddingTop: "1rem",
                    paddingBottom: "1rem",
                    paddingLeft: "2.5rem",
                    paddingRight: "2.5rem",
                    fontSize: "1.5rem",
                  }}
                  onClick={signUpHandler}
                >
                  Sign up free
                </Button>
              </div>

              <div
                className="signin_btn_container"
                style={{ textAlign: "left", marginBottom: "2rem" }}
              >
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "var(--button-bg-color)",
                    color: "var(--button-color)",
                    paddingTop: "1rem",
                    paddingBottom: "1rem",
                    paddingLeft: "2.5rem",
                    paddingRight: "2.5rem",
                    fontSize: "1.5rem",
                  }}
                  onClick={signInhandler}
                >
                  Sign in
                </Button>
              </div>
            </div>

            <div className="leftside_appicon_container">
              <p style={{ marginBottom: "0px" }}>Also available on</p>
              <IconContext.Provider
                value={{
                  size: "25px",
                  color: "var(--white-02)",
                }}
              >
                <IoLogoGooglePlaystore />
              </IconContext.Provider>

              <IconContext.Provider
                value={{
                  size: "25px",
                  color: "var(--white-02)",
                }}
              >
                <IoLogoAppleAppstore />
              </IconContext.Provider>
            </div>
          </div> */}

            {/* Right Side of hero section */}
            {/* <div className="sliderRightside" style={{ textAlign: "right" }}>
            <img
              src="https://i.postimg.cc/K8m661Dh/IMG-20230516-152911.png"
              className="w-100"
              alt="..."
            />
          </div> */}
            {/* </div> */}
          </div>

          {/* benefits section */}
          <section className="benefits">
            {/* <HomePgaeFeatures /> */}
            {/* <div className="box m-4 p-3 ">
          <div className="innerBox mb-2 d-flex flex-wrap justify-content-start align-items-center">
            <div className="boxIcon">
              <IconContext.Provider
                value={{
                  size: "25px",
                  color: "var(--white-02)",
                }}
              >
                <IoIosPeople />
              </IconContext.Provider>
            </div>
            <h3>3,593,219+</h3>
          </div>
          <p>It is your estimated customer in all over the BEED right now</p>
        </div> */}

            {/* <div className="box m-4 p-3 ">
          <div className="innerBox mb-2 d-flex flex-wrap justify-content-start align-items-center">
            <div className="">
              <div className="boxIcon">
                <IconContext.Provider
                  value={{
                    size: "25px",
                    color: "var(--white-02)",
                  }}
                >
                  <IoHome />
                </IconContext.Provider>
              </div>
            </div>
            <h3>3,593,219+</h3>
          </div>
          <p>It is your estimated customer in all over the BEED right now</p>
        </div> */}

            {/* <div className="box m-4 p-3 ">
          <div className="innerBox mb-2 d-flex flex-wrap justify-content-start align-items-center">
            <div className="boxIcon">
              <IconContext.Provider
                value={{
                  size: "25px",
                  color: "var(--white-02)",
                }}
              >
                <BiSearch />
              </IconContext.Provider>
            </div>
            <h3>3,593,219+</h3>
          </div>
          <p>It is your estimated customer in all over the BEED right now</p>
        </div> */}
          </section>

          {/* why choose us section */}
          {/* <h1 className="text-center mb-3">Why sellers choose ezyEMI ?</h1>
      <section className="whySection d-flex justify-content-between align-items-center ps-4 pe-4">
        <div className="box p-3">
          <div className="innerBox mb-2 d-flex justify-content-start align-items-center">
            
            <h3 className="ms-0">Growth</h3>
          </div>
          <p>
            Grow your business vary fast with us selling online to millions of
            customers
          </p>
        </div>

        <div className="box p-3">
          <div className="innerBox mb-2 d-flex justify-content-start align-items-center">
          
            <h3 className="ms-0">Easy Start</h3>
          </div>
          <p>
            Grow your business vary fast with us selling online to millions of
            customers
          </p>
        </div>

        <div className="box p-3">
          <div className="innerBox mb-2 d-flex justify-content-start align-items-center">
          
            <h3 className="ms-0">Secure Payments</h3>
          </div>
          <p>
            Grow your business vary fast with us selling online to millions of
            customers
          </p>
        </div>

        <div className="box p-3">
          <div className="innerBox mb-2 d-flex justify-content-start align-items-center">
            
            <h3 className="ms-0">0% Risk</h3>
          </div>
          <p>
            Grow your business vary fast with us selling online to millions of
            customers
          </p>
        </div>
      </section> */}

          {/* seller account creation section */}
          {/* <h1 className="text-center mb-3 mt-3">How to sell on ezyEMI</h1>
      <section className="creationStep d-flex justify-content-between align-items-center ps-4 pe-4">
        <Box sx={{ width: "100%" }}>
          <Stepper alternativeLabel>

            <Step>
              <StepLabel>Create account</StepLabel>
            </Step>
            <Step>
              <StepLabel>List products</StepLabel>
            </Step>
            <Step>
              <StepLabel>Collect orders</StepLabel>
            </Step>
            <Step>
              <StepLabel>Receive Payments</StepLabel>
            </Step>
            
          </Stepper>
          <div className="stepContnet-container d-flex justify-content-around align-items-center">
            <div className="text-white">
              <div className="d-flex ">
                <span>
                  <RxDotFilled />
                </span>
                <p style={{ marginBottom: "0" }}>GSTIN number</p>
              </div>
              <div className="d-flex">
                <span>
                  <RxDotFilled />
                </span>
                <p style={{ marginBottom: "0" }}>Bank account</p>
              </div>
              <div className="d-flex">
                <span>
                  <RxDotFilled />
                </span>
                <p style={{ marginBottom: "0" }}>PAN</p>
              </div>
            </div>
            <div className="text-white">
              <div className="d-flex">
                <span>
                  <RxDotFilled />
                </span>
                <p>List the products you want to sell in your supplier panel</p>
              </div>
            </div>
            <div className="text-white">
              <div className="d-flex">
                <span>
                  <RxDotFilled />
                </span>
                <p>
                  Attract millions of Indian shoppers to place orders on our
                  platform.
                </p>
              </div>
            </div>
            <div className="text-white">
              <div className="d-flex">
                <span>
                  <RxDotFilled />
                </span>
                <p>
                  Payments are deposited directly to your bank account in every
                  7 days
                </p>
              </div>
            </div>
          </div>
        </Box>
      </section> */}
          {/* comment section */}

          {/* <h1 className="section_header text-center">
        Be it a startup or a legacy business, here’s why you need BlueBill
      </h1> */}
          {/* Why you need section */}
          {/* <div className="whyYouNeed_container">
        <div className="container">
          <div className="row whyYouNeed_benifits_container d-flex justify-content-center align-items-center">
            <div className="col-lg-6 col-md-6 col-sm-12">
              <h2>Launch Fast</h2>
              <ul>
                <li>Fully responsive e-commerce website & mobile app.</li>
                <li>Loads 6X faster than existing solutions.</li>
                <li>Upload/import products and inventory in bulk.</li>
                <li>Integrate payment gateways.</li>
              </ul>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12 whyYouNeed_img_container">
              <img src="https://i.postimg.cc/KzxNQV6N/sunset-pool.png" alt="" />
            </div>
          </div>
        </div> */}

          {/* <section className="learnSection d-flex justify-content-around align-items-center ps-4 pe-4">
          <div className="box1">
            <h1 className="text-center mb-3">
              Learn how to sell product on <b>eZyEMI</b> and grow your business
            </h1>
          </div>
          <div className="box2">
            <div className="boxIcon p-4">
              <IconContext.Provider
                value={{
                  size: "50px",
                  color: "var(--secondary-color-01)",
                }}
              >
                <BsYoutube />
              </IconContext.Provider>
            </div>
          </div>
        </section> */}
          {/* </div> */}

          {/* Website features section */}
          <section className="feature_container">
            <HomePageCardSection />
            {/* <div className="container">
      <h2 className="heading_h2">E-commerce, made (incredibly) easy</h2>
      <p className="heading_para">
        All the tools you need to grow your online business.
      </p>

      <div id="feature_banner">
        <div className="feature_banner_inner_container">
          <div className="feature_banner_box">
            <div className="icon_container">
              <IconContext.Provider
                value={{
                  size: "35px",
                  color: "var(--secondary-color-01)",
                }}
              >
                <SiSpeedtest />
              </IconContext.Provider>
            </div>
            <h3>Site Speed</h3>
            <p>
              Incredibly fast storefronts. Don't take our word for it, start
              selling online and see it for yourself!
            </p>
          </div>
          <div className="feature_banner_box">
            <div className="icon_container">
              <IconContext.Provider
                value={{
                  size: "35px",
                  color: "var(--secondary-color-01)",
                }}
              >
                <TbFileAnalytics />
              </IconContext.Provider>
            </div>
            <h3>Advanced Analytics</h3>
            <p>
              Incredibly fast storefronts. Don't take our word for it, start
              selling online and see it for yourself!
            </p>
          </div>
          <div className="feature_banner_box">
            <div className="icon_container">
              <IconContext.Provider
                value={{
                  size: "35px",
                  color: "var(--secondary-color-01)",
                }}
              >
                <AiOutlineShop />
              </IconContext.Provider>
            </div>
            <h3>Multi-Warehouse</h3>
            <p>
              Incredibly fast storefronts. Don't take our word for it, start
              selling online and see it for yourself!
            </p>
          </div>
          <div className="feature_banner_box">
            <div className="icon_container">
              <IconContext.Provider
                value={{
                  size: "35px",
                  color: "var(--secondary-color-01)",
                }}
              >
                <SiSpeedtest />
              </IconContext.Provider>
            </div>
            <h3>Optimised Checkouts</h3>
            <p>
              Incredibly fast storefronts. Don't take our word for it, start
              selling online and see it for yourself!
            </p>
          </div>
          <div className="feature_banner_box">
            <div className="icon_container">
              <IconContext.Provider
                value={{
                  size: "35px",
                  color: "var(--secondary-color-01)",
                }}
              >
                <SiSpeedtest />
              </IconContext.Provider>
            </div>
            <h3>Staff Accounts</h3>
            <p>
              Incredibly fast storefronts. Don't take our word for it, start
              selling online and see it for yourself!
            </p>
          </div>
          <div className="feature_banner_box">
            <div className="icon_container">
              <IconContext.Provider
                value={{
                  size: "35px",
                  color: "var(--secondary-color-01)",
                }}
              >
                <SiSpeedtest />
              </IconContext.Provider>
            </div>
            <h3>Android App</h3>
            <p>
              Incredibly fast storefronts. Don't take our word for it, start
              selling online and see it for yourself!
            </p>
          </div>
        </div>
      </div>
    </div> */}
          </section>

          <section className="ThirdSection-HomePage">
            <HomePageThirdSection />
          </section>



          {/* Popularity section */}
          <section className="popularity_container">
            <HomePageIntegrationSection />
            {/* <div className="container">
          <div className="popularity_inner_container">
            <div className="popularity_inner_box">
              <h2 className="heading-h2">100+</h2>
              <p className="heading-para">Countries</p>
            </div>
            <div className="popularity_inner_box">
              <h2 className="heading-h2">9,200+</h2>
              <p className="heading-para">Cities covered</p>
            </div>
            <div className="popularity_inner_box">
              <h2 className="heading-h2">220+</h2>
              <p className="heading-para">Employees</p>
            </div>
            <div className="popularity_inner_box">
              <h2 className="heading-h2">Millions</h2>
              <p className="heading-para">of Entrepreneurs</p>
            </div>
          </div>
        </div> */}
          </section>

          <section className="testimonial_container">
            <HomePageBrandSection
              signUpHandler={signUpHandler} />

            {/* <div className="container">
          <div className="testimonial_header">
            <h2 className="heading-h2">What our customers are saying</h2>
            <p className="heading-para">
              From beginners to enterprise brands, everyone loves BlueBill
            </p>
          </div>

          <div className="row testimonial_1 testimonial_inner_container d-flex justify-content-center align-items-center">
            <div className="leftside col-lg-6 col-md-6 col-sm-12">
              <p className="heading-para">
                81% SAY THEIR TEAMWORK IS MORE EFFICIENT
              </p>
              <h2>
                We manage too many people to constantly be searching for stuff
              </h2>
              <p className="heading-para">
                In Twist, we waste less time and lose fewer conversations.
                Everyone loves that our team communication is finally organized
                and in one place.
              </p>
              <p className="heading-para">
                Chelle CEO of Chelle Weech Consulting
              </p>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12 testimonial_img_container">
              <img src="https://i.postimg.cc/XqqTvtw0/Image-4688.png" alt="" />
            </div>
          </div>

          <div className="row testimonial_2 testimonial_inner_container d-flex justify-content-center align-items-center ">
            <div className="col-lg-6 col-md-6 col-sm-12 testimonial_img_container">
              <img src="https://i.postimg.cc/cH9bPTPk/Image-4687.png" alt="" />
            </div>

            <div className="leftside col-lg-6 col-md-6 col-sm-12">
              <p className="heading-para">
                78% SAY TEAM COMMUNICATION IS CALMER
              </p>
              <h2>
                f Twist shows more respect for my team's time and attention
              </h2>
              <p className="heading-para">
                Switching from Slack was surprisingly easy Collaborating in
                Twist is a lot less stressful because it's designed to help
                people do deep, focused work.
              </p>
              <p className="heading-para">Richard Designer at Balance</p>
            </div>
          </div>

          <div className="row testimonial_3 testimonial_inner_container d-flex justify-content-center align-items-center">
            <div className="leftside col-lg-6 col-md-6 col-sm-12">
              <p className="heading-para">
                81% SAY THEIR TEAMWORK IS MORE EFFICIENT
              </p>
              <h2>
                We manage too many people to constantly be searching for stuff
              </h2>
              <p className="heading-para">
                In Twist, we waste less time and lose fewer conversations.
                Everyone loves that our team communication is finally organized
                and in one place.
              </p>
              <p className="heading-para">
                Chelle CEO of Chelle Weech Consulting
              </p>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12 testimonial_img_container">
              <img src="https://i.postimg.cc/g2g0Lf7B/Image-4686.png" alt="" />
            </div>
          </div>
        </div> */}

          </section>


          {/* Start selling section */}
          <section className="start_selling_container">
            <HomePageCustomerSlider />
            {/* <div className="container">
          <div className="start_selling_inner">
            <div className="img_container">
              <img src={logoIcon} alt="" />
            </div>
            <h1 className="heading-h1">Start selling online.</h1>
            <p className="heading-pera">
              Take your business online with Dukaan. Get your free online store
              in 30 seconds.
            </p>
            <div
              className="mt-2 start_selling_btn_container"
              style={{ textAlign: "right" }}
            >
              <Button
                variant="contained"
                style={{
                  backgroundColor: "var(--button-bg-color)",
                  color: "var(--button-color)",
                }}
                onClick={signUpHandler}
              >
                Start free
              </Button>
            </div>
          </div>
        </div> */}
          </section>


          <section className="business-conatiner">
            <HmePageBusinessSection signUpHandler={signUpHandler} />
          </section>

          {/* Asked Questions section */}
          <section className="AskQuestions-conatiner">
            <HomePageAskQuestionSection />
          </section>

          {/* 
      <section className="lastcontent-conatiner">
        <HomePageLastSection />
      </section> */}




          {/* support bluebill section */}
          <section className="support_container d-flex flex-column justify-content-around align-items-center ps-4 pe-4">
            <h1 className="heading_h2 text-center">Supports 24/7</h1>
            <div className="container">
              <div className="box1 w-100">
                <h1
                  className="text-center mb-3">
                  BlueBill Supplier Support Available 24/7
                </h1>
                <p className="text-center">
                  BlueBill support is available to solve all your doubts and issues
                  before and after you start your online selling business.
                </p>
                <div className="d-flex justify-content-center align-items-center gap-2">
                  <div
                    className="logo">
                    <IconContext.Provider
                      value={{
                        size: "25px",
                        color: "var(--secondary-color-01)",
                      }}
                    >
                      <FaTelegramPlane />
                    </IconContext.Provider>
                  </div>
                  <div className="text">
                    <b>You can reach out to</b>
                    <span className="ms-2">bluebill@compay.com</span>
                  </div>
                </div>
              </div>
            </div>
          </section>



          {/* Footer section */}
          <section className="footer_conainer">
            <FooterSection />
          </section>
        </div >

        <div className="planposte-Cart">
          {/* planposterCart modal showing in homepage */}
          <PlanPostercart
            signUpHandler={signUpHandler} />
        </div>
      </section>
    </>
  );
};

export default Home;
