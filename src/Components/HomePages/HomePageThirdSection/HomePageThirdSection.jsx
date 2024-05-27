import React from 'react'
import "./HomePageThirdSection.css";
import ReactPlayer from 'react-player';



const HomePageThirdSection = () => {
    return (
        <div className=''>
            {/* Why you need section */}
            <div data-aos="zoom-in" className="howWork_container">
                <h2 data-aos="zoom-in" className="section_header text-center">
                    How it Works?
                </h2>


                <div className="container" >
                    <div className=" whyYouNeed_benifits_container">
                        <div data-aos="zoom-in" className="mb-6">
                            {/* <h2>Launch Fast</h2> */}
                            <span style={{ fontSize: "1.5rem", fontWeight: "500" }}
                            >Checkout how you can Automate your Business with BlueBill ERP Software</span><br /><br />
                            <p>Discover how our retail and restaurant ERP software can revolutionize your business operations today!</p>
                        </div>
                        <div className="video-frame mt-5">
                            {/* <ReactPlayer url="https://www.youtube.com/watch?v=P3ivENBqrsM"> </ReactPlayer> */}
                        </div>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default HomePageThirdSection
