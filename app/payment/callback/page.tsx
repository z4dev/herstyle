"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircleIcon, XCircleIcon, RefreshCcwIcon } from "lucide-react"; // Lucide icons
import axiosInstance from "@/utils/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { clearAddress } from "@/utils/addressSlice";
import { getCookie } from "cookies-next";

const PaymentCallback: React.FC = () => {
  const router = useRouter();
  const queryParams = useSearchParams(); // Get status from query parameters
  const status = queryParams.get("status"); // Extract the status only once
  const paymentId = queryParams.get("id"); // Extract payment ID

  const [message, setMessage] = useState<string>("");
  const [icon, setIcon] = useState<JSX.Element | null>(null);
  const [iconColor, setIconColor] = useState<string>("");
  const dispatch = useDispatch();
  const addressCookies = getCookie("address");
  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (status === "completed" || status === "paid") {
      setMessage(
          "تم الطلب بنجاح! سيتم تحويلك إلى الصفحة الرئيسية خلال 5 ثوانٍ."
        );
        setIcon(<CheckCircleIcon className="w-16 h-16 text-green-500" />);
        setIconColor("bg-green-100");
        if (paymentId) {
          try {
            const response = await axiosInstance.post("/cart/checkout", {
              paymentMethod: "INSTANT",
              address: JSON.parse(addressCookies ?? ""),
              paymentId: paymentId,
            });
            dispatch(clearAddress());
            return response.data;
          } catch (error) {
            // the payment done in payment system so it's not necessary to throw error
          }
        }
        
      } else if (status === "failed") {
        setMessage("فشل الدفع! سيتم تحويلك إلى الصفحة الرئيسية خلال 5 ثوانٍ.");
        setIcon(<XCircleIcon className="w-16 h-16 text-red-500" />);
        setIconColor("bg-red-100");
      } else {
        setMessage("جارٍ معالجة الدفع... من فضلك انتظر.");
        setIcon(
          <RefreshCcwIcon className="w-16 h-16 animate-spin text-yellow-500" />
        );
        setIconColor("bg-yellow-100");
      }
    };

    checkPaymentStatus();

    // Redirect to homepage after 5 seconds
    const timeout = setTimeout(() => {
      router.push("/");
    }, 5000);

    return () => clearTimeout(timeout); // Cleanup on unmount
  }, [status, paymentId, router, dispatch]);

  return (
    <div
      className={`flex flex-col items-center justify-start pt-40 min-h-screen text-center ${iconColor}`}
    >
      <div className="mb-4">{icon}</div>
      <h1 className="text-2xl font-bold">{message}</h1>
    </div>
  );
};

// Wrap the component with Suspense
const PaymentCallbackWrapper = () => {
  return (
    <Suspense fallback={<div>Loading payment details...</div>}>
      <PaymentCallback />
    </Suspense>
  );
};

export default PaymentCallbackWrapper;
