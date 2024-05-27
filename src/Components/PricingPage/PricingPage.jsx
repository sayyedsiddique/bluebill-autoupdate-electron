import React from 'react'
import SubscriptionCard from '../TrialInformationCard/SubscriptionCard';
import "./PricingPage.css";
import FileSharingTableSection from './FileSharingTableSection';
import FreeTrailSection from './FreeTrailCard/FreeTrailSection';
import FooterSection from '../HomePages/HomePageFooterSection/FooterSection';
import HomeNavBar from '../HomePages/NavBar/HomeNavBar';
import { useNavigate } from 'react-router-dom';


const PricingPage = () => {
    const history = useNavigate();

    const signUpHandler = () => {
        history("/register");
    };

    return (
        <div>
            <HomeNavBar signUpHandler={signUpHandler} />
            <section className='main-plan-section'>
                <div className="container">
                    <div className="row">
                        {/* <div className="col-lg-12"> */}
                        <div className="title-box text-center">
                            <h1 className="title-heading mt-4">
                                PLANS & PRICING
                            </h1>
                            <p className="text-muted f-17 mt-3 mb-2" style={{ fontSize: "1.2rem" }}>
                                From intrepid entrepreneurs with shoestring budgets to established agencies with high-profile clients,
                                there’s a<br /> Hightail plan for you.
                            </p>
                        </div>
                    </div>
                </div>


                <div className="subscription-cart-container d-flex justify-content-center">
                    <div className="pricing-box mt-4">
                        <SubscriptionCard
                            cardTitle="FREE"
                            cardPrice="7999"
                            cardPriceDiscount="9998"
                            cardButtonText="Get Start"
                        />

                    </div>


                    <div className="pricing-box mt-4">
                        <SubscriptionCard
                            cardTitle="LIFE TIME"
                            cardPrice="1200"
                            cardFeaturedText="Featured"
                            cardPriceDiscount="1520"
                            cardButtonText="Get Start"

                        />
                    </div>


                    {/* <div className="col-lg-4"> */}
                    {/* <div className="pricing-box mt-4">
                            <SubscriptionCard
                                cardTitle="ULTIMATE"
                                cardPrice="8975"
                                cardPriceDiscount="9525"
                                cardButtonText="Get Start"
                                cardCharges="Charges"
                                cardAddons="Addons"
                                cardFeatures="Features"


                            />
                        </div> */}

                </div>
            </section>

            <div className='plan-info-section mt-5'>
                <h5 className="plan-info">All paid plans include recipient tracking, notifications,
                    access codes and unlimited storage. Teams and <br />
                    Business plans include creative collaboration
                    and project management features.

                </h5>
                <div className='horizanta-line'></div>
                <h6><p className="plan-info mb-5">Find more details on plan features below.</p></h6>

            </div>
            <section className='plans-information'>
                <div className='container-fluid mb-5'>
                    <div className='table-responsive'>
                        <table className="plan-table">
                            <thead >
                                <tr>
                                    <th style={{ backgroundColor: "white" }}></th>
                                    <th className='text-center'
                                        colspan="2" style={{
                                            color: "white",
                                            padding: "10px",
                                            backgroundColor: "var(--button-bg-color)"
                                        }}></th>
                                    <th className='text-center'
                                        colSpan="2" style={{
                                            color: "white",
                                            padding: "5px", backgroundColor: "var(--button-bg-color)"
                                        }}></th>
                                </tr>
                            </thead>
                            <thead className='mb-5'>
                                <tr>
                                    <td style={{
                                        borderTop: "none",
                                        borderLeft: "none",
                                        borderRadius: "none"
                                    }}>
                                    </td>

                                    <td style={{ borderTop: "none" }}>
                                        <div className="plan-pricing-box">
                                            <p className="plan-pricing">FREE</p>

                                            <div class="pricing-plan mt-4 text-center">
                                                <h2 className="text-muted d-flex flex-column">
                                                    <s className="discount-amount text-danger"> ₹9998
                                                    </s><strike className=" pl-3 text-dark">₹7999
                                                    </strike></h2>

                                            </div>

                                            <a href="/register#/register" >Get start</a>
                                            <p className="charge">Always free</p>
                                        </div>
                                    </td>
                                    <td style={{ borderTop: "none" }}>
                                        <div className="plan-pricing-box">
                                            <p className="plan-pricing">LIFE TIME</p>
                                            <div class="pricing-plan mt-4 text-center">
                                                <h2 className="text-muted d-flex flex-column">
                                                    <s className="discount-amount text-danger">₹1520
                                                    </s><strike className=" pl-3 text-dark">₹1200
                                                    </strike></h2>

                                            </div>

                                            <a href="/register#/register" >Get start</a>
                                            <p className="charge">*Billed annually</p>
                                        </div>
                                    </td>
                                    {/* <td style={{ borderTop: "none" }}>
                                        <div className="plan-pricing-box">
                                            <p className="plan-pricing">ULTIMATE</p>
                                            <div class="pricing-plan mt-4 text-center">
                                                <h2 className="text-muted d-flex flex-column">
                                                    <s className="discount-amount text-danger">₹9525
                                                    </s><strike className=" pl-3 text-dark">₹8975
                                                    </strike></h2>

                                            </div>
                                            <a href="/register#/register">Get start</a>
                                            <p className="charge">*Billed annually</p>
                                        </div>
                                    </td> */}
                                </tr>
                                <tr className='table-title dummy-row' style={{ height: "30px" }}></tr>

                            </thead>
                            <tbody className='paln-data text-center'>

                                {/* FEATURES TABLE SECTION */}

                                <tr className="row-title" style={{ backgroundColor: "var(--button-bg-color)" }}>
                                    <td colspan="5">
                                        <p style={{ color: "white", textAlign: "left" }}>Features</p>
                                    </td>
                                </tr>

                                <FileSharingTableSection />

                                <tr className='border-left'>
                                    <td style={{ borderRight: "none" }} colspan="5"></td>
                                </tr>
                                
                            </tbody>

                        </table>
                    </div>
                    {/* FreeTraiCard... */}
                    <section className="free-tari-container mb-5 mt-3">
                        <FreeTrailSection />
                    </section>
                </div>
            </section>
            {/* Footer section */}
            <section className="footer_conainer">
                <FooterSection />
            </section>
        </div >
    )
}

export default PricingPage
