import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import './HomePageCustomerSlider.css';
import { Pagination } from 'swiper/modules';
import CartForSlider from './CartForSlider';

const HomePageCustomerSlider = () => {
  return (
    <div className="container">
      <div>
        <h1 data-aos="zoom-in-right" style={{ marginBottom: "3rem" }}>Customer Testimonials</h1>
      </div>

      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        pagination={{
          clickable: true,
        }}
        modules={[Pagination]}
        className="mySwiper"
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 30
          }
        }}
      >
        <SwiperSlide style={{
          textAlign: "center",
          fontSize: "18px",
          backgroundClip: "white",
          display: "flex",
          justifyContent: 'center',
          alignItems: "center"
        }}>
          <CartForSlider />
        </SwiperSlide>
        <SwiperSlide>
          <CartForSlider />
        </SwiperSlide>
        <SwiperSlide>
          <CartForSlider />
        </SwiperSlide>

      </Swiper>
    </div>
  );
}

export default HomePageCustomerSlider;
