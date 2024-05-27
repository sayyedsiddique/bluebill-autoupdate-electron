import React, { useEffect, useState } from 'react';
import "./HomeNavBar.css";
import Button from "@mui/material/Button";
import { Navbar, Nav } from 'react-bootstrap';
import PricingPage from '../../PricingPage/PricingPage';
import { useNavigate } from 'react-router-dom';
import websiteLogo from '../../../assets/images/website-logo-bluebill.jpg';

const HomeNavBar = ({ signUpHandler, signInhandler }) => {

    const navigate = useNavigate();

    const [showShadow, setShowShadow] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    // when we are scroll page then show shadow on Navbar bottom
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setShowShadow(true);
            } else {
                setShowShadow(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const pricingHandler = () => {
        navigate("/PricingPage");
    };

    const supportHandler = () => {
        navigate("/SupportPage");
    };


    return (
        <>
            <div className={`headerContainer-sticty ${showShadow ? 'shadow' : ''}`}>
                <div className='header-top'>
                    <span>Email: support@bluebill.com</span>
                </div>

                <Navbar bg="white" expand="lg" variant="dark" sty>
                    <div className="container" style={{padding:"15px"}}>
                        <Navbar.Brand onClick={() => navigate("/")}>
                            <img 
                            style={{cursor:'pointer'}}
                                src={websiteLogo}
                                alt="logo"
                                height="45"
                                width="150"
                                className="d-inline-block align-top"
                            />
                        </Navbar.Brand>

                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-5">
                                {/* <Nav.Link><a href="#Explore">Explore</a></Nav.Link> */}
                                {/* <Nav.Link><a href="#Partners">Partners</a></Nav.Link> */}
                                <Nav.Link><a href="#Pricing" onClick={pricingHandler}>Pricing</a></Nav.Link>
                                {/* <Nav.Link><a href="#Blog">Blog</a></Nav.Link> */}
                                {/* <Nav.Link><a href="#Company">Company</a></Nav.Link> */}
                                <Nav.Link><a href="#Support" onClick={supportHandler}>Support</a></Nav.Link>
                                <Nav.Link><a href="#Login" onClick={signInhandler}>Login</a></Nav.Link>
                                {/* <Nav.Link><a href="#Languge">Languge</a></Nav.Link> */}
                                {/* <Nav.Link><a href="#Career">Career</a></Nav.Link> */}
                            </Nav>
                            <Button variant="contained"
                                style={{
                                    backgroundColor: "var(--button-bg-color)",
                                    color: "var(--button-color)",
                                    fontSize: "1rem", borderRadius: "2rem",
                                    padding: "10px 29px"
                                }}
                                onClick={signUpHandler}
                            >
                                Get started
                            </Button>
                        </Navbar.Collapse>
                    </div>
                </Navbar>

            </div>


        </>
    );
};

export default HomeNavBar;
