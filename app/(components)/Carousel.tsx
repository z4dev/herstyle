"use client";
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';
import Image from 'next/image';

function Carousel() {
  return (
    <div className="mb-8">
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      modules={[Autoplay, Pagination]}
      className="mySwiper"
    >
      <SwiperSlide>
        <Image
          src="/banners/b1.jpg"
          alt="Image Slider"
          width={1200}
          height={400}
          className="w-full rounded-lg"
        />
      </SwiperSlide>
      <SwiperSlide>
        <Image
          src="/banners/b2.jpg"
          alt="Image Slider 2"
          width={1200}
          height={400}
          className="w-full rounded-lg"
        />
      </SwiperSlide>
      <SwiperSlide>
        <Image
          src="/banners/b3.jpg"
          alt="Image Slider 3"
          width={1200}
          height={400}
          className="w-full rounded-lg"
        />
      </SwiperSlide>
      <SwiperSlide>
        <Image
          src="/banners/b4.jpg"
          alt="Image Slider 3"
          width={1200}
          height={400}
          className="w-full rounded-lg"
        />
      </SwiperSlide>
      <SwiperSlide>
        <Image
          src="/banners/b5.jpg"
          alt="Image Slider 3"
          width={1200}
          height={400}
          className="w-full rounded-lg"
        />
      </SwiperSlide>
      <SwiperSlide>
        <Image
          src="/banners/b6.jpg"
          alt="Image Slider 3"
          width={1200}
          height={400}
          className="w-full rounded-lg"
        />
      </SwiperSlide>
    </Swiper>
  </div>
  )
}

export default Carousel