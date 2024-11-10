"use client";
import { useState } from "react";
import { ShoppingBag, Trash2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import CartItems from "./CartItems";
import { RootState } from "@/utils/store";
import axiosInstance from "@/utils/axiosInstance";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";


async function getCart() {
  try {
    const response = await axiosInstance.get("/cart");
    return response.data;
  } catch (error) {
    throw error;
  }
}

async function deleteProductFromCart(productId: string, type: string) {
  try {
    const response = await axiosInstance.delete(
      `/cart/remove-${type}/${productId}`
    );
    return response.data;
  } catch (error) {
    
  }
}

async function applyCoupon(code: string) {
  try {
    const response = await axiosInstance.post("cart/apply-coupon", { code });
    return response.data;
  } catch (error) {
    
    throw error;
  }
}

export default function Cart() {

  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
  });

  const cartItems =
    data?.data?.carts[0]?.packages.concat(data?.data?.carts[0]?.products) || [];


  



  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: ({ productId, type }: { productId: string; type: string }) =>
      deleteProductFromCart(productId, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const handleDeleteProduct = (productId: string, type: string) => {
    deleteMutation.mutate({ productId, type });
  };

  const applyCouponMutation = useMutation({
    mutationFn: applyCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const handleApplyCoupon = () => {
    if (couponCode) {
      applyCouponMutation.mutate(couponCode);
    }
  };

  return (
    <div className="inline-block relative">
      <Button
        variant="outline"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <ShoppingBag className="h-6 w-6" />
        {data?.data?.carts[0]?.products?.length + data?.data?.carts[0]?.packages?.length > 0 && (
          <Badge className="absolute bg-purple hover:bg-purple flex items-center justify-center -top-2 -right-2 h-6 w-6 rounded-full p-2">
            <p>{ data?.data?.carts[0]?.products?.length + data?.data?.carts[0]?.packages?.length }</p>
          </Badge>
        )}
      </Button>

      {isOpen && (
        <Card className="absolute left-0 top-full mt-2 w-80 z-50">
          <CardHeader className="flex justify-between items-center">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center min-h-[200px]">
            {isLoading ? (
              <p className="p-4 w-full text-center">Loading...</p>
            ) : error ? (
              <p className="text-purple w-full text-center">
                عليك تسجيل الدخول أولاً!
              </p>
            ) : cartItems.length > 0 ? (
              <div className="w-full ">
                <div className={`${cartItems.length > 2 ? 'overflow-y-scroll h-72' : 'overflow-y-clip h-fit'}  overflow-hidden cart-items p-0 m-0`}>
                {cartItems.map((item: any) => 
                 
                 { 
                  return<CartItems
                    key={item._id}
                    id={item.productId?item.productId:item.packageId}
                    price={item.totalPrice / item.quantity}
                    name={`${
                      item.productId ? item.productId.name : item.packageId?.name
                    }`}
                    image={item.productId ? item.productId.images[0] : item.packageId?.images[0]}
                    quantity={item.quantity}
                    onDelete={() =>
                      handleDeleteProduct(
                        `${
                          item.productId
                            ? item.productId._id
                            : item.packageId._id
                        }`,
                        item.productId ? "product" : "package"
                      )
                    }
                    stateOfDeleting={deleteMutation.isPending}
                    type={item.productId ? "product" : "package"}
                  />}
                )}
                </div>
                <div className="border-t pt-4 w-full">
                  <h3 className="font-medium mb-4 w-full text-center ">
                    ملخص الطلب
                  </h3>
                  <div className="flex items-center justify-end mb-2">
                    <span> {data.data.carts[0].totalPrice} ريس : </span>
                    <span className="ml-1 text-gray-500">مجموع المنتجات</span>
                  </div>
                  <div className="flex flex-col items-end border-t pt-4">
                    <p className="mb-2 ">هل لديك كود خصم ؟</p>
                    <div className="flex items-center mb-2">
                      <Button
                        className="rounded-r-none bg-purple text-white"
                        onClick={handleApplyCoupon}
                        disabled={applyCouponMutation.isPending}
                      >
                        {applyCouponMutation.isPending
                          ? "جاري التطبيق..."
                          : "إضافة"}
                      </Button>
                      <input
                        type="text"
                        placeholder="ادخل الكود"
                        className="flex-grow p-1 lg:p-2 border rounded-r-md text-right"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                      />
                    </div>
                    {applyCouponMutation.isError && (
                      <p className="text-red-500 text-sm">
                        فشل تطبيق الكوبون. يرجى المحاولة مرة أخرى.
                      </p>
                    )}
                    {applyCouponMutation.isSuccess && (
                      <p className="text-green-500 text-sm">
                        تم تطبيق الكوبون بنجاح!
                      </p>
                    )}
                  </div>
                  <div className="flex justify-end  font-medium mt-2">
                    <span>{data.data.carts[0].totalPrice} ريس</span>
                    <span className="text-gray-500 ml-2">الإجمالي :</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 w-full text-center">
                لا يوجد منتجات في السلة
              </p>
            )}
          </CardContent>
          {!isLoading && !error && cartItems.length > 0 && (
            <CardFooter>
              <Button
                className="w-full bg-purple"
                onClick={() => {
                  setIsOpen(false);
                  router.push("/checkout");
                }}
              >
                إتمام الطلب
              </Button>
            </CardFooter>
          )}
        </Card>
      )}
    </div>
  );
}
