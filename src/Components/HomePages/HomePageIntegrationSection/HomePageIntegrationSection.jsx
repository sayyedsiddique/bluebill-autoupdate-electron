import React, { useEffect, useRef } from 'react'
import "./HomePageIntegrationSection.css";

const HomePageIntegrationSection = () => {

    const imagesRef = useRef(null);



    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.2, // Trigger animation when 20% of the image is visible
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        const images = imagesRef.current.querySelectorAll('img');
        images.forEach((img) => {
            observer.observe(img);
        });

        return () => {
            observer.disconnect();
        };
    }, []);


    return (

        <div className='container'>
            <div  className='hosting_title erp_title text-center' style={{ marginBottom: "5rem", marginTop: "3.5rem" }}>
                <h2 data-aos="zoom-in-down" className='integration-heading'>Integrations</h2>
                <p data-aos="zoom-in-down" >Connect to Blue Bill to keep your business running smoothly</p>
            </div>


            <ul data-aos="fade-right"
                data-aos-offset="300"
                data-aos-easing="ease-in-sine" className="list-unstyled animation_inner d-flex flex-wrap justify-content-center" ref={imagesRef}>
                <li className="wow slideInnew2" data-wow-delay="0.1s">
                    <img decoding="async" src="https://posbytz.com/wp-content/uploads/2021/09/deliveroo.png" alt="Deliveroo" />
                </li>
                <li className="wow slideInnew2" data-wow-delay="0.2s">
                    <img decoding="async" src="https://posbytz.com/wp-content/uploads/2021/09/careem.png" alt="Careem" />
                </li>
                <li className="wow slideInnew2" data-wow-delay="0.3s">
                    <img decoding="async" src="https://posbytz.com/wp-content/uploads/2021/09/tidypay.png" alt="Tidypay" />
                </li>
                <li className="wow slideInnew2" data-wow-delay="0.4s">
                    <img decoding="async" src="https://posbytz.com/wp-content/uploads/2021/09/sunmi.png" alt="Sunmi" />
                </li>
                <li className="wow slideInnew2" data-wow-delay="0.5s" >
                    <img decoding="async" src="https://posbytz.com/wp-content/uploads/2022/08/swiggy.png" alt="Swiggy" />
                </li>
                <li className="wow slideInnew2" data-wow-delay="0.6s">
                    <img decoding="async" src="https://posbytz.com/wp-content/uploads/2021/09/zomato.png" alt="Zomato" />
                </li>
                <li className="wow slideInnew2" data-wow-delay="0.7s">
                    <img decoding="async" src="https://posbytz.com/wp-content/uploads/2021/09/dunzo.png" alt="Dunzo" />
                </li>
                <li class="wow slideInnew2" data-wow-delay="0.8s">
                    <img decoding="async" src="https://posbytz.com/wp-content/uploads/2021/09/tally.png" alt="Tally" />
                </li>
                <li className="wow slideInnew2" data-wow-delay="0.9s">
                    <img decoding="async" src="https://posbytz.com/wp-content/uploads/2021/09/cashfree.png" alt="Cashfree" />
                </li>
                <li className="wow slideInnew2" data-wow-delay="1s">
                    <img decoding="async" src="https://posbytz.com/wp-content/uploads/2021/09/talabat.png" alt="Talabat" />
                </li>
                <li className="wow slideInnew2" data-wow-delay="1.1s" >
                    <img decoding="async" src="https://posbytz.com/wp-content/uploads/2021/09/stripe.png" alt="Stripe" />
                </li>
                <li className="wow slideInnew2" data-wow-delay="1.2s">
                    <img decoding="async" src="https://posbytz.com/wp-content/uploads/2021/09/razorpay.png" alt="Razorpay" />
                </li>
                <li className="wow slideInnew2" data-wow-delay="1.3s">
                    <img decoding="async" src="https://posbytz.com/wp-content/uploads/2021/09/quickbooks.png" alt="Quickbooks" />
                </li>
                <li className="wow slideInnew2" data-wow-delay="1.4s">
                    <img decoding="async" src="https://posbytz.com/wp-content/uploads/2021/09/xero.png" alt="Xero" />
                </li>
                <li className="wow slideInnew2" data-wow-delay="1.5s">
                    <img decoding="async" src="https://posbytz.com/wp-content/uploads/2021/09/urbanpiper.png" alt="Urbanpiper" />
                </li>
                <li className="wow slideInnew2" data-wow-delay="1.6s">
                    <img decoding="async" src="https://posbytz.com/wp-content/uploads/2021/09/ubereats.png" alt="Ubereats" />
                </li>
                <li className="wow slideInnew2" data-wow-delay="1.7s">
                    <img decoding="async" src="https://posbytz.com/wp-content/uploads/2021/09/amazon.png" alt="Amazon" />
                </li>
                <li className="wow slideInnew2" data-wow-delay="1.8s">
                    <img decoding="async" src="https://posbytz.com/wp-content/uploads/2021/09/jahez.png" alt="Jahez" />
                </li>
                <li className="wow slideInnew2" data-wow-delay="1.9s">
                    <img decoding="async" src="https://posbytz.com/wp-content/uploads/2021/08/20.png" alt="Google" />
                </li>
            </ul>

        </div>




    )
}

export default HomePageIntegrationSection
