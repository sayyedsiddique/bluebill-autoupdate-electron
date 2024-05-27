import React, { useState } from 'react'
import "./SupportPage.css";
import supportImage from '../../../assets/images/Support.png'
import HomeNavBar from '../NavBar/HomeNavBar';
import { FaRocketchat, FaWhatsapp } from 'react-icons/fa';
import { PiPhoneCallBold } from "react-icons/pi";
import { MdOutlineMail } from 'react-icons/md';
import Button from "@mui/material/Button";
import { IconButton, TextField } from '@mui/material';
import FooterSection from '../HomePageFooterSection/FooterSection';
import { useNavigate } from 'react-router-dom';

const SupportPage = () => {

    const history = useNavigate();

    const [fields, setfields] = useState({
        name: '',
        businessName: '',
        email: '',
        subject: '',
        message: ''
    });

    const [error, setError] = useState({
        name: '',
        businessName: '',
        email: '',
        subject: '',
        message: "",
    });

    const validation = () => {
        if (!fields.name) {
            setError({ ...error, name: 'Name is required' });
            return false;
        } else if (fields.businessName === undefined || fields.businessName === '') {
            setError({ ...error, businessName: 'BusinessName is required' });
            return false;
        } else if (fields.email === undefined || fields.email === '') {
            setError({ ...error, email: 'Email is required' });
            return false;
        } else if (!validateEmail(fields.email)) {
            setError({ email: 'Invalid email address' });
            return false;
        } else if (fields.subject === undefined || fields.subject === '') {
            setError({ ...error, subject: 'Subject is required' });
            return false;
        } else if (fields.message === undefined || fields.message === '') {
            setError({ message: 'Message is required' });
            return false;
        }
        return true;

    };

    const submitHandler = (event) => {
        event.preventDefault();
        const val = validation();
        if (val) {
            const jsonObj = {
                name: fields.name,
                businessName: fields.businessName,
                email: fields.email,
                subject: fields.subject,
                message: fields.message,
            }
            console.log("SupportDetails..", jsonObj);
            setfields({
                name: '',
                businessName: '',
                email: '',
                subject: '',
                message: ''
            });
        }
    }

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setfields({ ...fields, [name]: value });
        setError({ ...error, [name]: "" });
    };

    const validateEmail = (email) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    const signUpHandler = () => {
        history("/register");
    };



    return (
        <div>
            <HomeNavBar signUpHandler={signUpHandler} />
            {/* support first section */}
            <section>

                <div className='support-container'>
                    <div className='support-main-containt mt-2'>
                        <div data-aos="fade-right" className="support-text">
                            <h1>Support 24/7</h1>
                            <p>Our team is here to provide round-the-clock support for your Point of Sale (POS) system. Our team is here to help with any questions, technical issues,
                                or troubleshooting needs you may have.</p>
                            <Button variant="contained"
                                style={{
                                    backgroundColor: "var(--button-bg-color)",
                                    color: "var(--button-color)",
                                    borderRadius: "2rem",
                                    padding: "5px 30px",
                                    marginTop: "1.5rem"
                                }}

                            >
                                Read More
                            </Button>
                        </div>
                        <div data-aos="fade-left" className="supoort-image ">
                            <img src={supportImage}
                                width="700px"
                                alt="Image" />
                        </div>
                    </div>
                </div>
            </section>

            {/* cards section */}
            <section className="service-grid pb-5 pt-5">
                <div data-aos="fade-right" className="container">
                    <div className="row">
                        <div className="col-xl-12 text-center mb-4">
                            <div className="service-title">
                                <h2>What kind of help do you need today?</h2>
                                <p>Our support team is always ready to provide any assistance you may need. With experts in
                                    technology, software implementation integration assistance, and more, we have you covered.
                                    Contact us and follow us.</p>
                            </div>

                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-4 col-md-6 text-center mb-3">
                            <div className="service-wrap">

                                <FaRocketchat className='support-icons' />

                                <h4>Live Chat</h4>
                                <p>Chat directly with BlueBill support</p>
                                <Button
                                    variant="contained"
                                    style={{
                                        color: "black",
                                        backgroundColor: "white",
                                        fontSize: "1rem",
                                        borderRadius: "2rem",
                                        padding: "10px 29px"
                                    }}
                                >
                                    Chat with us
                                </Button>

                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6 text-center mb-3">
                            <div className="service-wrap">
                                <PiPhoneCallBold className='support-icons' />
                                <h4>Phone</h4>
                                <p>Talk with us over the phone</p>
                                <Button
                                    variant="contained"
                                    style={{
                                        color: "black",
                                        backgroundColor: "white",
                                        fontSize: "1rem",
                                        borderRadius: "2rem",
                                        padding: "10px 29px"
                                    }}
                                >
                                    Call us
                                </Button>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6 text-center mb-3">
                            <div className="service-wrap">
                                <MdOutlineMail className='support-icons' />
                                <h4>Email Support</h4>
                                <p>Reach us by email</p>
                                <Button
                                    variant="contained"
                                    style={{
                                        color: "black",
                                        backgroundColor: "white",
                                        fontSize: "1rem",
                                        borderRadius: "2rem",
                                        padding: "10px 29px"
                                    }}
                                >
                                    Email us
                                </Button>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Email Support Section */}

            <section className='email-support-section' >
                <div className="row">
                    <div className="col-xl-12 text-center ">
                        <div className="service-title mt-5 p-1">
                            <h2>Email Support</h2>
                            <p>Please submit your questions, comments, and other inquires below along with your contact <br /> information. One of our team members will reach out to you promptly.</p>
                        </div>

                    </div>
                </div>

            </section>

            <section className='email-support-section'>
                <form className="container">
                    <div className="row">
                        <div className="support-input col-md-6 mx-auto">
                            <div className="email-form-group">
                                <TextField
                                    fullWidth
                                    type="text"
                                    id="Name"
                                    name="name"
                                    placeholder="Your Name"
                                    value={fields.name}
                                    onChange={handleChange}
                                />
                                {error.name && <span className="text-danger">{error.name}</span>}
                            </div>
                            <div className="email-form-group">
                                <TextField
                                    fullWidth
                                    type="text"
                                    id="businessName"
                                    name="businessName"
                                    placeholder="Business Name"
                                    value={fields.businessName}
                                    onChange={handleChange}
                                />
                                {error.businessName && <span className="text-danger">{error.businessName}</span>}
                            </div>
                            <div className="email-form-group">
                                <TextField
                                    fullWidth
                                    type="email"
                                    id="Email"
                                    name="email"
                                    placeholder="Your Email"
                                    value={fields.email}
                                    onChange={handleChange}
                                />
                                {error.email && <span className="text-danger">{error.email}</span>}
                            </div>
                            <div className="email-form-group">
                                <TextField
                                    fullWidth
                                    type="text"
                                    id="Subject"
                                    name="subject"
                                    placeholder="Subject"
                                    value={fields.subject}
                                    onChange={handleChange}
                                />
                                {error.subject && <span className="text-danger">{error.subject}</span>}
                            </div>
                            <div className="email-form-group">
                                <TextField
                                    style={{ backgroundColor: "white" }}
                                    fullWidth
                                    multiline={true}
                                    rows={4}
                                    type='text'
                                    name="message"
                                    placeholder="Your Message"
                                    autoComplete="off"
                                    variant="outlined"
                                    value={fields.message}
                                    onChange={handleChange}
                                />
                                {error.message && <span className="text-danger">{error.message}</span>}
                            </div>
                            <div className="email-submit-btn">
                                <Button
                                    type="submit"
                                    variant="contained"
                                    style={{
                                        backgroundColor: "var(--button-bg-color)",
                                        color: "var(--button-color)",
                                        borderRadius: "0.5rem",
                                        padding: "10px 40px",
                                        marginTop: "0.5rem"
                                    }}
                                    onClick={submitHandler}
                                >
                                    Submit
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </section>

            <section>
                <div className='wtsapp-support-section mt-5 mb-5'>
                    <div className='wtsapp-first'>
                        <h1>Whatsapp Support</h1>
                        <p>Send message to our Whatsapp number. One of our team members will reach out to you promptly.</p>
                    </div>
                    <div className='wtsapp-btn '>
                        <Button variant="contained"
                            style={{
                                backgroundColor: "var(--button-bg-color)",
                                color: "var(--button-color)",
                                marginTop: "0.5rem"
                            }}

                        >
                            <IconButton
                                style={{ padding: 0, marginRight: "0.5rem" }}

                            >
                                <FaWhatsapp style={{ color: "white", fontSize: "1.5rem" }} />
                            </IconButton>
                            <span>Send Message</span>
                        </Button>
                    </div>
                </div>
            </section>

            <section className="footer_conainer">
                <FooterSection />
            </section>


        </div>


    )
}

export default SupportPage
