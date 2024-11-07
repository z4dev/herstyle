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

    const {data , isLoading , error} =  useQuery({
        queryKey: ['testmonials'],
        queryFn: getTestmonials,
    })

    if(isLoading) return <div>Loading...</div>

    if(error) return <div>Error: {error.message}</div>


  return (
    <Swiper
      slidesPerView={1} // Default for mobile
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
      className="mySwiper w-full h-auto"
    >
    {data && data.data.comments.slice(0,5).map((comment:any , index:number) => (
      <SwiperSlide key={index}>
        <div className="bg-white p-4 rounded-lg shadow text-center h-full flex flex-col justify-center items-center">
          <User
            className="mx-auto mb-4 text-purple border-2 border-purple rounded-full p-2"
            size={64}
          />
          <h3 className="font-bold">{comment.userId?.name}</h3>
          <p className="mb-2">{comment.content}</p>
        </div>
      </SwiperSlide>
    ))}
  </Swiper>
  )
}

export default Testmonial