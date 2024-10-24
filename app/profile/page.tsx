"use client";

import React, { useState } from "react";
import { SquarePenIcon, User } from "lucide-react";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";

interface Profile {
  _id: string;
  name: string;
  email: string;
  photo: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Order {
  _id: string;
  user: {
    name: string;
    phoneNumber: string;
  };
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  cart: {
    totalPrice: number;
  };
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
}

const fetchProfile = async (): Promise<Profile> => {
  const response = await axiosInstance.get("profile");
  return response.data.data;
};

const fetchOrders = async () => {
  const response = await axiosInstance.get("orders");
  return response.data;
};

const updateProfile = async (data: { name: string; phoneNumber: string }) => {
  const response = await axiosInstance.put("profile", data);
  return response.data;
};

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const queryClient = useQueryClient();

  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useQuery({
    queryKey: ["client-profile"],
    queryFn: fetchProfile,
  });

  const {
    data: ordersData,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
  } = useQuery({
    queryKey: ["client-order"],
    queryFn: fetchOrders,
  });

  const updateProfileMutation: any = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-profile"] });
    },
    onError: () => {},
  });

  const handleSignOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    deleteCookie("auth_token");
    router.push("/");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    updateProfileMutation.mutate({ name, phoneNumber });
  };

  if (isProfileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>جاري تحميل الملف الشخصي...</p>
      </div>
    );
  }

  if (isProfileError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>حدث خطأ أثناء تحميل الملف الشخصي. يرجى المحاولة مرة أخرى.</p>
      </div>
    );
  }

  return (
    <div className="min-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md my-8">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">الملف الشخصي</TabsTrigger>
          <TabsTrigger value="orders">الطلبات</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <div className="flex  items-center justify-end mb-6">
            <div className="mr-4 text-right">
              <h1 className="text-2xl font-bold">مرحبا بك، {profile?.name}</h1>
              <p className="text-gray-600">الرئيسة / تعديل المعلومات</p>
            </div>
            <User
              size={80}
              className="text-gray-800 font-thin border-2 border-gray-200 rounded-full p-2"
            />
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex justify-between items-center border-2 rounded-lg border-gray-200 px-2">
              <div className="flex items-center gap-2">
                <SquarePenIcon />
                <Input
                  name="name"
                  type="text"
                  defaultValue={profile?.name}
                  className="p-2 rounded focus:outline-none"
                />
              </div>
              <Label className="font-medium">الاسم</Label>
            </div>
            <div className="flex justify-between items-center border-2 rounded-lg border-gray-200 px-2">
              <div className="flex items-center gap-2">
                <SquarePenIcon />
                <Input
                  name="phoneNumber"
                  type="tel"
                  defaultValue={"xxxxxxxx"}
                  className="p-2 rounded focus:outline-none"
                />
              </div>
              <Label className="font-medium">رقم الهاتف</Label>
            </div>
            <div className="flex justify-between items-center border-2 rounded-lg border-gray-200 px-2">
              <div className="flex items-center gap-2">
                <Input
                  type="email"
                  defaultValue={profile?.email}
                  className="p-2 rounded focus:outline-none"
                  disabled
                />
              </div>
              <Label className="font-medium">البريد الإلكتروني</Label>
            </div>
            <Button
              type="submit"
              className="w-full bg-purple text-white"
              disabled={updateProfileMutation.isLoading}
            >
              {updateProfileMutation.isLoading
                ? "جاري الحفظ..."
                : "حفظ التعديلات"}
            </Button>
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleSignOut}
            >
              تسجيل الخروج
            </Button>
          </form>
        </TabsContent>
        <TabsContent value="orders">
          <h2 className="text-2xl font-bold my-4 text-right">طلباتي</h2>
          {isOrdersLoading ? (
            <p>جاري تحميل الطلبات...</p>
          ) : isOrdersError ? (
            <p>حدث خطأ أثناء تحميل الطلبات. يرجى المحاولة مرة أخرى.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">رقم الطلب</TableHead>
                  <TableHead className="text-right">التاريخ</TableHead>
                  <TableHead className="text-right">المبلغ الإجمالي</TableHead>
                  <TableHead className="text-right">حالة الطلب</TableHead>
                  <TableHead className="text-right">طريقة الدفع</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ordersData?.data.orders.map((order: Order) => (
                  <TableRow key={order._id}>
                    <TableCell className="text-right">{order._id}</TableCell>
                    <TableCell className="text-right">
                      {new Date(order.createdAt).toLocaleDateString("ar-EG")}
                    </TableCell>
                    <TableCell className="text-right">
                      {order.cart.totalPrice} ريال
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full ${
                          order.status === "PENDING"
                            ? "bg-orange-200 text-orange-800"
                            : "bg-green-200 text-green-800"
                        }`}
                      >
                        {order.status === "PENDING" ? "قيد الانتظار" : "مكتمل"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {order.paymentMethod}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
