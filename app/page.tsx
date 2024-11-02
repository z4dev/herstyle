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
import ProductSkelton from "./(components)/ProductSkelton";
import Testmonial from "./(components)/Testmonial";




export default function Home() {
  async function getProducts() {
    const { data:products } = await axiosInstance.get("products?tags=green");
    const{data:packages} =await axiosInstance.get("packages?tags=green")
    return {products:products.data.products ,packages:packages.data.packages};
  }

  // New function to get packages
  async function getPackages() {
    const { data:products } = await axiosInstance.get("products?tags=blue");
    const{data:packages} =await axiosInstance.get("packages?tags=blue")
    console.log(products , packages)
    return {products:products.data.products ,packages:packages.data.packages};
  }

  const { data: productsData, isLoading: productsLoading, error: productsError } = useQuery({
    queryKey: ["home-products"],
    queryFn: getProducts,
  });

  // New query for packages
  const { data: packagesData, isLoading: packagesLoading, error: packagesError } = useQuery({
    queryKey: ["home-packages"],
    queryFn: getPackages,
  });

  console.log(packagesData)



  return (
    <main className="container mx-auto p-8  px-4 lg:px-24">
      {/* Hero Banner */}
      <Carousel />
      {/* Promotion Banner */}
      <div className="bg-purple py-4 lg:px-4 px-0  rounded-lg mb-8 flex justify-between items-center relative">
        <Image
          src="/plant.png"
          alt="Plant"
          width={60}
          height={60}
          className="object-cover absolute left-0 bottom-0"
        />
        <button className="bg-red lg:ml-24 ml-12 relative z-10 text-white px-4 py-2   rounded-xl  transition duration-300">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">


          {/* Repeat this product card 4 times */}
          {[...Array(4)].map((_, index) => (
            <ProductSkelton key={index} isLoading={packagesLoading} />
          ))}
          {packagesData &&
            packagesData.products
              ?.slice(0, 2) // Get only the first 4 packages
              .map((packageItem: any, i: number) => (
                <Product
                  id={`/product/${packageItem._id}`} // Adjusted to use package ID
                  className="w-[250px]"
                  key={packageItem._id}
                  image={packageItem.images[0]} // Adjusted to use package image
                  title={packageItem.name}
                  rating={packageItem.rating}
                  reviewCount={packageItem.numReviews}
                  price={packageItem.price.finalPrice}
                  originalPrice={packageItem.price.originalPrice}
                  discount={packageItem.price.discount}
                />
              ))}
              {packagesData &&
            packagesData.packages
              ?.slice(0, 2) // Get only the first 4 packages
              .map((packageItem: any, i: number) => (
                <Product
                  id={`/package/${packageItem._id}`} // Adjusted to use package ID
                  className="w-[250px]"
                  key={packageItem._id}
                  image={packageItem.images[0]} // Adjusted to use package image
                  title={packageItem.name}
                  rating={packageItem.rating}
                  reviewCount={packageItem.numReviews}
                  price={packageItem.price.finalPrice}
                  originalPrice={packageItem.price.originalPrice}
                  discount={packageItem.price.discount}
                />
              ))}
          {/* ... Repeat for other products */}
        </div>
      </section>

      {/* Suggested Products Section */}
      <section className="mb-12 flex flex-col items-center py-4">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-purple">لشعرك أكثر نعومة</h3>
          <h2 className="text-2xl mb-4">نعومة شعرك تحصليها من عندنا</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
           {/* Repeat this product card 4 times */}
           {[...Array(4)].map((_, index) => (
            <ProductSkelton key={index} isLoading={productsLoading} />
          ))}
          {productsData &&
            productsData?.products.slice(0, 3)
              .map((product: any, i: number) => (
                <Product
                  id={`/product/${product._id}`}
                  className="w-[250px]"
                  key={product._id}
                  image={product.images[0]}
                  title={product.name}
                  rating={product.rating}
                  reviewCount={product.numReviews}
                  price={product.price.finalPrice}
                  originalPrice={product.price.originalPrice}
                  discount={product.price.discount}
                />
              ))}
               {productsData &&
            productsData?.packages.slice(0, 1)
              .map((product: any, i: number) => (
                <Product
                  id={`/package/${product._id}`}
                  className="w-[250px]"
                  key={product._id}
                  image={product.images[0]}
                  title={product.name}
                  rating={product.rating}
                  reviewCount={product.numReviews}
                  price={product.price.finalPrice}
                  originalPrice={product.price.originalPrice}
                  discount={product.price.discount}
                />
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
            className="w-full object-cover h-64"
          />
          <div className="absolute inset-0 flex flex-col justify-center space-y-4 items-center p-8 text-white">
            <h2 className="text-3xl font-bold mb-2">صيفك أكثر إشراقة</h2>
            <button className="bg-purple text-white px-6 py-2 rounded lg:w-1/4 hover:bg-purple-900 transition duration-300">
              حماية + نعومة
            </button>
            <Link
              href="/shop"
              className=" text-white px-6 py-2 underline transition duration-300"
            >
              تسوقي الان
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="flex flex-col items-center">
        <div className="text-center mb-3">
          <h2 className="text-2xl font-bold mb-4 text-purple">
            ماذا قالوا عنا ؟
          </h2>
          <h2 className="text-2xl font-bold mb-4">
            يمتاز متجرنا بالتقييم الإيجابي من قبل العملاء
          </h2>
        </div>
       <Testmonial />
      </section>
    </main>
  );
}
