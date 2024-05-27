import React from 'react'
import Button from "@mui/material/Button";
import "./HomePageFirstSection.css";


const HomePageFirstSection = ({ signUpHandler }) => {
    return (
        <>
            <div className='home-headingmain-container'>
                <div className='home-pageContaniner '>
                    <div data-aos="fade-up" className='home-heading-content'>
                        <h1 className='fw-bold '>Your All-in-one Cloud based <br />
                            Restaurant & Retail ERP Software
                        </h1>
                    </div>
                    <div data-aos="fade-up" className='home-headingdescription-content'>
                        <p>
                            BlueBill ERP software is the perfect solution for simplifying your business operations <br />
                            inventory , Accounting , CRM and HR & Payroll.
                        </p>

                    </div>
                    <div className='getstartbtn'>
                        <Button data-aos="fade-up" variant="contained"
                            style={{
                                backgroundColor: "var(--button-bg-color)",
                                color: "var(--button-color)",
                                borderRadius: "2rem",
                                padding: "12px 50px",
                                margin: "10px 0px"

                            }}
                            onClick={signUpHandler}

                        >
                            Get started
                        </Button>

                    </div>


                </div>

                <div className='home-bottom-section '>
                    <div data-aos="fade-up" className='home-headingbuttom-section'>
                        <img src="https://posbytz.com/wp-content/uploads/2023/07/rating-main-10-1024x110.png"
                        />

                    </div>
                </div>

            </div>




        </>
    )
}

export default HomePageFirstSection
