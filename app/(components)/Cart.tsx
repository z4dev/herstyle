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

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export default function Cart() {
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart.items);
  const totalQuantity = useSelector((state: RootState) => state.cart.totalQuantity);
  const totalPrice = useSelector((state: RootState) => state.cart.totalPrice);
  const [isOpen, setIsOpen] = useState(false);


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

      {isOpen && cart.length > 0 && (
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
            {cart.map((item) => (
              <CartItems
                key={item.id}
                id={item.id}
                price={item.price}
                name={item.name}
                quantity={item.quantity}
              />
            ))}
            <div className="border-t pt-4 w-full">
              <h3 className="font-medium mb-4 w-full text-center ">
                ملخص الطلب
              </h3>
              <div className="flex items-center justify-end mb-2">
                <span> {totalPrice.toFixed(2)} ريس : </span>
                <span className="ml-1 text-gray-500">مجموع المنتجات</span>
              </div>
              <div className="flex flex-col items-end border-t pt-4">
                <p className="mb-2 ">هل لديك كود خصم ؟</p>
                <div className="flex items-center mb-2">
                  <Button className="rounded-r-none bg-purple text-white">
                    إضافة
                  </Button>
                  <input
                    type="text"
                    placeholder="ادخل الكود"
                    className="flex-grow p-2 border rounded-r-md text-right"
                  />
                </div>
              </div>
              <div className="flex justify-end  font-medium mt-2">
                <span>{totalPrice.toFixed(2)} ريس</span>
                <span className="text-gray-500 ml-2">الإجمالي :</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-purple">إتمام الطلب</Button>
          </CardFooter>
        </Card>
      )}
      {cart.length === 0 && isOpen &&
      <Card className="absolute left-0 top-full mt-2 w-80 z-50">
         <CardHeader>
           <Button
             variant="ghost"
             size="icon"
             className="absolute right-0 top-0"
             onClick={() => setIsOpen(false)}
           >
             <X className="h-4 w-4" />
           </Button>
         </CardHeader>
         <CardContent className="flex flex-col items-center justify-center h-40">
           <p className="text-gray-500">لا يوجد منتجات في السلة</p>
         </CardContent>
       </Card>
       }
    </div>
  );
}
