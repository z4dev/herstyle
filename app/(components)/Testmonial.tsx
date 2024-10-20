import React from 'react'
import { User } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import axiosInstance from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';

async function getTestmonials() {
  const response = await axiosInstance.get('/comments');
  return response.data;
}

function Testmonial() {

    const {data} =  useQuery({
        queryKey: ['testmonials'],
        queryFn: getTestmonials,
    })

    console.log("testmonial =",data);


  return (
    <Swiper
    slidesPerView={3}
    spaceBetween={30}
    pagination={{
      clickable: true,
    }}
    breakpoints={{
      640: {
        slidesPerView: 2,
      },
      768: {
        slidesPerView: 3,
      },
    }}
    modules={[Pagination]}
    className="mySwiper w-full h-[40vh]"
  >
    {data.data.comments.map((comment:any , index:number) => (
      <SwiperSlide key={index}>
        <div className="bg-white p-4 rounded-lg shadow text-center h-52">
          <User
            className="mx-auto mb-4 text-purple border-2 border-purple rounded-full p-2"
            size={64}
          />
          <h3 className="font-bold">{comment.userId.name}</h3>
          <p className="mb-2">{comment.content}</p>
        </div>
      </SwiperSlide>
    ))}
  </Swiper>
  )
}

export default Testmonial