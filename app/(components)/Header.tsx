"use client";
import React, { useState, useCallback } from "react";
import { debounce } from "lodash";
import Image from "next/image";
import Link from "next/link";
import { Login } from "./Login";
import { ShoppingBag } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import Cart from "./Cart";


function Header() {
  const [showTopBanner, setShowTopBanner] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const debouncedSetSearch = useCallback(
    debounce((term: string) => {
      setDebouncedSearchTerm(term);
    }, 300),
    []
  );

  const fetchRecommendations = async (term: string) => {
    if (!term.trim()) return { data: { products: [] } };
    const { data } = await axiosInstance.get(`products?search=${term}`);
    return data;
  };

  const { data: recommendationsData, isLoading } = useQuery({
    queryKey: ["search" ],
    queryFn: () => fetchRecommendations(debouncedSearchTerm),
    enabled: !!debouncedSearchTerm.trim(),
  });

  const recommendations = recommendationsData?.data?.products || [];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    debouncedSetSearch(term);
  };

  const handleRecommendationClick = () => {
    setSearchTerm("");
  }

  return (
    <div>
      {showTopBanner && (
        <div className="bg-black text-white p-2 flex justify-center items-center">
          <button
            onClick={() => setShowTopBanner(false)}
            className="text-white hover:text-gray-200 mr-auto"
          >
            ✕
          </button>
          <span className="mr-auto">
            تخفيضات موسمية تصل إلى 30% لمدة 30 يوم
          </span>
        </div>
      )}

      <header className="bg-white text-purple p-4 lg:px-24 flex justify-between items-center">
        <div className="flex items-center  space-x-4">
          <Cart/>
        </div>
        <div className="relative w-[42%] lg:w-[35%]">
          <input
            type="text"
            placeholder="...البحث"
            className="py-1 lg:py-2 p-2 pr-10 pl-4 rounded-md text-black w-full focus:outline-none border-purple border-2 focus:ring-2 focus:ring-purple text-right"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_251_32)">
                <path
                  d="M21 11.5C21 13.3789 20.4428 15.2156 19.399 16.7779C18.3551 18.3402 16.8714 19.5578 15.1355 20.2769C13.3996 20.9959 11.4895 21.184 9.64665 20.8175C7.80383 20.4509 6.11109 19.5461 4.78249 18.2175C3.45389 16.8889 2.5491 15.1962 2.18254 13.3534C1.81598 11.5105 2.00412 9.60041 2.72315 7.86451C3.44218 6.12861 4.65982 4.64491 6.22209 3.60104C7.78435 2.55717 9.62108 2 11.5 2C14.0196 2 16.4359 3.00089 18.2175 4.78249C19.9991 6.56408 21 8.98044 21 11.5Z"
                  stroke="#564495"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22 22L20 20"
                  stroke="#564495"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_251_32">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
          { searchTerm.trim() !== "" && recommendations.length > 0 && !isLoading && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-purple rounded-md shadow-lg">
              {recommendations.map((item:{_id:string,name:string}) => (
                <Link href={`/shop/product/${item._id}`} key={item._id} onClick={() => handleRecommendationClick()}>
                  <div className="p-2 hover:bg-gray-100 cursor-pointer text-right">
                    <div className="font-semibold">{item.name}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
        <Image src="/logo.png" alt="Herstyle Logo" className="h-full w-[4rem]" width={50} height={50} />
      </header>

      {/* Navigation */}
      <nav className=" w-full flex items-center bg-purple text-white text-xs lg:text-base text-center lg:px-24  p-4">
        <Login />
        <div className="flex ml-auto lg:mr-[33%] 2xl:mr-[40%] justify-center space-x-6">
          <Link href="/about">من نحن</Link>
          <Link href="/service">سياسة الاستخدام</Link>
          <Link href="/shop">جميع المنتجات</Link>
          <Link href="/">الصفحة الرئيسية</Link>
        </div>
      </nav>
    </div>
  );
}

export default Header;
