"use client";
import { Share2, ShoppingBag, Star } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import Image from 'next/image';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Button } from '@/components/ui/button';

export default function ProductPage({ params }: { params: { product: string } }) {
  const product = {
    id: 'dummy-product',
    name: 'منتج تجريبي',
    rating: 4,
    reviews: 120,
    price: 199.99,
    originalPrice: 249.99,
    description: 'هذا وصف تجريبي للمنتج. يمكن أن يحتوي على تفاصيل حول المنتج وميزاته.',
    contents: [
      'العنصر الأول',
      'العنصر الثاني',
      'العنصر الثالث',
      'العنصر الرابع'
    ]
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <Button className="text-purple bg-white flex items-center gap-2 border border-purple hover:bg-purple-100">
        مشاركة
        <Share2 />
        </Button>
        <p className="text-gray-600">
          الرئيسية / المتجر / {product.name}
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
       <div className="md:w-1/2 flex flex-col items-end">
          <div className="bg-gray-100 p-4 rounded-lg  mb-6 w-full">
            <div className="flex justify-between items-center">
              <span className="text-3xl font-bold text-purple-600">{product.price} ر.س</span>
              <h1 className="text-2xl font-bold mb-2 text-right">{product.name}</h1>
            </div>
            <div className="flex justify-between items-center py-2">

            <div className="text-right">
              {product.originalPrice && (
                <div className="flex items-center justify-end mt-1">
                  <span className="mr-2 text-sm text-red-500">%{Math.floor(((product.originalPrice - product.price) / product.originalPrice) * 100)} خصم</span>
                  <span className="text-sm line-through text-gray-500">{product.originalPrice} ر.س</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end mb-2">
              <span className="ml-2 text-sm text-gray-600">({product.reviews})</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < product.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                ))}
              </div>
            </div>

            </div>


          </div>
          <div className=" bg-gray-100 p-4 rounded-lg mb-6 w-full">
            <h3 className="font-semibold mb-2 text-right">تفاصيل المجموعة:</h3>
            <p className="text-right text-gray-700">{product.description}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg mb-6 w-full">
            <h3 className="font-semibold mb-2 text-right">محتويات المجموعة:</h3>
            <ul className="text-right text-gray-700 rtl">
              {product.contents.map((item, index) => (
                <li key={index} className="flex justify-end items-center">
                  <span>{item}</span>
                  <span className="ml-2">•</span>
                </li>
              ))}
            </ul>
          </div>
          <button className="flex items-center justify-center w-full bg-purple text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition duration-300">
            <span className="ml-2">إضافة للسلة</span>
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>
        <div className="md:w-1/2">
          <Swiper
            modules={[Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            pagination={{ clickable: true }}
            className="w-full h-full rounded-lg"
          >
            {[1, 2, 3, 4].map((index) => (
              <SwiperSlide key={index}>
                <div className="relative w-full h-full">
                  <Image
                    src={`/products/${index}.jpg`}
                    alt={`Product image ${index}`}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

      </div>
    </div>
  );
}