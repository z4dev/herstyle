"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { debounce } from "lodash";
import Image from "next/image";
import Link from "next/link";
import { Login } from "./Login";
import axiosInstance from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import Cart from "./Cart";
import { Menu, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Header() {
  const [showTopBanner, setShowTopBanner] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const debouncedSetSearch = useCallback(
    debounce((term: string) => {
      setDebouncedSearchTerm(term);
    }, 300),
    []
  );

  const fetchProductRecommendations = async (term: string) => {
    if (!term.trim()) return { data: { products: [] } };
    const { data } = await axiosInstance.get(`products?search=${term}`);
    return data;
  };

  const fetchPackageRecommendations = async (term: string) => {
    if (!term.trim()) return { data: { products: [] } };
    const { data } = await axiosInstance.get(`packages?search=${term}`);
    return data;
  };

  const fetchRecommendations = async (term: string) => {
    if (!term.trim()) return { data: { products: [], packages: [] } };
    const productData = await fetchProductRecommendations(term);
    const packageData = await fetchPackageRecommendations(term);
    return {
      products: productData.data.products,
      packages: packageData.data.packages,
    };
  };

  const {
    data: recommendationsData,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["search", debouncedSearchTerm],
    queryFn: () => fetchRecommendations(debouncedSearchTerm),
    enabled: !!debouncedSearchTerm.trim(),
  });

  const recommendations = recommendationsData?.products || [];
  const packageRecommendations = recommendationsData?.packages || [];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    debouncedSetSearch(term);
  };

  const handleRecommendationClick = () => {
    setSearchTerm("");
  };

  const handleLinkClick = () => {
    setIsSheetOpen(false);
  };

  const recommendationsRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      recommendationsRef.current &&
      !recommendationsRef.current.contains(event.target as Node)
    ) {
      setSearchTerm(""); // Close recommendations
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
          <span className="mr-auto text-nowrap">
            تخفيضات موسمية تصل إلى 30% لمدة 30 يوم
          </span>
        </div>
      )}

      <header className="bg-white text-purple p-4 lg:px-24 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Cart />
        </div>
        <div className="relative w-[42%] lg:w-[35%]" ref={recommendationsRef}>
          <input
            type="text"
            placeholder="...البحث"
            className="py-1 lg:py-2 p-2 pr-10 pl-4 rounded-md text-black w-full focus:outline-none border-purple border-2 focus:ring-purple text-right"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {isFetching ? (
              <Loader2 className="h-5 w-5 text-purple animate-spin" />
            ) : (
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
            )}
          </div>
          {searchTerm.trim() !== "" && (
            <div className="absolute z-10 w-[80vw] lg:w-full mt-1 bg-white border border-purple rounded-md shadow-lg left-1/2 transform -translate-x-1/2">
              {isLoading ? (
                <div className="text-center p-2">
                  <Loader2 className="h-6 w-6 text-purple animate-spin mx-auto" />
                  <span className="text-gray-500 mt-2 block">
                    جاري التحميل...
                  </span>
                </div>
              ) : recommendations.length > 0 ||
                packageRecommendations.length > 0 ? (
                <>
                  {recommendations.map(
                    (item: { _id: string; name: string }) => (
                      <Link
                        href={`/shop/product/${item._id}`}
                        key={item._id}
                        onClick={() => handleRecommendationClick()}
                      >
                        <div className="p-2 hover:bg-gray-100 cursor-pointer text-right">
                          <div className="font-semibold">{item.name}</div>
                        </div>
                      </Link>
                    )
                  )}
                  {packageRecommendations.map(
                    (item: { _id: string; name: string }) => (
                      <Link
                        href={`/shop/package/${item._id}`}
                        key={item._id}
                        onClick={() => handleRecommendationClick()}
                      >
                        <div className="p-2 hover:bg-gray-100 cursor-pointer text-right">
                          <div className="font-semibold">{item.name}</div>
                        </div>
                      </Link>
                    )
                  )}
                </>
              ) : (
                <div className="text-center p-2">
                  <span className="text-gray-500">لا توجد نتائج</span>
                </div>
              )}
            </div>
          )}
        </div>

        <Link href="/">
        <svg
          width="55"
          height="55"
          viewBox="0 0 303 243"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M189.11 78.49H194.62C217.87 78.49 236.71 59.65 236.71 36.4V0H231.2C207.95 0 189.11 18.84 189.11 42.09V78.49Z"
            fill="#554393"
          />
          <path
            d="M189.11 78.49H194.62C217.87 78.49 236.71 97.33 236.71 120.58V156.99H231.2C207.95 156.99 189.11 138.15 189.11 114.9V78.49Z"
            fill="#554393"
          />
          <path
            d="M146.84 78.49H141.33C118.08 78.49 99.24 59.65 99.24 36.4V0H104.75C128 0 146.84 18.84 146.84 42.09V78.49Z"
            fill="#554393"
          />
          <path
            d="M146.84 78.49H141.33C118.08 78.49 99.24 97.33 99.24 120.58V156.99H104.75C128 156.99 146.84 138.15 146.84 114.9V78.49Z"
            fill="#554393"
          />
          <path
            d="M168.13 61.21C170.33 70.25 177.62 76.11 191.37 77.96C179.06 81 170.73 86.58 168.13 95.78C165.91 86.17 158.26 80.94 147.17 78.5C158.16 76.46 164.73 70.31 168.13 61.21Z"
            fill="#221E20"
          />
          <path
            d="M235.57 61.21C237.77 70.25 245.06 76.11 258.81 77.96C246.5 81 238.17 86.58 235.57 95.78C233.35 86.17 225.7 80.94 214.61 78.5C225.6 76.46 232.17 70.31 235.57 61.21Z"
            fill="#221E20"
          />
          <path
            d="M98.0999 61.21C100.3 70.25 107.59 76.11 121.34 77.96C109.03 81 100.7 86.58 98.0999 95.78C95.8799 86.17 88.2299 80.94 77.1399 78.5C88.1299 76.46 94.6999 70.31 98.0999 61.21Z"
            fill="#221E20"
          />
          <path
            d="M7.47 165.6V189.82H35.47V165.6H43.03V223.49H35.47V196.35H7.47V223.49H0V165.6H7.47Z"
            fill="black"
          />
          <path
            d="M62.7 204.08C62.87 214.3 69.4 218.51 76.96 218.51C82.37 218.51 85.64 217.57 88.47 216.36L89.76 221.77C87.1 222.97 82.54 224.35 75.93 224.35C63.13 224.35 55.49 215.93 55.49 203.39C55.49 190.85 62.88 180.97 74.99 180.97C88.56 180.97 92.17 192.91 92.17 200.55C92.17 202.1 92 203.3 91.91 204.07H62.7V204.08ZM84.86 198.67C84.95 193.86 82.88 186.39 74.38 186.39C66.74 186.39 63.39 193.43 62.78 198.67H84.86Z"
            fill="black"
          />
          <path
            d="M104.28 194.89C104.28 189.99 104.19 185.79 103.94 181.92H110.55L110.81 190.08H111.15C113.04 184.5 117.59 180.98 122.66 180.98C123.52 180.98 124.12 181.07 124.81 181.24V188.37C124.04 188.2 123.26 188.11 122.23 188.11C116.9 188.11 113.12 192.15 112.09 197.82C111.92 198.85 111.75 200.05 111.75 201.34V223.5H104.28V194.89Z"
            fill="black"
          />
          <path
            d="M134.08 215.76C136.31 217.22 140.27 218.77 144.04 218.77C149.54 218.77 152.11 216.02 152.11 212.59C152.11 208.98 149.96 207.01 144.38 204.95C136.91 202.29 133.39 198.16 133.39 193.18C133.39 186.48 138.8 180.98 147.73 180.98C151.94 180.98 155.63 182.18 157.95 183.56L156.06 189.06C154.43 188.03 151.42 186.65 147.56 186.65C143.09 186.65 140.6 189.23 140.6 192.32C140.6 195.76 143.09 197.3 148.5 199.36C155.71 202.11 159.41 205.72 159.41 211.9C159.41 219.2 153.74 224.35 143.87 224.35C139.32 224.35 135.11 223.23 132.19 221.52L134.08 215.76Z"
            fill="black"
          />
          <path
            d="M180.98 169.98V181.92H191.8V187.67H180.98V210.09C180.98 215.24 182.44 218.16 186.65 218.16C188.62 218.16 190.09 217.9 191.03 217.64L191.37 223.31C189.91 223.91 187.59 224.34 184.67 224.34C181.15 224.34 178.31 223.22 176.51 221.16C174.36 218.93 173.59 215.23 173.59 210.34V187.66H167.15V181.91H173.59V171.95L180.98 169.98Z"
            fill="black"
          />
          <path
            d="M205.81 181.92L214.92 206.49C215.87 209.24 216.89 212.5 217.58 214.99H217.75C218.52 212.5 219.38 209.32 220.41 206.32L228.66 181.93H236.65L225.31 211.56C219.9 225.82 216.2 233.12 211.05 237.59C207.36 240.85 203.66 242.14 201.77 242.49L199.88 236.13C201.77 235.53 204.26 234.33 206.49 232.44C208.55 230.81 211.13 227.89 212.85 224.02C213.19 223.25 213.45 222.65 213.45 222.22C213.45 221.79 213.28 221.19 212.93 220.24L197.56 181.93H205.81V181.92Z"
            fill="black"
          />
          <path d="M246.26 162.51H253.82V223.49H246.26V162.51Z" fill="black" />
          <path
            d="M273.49 204.08C273.66 214.3 280.19 218.51 287.75 218.51C293.16 218.51 296.43 217.57 299.26 216.36L300.55 221.77C297.89 222.97 293.33 224.35 286.72 224.35C273.92 224.35 266.28 215.93 266.28 203.39C266.28 190.85 273.67 180.97 285.78 180.97C299.35 180.97 302.96 192.91 302.96 200.55C302.96 202.1 302.79 203.3 302.7 204.07H273.49V204.08ZM295.65 198.67C295.74 193.86 293.67 186.39 285.17 186.39C277.53 186.39 274.18 193.43 273.57 198.67H295.65Z"
            fill="black"
          />
        </svg>
        </Link>
      </header>
      {/* Navigation */}
      <nav className="w-full flex items-center bg-purple text-white text-xs lg:text-base text-center lg:px-24 p-4">
        <Login />
        <div className="hidden lg:flex ml-auto lg:mr-[33%] 2xl:mr-[40%] justify-center space-x-6">
          <Link href="/about">من نحن</Link>
          <Link href="/service">سياسة الاستخدام</Link>
          <Link href="/shop">جميع المنتجات</Link>
          <Link href="/">الصفحة الرئيسية</Link>
        </div>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden ml-auto">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col space-y-4 mt-8 text-right">
              <Link
                href="/"
                className="text-lg font-medium"
                onClick={handleLinkClick}
              >
                الصفحة الرئيسية
              </Link>
              <Link
                href="/shop"
                className="text-lg font-medium"
                onClick={handleLinkClick}
              >
                جميع المنتجات
              </Link>
              <Link
                href="/service"
                className="text-lg font-medium"
                onClick={handleLinkClick}
              >
                سياسة الاستخدام
              </Link>
              <Link
                href="/about"
                className="text-lg font-medium"
                onClick={handleLinkClick}
              >
                من نحن
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
}
