"use client";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import React, { PropsWithChildren, useEffect, useLayoutEffect } from "react";

const PaymentLayout = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  useLayoutEffect(() => {
    const token = getCookie("auth_token");
    console.log(token);
    if (!token) {
      router.push("/login");
    } else {
      const role = localStorage.getItem("role");
      if (role !== "CLIENT") {
        router.push("/");
      }
    }
  }, [getCookie("auth_token")]);
  return <div className="">{children}</div>;
};

export default PaymentLayout;
