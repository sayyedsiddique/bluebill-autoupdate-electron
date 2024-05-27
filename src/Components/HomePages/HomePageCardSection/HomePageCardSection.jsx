import React from 'react'
import { IconContext } from 'react-icons'
import { AiOutlineShop } from 'react-icons/ai'
import { SiSpeedtest } from 'react-icons/si'
import { TbFileAnalytics } from 'react-icons/tb'
import "./HomePageCardSection.css";
import { MdOutlineInventory, MdOutlineRestaurant, MdTableRestaurant } from 'react-icons/md'
import { HiClipboardList } from 'react-icons/hi'
import { FaBoxOpen } from 'react-icons/fa'
import { MdPointOfSale } from "react-icons/md";

const HomePageCardSection = () => {
    return (
        <div>

            <div className="container">
                <div className='' style={{textAlign:"center"}}>
                    <h1 data-aos="zoom-out-down" className="card-heading_h2" style={{textAlign:"center"}}>Reasons to Choose BlueBill POS Software</h1>
                    <h1 data-aos="zoom-out-down" className="heading_para" style={{ color: "black" }}>
                        One of Best POS Software for Small & Medium businesses
                    </h1>
                    {/* <h1 data-aos="zoom-out-down" className='heading-main' style={{ textAlign: "center", marginTop: "2rem", color: "var(--main-bg-color)" }}
                    >Blue Bill</h1> */}

                </div>

                <div id="feature_banner">
                    <div data-aos="fade-left" className="feature_banner_inner_container">
                        <div className="feature_banner_box">
                            <div className="icon_container">
                                <li id="cardli">
                                    {/* <img
                                        src="src/assets/images/point-of-sale-3395798-2828085.png"
                                        alt=""
                                    /> */}
                                    <MdPointOfSale className='cards-icon' />
                                    <div class="sp">
                                        <span class="title">POS</span>
                                    </div>
                                </li>
                            </div>
                            <h3>Simplifying billing, Empowering Businesses</h3>
                            <p>
                                Enhance your business efficiency
                                with our cutting-edge Point of Sale solutions works on Windows POS, Android POS and IPAD POS.  Our Cloud POS system
                                empowers your business for
                                growth and success
                            </p>
                        </div>
                        <div className="feature_banner_box">
                            <div className="icon_container">
                                <li id="cardli">
                                    <MdTableRestaurant className='cards-icon'/>
                                    <div class="sp">
                                        <span>Table Management</span>
                                    </div>
                                </li>
                            </div>
                            <h3>Effortless Table Management</h3>
                            <p>
                                Simplify your restaurant operations with our Table Management feature. From assigning tables to tracking orders, our software offers a seamless experience for managing your restaurant floor.
                            </p>
                        </div>

                        <div className="feature_banner_box">
                            <div className="icon_container">
                                <li id="cardli">
                                    {/* <img
                                        src="https://posbytz.com/wp-content/uploads/2023/07/Untitled-123.png"
                                        alt="Inventory &amp; warehouse Managment system"
                                    /> */}
                                    <MdOutlineInventory className='cards-icon' />
                                    <div class="sp">
                                        <span>
                                            <span>
                                                Purchase & Inventory <br />
                                                Management
                                            </span>
                                        </span>
                                    </div>
                                </li>
                            </div>
                            <h3>Efficient Inventory Control, Amplified Success</h3>
                            <p>
                                Efficiently manage  your inventory with our advanced Inventory Management system.
                                Gain real-time visibility into stock levels,
                                track product movement, and automate reordering processes
                                for optimal efficiency. Streamline operations, reduce costs,
                                and ensure inventory accuracy with our powerful solution.
                            </p>
                        </div>
                        <div className="feature_banner_box">
                            <div className="icon_container">
                                <li id="cardli">
                                    <HiClipboardList className='cards-icon' />
                                    <div class="sp">
                                        <span>
                                            E-commerce & Online <br />
                                            Ordering
                                        </span>
                                    </div>
                                </li>
                            </div>
                            <h3>Effortless E-commerce & Online Ordering</h3>
                            <p>
                                Enhance your POS system with our E-commerce & Online Ordering feature. Seamlessly integrate online orders with your POS system, providing a convenient ordering experience for your customers. Manage orders, payments, and deliveries all in one place.
                            </p>
                        </div>

                        <div className="feature_banner_box">
                            <div className="icon_container">
                                <li id="cardli">
                                    <MdOutlineRestaurant className='cards-icon' />
                                    <div className="sp">
                                        <span>
                                            Restaurant & <br />
                                            Management
                                        </span>
                                    </div>
                                </li>
                            </div>
                            <h3>Efficient Restaurant Management</h3>
                            <p>
                                Our Restaurant Management feature offers a comprehensive solution for managing your restaurant operations. From table management to order tracking, our software helps you streamline your restaurant's workflow and provide exceptional service to your customers.
                            </p>
                        </div>

                        <div className="feature_banner_box">
                            <div className="icon_container">
                                <li id="cardli">
                                    <FaBoxOpen className='cards-icon' />
                                    <div className="sp">
                                        <span>
                                            Product & Management
                                        </span>
                                    </div>
                                </li>
                            </div>
                            <h3>Efficient Product Management</h3>
                            <p>
                                Our Product Management feature offers a comprehensive solution for managing your products efficiently. From inventory tracking to product catalog management, our software helps you streamline your product management process and enhance your overall business operations.
                            </p>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    )
}

export default HomePageCardSection
