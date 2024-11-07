"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";

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
          <Link href="/shop/product/672ba4e09e16953b66fa8629">
            <Image
              src="/banners/b1.jpg"
              alt="Image Slider"
              width={1200}
              height={400}
              className="w-full rounded-lg lg:h-full h-60"
            />
          </Link>
        </SwiperSlide>
        <SwiperSlide>
        <Link href="/shop/product/6720dbe1bd7078dee3304891">
          <Image
            src="/banners/b2.jpg"
            alt="Image Slider 2"
            width={1200}
            height={400}
            className="w-full rounded-lg lg:h-full h-60"
          />
          </Link>
        </SwiperSlide>
        <SwiperSlide>
        <Link href="/shop/product/6720d821bd7078dee33047e8">
            <Image
              src="/banners/b3.jpg"
              alt="Image Slider 3"
              width={1200}
              height={400}
              className="w-full rounded-lg lg:h-full h-60"
            />
          </Link>
        </SwiperSlide>
        <SwiperSlide>
        <Link href="/shop/product/672ba4e09e16953b66fa8629">
          <Image
            src="/banners/b4.jpg"
            alt="Image Slider 3"
            width={1200}
            height={400}
            className="w-full rounded-lg lg:h-full h-60"
          />
          </Link>
        </SwiperSlide>
        <SwiperSlide>
          <Link href='/shop/product/6720d9e8bd7078dee3304845'>
          <Image
            src="/banners/b5.jpg"
            alt="Image Slider 3"
            width={1200}
            height={400}
            className="w-full rounded-lg lg:h-full h-60"
          />
          </Link>
        </SwiperSlide>
        <SwiperSlide>
        <Link href="/shop/product/672ba4e09e16953b66fa8629">
          <Image
            src="/banners/b6.jpg"
            alt="Image Slider 3"
            width={1200}
            height={400}
            className="w-full rounded-lg lg:h-full h-60"
          />
          </Link>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}

export default Carousel;
