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
          <Link href="/shop/package/671e5f7fe801785445d7f09a">
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
          <Image
            src="/banners/b2.jpg"
            alt="Image Slider 2"
            width={1200}
            height={400}
            className="w-full rounded-lg lg:h-full h-60"
          />
        </SwiperSlide>
        <SwiperSlide>
          <Link href="/shop/package/671e5f7fe801785445d7f09a">
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
          <Link href='shop/package/671e4e63e801785445d7ed45'>
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
          <Link href='/shop/package/671e4eebe801785445d7ed73'>
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
          <Link href="/shop/package/6720b1efc622738dbb32dc2e">
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
