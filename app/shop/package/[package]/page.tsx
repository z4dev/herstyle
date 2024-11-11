"use client";
import { Share2, ShoppingBag, Star, X } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import Image from "next/image";
import Product from "@/app/(components)/Product";
import { useState } from "react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Button } from "@/components/ui/button";
import RelatedProducts from "../../product/[product]/components/RelatedProducts";
import Reviews from "../../product/[product]/components/Reviews";
import axiosInstance from "@/utils/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import SingleProductSkeleton from "../../component/SingleProductSkeleton";
import ProductSkelton from "@/app/(components)/ProductSkelton";
import SinglePackges from "../SinglePackges";

const addToCartMutation = async (productId: string) => {
  const response = await axiosInstance.post(`cart/add-package/${productId}`, {
    quantity: 1,
  });
  console.log(productId, response);
  return response.data;
};

export default function ProductPage({
  params,
}: {
  params: { package: string };
}) {
  const queryClient = useQueryClient();
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

  const mutation: any = useMutation({
    mutationFn: (productId: string) => addToCartMutation(productId),
    onSuccess: () => {
      toast({
        title: "نجاح",
        description: "تم إضافة العنصر إلى السلة",
        // يمكنك إضافة المزيد من الخصائص هنا إذا لزم الأمر
      });

      // Invalidate and refetch cart data
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: () => {
      toast({
        title: "خطأ",
        description: "لا يمكنت أضافه المنتج لانك لست مسجل دخول",
        variant: "destructive",
      });
    },
  });

  const handleAddToCart = (id: string) => {
    mutation.mutate(id);
  };

  const [isReviews, setIsReviews] = useState(false);
  const { data: packageData, isLoading: packageLoading } = useQuery({
    queryKey: ["view-package"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/packages/${params.package}`);
      return res.data;
    },
  });

  if (packageLoading) return <SingleProductSkeleton />;

  const {
    data: {
      Package,
      productsForThatPackage,
      packageComments: { comments },
    },
  } = packageData;

  const handleShare = async () => {
    const currentUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: Package.name,
          text: "Check out this product!",
          url: currentUrl,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(currentUrl);
        toast({
          title: "تم النسخ",
          description: "تم نسخ الرابط إلى الحافظة",
        });
      } catch (error) {
        console.error("Error copying to clipboard:", error);
        toast({
          title: "خطأ",
          description: "فشل نسخ الرابط",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="container mx-auto px-4 lg:px-24 py-8">
      <div className="flex items-center justify-between mb-4">
        <Button
          onClick={handleShare}
          className="text-purple bg-white flex items-center gap-2 border border-purple hover:bg-purple-100"
        >
          مشاركة
          <Share2 />
        </Button>
        <p className="text-gray-600  text-xs md:text-base text-right">
          الرئيسية / المتجر / {Package.name}
        </p>
      </div>
      <div className="h-fit flex flex-col-reverse lg:flex-row gap-8">
        <div className="lg:w-1/2 flex flex-col items-end">
          <div className="bg-gray-100 p-4 rounded-lg  mb-6 w-full">
            <div className="flex justify-between items-center">
              <span className="text-3xl font-bold text-purple-600">
                {Package.price.finalPrice} ر.س
              </span>
              <h1 className="text-2xl font-bold mb-2 text-right">
                {Package.name}
              </h1>
            </div>
            <div className="flex justify-between items-center py-2">
              <div className="text-right">
                <div className="flex items-center justify-end mt-1">
                  <span className="mr-2 text-sm text-red-500">
                    %
                    {100 -
                      Math.floor(
                        (Package.price.finalPrice /
                          Package.price.originalPrice) *
                          100
                      )}{" "}
                    خصم
                  </span>
                  <span className="text-sm line-through text-gray-500">
                    {Package.price.originalPrice} ر.س
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end mb-2">
                <div className="flex flex-row-reverse">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Package.stars
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className=" bg-gray-100 p-4 rounded-lg mb-6 w-full">
            <h3 className="font-semibold mb-2 text-right">تفاصيل المجموعة:</h3>
            <p className="text-right text-gray-700">{Package.description}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg mb-6 w-full">
            <h3 className="font-semibold mb-2 text-right">محتويات المجموعة:</h3>
            <ul className="text-right text-gray-700 rtl">
              {productsForThatPackage.map((item: any, index: number) => (
                <li key={index} className="flex justify-end items-center">
                  <span>{item.name}</span>
                  <span className="ml-2">•</span>
                </li>
              ))}
            </ul>
          </div>
          {Package.availableQuantity > 0 ? (
            <button
              onClick={() => handleAddToCart(Package._id)}
              className="flex items-center justify-center w-full bg-purple text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition duration-300"
            >
              <span className="ml-2">
                {mutation.isPending ? "جاري الإضافة..." : "إضافة للسلة"}
              </span>
              <ShoppingBag className=" ml-2 w-5 h-5" />
            </button>
          ) : (
            <button
              disabled={true}
              className="flex items-center justify-center w-full bg-red text-white px-6 py-3 rounded-lg hover:bg-red transition duration-300"
            >
              <span className="ml-2">نفد من المخزون</span>
              <ShoppingBag className=" ml-2 w-5 h-5" />
            </button>
          )}
        </div>
        <div className="h-full w-full lg:w-1/2">
          <Swiper
            modules={[Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            pagination={{ clickable: true }}
            className="w-full  h-[450px] sm:h-[650px]   lg:h-[650px] rounded-lg"
          >
            {packageData.data.Package.images.map(
              (image: any, index: number) => (
                <SwiperSlide key={index}>
                  <div className="relative w-full h-full ">
                    <Image
                      src={image}
                      alt={`Product image ${index}`}
                      layout="fill"
                      className="h-full w-full"
                      onClick={() => setFullScreenImage(image)}
                    />
                  </div>
                </SwiperSlide>
              )
            )}
          </Swiper>
        </div>
      </div>

      {/* Full-screen image modal */}
      {fullScreenImage && (
        <div
          className="fixed inset-0  bg-black bg-opacity-75 flex items-center h-screen justify-center z-50"
          onClick={() => setFullScreenImage(null)}
        >
          <div className="max-w-4xl h-[80vh] md:h-[100vh] ">
            <button
              className="absolute  top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2"
              onClick={(e) => {
                e.stopPropagation();
                setFullScreenImage(null);
              }}
            >
              <X className="w-6 h-6" />
            </button>
            <Image
              src={fullScreenImage}
              alt="Full-screen product image"
              width={800}
              height={800}
              className="h-full w-full"
            />
          </div>
        </div>
      )}

      {/* New section for related products and reviews */}
      <div className="mt-16">
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setIsReviews(true)}
            className={`py-2 rounded-l-full border-2 border-purple w-40 ${
              isReviews ? "bg-purple text-white" : "bg-white text-purple"
            }`}
          >
            التقييمات
          </button>
          <button
            onClick={() => setIsReviews(false)}
            className={`py-2 rounded-r-full border-2 border-purple w-40 ${
              !isReviews ? "bg-purple text-white" : "bg-white text-purple"
            }`}
          >
            محتويات المجموعة
          </button>
        </div>

        {isReviews ? (
          <Reviews comments={comments} id={params.package} />
        ) : (
          <RelatedProducts data={productsForThatPackage} />
        )}

        {/* Suggested products section */}
        <div className="flex flex-col mt-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-purple">منتجات قد تعجبك</h1>
            <h2 className="text-lg text-gray-600">
              اختاري منتجك الراقي من متجرنا
            </h2>
          </div>
          <SinglePackges />
        </div>
      </div>
    </div>
  );
}
