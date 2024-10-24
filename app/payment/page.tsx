"use client";
import MoyassarPayment from "@/app/(components)/moyasserPayment";
import axiosInstance from "@/utils/axiosInstance";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const PaymentPage = () => {
  const [cart, setCart] = useState<any>();
  const router = useRouter();
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axiosInstance.get("/cart");
        if (res.data.data.carts.length < 1) {
          return router.push("/");
        }
        setCart(res.data);
      } catch (error) {
        router.push("/");
      }
    };
    fetchCart();
  }, []);
  return (
    <>
      <div>
        <MoyassarPayment cartInfo={cart?.data?.carts[0]} />
      </div>
    </>
  );
};

export default PaymentPage;
