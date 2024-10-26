"use client";
import { Share2, ShoppingBag, Star } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import Image from 'next/image';
import Product from '@/app/(components)/Product';
import { useState } from 'react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Button } from '@/components/ui/button';
import Reviews from './components/Reviews';
import axiosInstance from '@/utils/axiosInstance';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import SingleProductSkeleton from '../../component/SingleProductSkeleton';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/utils/cart';
import { toast } from '@/hooks/use-toast';

const addToCartMutation = async (productId: string) => {

  const response = await axiosInstance.post(
    `cart/add-product/${productId}`,
    { quantity: 1 }
  );
  return response.data;
};



export default function ProductPage({ params }: { params: { product: string } }) {

  const queryClient = useQueryClient()


  const mutation:any = useMutation({
    mutationFn: (productId: string) => addToCartMutation(productId),
    onSuccess: () => {

      toast({
        title: "نجاح",
        description: "تم إضافة العنصر إلى السلة",
        // يمكنك إضافة المزيد من الخصائص هنا إذا لزم الأمر
      });
      
      // Invalidate and refetch cart data
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      console.log(" item added to cart successfully")
    },
    onError: (error) => {
      console.error('Error adding product to cart:', error);
      // Handle error (e.g., show an error message to the user)
    },
  });

  const handleAddToCart = (id: string) => {
    mutation.mutate(id);
  };




  const {data:productData, isLoading} = useQuery({
    queryKey: ['view-product'],
    queryFn: async () => {
      const res = await axiosInstance.get(`/products/${params.product}`)
      return res.data
    }
  })

  
  if(isLoading) return <SingleProductSkeleton />
  
  const  dispatch = useDispatch()


  const  data  = productData.data.product

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

  const suggestedProducts = [
    {
      image: "/products/1.jpg",
      title: "منتج رائع 1",
      rating: 4.5,
      reviewCount: 30,
      price: 149.99,
      originalPrice: 199.99,
      discount: 25
    },
    {
      image: "/products/2.jpg",
      title: "منتج رائع 2",
      rating: 4.0,
      reviewCount: 25,
      price: 129.99,
      originalPrice: 169.99,
      discount: 23
    },
    {
      image: "/products/3.jpg",
      title: "منتج رائع 3",
      rating: 4.8,
      reviewCount: 40,
      price: 179.99,
      originalPrice: 229.99,
      discount: 22
    },
    {
      image: "/products/4.jpg",
      title: "منتج رائع 4",
      rating: 4.2,
      reviewCount: 35,
      price: 159.99,
      originalPrice: 209.99,
      discount: 24
    }
  ];

  const handleShare = async () => {
    const currentUrl = window.location.href
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: data.name,
          text: 'Check out this product!',
          url: currentUrl,
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      try {
        await navigator.clipboard.writeText(currentUrl)
        toast({
          title: "تم النسخ",
          description: "تم نسخ الرابط إلى الحافظة",
        })
      } catch (error) {
        console.error('Error copying to clipboard:', error)
        toast({
          title: "خطأ",
          description: "فشل نسخ الرابط",
          variant: "destructive",
        })
      }
    }
  }




  return (
    <div className="container mx-auto lg:px-24 px-4 py-8">
      <div className="flex  items-center justify-between mb-4">
        <Button onClick={handleShare} className="text-purple bg-white flex items-center gap-2 border border-purple hover:bg-purple-100">
        مشاركة
        <Share2 />
        </Button>
        <p className="text-gray-600">
          الرئيسية / المتجر / {data.name}
        </p>
      </div>
      <div className="flex flex-col-reverse lg:flex-row gap-8">
       <div className="md:w-1/2 flex flex-col items-end">
          <div className="bg-gray-100 p-4 rounded-lg  mb-6 w-full">
            <div className="flex justify-between items-center">
              <span className="text-3xl font-bold text-purple-600 text-nowrap">{data.price.finalPrice} ر.س</span>
              <h1 className="text-2xl font-bold mb-2 text-right">{data.name}</h1>
            </div>
            <div className="flex justify-between items-center py-2">

            <div className="text-right">
              {product.originalPrice && (
                <div className="flex items-center justify-end mt-1">
                  <span className="mr-2 text-sm text-red-500">%{Math.floor(((data.price.originalPrice - data.price.finalPrice) / data.price.originalPrice) * 100)} خصم</span>
                  <span className="text-sm line-through text-gray-500">{data.price.originalPrice} ر.س</span>
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
            <p className="text-right text-gray-700">{data.description}</p>
          </div>
          <button onClick={()=>handleAddToCart(data._id)} className="flex items-center justify-center w-full bg-purple text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition duration-300">
            <span className="ml-2">{mutation.isPending ? 'جاري الإضافة...' : 'إضافة للسلة'}</span>
            <ShoppingBag className=" ml-2 w-5 h-5" />
          </button>
        </div>
        <div className=" h-64 lg:h-auto w-full lg:w-1/2">
          <Swiper
            modules={[Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            pagination={{ clickable: true }}
            className="w-full h-full rounded-lg"
          >
            { productData.data.product.images.map((image:any,index:number) => (
              <SwiperSlide key={index}>
                <div className="relative w-full h-full">
                  <Image
                    src={image}
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

     
      {/* New section for related products and reviews */}
      <div className="mt-16">
        <div className="flex justify-center mb-6">
          <button 
            className={`py-2 rounded-full border-2 border-purple w-40 bg-purple text-white`}
          >
            التقييمات
          </button>
          
        </div>

         <Reviews comments={productData.data.productComments.comments} /> 

        {/* Suggested products section */}
        <div className='flex flex-col mt-8'>
          <div className='text-center mb-6'>
            <h1 className="text-2xl font-bold text-purple">منتجات قد تعجبك</h1>
            <h2 className="text-lg text-gray-600">اختاري منتجك الراقي من متجرنا</h2>
          </div>
          
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4'>
            {suggestedProducts.map((product, index) => (
              <Product
                id={index.toString()}
                key={index}
                image={product.image}
                title={product.title}
                rating={product.rating}
                reviewCount={product.reviewCount}
                price={product.price}
                originalPrice={product.originalPrice}
                discount={product.discount}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
