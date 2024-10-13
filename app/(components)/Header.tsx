"use client";
import Image from 'next/image'
import Link from 'next/link';
import React, { useState } from 'react'
import { Login } from './Login';
import { ShoppingBag } from 'lucide-react';

function Header() {
    const [showTopBanner, setShowTopBanner] = useState(true);
  return (
    <div>
         {showTopBanner && (
        <div className="bg-red text-white p-2 flex justify-center items-center">
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

      <header className="bg-white text-purple p-4  flex justify-between items-center">
        <div className="flex items-center  space-x-4">
          <button>
            <ShoppingBag className='w-6 h-6'/>
          </button>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="البحث"
            className="p-2 pr-10 pl-4 rounded-full text-black w-64 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple text-right"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <Image src="/logo.png" alt="Herstyle Logo" width={50} height={40} />
      </header>

      {/* Navigation */}
      <nav className=" w-full flex items-center bg-purple text-white p-4">
        <Login/>
        <div className="flex ml-auto mr-[30%] justify-center space-x-6">
          <Link href="/about">من نحن</Link>
          <Link href="/service">سياسة الاستخدام</Link>
          <Link href='/shop'>جميع المنتجات</Link>
          <Link href='/'>الصفحة الرئيسية</Link>
        </div>
      </nav>
      </div>
  )
}

export default Header