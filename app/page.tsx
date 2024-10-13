"use client";
import Image from "next/image";
import axios from "axios";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Link from "next/link";
import Carousel from "./(components)/Carousel";
import { useQuery } from "@tanstack/react-query";
import Product from "./(components)/Product";
import axiosInstance from "@/utils/axiosInstance";


export default function Home() {

  async function getProducts(){
    const {data} = await axiosInstance.get("products")
    return data.data
  }

  const {data,isLoading,error} = useQuery({
    queryKey:["products"],
    queryFn:getProducts
  })

  // Console log the data from the API
  console.log("Products data:", data)
  console.log("Products error:", error)

  const SectionOneImages = ["/products/1.jpg","/products/2.jpg","/products/3.jpg","/products/4.jpg"]
  const SectionTwoImages = ["/products/5.jpg","/products/6.jpg","/products/7.jpg","/products/8.jpg"]

  return (
      <main className="container mx-auto p-8">
        {/* Hero Banner */}
        <Carousel />
        {/* Promotion Banner */}
        <div className="bg-purple p-4 rounded-lg mb-8 flex justify-between items-center relative">
          <Image
            src="/plant.png"
            alt="Plant"
            width={60}
            height={60}
            className="object-cover absolute left-0 bottom-0"
          />
          <button className="bg-red ml-24  text-white px-4 py-2  rounded-xl  transition duration-300">
            اذا لم يناسبك <br /> استرد قيمة طلبك
          </button>

          <div className="flex items-center absolute right-0">
            <Image
              src="/productsImages.png"
              alt="Products"
              width={120}
              height={80}
              className="object-cover"
            />
            <Image
              src="/shampo.png"
              alt="Shampoo"
              width={60}
              height={60}
              className="object-cover"
            />
          </div>
        </div>

        {/* Featupurple Products */}
        <section className="mb-12 flex flex-col items-center">
          <div className="my-4 text-center">
            <h2 className="text-2xl font-bold -4 text-purple">
              فروة شعرك أكثر إشراقة
            </h2>
            <h2 className="text-2xl  mb-4">اختاري منتجك الراقي من متجرنا</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {/* Repeat this product card 4 times */}
            {data && data.products.slice(0,4).map((product:any,i:number)=>(
              <Product key={product._id} image={SectionOneImages[i]} title={product.name} rating={product.rating} reviewCount={product.numReviews} price={product.price.finalPrice} originalPrice={product.price.originalPrice} discount={product.price.discount} />
            ))}
            {/* ... Repeat for other products */}
          </div>
        </section>

        {/* Recommended Products */}
        <section className="mb-12 flex flex-col items-center py-4">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-purple">
              لشعرك أكثر نعومة
            </h3>
            <h2 className="text-2xl mb-4">نعومة شعرك تحصليها من عندنا</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {/* Repeat this product card 4 times */}
            {data && data.products.slice(0,4).map((product:any,i:number)=>(
              <Product key={product._id} image={SectionTwoImages[i]} title={product.name} rating={product.rating} reviewCount={product.numReviews} price={product.price.finalPrice} originalPrice={product.price.originalPrice} discount={product.price.discount} />
            ))}
            {/* ... Repeat for other products */}
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="mb-12">
          <div className="relative rounded-lg overflow-hidden">
            <Image
              src="/newsletterbackground.png"
              alt="Newsletter Background"
              width={1200}
              height={300}
              className="w-full object-cover"
            />
            <div className="absolute inset-0 flex flex-col justify-center space-y-4 items-center p-8 text-white">
              <h2 className="text-3xl font-bold mb-2">صيفك أكثر إشراقة</h2>
                <button className="bg-purple text-white px-6 py-2 rounded w-1/4 hover:bg-purple-900 transition duration-300">
                حماية + نعومة
                </button>
                <Link href="/products" className=" text-white px-6 py-2 underline transition duration-300">
                تسوقي الان 
                </Link>
              
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="flex flex-col items-center">
          <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-purple">ماذا قالوا عنا ؟</h2>
          <h2 className="text-2xl font-bold mb-4">يمتاز متجرنا بالتقييم الإيجابي من قبل العملاء</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Repeat this testimonial 3 times */}
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <Image
                src="/avatar.jpg"
                alt="Customer"
                width={64}
                height={64}
                className="mx-auto rounded-full mb-4"
              />
              <p className="mb-2">نتميز بالتسليم الرياضي من قبل المندوب</p>
              <h3 className="font-bold">د. مريم الحربي</h3>
            </div>
            {/* ... Repeat for other testimonials */}
          </div>
        </section>
      </main>
  );
}
