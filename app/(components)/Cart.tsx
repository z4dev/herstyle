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

// interface CartItem {
//   _id: string;
//   productId: string;
//   quantity: number;
//   totalPrice: number;
// }

async function getCart(){
  const response = await axiosInstance.get('/cart')
  return response.data
}

async function deleteProductFromCart(productId:string ,type:string){
  try{
    const response = await axiosInstance.delete(`/cart/remove-${type}/${productId}`)
    return response.data
  }catch(error){
    console.log(error)
  }
}

async function applyCoupon(code: string) {
  const response = await axiosInstance.post('cart/apply-coupon', { code });
  return response.data;
}

export default function Cart() {
  const cart = useSelector((state: RootState) => state.cart.items);
  const totalQuantity = useSelector((state: RootState) => state.cart.totalQuantity);
  const totalPrice = useSelector((state: RootState) => state.cart.totalPrice);
  const [isOpen, setIsOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
  })

  if (error) return <p>Error: {error.message}</p>

  console.log("cart",data)

  const cartItems = data?.data?.carts[0]?.packages.concat(data?.data?.carts[0]?.products) || []

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: ({ productId, type }: { productId: string; type: string }) => deleteProductFromCart(productId, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const handleDeleteProduct = (productId: string ,type:string) => {
    deleteMutation.mutate({productId , type});
  };

  const applyCouponMutation = useMutation({
    mutationFn: applyCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
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
        {totalQuantity > 0 && (
          <Badge className="absolute bg-purple hover:bg-purple flex items-center justify-center -top-2 -right-2 h-6 w-6 rounded-full p-2">
            <p>{totalQuantity}</p>
          </Badge>
        )}
      </Button>

      {isOpen && (
        <Card className="absolute left-0 top-full mt-2 w-fit z-50">
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
          <CardContent className="flex flex-col items-end">
            {isLoading ? (
              <p className="p-4">Loading...</p>
            ) : cartItems.length > 0 ? (
              <>
                {cartItems.map((item: any) => (
                  <CartItems
                    key={item._id}
                    id={item.productId}
                    price={item.totalPrice / item.quantity}
                    name={`${item.productId ? item.productId.name : item.packageId.name}`}
                    quantity={item.quantity}
                    onDelete={() => handleDeleteProduct(`${item.productId ? item.productId._id : item.packageId._id}`,item.productId ? 'product' : 'package')}
                    stateOfDeleting={deleteMutation.isPending}
                    type={item.productId ? 'product' : 'package'}
                  />
                ))}
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
                        {applyCouponMutation.isPending ? 'جاري التطبيق...' : 'إضافة'}
                      </Button>
                      <input
                        type="text"
                        placeholder="ادخل الكود"
                        className="flex-grow p-2 border rounded-r-md text-right"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                      />
                    </div>
                    {applyCouponMutation.isError && (
                      <p className="text-red-500 text-sm">فشل تطبيق الكوبون. يرجى المحاولة مرة أخرى.</p>
                    )}
                    {applyCouponMutation.isSuccess && (
                      <p className="text-green-500 text-sm">تم تطبيق الكوبون بنجاح!</p>
                    )}
                  </div>
                  <div className="flex justify-end  font-medium mt-2">
                    <span>{data.data.carts[0].totalPrice} ريس</span>
                    <span className="text-gray-500 ml-2">الإجمالي :</span>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-gray-500">لا يوجد منتجات في السلة</p>
            )}
          </CardContent>
          {!isLoading && cartItems.length > 0 && (
            <CardFooter>
              <Button className="w-full bg-purple">إتمام الطلب</Button>
            </CardFooter>
          )}
        </Card>
      )}
    </div>
  );
}
