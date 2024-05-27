import React, { useState } from 'react'
import Button from "@mui/material/Button";
import "./HomePageBrandSection.css";
import { images1, images2, images3 } from '../../../Containts/Values';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const HomePageBrandSection = ({ signUpHandler }) => {

    // For images Slider....
    const [currentSlide, setCurrentSlide] = useState(0);
    const [currentSlide2, setCurrentSlide2] = useState(0);
    const [currentSlide3, setCurrentSlide3] = useState(0);

    const nextSlide = () => {
        setCurrentSlide((currentSlide + 1) % images1.length);
    };
    const prevSlide = () => {
        setCurrentSlide((currentSlide - 1 + images1.length) % images1.length);
    };
    const nextSlide2 = () => {
        setCurrentSlide2((currentSlide2 + 1) % images2.length);
    };
    const prevSlide2 = () => {
        setCurrentSlide2((currentSlide2 - 1 + images2.length) % images2.length);
    };
    const nextSlide3 = () => {
        setCurrentSlide3((currentSlide3 + 1) % images3.length);
    };
    const prevSlide3 = () => {
        setCurrentSlide3((currentSlide3 - 1 + images3.length) % images3.length);
    };


    return (
        <div className='container'>
            <div className='brand-main-container d-flex '>
                <div className='leftside-content'>
                    <div className='leftside-contentheading'>
                        <h2  className="brand-name "><span>Trusted by</span><br />
                            great brands</h2>
                    </div>
                    <div className='leftside-para'>
                        <p>Over 5000+ businesses in 15 countries have registered with BlueBill.</p>
                    </div>
                    <div className='leftside-btn'>
                        <Button variant="contained"
                            style={{
                                backgroundColor: "var(--button-bg-color)",
                                color: "var(--button-color)",
                                borderRadius: "2rem",
                                marginTop: "2rem"
                            }}
                            onClick={signUpHandler}
                        >
                            Get started for free
                        </Button>
                    </div>
                </div>

                <div className='rightside-content'>

                    <div className='elementor-widget-container1 d-flex justify-content-center align-items-center'>
                        <FaChevronLeft
                            style={{ cursor: "pointer" }}
                            onClick={prevSlide} />
                        <div className="sliderimages">
                            {images1.map((image, index) => (
                                <img
                                    key={index}
                                    className="slides"
                                    src={image}
                                    alt={`slides ${index}`}
                                    style={{ transform: `translateX(${(index - currentSlide) * 100}%)` }}
                                />
                            ))}
                        </div>

                        <FaChevronRight style={{ cursor: "pointer" }}
                            onClick={nextSlide} />
                    </div>

                    <div className='elementor-widget-container1 d-flex justify-content-center align-items-center'>
                        <FaChevronLeft
                            style={{ cursor: "pointer" }}
                            onClick={prevSlide2} />
                        <div className="sliderimages">
                            {images2.map((image, index) => (
                                <img
                                    key={index}
                                    className="slides"
                                    src={image}
                                    alt={`slides ${index}`}
                                    style={{ transform: `translateX(${(index - currentSlide2) * 100}%)` }}
                                />
                            ))}
                        </div>

                        <FaChevronRight style={{ cursor: "pointer" }}
                            onClick={nextSlide2} />
                    </div>

                    <div className='elementor-widget-container1 d-flex justify-content-center align-items-center'>
                        <FaChevronLeft
                            style={{ cursor: "pointer" }}
                            onClick={prevSlide3} />
                        <div className="sliderimages">
                            {images3.map((image, index) => (
                                <img
                                    key={index}
                                    className="slides"
                                    src={image}
                                    alt={`slides ${index}`}
                                    style={{ transform: `translateX(${(index - currentSlide3) * 100}%)` }}
                                />
                            ))}
                        </div>
                        <FaChevronRight style={{ cursor: "pointer" }}
                            onClick={nextSlide3} />
                    </div>


                </div>

            </div>

        </div>
    )
}

export default HomePageBrandSection
