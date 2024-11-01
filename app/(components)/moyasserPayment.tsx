"use client";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
// components/MoyasarPayment.js

import { useEffect, useState } from "react";
declare global {
  interface Window {
    Moyasar: any;
  }
}
const MoyasarPayment: React.FC<{ cartInfo: any }> = ({ cartInfo }) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const queryClient = useQueryClient()
  useEffect(() => {
    if (cartInfo) {
      const script = document.createElement("script");
      script.src = "https://cdn.moyasar.com/mpf/1.14.0/moyasar.js";
      script.async = true;
      script.onload = () => {
        if (window.Moyasar) {
          window.Moyasar.init({
            element: ".mysr-form",
            amount: cartInfo.totalPrice * 100,
            currency: "SAR",
            description: `order for : ${cartInfo.userId?.email} \n
            phone : ${cartInfo.userId.phoneNumber}.\n
            products : ${
              cartInfo.products
                .map(
                  (item: any) => `
                  name : ${item.productId.name}
                  quantity : ${item.quantity}
                  price : ${item.totalPrice}
                `
                )
                .join(", ") ?? "-"
            }\n
            packages : ${
              cartInfo.packages
                .map(
                  (item: any) => `
                  name : ${item.packageId.name}
                  quantity : ${item.quantity}
                  price : ${item.totalPrice}
                  `
                )
                .join(", ") ?? "-"
            }\n`,
            publishable_api_key:
              process.env.NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY ,
            callback_url:
              process.env.NEXT_PUBLIC_BASE_URL +"/payment/callback",
            methods: ["creditcard"],
            secret_api_key: "",
            on_completed: function (payment: any) {
              return new Promise(function (resolve, reject) {
                if (payment.status === "completed") {
                  queryClient.invalidateQueries({ queryKey: ['cart'] });
                  resolve({ message: "Payment completed successfully." });

                } else if (payment.status === "initiated") {
                  resolve({
                    message:
                      "Payment initiated, awaiting 3D Secure confirmation.",
                  });
                } else {
                  router.push("/payment/callback?status=failed");
                  reject(
                    new Error(
                      `Payment not successful. Status: ${payment.status}`
                    )
                  );
                }
              });
            },
            metadata: {
              email: cartInfo.userId?.email,
              phoneNumber: cartInfo.userId?.phoneNumber,
              products: cartInfo.products
                .map(
                  (item: any) =>
                    `name: ${item.productId.name}, quantity: ${item.quantity}, price: ${item.totalPrice}`
                )
                .join("; "), // Serialize array to a single string
              packages: cartInfo.packages
                .map(
                  (item: any) =>
                    `name: ${item.packageId.name}, quantity: ${item.quantity}, price: ${item.totalPrice}`
                )
                .join("; "), // Serialize array to a single string
            },
          });
          setLoading(false);
        } else {
          console.error("Moyasar is not defined.");
        }
      };

      document.body.appendChild(script);
      const script1 = document.createElement("script");
      script1.src =
        "https://cdnjs.cloudflare.com/polyfill/v3/polyfill.min.js?version=4.8.0&features=fetch";
      script.async = true;
      document.body.appendChild(script1);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [cartInfo]);

  return (
    <div className="relative flex justify-center items-center md:h-screen md:py-0 py-5 px-2 md:px-0">
      {loading && <div className="loader"></div>}
      <form className="mysr-form">
        {/* The payment fields will be rendered by Moyasar here */}
      </form>
      <style jsx>{`
        .loader {
          border: 8px solid #f3f3f3;
          border-top: 8px solid #564495;
          border-radius: 50%;
          width: 60px;
          height: 60px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default MoyasarPayment;
